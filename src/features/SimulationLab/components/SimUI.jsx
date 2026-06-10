/**
 * SimUI.jsx
 * Shared UI primitives for all simulation labs.
 * Exports: SliderField, InfoTooltip, NudgeBar, StudioLayout
 */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../Studios.module.css";

/* ── InfoTooltip ────────────────────────────────────────────── */
export const InfoTooltip = ({ title, body }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const tooltipWidth = Math.min(viewportWidth - 20, 280);
        let leftPos = rect.left - (tooltipWidth - rect.width) / 2;
        
        // Ensure tooltip stays within viewport
        leftPos = Math.max(10, Math.min(leftPos, viewportWidth - tooltipWidth - 10));
        
        setPosition({ 
          top: rect.bottom + 8, 
          left: leftPos 
        });
      }
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!title) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.infoIcon}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Info about ${title}`}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--clr-gold)" strokeWidth="1" />
          <text x="7" y="7" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--clr-gold)">i</text>
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            className={styles.tooltipBox}
            style={{ 
              position: "fixed", 
              top: position.top, 
              left: position.left, 
              zIndex: 999999,
              maxWidth: "calc(100vw - 20px)"
            }}
            role="tooltip"
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{title}</span>
              <button className={styles.tooltipClose} onClick={() => setOpen(false)} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className={styles.tooltipBody}>{body}</p>
          </div>,
          document.body,
        )}
    </>
  );
};

/* ── SliderField ─────────────────────────────────────────────── */
export const SliderField = ({ label, min, max, step, value, onChange, prefix = "", suffix = "", tooltip }) => (
  <div className={styles.fieldRow}>
    <label className={styles.fieldLabel}>{label}</label>
    <div className={styles.sliderWrap}>
      <div className={styles.sliderTrackWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          style={{ "--pct": `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <span className={styles.sliderValue}>
        {prefix}{value.toLocaleString("en-ZA")}{suffix}
      </span>
      {tooltip && <InfoTooltip title={tooltip.title} body={tooltip.body} />}
    </div>
  </div>
);

/* ── NudgeBar ─────────────────────────────────────────────────
   Non-intrusive nudge strip. Slides in from the bottom.
   Severity: "info" | "warn" | "alert"
*/
const SEVERITY_COLORS = {
  info:  { border: "rgba(248,210,153,0.35)", icon: "💡", accent: "var(--clr-gold)" },
  warn:  { border: "rgba(255,180,50,0.5)",   icon: "⚠️", accent: "#ffb432" },
  alert: { border: "rgba(255,90,90,0.5)",    icon: "🔴", accent: "#ff6b6b" },
};

export const NudgeBar = ({ nudges, onDismiss }) => {
  if (!nudges || nudges.length === 0) return null;

  return (
    <div className="nudgeBarContainer" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
      {nudges.map((nudge) => {
        const { border, icon, accent } = SEVERITY_COLORS[nudge.severity] || SEVERITY_COLORS.info;
        return (
          <div
            key={nudge.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "0.7rem 0.9rem",
              borderRadius: "10px",
              border: `1px solid ${border}`,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              animation: "nudgeIn 0.25s ease",
            }}
          >
            <span style={{ fontSize: "0.9rem", lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
            <p style={{
              flex: 1,
              margin: 0,
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "var(--clr-text)",
              lineHeight: 1.6,
            }}>
              {nudge.message}
            </p>
            <button
              onClick={() => onDismiss(nudge.id)}
              aria-label="Dismiss"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: accent,
                opacity: 0.7,
                padding: "0 0 0 0.5rem",
                flexShrink: 0,
                fontSize: "0.7rem",
                fontFamily: "var(--font-body)",
                transition: "opacity 0.15s",
              }}
            >
              Dismiss
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes nudgeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};