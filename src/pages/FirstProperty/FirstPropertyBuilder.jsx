import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import styles from "./FirstProperty.module.css";

/* ─────────────────────────────────────────────
   TOOLTIP INFO CONTENT
───────────────────────────────────────────── */
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
};

/* ─────────────────────────────────────────────
   MILESTONES CONFIG
───────────────────────────────────────────── */
const MILESTONES = [
  {
    id: 1,
    icon: "🏁",
    title: "Build Your Financial Foundation",
    desc: "3-month emergency fund in place, budget tracked monthly, all short-term debt under control.",
    requirement: (s) => s.creditScore >= 580 && s.savings >= 10000,
    badge: "Foundation",
  },
  {
    id: 2,
    icon: "📈",
    title: "Crack the Credit Score",
    desc: "Achieve a credit score of 670+ for standard bond approval. Pay every account on time for 12+ consecutive months.",
    requirement: (s) => s.creditScore >= 670,
    badge: "Credit Ready",
  },
  {
    id: 3,
    icon: "💰",
    title: "Reach 50% of Your Deposit",
    desc: "Save at least half your target deposit — a meaningful milestone that shows consistent discipline and keeps you on track.",
    requirement: (s) => s.savings >= s.targetDeposit * 0.5,
    badge: "Halfway There",
  },
  {
    id: 4,
    icon: "🏆",
    title: "Hit Your Full Deposit Target",
    desc: "Reach your full deposit goal. A 20% deposit dramatically improves your bond rate and reduces total interest paid.",
    requirement: (s) => s.savings >= s.targetDeposit,
    badge: "Deposit Ready",
  },
  {
    id: 5,
    icon: "🔑",
    title: "Bond Application Ready",
    desc: "Credit score 700+, deposit in place, income verified, and all supporting documents prepared for pre-approval.",
    requirement: (s) => s.savings >= s.targetDeposit && s.creditScore >= 700,
    badge: "Apply Now",
  },
];

