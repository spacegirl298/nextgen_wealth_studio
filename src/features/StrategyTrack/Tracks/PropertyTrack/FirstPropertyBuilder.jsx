/**
 * FirstPropertyBuilder.jsx
 * ─────────────────────────────────────────────────────────────
 * Strategy track page — fully driven by tracksData.js.
 * This page pattern is reusable for ANY track: swap getTrackById(id).
 *
 * Key wiring:
 *  - Reads from useSnapshotStore to seed input defaults (MoneySnapshot data)
 *  - User can override locally; overrides persist in localStorage per track
 *  - Stage statuses computed live against track requirement() functions
 *  - Completed stages persist in localStorage via TRACK_PROGRESS_KEY
 *  - Nudges driven by tracksData nudgeDefs + useNudges hook
 *  - MilestoneStep renders full tradeoffs, warnings, edu, glossary
 *  - TrackTimeline for visual progress
 *  - TrackProgress for summary bar
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { getTrackById, TRACK_PROGRESS_KEY } from "../../data/tracksData";
import { useSnapshotStore, calcTaxBreakdown } from "../../../../hooks/usesSnapshotStore";
import { useLocalStorage } from "../../../../hooks/userLocalStorage";
import { useNudges } from "../../../../hooks/useNudges";

import MilestoneStep  from "../../components/MilestoneStep";
import TrackTimeline  from "../../components/TrackTimeline";
import TrackProgress  from "../../components/TrackProgress";

import styles from "../../Tracks.module.css";

// ─── CONSTANTS ───────────────────────────────────────────────
const TRACK_ID   = "property";
const STORAGE_KEY_OVERRIDES = `track_overrides_${TRACK_ID}_v1`;

// ─── INFO TOOLTIP ────────────────────────────────────────────
const INFO_CONTENT = {
  "Monthly Take-Home Pay": {
    title: "Monthly Take-Home Pay",
    body: "Your net salary after tax and deductions. This is what actually lands in your account and determines how much you can realistically save each month toward your deposit.",
  },
  "Monthly Savings Contribution": {
    title: "Monthly Savings Contribution",
    body: "How much you set aside each month specifically for your deposit goal. Consistent contributions compound significantly over time — even small increases make a big difference.",
  },
  "Current Savings Balance": {
    title: "Current Savings Balance",
    body: "The total amount you have saved toward your deposit so far. This is your starting point in the simulation.",
  },
  "Target Deposit": {
    title: "Target Deposit",
    body: "The deposit you're aiming for on your first property. SA banks typically require at least 10% of the purchase price. A 20% deposit unlocks better interest rates and reduces monthly repayments significantly.",
  },
  "Savings Interest Rate": {
    title: "Savings Interest Rate",
    body: "The annual return on your savings account or investment vehicle. A tax-free savings account (TFSA) in South Africa can yield 8–10% through unit trusts, vs simple call account rates of 7–8%.",
  },
  "Credit Score": {
    title: "Credit Score",
    body: "Your credit score is one of the most important factors in bond approval. South African scores range from 300–999. Most banks require 600+ for approval. Above 700 typically unlocks better interest rates.",
  },
  "Emergency Fund (months)": {
    title: "Emergency Fund",
    body: "How many months of living expenses your emergency fund covers. Banks and financial advisors recommend at least 3 months before aggressively saving for a deposit.",
  },
  "Debt-to-Income Ratio": {
    title: "Debt-to-Income Ratio",
    body: "Your total monthly debt repayments as a percentage of your gross income. Banks require this below 35–40% for bond approval. The lower, the better.",
  },
};

const InfoTooltip = ({ field }) => {
  const [open, setOpen]       = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const btnRef                = useRef(null);
  const info                  = INFO_CONTENT[field];

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        setPos({ top: r.bottom + 8, left: r.left - 120 });
      }
    };
    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    const onOut = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onOut);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("mousedown", onOut);
    };
  }, [open]);

  if (!info) return null;

  return (
    <>
      <button
        ref={btnRef}
        className={styles.infoIcon}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Info about ${field}`}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="var(--clr-gold)" strokeWidth="1" />
          <text x="7" y="7" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--clr-gold)">i</text>
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            className={styles.tooltipBox}
            style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 999999 }}
            role="tooltip"
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{info.title}</span>
              <button className={styles.tooltipClose} onClick={() => setOpen(false)} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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

// ─── SLIDER FIELD ────────────────────────────────────────────
const SliderField = ({ label, min, max, step, value, onChange, prefix = "", suffix = "", info, snapshotValue }) => {
  const isDivergent = snapshotValue !== undefined && value !== snapshotValue;

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldLabelRow}>
        <label className={styles.fieldLabel}>{label}</label>
        {isDivergent && (
          <button
            className={styles.syncBtn}
            onClick={() => onChange(snapshotValue)}
            title={`Reset to Money Snapshot value: ${prefix}${snapshotValue?.toLocaleString()}${suffix}`}
            aria-label={`Reset ${label} to your Money Snapshot value`}
          >
            ↩ Sync from Snapshot
          </button>
        )}
      </div>
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
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={label}
          />
        </div>
        <span className={styles.sliderValue}>
          {prefix}{value.toLocaleString()}{suffix}
        </span>
        {info && <InfoTooltip field={label} />}
      </div>
    </div>
  );
};

// ─── NUDGE BANNER ────────────────────────────────────────────
const NudgeBanner = ({ nudges, onDismiss }) => {
  if (!nudges?.length) return null;

  return (
    <div className={styles.nudgeBannerStack} role="region" aria-label="Alerts and nudges">
      {nudges.map((n) => (
        <div
          key={n.id}
          className={`${styles.nudgeBanner} ${
            n.severity === "danger"
              ? styles.nudgeDanger
              : n.severity === "warning"
              ? styles.nudgeWarning
              : styles.nudgeInfo
          }`}
          role="status"
          aria-live="polite"
        >
          <span className={styles.nudgeText}>{n.message}</span>
          <button
            className={styles.nudgeDismiss}
            onClick={() => onDismiss(n.id)}
            aria-label={`Dismiss: ${n.message}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── DONUT CHART ─────────────────────────────────────────────
const DonutChart = ({ pct }) => {
  const r     = 68;
  const circ  = 2 * Math.PI * r;
  const dash  = Math.min(pct / 100, 1) * circ;
  const done  = pct >= 100;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutContainer}>
        <svg className={styles.donutSvg} width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={done ? "#4ade80" : "var(--clr-gold)"}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)", filter: "drop-shadow(0 0 8px rgba(248,210,153,0.4))" }}
          />
        </svg>
        <div className={styles.donutInner}>
          <span className={styles.donutPct}>{Math.min(Math.round(pct), 100)}%</span>
          <span className={styles.donutLbl}>of goal</span>
        </div>
      </div>
    </div>
  );
};

// ─── CREDIT SCORE BAR ────────────────────────────────────────
const CreditScoreBar = ({ score }) => {
  const pct = Math.max(0, Math.min(100, ((score - 300) / 699) * 100));
  const gradeInfo =
    score >= 750 ? { label: "Excellent", color: "#4ade80" }
    : score >= 670 ? { label: "Good", color: "#86efac" }
    : score >= 580 ? { label: "Fair", color: "#fbbf24" }
    : { label: "Poor", color: "#f87171" };

  const TIERS = [
    { label: "Minimum Approval",  score: 600 },
    { label: "Competitive Rate",  score: 670 },
    { label: "Best Rate Tier",    score: 750 },
  ];

  return (
    <>
      <div className={styles.creditScoreBig} style={{ color: gradeInfo.color }}>{score}</div>
      <div className={styles.creditGrade} style={{ color: gradeInfo.color }}>{gradeInfo.label}</div>
      <div className={styles.creditTrack} role="progressbar" aria-valuenow={score} aria-valuemin={300} aria-valuemax={999} aria-label={`Credit score: ${score}`}>
        <div className={styles.creditMarker} style={{ left: `${pct}%` }} />
      </div>
      <div className={styles.creditScaleLabels}>
        <span>300 · Poor</span>
        <span>580 · Fair</span>
        <span>670 · Good</span>
        <span>750+ · Excellent</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.creditTiersHeading}>Bank Requirements</div>
      {TIERS.map((t) => (
        <div key={t.label} className={styles.creditTierRow}>
          <span className={styles.creditTierLabel}>{t.label}</span>
          <span className={score >= t.score ? styles.creditTierMet : styles.creditTierUnmet}>
            {t.score}+ {score >= t.score ? "✓" : ""}
          </span>
        </div>
      ))}
    </>
  );
};

// ─── ALERT HELPERS ───────────────────────────────────────────
const alertClass = (type, s) => {
  if (type === "warn") return `${s.alert} ${s.alertWarn}`;
  if (type === "good") return `${s.alert} ${s.alertGood}`;
  return `${s.alert} ${s.alertInfo}`;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function FirstPropertyBuilder() {
  const track = getTrackById(TRACK_ID);
  const { state: snapshotState, derived: snapshotDerived } = useSnapshotStore();

  // ── Derive sensible defaults from MoneySnapshot ──────────
  const snapshotDefaults = useMemo(() => {
    const takeHome       = Math.round(snapshotDerived.takeHome);
    const monthlySave    = snapshotState.monthlySavingsContrib ?? 2000;
    const savings        = snapshotState.emergencyFund + snapshotState.tfsa + snapshotState.localInv;
    const dti            = snapshotDerived.metrics?.dti ?? 0;
    const emergencyMonths = snapshotDerived.metrics?.emergencyMonths ?? 0;
    return { takeHome, monthlySave, savings, dti, emergencyMonths };
  }, [snapshotState, snapshotDerived]);

  // ── Local overrides — persist per track ──────────────────
  const [overrides, setOverrides] = useLocalStorage(STORAGE_KEY_OVERRIDES, {});

  const get = (key, fallback) =>
    overrides[key] !== undefined ? overrides[key] : fallback;

  const set = useCallback(
    (key, val) => setOverrides((prev) => ({ ...prev, [key]: val })),
    [setOverrides],
  );

  // ── Inputs — seeded from snapshot, overridable ────────────
  const takeHome       = get("takeHome",       snapshotDefaults.takeHome);
  const monthlySave    = get("monthlySave",    snapshotDefaults.monthlySave);
  const savings        = get("savings",        snapshotDefaults.savings);
  const targetDeposit  = get("targetDeposit",  200000);
  const interestRate   = get("interestRate",   8.5);
  const creditScore    = get("creditScore",    640);

  const [learnOpen, setLearnOpen] = useState(false);

  // ── Stage progress persistence ────────────────────────────
  const progressKey = TRACK_PROGRESS_KEY(TRACK_ID);
  const [manuallyCompleted, setManuallyCompleted] = useLocalStorage(progressKey, []);

  const markComplete = useCallback(
    (stageId) => setManuallyCompleted((prev) => prev.includes(stageId) ? prev : [...prev, stageId]),
    [setManuallyCompleted],
  );

  const markIncomplete = useCallback(
    (stageId) => setManuallyCompleted((prev) => prev.filter((id) => id !== stageId)),
    [setManuallyCompleted],
  );

  // ── Derived calculations ──────────────────────────────────
  const computed = useMemo(() => {
    const pct          = (savings / targetDeposit) * 100;
    const remaining    = Math.max(0, targetDeposit - savings);
    const savingsRate  = takeHome > 0 ? (monthlySave / takeHome) * 100 : 0;
    const dti          = snapshotDerived.metrics?.dti ?? 0;
    const emergencyMonths = savings > 0 && snapshotDerived.totalExpenses > 0
      ? savings / snapshotDerived.totalExpenses
      : snapshotDerived.metrics?.emergencyMonths ?? 0;

    const r = interestRate / 100 / 12;
    let months = 0;
    if (remaining > 0 && monthlySave > 0) {
      let bal = savings;
      while (bal < targetDeposit && months < 360) {
        bal = bal * (1 + r) + monthlySave;
        months++;
      }
    }

    const years    = Math.floor(months / 12);
    const mo       = months % 12;
    const goalDate =
      months === 0     ? "Already reached"
      : months >= 360  ? "36+ years"
      : years > 0      ? `${years}y ${mo}m`
      :                  `${mo} months`;

    // Smart alerts
    const alerts = [];
    if (savingsRate < 15)
      alerts.push({ type: "warn", text: `Your savings rate is ${savingsRate.toFixed(0)}% — aim for at least 20% of take-home to hit your goal faster.` });
    if (creditScore < 600)
      alerts.push({ type: "warn", text: "Your credit score needs attention. Clear any missed payments and keep credit utilisation below 30%." });
    if (creditScore >= 670 && creditScore < 750)
      alerts.push({ type: "info", text: "A 750+ score unlocks better bond rates. Request your free credit report from TransUnion or Experian and dispute any errors." });
    if (creditScore >= 750)
      alerts.push({ type: "good", text: "Excellent credit score — you're likely to qualify for prime or prime minus rates on your bond." });
    if (pct >= 100)
      alerts.push({ type: "good", text: "You've reached your deposit target! Consider locking it in a fixed-term account while you prepare your bond application." });
    if (months > 60 && months < 360)
      alerts.push({ type: "info", text: `Increasing your monthly contribution by R500 would cut approximately ${Math.round(months * 0.08)} months off your timeline.` });
    if (alerts.length === 0)
      alerts.push({ type: "good", text: "You're on track. Stay consistent and review your budget quarterly to find extra savings capacity." });

    // Monthly action plan
    const actions = [];
    if (creditScore < 670)
      actions.push("Check your credit report for errors via TransUnion or Experian (free once a year)");
    actions.push(`Automate a R${monthlySave.toLocaleString()} debit order into your dedicated deposit savings account`);
    if (savingsRate < 20)
      actions.push("Review last month's spending — identify one category to cut by 10%");
    actions.push("Compare TFSA interest rates across FNB, Nedbank, and Standard Bank");
    if (creditScore >= 600)
      actions.push("Get pre-qualified at your bank to understand your current bond eligibility");
    if (months > 24)
      actions.push("Consider supplementary income streams to accelerate your deposit timeline");
    actions.push("Confirm your emergency fund still covers at least 3 months of expenses");

    return { pct, remaining, months, goalDate, savingsRate, dti, emergencyMonths, alerts, actions };
  }, [takeHome, monthlySave, savings, targetDeposit, interestRate, creditScore, snapshotDerived]);

  // ── Stage statuses — requirement(snapshotState) merged with local inputs ──
  const stageStatuses = useMemo(() => {
    const ctx = {
      savings,
      targetDeposit,
      creditScore,
      emergencyMonths: computed.emergencyMonths,
      dti: computed.dti,
      savingsRate: computed.savingsRate,
      tfsa: snapshotState.tfsa,
      totalSavings: snapshotDerived.totalSavings,
    };

    const autoResults = track?.stages.map((s) => {
      try { return s.requirement(ctx); }
      catch { return false; }
    }) ?? [];

    // Manual overrides can only promote, not demote past auto-completion
    return autoResults.map((autoDone, i) => {
      const stage     = track.stages[i];
      const isManual  = manuallyCompleted.includes(stage.id);
      const done      = autoDone || isManual;
      if (done) return "done";
      if (i === 0 || autoResults[i - 1] || manuallyCompleted.includes(track.stages[i - 1].id)) return "active";
      return "locked";
    });
  }, [savings, targetDeposit, creditScore, computed, snapshotState, snapshotDerived, manuallyCompleted, track]);

  const doneCount       = stageStatuses.filter((s) => s === "done").length;
  const totalStages     = track?.stages.length ?? 0;

  // ── Nudges ────────────────────────────────────────────────
  const nudgeContext = useMemo(() => ({
    savings,
    tfsa: snapshotState.tfsa,
    housing: snapshotDerived.housing,
    takeHome,
    totalSavings: snapshotDerived.totalSavings,
    offshoreInv: snapshotState.offshoreInv,
  }), [savings, snapshotState, snapshotDerived, takeHome]);

  const nudgeMetrics = useMemo(() => ({
    savingsRate: computed.savingsRate,
    emergencyMonths: computed.emergencyMonths,
    dti: computed.dti,
  }), [computed]);

  const { activeNudges, dismissNudge } = useNudges(
    track?.nudgeDefs ?? [],
    nudgeMetrics,
    nudgeContext,
    `track_nudges_${TRACK_ID}_v1`,
  );

  // ── Scroll to milestone refs ──────────────────────────────
  const milestoneRefs = useRef([]);
  const handleTimelineClick = useCallback((stageId, index) => {
    milestoneRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!track) return <div className={styles.page}>Track not found.</div>;

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>{track.difficulty} · {track.timeHorizon}</div>
        <h1 className={styles.heroTitle}>
          First Property
          <br />
          Builder
        </h1>
        <p className={styles.heroSub}>{track.description}</p>
        <p className={styles.heroWho}>{track.whoIsItFor}</p>
      </div>

      {/* Nudges */}
      <NudgeBanner nudges={activeNudges} onDismiss={dismissNudge} />

      {/* Learn More / Rationale */}
      <div className={styles.learnCard}>
        <button
          className={styles.learnToggle}
          onClick={() => setLearnOpen((v) => !v)}
          aria-expanded={learnOpen}
        >
          Why this track?
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {learnOpen && (
          <div className={styles.learnBody}>
            <p className={styles.learnIntro}>{track.rationale}</p>
            <div className={styles.learnGrid}>
              <div className={styles.learnItem}>
                <h4>Why Deposit Size Matters</h4>
                <p>A 10% deposit meets the minimum. A 20% deposit typically saves R200–400K in total interest by reducing the loan principal and often unlocking a better rate.</p>
              </div>
              <div className={styles.learnItem}>
                <h4>The Credit Score Lever</h4>
                <p>Your credit score is often more impactful than your income. Moving from 620 to 720 can be the difference between prime+2% and prime−0.5% — thousands per month.</p>
              </div>
              <div className={styles.learnItem}>
                <h4>Compound Savings</h4>
                <p>Consistent monthly contributions into a high-yield TFSA compound meaningfully over 3–5 years. A R3,500/month contribution at 8.5% p.a. grows to R200K+ in under 4 years.</p>
              </div>
              <div className={styles.learnItem}>
                <h4>The Trade-Offs</h4>
                <p>Higher deposit = lower risk but longer timeline. Better credit = lower interest but requires time and discipline. This lab helps you find your optimal path.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Your Journey</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <TrackTimeline
        stages={track.stages}
        stageStatuses={stageStatuses}
        onStageClick={handleTimelineClick}
      />

      <TrackProgress
        totalStages={totalStages}
        completedStages={doneCount}
      />

      {/* Step 1 — Profile inputs */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 1 — Your Situation</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Financial Profile</h2>
        <p className={styles.cardSub}>
          These values are pre-filled from your Money Snapshot. Adjust freely — your changes are saved here and don&apos;t affect your Snapshot.
          Use <em>↩ Sync from Snapshot</em> on any field to pull the latest figure across.
        </p>

        <div className={styles.twoCol}>
          <div>
            <SliderField
              label="Monthly Take-Home Pay"
              min={8000} max={120000} step={500}
              value={takeHome} onChange={(v) => set("takeHome", v)}
              prefix="R " info
              snapshotValue={snapshotDefaults.takeHome}
            />
            <SliderField
              label="Monthly Savings Contribution"
              min={500} max={30000} step={250}
              value={monthlySave} onChange={(v) => set("monthlySave", v)}
              prefix="R " info
              snapshotValue={snapshotDefaults.monthlySave}
            />
            <SliderField
              label="Savings Interest Rate"
              min={4} max={14} step={0.25}
              value={interestRate} onChange={(v) => set("interestRate", v)}
              suffix="% p.a." info
            />
          </div>
          <div>
            <SliderField
              label="Current Savings Balance"
              min={0} max={500000} step={5000}
              value={savings} onChange={(v) => set("savings", v)}
              prefix="R " info
              snapshotValue={Math.round(snapshotDefaults.savings)}
            />
            <SliderField
              label="Target Deposit"
              min={50000} max={600000} step={10000}
              value={targetDeposit} onChange={(v) => set("targetDeposit", v)}
              prefix="R " info
            />
            <SliderField
              label="Credit Score"
              min={300} max={999} step={1}
              value={creditScore} onChange={(v) => set("creditScore", v)}
              info
            />
          </div>
        </div>

        {/* Snapshot-derived metrics read-only display */}
        <div className={styles.snapshotMetaRow}>
          <div className={styles.snapshotMetaItem}>
            <span className={styles.snapshotMetaLabel}>Emergency Fund Coverage</span>
            <span className={`${styles.snapshotMetaValue} ${computed.emergencyMonths >= 3 ? styles.metaGood : styles.metaWarn}`}>
              {computed.emergencyMonths.toFixed(1)} months
            </span>
          </div>
          <div className={styles.snapshotMetaItem}>
            <span className={styles.snapshotMetaLabel}>Debt-to-Income Ratio</span>
            <span className={`${styles.snapshotMetaValue} ${computed.dti < 36 ? styles.metaGood : styles.metaWarn}`}>
              {computed.dti.toFixed(1)}%
            </span>
          </div>
          <div className={styles.snapshotMetaItem}>
            <span className={styles.snapshotMetaLabel}>Monthly Savings Rate</span>
            <span className={`${styles.snapshotMetaValue} ${computed.savingsRate >= 20 ? styles.metaGood : styles.metaWarn}`}>
              {computed.savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Step 2 — Savings Progress */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 2 — Savings Progress</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Deposit Tracker</h2>
          <p className={styles.cardSub}>How close you are to your target deposit</p>

          <DonutChart pct={computed.pct} />
          <div className={styles.divider} />

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Saved</span>
            <span className={styles.summaryVal}>R {savings.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Remaining</span>
            <span className={styles.summaryVal}>R {computed.remaining.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Target</span>
            <span className={styles.summaryVal}>R {targetDeposit.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Savings Rate</span>
            <span className={computed.savingsRate >= 20 ? styles.summaryValGood : styles.summaryValWarn}>
              {computed.savingsRate.toFixed(1)}% of income
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.goalEstimate}>
            <div className={styles.goalEstimateLbl}>Estimated Time to Goal</div>
            <div className={computed.months < 360 ? styles.goalEstimateVal : styles.goalEstimateValDim}>
              {computed.goalDate}
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Credit Score</h2>
          <p className={styles.cardSub}>Your key to bond approval and better rates</p>
          <CreditScoreBar score={creditScore} />
        </div>
      </div>

      {/* Step 3 — Milestones */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 3 — Milestones</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Journey to Home Ownership</h2>
        <p className={styles.cardSub}>
          {totalStages} stages from financial foundation to bond application. Progress updates live as you adjust your inputs —
          or mark stages complete manually as you hit them in real life.
        </p>

        <div className={styles.milestones}>
          {track.stages.map((stage, i) => (
            <div
              key={stage.id}
              ref={(el) => (milestoneRefs.current[i] = el)}
            >
              <MilestoneStep
                stage={stage}
                stageNumber={i + 1}
                status={stageStatuses[i]}
                onComplete={markComplete}
                onUncomplete={markIncomplete}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 4 — Recommendations */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 4 — Recommendations</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Smart Alerts</h2>
          <p className={styles.cardSub}>Dynamic insights based on your current inputs</p>
          <div className={styles.alerts}>
            {computed.alerts.map((a, i) => (
              <div key={i} className={alertClass(a.type, styles)}>
                <span className={styles.alertIcon} aria-hidden="true">
                  {a.type === "warn" ? "⚠" : a.type === "good" ? "✓" : "ℹ"}
                </span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Monthly Action Plan</h2>
          <p className={styles.cardSub}>Personalised actions for this month</p>
          <ul className={styles.actionsList}>
            {computed.actions.map((action, i) => (
              <li key={i} className={styles.actionItem}>
                <div className={styles.actionDot} aria-hidden="true" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step 5 — Summary */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 5 — Summary</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Key Numbers at a Glance</h2>
        <p className={styles.cardSub}>
          A snapshot of your path to first property ownership based on your current profile.
        </p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Your Figures</th>
              <th>Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Monthly Savings",    `R ${monthlySave.toLocaleString()}`,                       `R ${Math.round(takeHome * 0.2).toLocaleString()} (20%)`],
              ["Savings Rate",       `${computed.savingsRate.toFixed(1)}%`,                     "20%+"],
              ["Deposit Progress",   `${Math.min(Math.round(computed.pct), 100)}%`,             "100%"],
              ["Credit Score",       `${creditScore}`,                                          "670+ for approval"],
              ["Emergency Coverage", `${computed.emergencyMonths.toFixed(1)} months`,           "3+ months"],
              ["Debt-to-Income",     `${computed.dti.toFixed(1)}%`,                            "< 36%"],
              ["Time to Goal",       computed.goalDate,                                         "< 36 months ideal"],
              ["Property Budget",    `R ${Math.round(targetDeposit / 0.1).toLocaleString()}`,  "Based on 10% deposit"],
            ].map(([label, yours, bench]) => (
              <tr key={label}>
                <td className={styles.rowLabel}>{label}</td>
                <td className={styles.highlight}>{yours}</td>
                <td className={styles.benchmarkVal}>{bench}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.recHighlight}>
          <strong>Simulation Insight:</strong> At your current savings rate of {computed.savingsRate.toFixed(0)}% and a {interestRate}% annual
          return, you&apos;re projected to reach your R {targetDeposit.toLocaleString()} deposit target in{" "}
          <strong>{computed.goalDate}</strong>.
          {computed.savingsRate < 20
            ? ` Increasing monthly contributions by R${Math.round(takeHome * 0.05).toLocaleString()} could shave approximately ${Math.round(computed.months * 0.15)} months off your timeline.`
            : " You're ahead of the 20% savings benchmark — stay consistent and review your credit score next."}
        </div>
      </div>
    </div>
  );
}