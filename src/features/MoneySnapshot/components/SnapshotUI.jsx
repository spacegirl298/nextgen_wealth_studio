/**
 * SnapshotUI.jsx
 * ─────────────────────────────────────────────────────────────
 * Shared, reusable UI primitives for the Money Snapshot feature.
 * Import individual components as needed in any snapshot page.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import styles from "../Snapshot.module.css";

// ─────────────────────────────────────────────
//  INFO CONTENT (tooltip definitions)
// ─────────────────────────────────────────────
const INFO_CONTENT = {
  "Gross Monthly Salary":          { title: "Gross Monthly Salary",          body: "Your total salary before any deductions. Used to calculate PAYE via SARS 2025/26 brackets." },
  "Investment Income":             { title: "Investment Income",             body: "Monthly income from local investments: dividends, interest on unit trusts, or rental income." },
  "Rental Income":                 { title: "Rental Income",                 body: "Monthly rental income from tenants. Taxable in SA — declare to SARS. Net rental income adds to your taxable income." },
  "Bonuses":                       { title: "Bonuses",                       body: "Include 1/12 of your expected annual bonus for accurate monthly planning." },
  "Side Business Income":          { title: "Side Business Income",          body: "Freelancing, consulting, or any business activity outside primary employment. Also taxable." },
  "Medical Aid Dependants":        { title: "Medical Aid Dependants",        body: "People on your medical aid (including yourself). Each generates a monthly tax credit that reduces your PAYE." },
  "Rent / Bond":                   { title: "Rent / Bond",                   body: "Monthly rent or bond repayment. Should not exceed 30% of gross income — the primary affordability benchmark used by SA banks." },
  "Levies":                        { title: "Levies",                        body: "Monthly levies if you live in an estate or complex. A fixed housing cost often overlooked in budgets." },
  "Rates & Municipal":             { title: "Rates & Municipal",             body: "Monthly municipal rates (property tax) and services. Paid by homeowners directly or via an agent." },
  "Car Payment":                   { title: "Car Payment",                   body: "Monthly vehicle finance instalment. Aim to keep this under 15% of gross income." },
  "Petrol / Transport":            { title: "Petrol / Transport",            body: "Monthly fuel, Uber, taxi, or public transport costs. Include e-tolls and parking." },
  "Insurance":                     { title: "Insurance",                     body: "Car, home contents, and life cover premiums. Review annually." },
  "Medical Aid":                   { title: "Medical Aid",                   body: "Monthly medical aid premium. Contributions qualify for a monthly tax credit per dependant, reducing your PAYE." },
  "Groceries":                     { title: "Groceries",                     body: "Monthly spend on food, household supplies, and personal care. Typically the largest variable expense in a SA household." },
  "Dining Out":                    { title: "Dining Out",                    body: "Restaurants, takeaways, coffee shops, and food delivery. One of the most impactful categories to reduce." },
  "Subscriptions":                 { title: "Subscriptions",                 body: "Netflix, Showmax, gym, Spotify, news apps, and other recurring services. Small amounts add up." },
  "Entertainment":                 { title: "Entertainment",                 body: "Movies, events, concerts, holidays, and leisure. Budget for fun but keep it proportional." },
  "Shopping":                      { title: "Shopping",                      body: "Clothing, electronics, home décor, and general retail. Frequently underestimated in budget reviews." },
  "Student Loan":                  { title: "Student Loan",                  body: "NSFAS or private study loan repayments." },
  "Personal Loan":                 { title: "Personal Loan",                 body: "Personal loans from banks or credit providers. High-interest — prioritise paying these down first." },
  "Retail Accounts":               { title: "Retail Accounts",               body: "Store credit (Edgars, Woolworths, Truworths). Often carries 20–30% p.a. interest." },
  "Credit Card":                   { title: "Credit Card",                   body: "Monthly credit card repayment. Paying only the minimum keeps you trapped in a costly debt cycle." },
  "Total Outstanding Debt":        { title: "Total Outstanding Debt",        body: "Total amount owed across all credit: bonds, loans, car finance, credit cards, and store accounts." },
  "Monthly Minimum Payments":      { title: "Monthly Minimum Payments",      body: "Minimum required payments across all debt accounts. Always pay at least the minimum to avoid default." },
  "Weighted Average Interest Rate":{ title: "Weighted Average Interest Rate",body: "Average rate across all debts, weighted by balance. A high rate signals debt reduction should be priority." },
  "Emergency Fund":                { title: "Emergency Fund",                body: "Liquid savings for unexpected events. Target 3–6 months of total expenses in an accessible account separate from investments." },
  "TFSA Balance":                  { title: "TFSA Balance",                  body: "Contributions up to R36,000/year grow completely tax-free. Lifetime limit is R500,000." },
  "Retirement Annuity":            { title: "Retirement Annuity",            body: "RA balance. Contributions are tax-deductible up to 27.5% of taxable income (max R350,000/year)." },
  "Offshore Investments":          { title: "Offshore Investments",          body: "SA residents may externalise up to R10 million per year via the foreign investment allowance." },
  "Local Investments":             { title: "Local Investments",             body: "Unit trusts, ETFs, shares, or other locally-held investments outside TFSA or RA." },
  "Monthly Savings Contribution":  { title: "Monthly Savings Contribution",  body: "How much you actively add to savings/investments each month. This is the engine of wealth building." },
};

// ─────────────────────────────────────────────
//  INFO TOOLTIP
// ─────────────────────────────────────────────
export const InfoTooltip = ({ field }) => {
  const [open, setOpen]       = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const buttonRef             = useRef(null);
  const info                  = INFO_CONTENT[field];
  const tooltipId             = useId();

  const updatePos = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: Math.max(8, Math.min(rect.left - 120, window.innerWidth - 290)) });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const close = (e) => { if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false); };
    const key   = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", close);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
      document.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", close);
    };
  }, [open, updatePos]);

  if (!info) return null;

  return (
    <>
      <button ref={buttonRef} className={styles.infoIcon} onClick={() => setOpen(v => !v)}
        aria-label={`More information about ${field}`} aria-expanded={open}
        aria-controls={open ? tooltipId : undefined} type="button">
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="var(--clr-gold)" strokeWidth="1" />
          <text x="7" y="7" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--clr-gold)">i</text>
        </svg>
      </button>
      {open && createPortal(
        <div id={tooltipId} className={styles.tooltipBox}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 999999 }} role="tooltip">
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>{info.title}</span>
            <button className={styles.tooltipClose} onClick={() => setOpen(false)} aria-label="Close tooltip" type="button">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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

// ─────────────────────────────────────────────
//  SLIDER FIELD
// ─────────────────────────────────────────────
export const SliderField = ({ label, min = 0, max, step, value, onChange, prefix = "", suffix = "", id: propId }) => {
  const generated = useId();
  const inputId   = propId || `slider-${generated}`;
  const safe      = typeof value === "number" && !isNaN(value) ? value : min;
  const fillPct   = ((safe - min) / (max - min)) * 100;

  return (
    <div className={styles.fieldRow}>
      <label htmlFor={inputId} className={styles.fieldLabel}>{label}</label>
      <div className={styles.sliderWrap}>
        <div className={styles.sliderTrackWrap}>
          <input id={inputId} type="range" min={min} max={max} step={step} value={safe}
            onChange={e => onChange(Number(e.target.value))} className={styles.slider}
            style={{ "--pct": `${fillPct}%` }}
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={safe}
            aria-valuetext={`${prefix}${safe.toLocaleString()}${suffix}`} />
        </div>
        <span className={styles.sliderValue} aria-live="polite">
          {prefix}{safe.toLocaleString()}{suffix}
        </span>
        <InfoTooltip field={label} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  STAT CARD
// ─────────────────────────────────────────────
export const StatCard = ({ label, value, sub, accent }) => (
  <div className={styles.statCard}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value}</div>
    {sub && <div className={styles.statCardSub}>{sub}</div>}
    <div className={styles.statCardInfo}><InfoTooltip field={label} /></div>
  </div>
);

// ─────────────────────────────────────────────
//  MULTI-SEGMENT BAR
// ─────────────────────────────────────────────
export const MultiSegmentBar = ({ segments }) => {
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);
  return (
    <div className={styles.multiBar} role="img" aria-label="Breakdown chart">
      {segments.map((seg, i) => (
        <div key={i} className={styles.multiBarSeg}
          style={{ width: `${total > 0 ? (seg.value / total) * 100 : 0}%`, background: seg.color }}
          title={`${seg.label}: R${Math.round(seg.value).toLocaleString()}`}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
//  CIRCLE PROGRESS
// ─────────────────────────────────────────────
export const CircleProgress = ({ pct, label }) => {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <div className={styles.circleWrap}>
      <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label={`${label}: ${Math.round(pct)}%`}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--clr-gold)" strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
        <text x="36" y="40" textAnchor="middle" fill="var(--clr-gold)" fontSize="12" fontWeight="700">{Math.round(pct)}%</text>
      </svg>
      <span className={styles.circleLabel}>{label}</span>
    </div>
  );
};

// ─────────────────────────────────────────────
//  INSIGHT CARD
// ─────────────────────────────────────────────
export const InsightCard = ({ text, sentiment }) => (
  <div className={`${styles.insightCard} ${styles[`insightCard--${sentiment}`]}`}>
    {text}
  </div>
);

// ─────────────────────────────────────────────
//  NUDGE BANNER
// ─────────────────────────────────────────────
export const NudgeBanner = ({ nudges, onDismiss }) => {
  if (!nudges.length) return null;
  const nudge = nudges[0];
  return (
    <div role="alert" aria-live="polite"
      className={`${styles.nudgeBanner} ${styles[`nudgeBanner--${nudge.severity}`]}`}>
      <span className={styles.nudgeMessage}>{nudge.message}</span>
      {nudges.length > 1 && <span className={styles.nudgeCount}>{nudges.length} alerts</span>}
      <button onClick={() => onDismiss(nudge.id)} aria-label="Dismiss notification" type="button"
        className={styles.nudgeDismiss}>✕</button>
    </div>
  );
};

// ─────────────────────────────────────────────
//  LEARN MORE CARD
// ─────────────────────────────────────────────
export const LearnMore = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.learnCard}>
      <button className={styles.learnToggle} onClick={() => setOpen(v => !v)} aria-expanded={open} type="button">
        What is a Money Snapshot?
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.learnBody}>
          A Money Snapshot is a structured view of your financial position at a point in time — your income, taxes, spending categories, debt, and savings all in one place.
          It&apos;s designed to help you see patterns you might otherwise miss, like housing consuming too large a share of income, or a low savings rate that compounds into a significant retirement shortfall.
          <br /><br />
          <strong className={styles.learnHighlight}>In the South African context</strong>, many households carry high debt-to-income ratios, often fuelled by vehicle finance, store accounts, and personal loans at 20–30% interest.
          A regular snapshot helps you catch these patterns before they become crises.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  AUTO-SAVE INDICATOR
// ─────────────────────────────────────────────
export const AutoSaveIndicator = ({ lastSaved }) => {
  if (!lastSaved) return null;
  const time = lastSaved.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={styles.autoSaveIndicator} aria-live="polite">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="var(--clr-gold)" strokeWidth="1" />
        <path d="M3 5l1.5 1.5L7 3.5" stroke="var(--clr-gold)" strokeWidth="1" strokeLinecap="round" />
      </svg>
      Saved at {time}
    </div>
  );
};