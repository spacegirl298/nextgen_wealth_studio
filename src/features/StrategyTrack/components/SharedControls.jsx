import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "../Tracks.module.css";

export const InfoTooltip = ({ field, infoMap }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const info = infoMap?.[field];

  const updatePosition = useCallback(() => {
    if (buttonRef.current && open) {
      const rect = buttonRef.current.getBoundingClientRect();
      // On mobile, center the tooltip
      if (window.innerWidth <= 768) {
        setPosition({ 
          top: rect.bottom + 8, 
          left: window.innerWidth / 2 - 140 
        });
      } else {
        setPosition({ top: rect.bottom + 8, left: rect.left - 120 });
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        // Also check if click is inside tooltip
        const tooltip = document.querySelector(`.${styles.tooltipBox}`);
        if (tooltip && !tooltip.contains(event.target)) {
          setOpen(false);
        } else if (!tooltip) {
          setOpen(false);
        }
      }
    };

    // Delay to avoid immediate close
    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 0);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, updatePosition]);

  if (!info) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.infoIcon}
        onClick={() => setOpen((value) => !value)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
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
          style={{ 
            position: "fixed", 
            top: position.top, 
            left: position.left, 
            zIndex: 999999,
            maxWidth: window.innerWidth <= 768 ? "calc(100vw - 32px)" : "260px",
          }}
          role="tooltip"
        >
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>{info.title}</span>
            <button 
              className={styles.tooltipClose} 
              onClick={() => setOpen(false)}
              onTouchEnd={() => setOpen(false)}
              aria-label="Close" 
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className={styles.tooltipBody}>{info.body}</p>
        </div>,
        document.body
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
}) => {
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  // For mobile touch events
  const handleTouchEnd = (e) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
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
            onChange={handleChange}
            onTouchEnd={handleTouchEnd}
            className={styles.slider}
            style={{ "--pct": `${percentage}%` }}
          />
        </div>
        <span className={styles.sliderValue}>
          {prefix}{value.toLocaleString()}{suffix}
        </span>
        {info && <InfoTooltip field={label} infoMap={infoMap} />}
      </div>
    </div>
  );
};