/* ─────────────────────────────────────────────
   INFO TOOLTIP COMPONENT
───────────────────────────────────────────── */
const InfoTooltip = ({ field }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const info = INFO_CONTENT[field];

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

  if (!info) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.infoIcon}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Info about ${field}`}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--clr-gold)" strokeWidth="1" />
          <text x="7" y="7" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--clr-gold)">
            i
          </text>
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            className={styles.tooltipBox}
            style={{ position: "fixed", top: position.top, left: position.left, zIndex: 999999 }}
            role="tooltip"
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{info.title}</span>
              <button className={styles.tooltipClose} onClick={() => setOpen(false)} aria-label="Close">
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

/* ─────────────────────────────────────────────
   SLIDER FIELD COMPONENT
───────────────────────────────────────────── */
const SliderField = ({ label, min, max, step, value, onChange, prefix = "", suffix = "", info }) => (
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
        {prefix}{value.toLocaleString()}{suffix}
      </span>
      {info && <InfoTooltip field={label} />}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   DONUT CHART COMPONENT
───────────────────────────────────────────── */
const DonutChart = ({ pct }) => {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  const isComplete = pct >= 100;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutContainer}>
        <svg className={styles.donutSvg} width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
          <circle
            cx="80" cy="80" r={r}
            fill="none"
            stroke={isComplete ? "#4ade80" : "var(--clr-gold)"}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)",
              filter: "drop-shadow(0 0 8px rgba(248,210,153,0.4))",
            }}
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

/* ─────────────────────────────────────────────
   CREDIT SCORE BAR COMPONENT
───────────────────────────────────────────── */
const CreditScoreBar = ({ score }) => {
  const pct = Math.max(0, Math.min(100, ((score - 300) / 699) * 100));

  const gradeInfo =
    score >= 750 ? { label: "Excellent", color: "#4ade80" }
    : score >= 670 ? { label: "Good", color: "#86efac" }
    : score >= 580 ? { label: "Fair", color: "#fbbf24" }
    : { label: "Poor", color: "#f87171" };

  const TIERS = [
    { label: "Minimum Approval", score: 600 },
    { label: "Competitive Rate",  score: 670 },
    { label: "Best Rate Tier",    score: 750 },
  ];

  return (
    <>
      <div className={styles.creditScoreBig} style={{ color: gradeInfo.color }}>{score}</div>
      <div className={styles.creditGrade} style={{ color: gradeInfo.color }}>{gradeInfo.label}</div>

      <div className={styles.creditTrack}>
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

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function FirstPropertyBuilder() {
  const [learnOpen, setLearnOpen] = useState(false);

  // ── Inputs ──
  const [takeHome,      setTakeHome]      = useState(32000);
  const [monthlySave,   setMonthlySave]   = useState(3500);
  const [savings,       setSavings]       = useState(85000);
  const [targetDeposit, setTargetDeposit] = useState(200000);
  const [interestRate,  setInterestRate]  = useState(8.5);
  const [creditScore,   setCreditScore]   = useState(640);

  // ── Derived calculations ──
  const computed = useMemo(() => {
    const pct = (savings / targetDeposit) * 100;
    const remaining = Math.max(0, targetDeposit - savings);
    const savingsRate = takeHome > 0 ? (monthlySave / takeHome) * 100 : 0;

    const r = interestRate / 100 / 12;
    let months = 0;
    if (remaining > 0 && monthlySave > 0) {
      let bal = savings;
      while (bal < targetDeposit && months < 360) {
        bal = bal * (1 + r) + monthlySave;
        months++;
      }
    }

    const years = Math.floor(months / 12);
    const mo    = months % 12;
    const goalDate =
      months === 0   ? "Already reached"
      : months >= 360 ? "36+ years"
      : years > 0     ? `${years}y ${mo}m`
      : `${mo} months`;

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

    // Monthly actions
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

    return { pct, remaining, months, goalDate, savingsRate, alerts, actions };
  }, [takeHome, monthlySave, savings, targetDeposit, interestRate, creditScore]);

  // ── Milestone statuses ──
  const msStatuses = useMemo(() => {
    const state = { savings, targetDeposit, creditScore };
    const results = MILESTONES.map((m) => m.requirement(state));
    return results.map((done, i) => {
      if (done) return "done";
      if (i === 0 || results[i - 1]) return "active";
      return "locked";
    });
  }, [savings, targetDeposit, creditScore]);

  const doneCount       = msStatuses.filter((s) => s === "done").length;
  const overallProgress = (doneCount / MILESTONES.length) * 100;

  // ── Class name helpers ──
  const msIconClass = (status) => {
    if (status === "done")   return `${styles.msIcon} ${styles.msIconDone}`;
    if (status === "active") return `${styles.msIcon} ${styles.msIconActive}`;
    return `${styles.msIcon} ${styles.msIconLocked}`;
  };

  const msStatusClass = (status) => {
    if (status === "done")   return `${styles.msStatus} ${styles.msStatusDone}`;
    if (status === "active") return `${styles.msStatus} ${styles.msStatusActive}`;
    return `${styles.msStatus} ${styles.msStatusLocked}`;
  };

  const msBadgeClass = (status) => {
    if (status === "done")   return `${styles.msBadge} ${styles.msBadgeDone}`;
    if (status === "active") return `${styles.msBadge} ${styles.msBadgeActive}`;
    return `${styles.msBadge} ${styles.msBadgeLocked}`;
  };

  const alertClass = (type) => {
    if (type === "warn") return `${styles.alert} ${styles.alertWarn}`;
    if (type === "good") return `${styles.alert} ${styles.alertGood}`;
    return `${styles.alert} ${styles.alertInfo}`;
  };

  return (
    <div className={styles.page}>

      {/* ── Back button ── */}
      <button className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All Tracks
      </button>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.trackPill}>
          <svg width="7" height="7" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" fill="currentColor" />
          </svg>
          Young Professionals Track
        </div>

        <h1 className={styles.heroTitle}>
          First Property<br />Builder
        </h1>

        <p className={styles.heroSub}>
          A structured simulation lab for young professionals working toward the milestone of home ownership.
          Track your deposit progress, credit score, and five key milestones — all updating in real time
          as you adjust your inputs.
        </p>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>5</span>
            <span className={styles.statLabel}>Milestones</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValSmall}>R1.1M+</span>
            <span className={styles.statLabel}>Avg First Home</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>10%</span>
            <span className={styles.statLabel}>Min Deposit</span>
          </div>
        </div>
      </div>

      {/* ── Learn More ── */}
      <div className={styles.learnCard}>
        <button className={styles.learnToggle} onClick={() => setLearnOpen((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v4M8 11v.5" stroke="var(--clr-gold)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Track Philosophy &amp; How This Works
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {learnOpen && (
          <div className={styles.learnBody}>
            <p className={styles.learnIntro}>
              The First Property Builder track is built on a simple philosophy: the gap between renting and owning
              is mostly a savings and credit discipline problem, not an income problem. Most young professionals
              in Johannesburg earn enough to eventually qualify for a bond — they just haven't optimised the inputs yet.
            </p>
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

      {/* ══════════════════════════════════════
          STEP 1 — FINANCIAL PROFILE
      ══════════════════════════════════════ */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 1 — Your Situation</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Financial Profile</h2>
        <p className={styles.cardSub}>
          Adjust the sliders to reflect your current situation. All outputs update in real time.
        </p>

        <div className={styles.twoCol}>
          <div>
            <SliderField label="Monthly Take-Home Pay"        min={8000}  max={120000} step={500}  value={takeHome}      onChange={setTakeHome}      prefix="R " info />
            <SliderField label="Monthly Savings Contribution" min={500}   max={30000}  step={250}  value={monthlySave}   onChange={setMonthlySave}   prefix="R " info />
            <SliderField label="Savings Interest Rate"        min={4}     max={14}     step={0.25} value={interestRate}  onChange={setInterestRate}  suffix="% p.a." info />
          </div>
          <div>
            <SliderField label="Current Savings Balance" min={0}      max={500000} step={5000}  value={savings}       onChange={setSavings}       prefix="R " info />
            <SliderField label="Target Deposit"          min={50000}  max={600000} step={10000} value={targetDeposit} onChange={setTargetDeposit} prefix="R " info />
            <SliderField label="Credit Score"            min={300}    max={999}    step={1}     value={creditScore}   onChange={setCreditScore}   info />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STEP 2 — SAVINGS PROGRESS
      ══════════════════════════════════════ */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 2 — Savings Progress</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        {/* Deposit Tracker */}
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

        {/* Credit Score */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Credit Score</h2>
          <p className={styles.cardSub}>Your key to bond approval and better rates</p>
          <CreditScoreBar score={creditScore} />
        </div>
      </div>

      {/* ══════════════════════════════════════
          STEP 3 — MILESTONES
      ══════════════════════════════════════ */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 3 — Milestones</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Journey to Home Ownership</h2>
        <p className={styles.cardSub}>
          Five milestones from financial foundation to bond application. Progress updates live as you adjust your inputs above.
        </p>

        <div className={styles.progressRow}>
          <div className={styles.progressLabels}>
            <span>Overall Progress</span>
            <span className={styles.progressGold}>{doneCount} / {MILESTONES.length} complete</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className={styles.milestones}>
          {MILESTONES.map((m, i) => {
            const status = msStatuses[i];
            const isLast = i === MILESTONES.length - 1;

            return (
              <div key={m.id} className={styles.milestoneRow}>
                <div className={styles.msIconCol}>
                  <div className={msIconClass(status)}>{m.icon}</div>
                  {!isLast && (
                    <div className={`${styles.msConnector} ${status === "done" ? styles.msConnectorDone : ""}`} />
                  )}
                </div>
                <div className={styles.msContent}>
                  <div className={msStatusClass(status)}>
                    {status === "done" ? "✓ Completed" : status === "active" ? "▶ In Progress" : "Locked"}
                  </div>
                  <div className={styles.msTitle}>{m.title}</div>
                  <div className={styles.msDesc}>{m.desc}</div>
                  <span className={msBadgeClass(status)}>{m.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STEP 4 — RECOMMENDATIONS
      ══════════════════════════════════════ */}
      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 4 — Recommendations</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        {/* Smart Alerts */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Smart Alerts</h2>
          <p className={styles.cardSub}>Dynamic insights based on your current inputs</p>
          <div className={styles.alerts}>
            {computed.alerts.map((a, i) => (
              <div key={i} className={alertClass(a.type)}>
                <span className={styles.alertIcon}>
                  {a.type === "warn" ? "⚠" : a.type === "good" ? "✓" : "ℹ"}
                </span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Actions */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Monthly Action Plan</h2>
          <p className={styles.cardSub}>Personalised actions for this month</p>
          <ul className={styles.actionsList}>
            {computed.actions.map((action, i) => (
              <li key={i} className={styles.actionItem}>
                <div className={styles.actionDot} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STEP 5 — SUMMARY TABLE
      ══════════════════════════════════════ */}
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
              ["Monthly Savings",   `R ${monthlySave.toLocaleString()}`,                     `R ${Math.round(takeHome * 0.2).toLocaleString()} (20%)`],
              ["Savings Rate",      `${computed.savingsRate.toFixed(1)}%`,                   "20%+"],
              ["Deposit Progress",  `${Math.min(Math.round(computed.pct), 100)}%`,            "100%"],
              ["Credit Score",      `${creditScore}`,                                         "670+ for approval"],
              ["Time to Goal",      computed.goalDate,                                        "< 36 months ideal"],
              ["Property Budget",   `R ${Math.round(targetDeposit / 0.1).toLocaleString()}`,  "Based on 10% deposit"],
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
          <strong>Simulation Insight:</strong> At your current savings rate of {computed.savingsRate.toFixed(0)}% and a {interestRate}% annual return,
          you're projected to reach your R {targetDeposit.toLocaleString()} deposit target in <strong>{computed.goalDate}</strong>.
          {computed.savingsRate < 20
            ? ` Increasing monthly contributions by R${Math.round(takeHome * 0.05).toLocaleString()} could shave approximately ${Math.round(computed.months * 0.15)} months off your timeline.`
            : " You're ahead of the 20% savings benchmark — stay consistent and review your credit score next."}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className={styles.ctaWrap}>
        <button className={styles.ctaBtn}>Book a Free Home Loan Consultation →</button>
      </div>

    </div>
  );
}