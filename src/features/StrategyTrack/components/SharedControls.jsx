import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Tracks.module.css";

export const InfoTooltip = ({ field, infoMap }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const info = infoMap?.[field];

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, left: rect.left - 120 });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!info) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.infoIcon}
        onClick={() => setOpen((value) => !value)}
        aria-label={`Info about ${field}`}
        aria-expanded={open}
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--clr-gold)" strokeWidth="1" />
          <text x="7" y="7" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--clr-gold)">i</text>
        </svg>
      </button>
      {open && createPortal(
        <div
          className={styles.tooltipBox}
          style={{ position: "fixed", top: position.top, left: position.left, zIndex: 999999 }}
          role="tooltip"
        >
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>{info.title}</span>
            <button className={styles.tooltipClose} onClick={() => setOpen(false)} aria-label="Close" type="button">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className={styles.tooltipBody}>{info.body}</p>
        </div>,
        document.body,
      )}
    </>
  );
};

export const SliderField = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  prefix = "",
  suffix = "",
  info,
  infoMap,
}) => (
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
          onChange={(event) => onChange(Number(event.target.value))}
          className={styles.slider}
          style={{ "--pct": `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <span className={styles.sliderValue}>
        {prefix}{value.toLocaleString()}{suffix}
      </span>
      {info && <InfoTooltip field={label} infoMap={infoMap} />}
    </div>
  </div>
);