/**
 * FirstPropertyBuilder.jsx
 * First Property Builder — full strategy track page.
 */
import { useState, useRef, useMemo } from "react";
import styles from "../../Tracks.module.css";
import { useLocalStorage } from "../../../../hooks/userLocalStorage";
import { useNudges } from "../../../../hooks/useNudges";
import { TRACKS } from "../../data/tracksData";
import TrackTimeline from "../../components/TrackTimeline";
import TrackProgress from "../../components/TrackProgress";
import MilestoneStep from "../../components/MilestoneStep";
import { SliderField } from "../../components/SharedControls";

const TRACK = TRACKS.firstProperty;
const STORAGE_KEY = "fpb_state_v1";
const COMPLETED_KEY = "fpb_completed_v1";
const NUDGES_KEY = "fpb_nudges_dismissed_v1";

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
            cx="80" cy="80" r={r} fill="none"
            stroke={isComplete ? "var(--clr-success)" : "var(--clr-gold)"}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
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

const CreditScoreBar = ({ score }) => {
  const pct = Math.max(0, Math.min(100, ((score - 300) / 699) * 100));
  const gradeInfo =
    score >= 750 ? { label: "Excellent", color: "var(--clr-success)" }
    : score >= 670 ? { label: "Good", color: "var(--clr-gold)" }
    : score >= 580 ? { label: "Fair", color: "var(--clr-warning)" }
    : { label: "Poor", color: "var(--clr-danger)" };

  const TIERS = [
    { label: "Minimum Approval", score: 600 },
    { label: "Competitive Rate", score: 670 },
    { label: "Best Rate Tier", score: 750 },
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

const NudgeBanner = ({ nudge, onDismiss }) => {
  const alertClass =
    nudge.severity === "warn" ? `${styles.alert} ${styles.alertWarn}`
    : nudge.severity === "good" ? `${styles.alert} ${styles.alertGood}`
    : `${styles.alert} ${styles.alertInfo}`;

  const icon = nudge.severity === "warn" ? "⚠" : nudge.severity === "good" ? "✓" : "ℹ";

  return (
    <div className={`${alertClass} ${styles.nudgeBanner}`}>
      <span className={styles.alertIcon}>{icon}</span>
      <span style={{ flex: 1 }}>{nudge.message}</span>
      <button
        className={styles.nudgeDismiss}
        onClick={() => onDismiss(nudge.id)}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default function FirstPropertyBuilder() {
  const [sliderState, setSliderState] = useLocalStorage(STORAGE_KEY, {
    takeHome: 32000,
    monthlySave: 3500,
    savings: 85000,
    targetDeposit: 200000,
    interestRate: 8.5,
    creditScore: 640,
  });

  const { takeHome, monthlySave, savings, targetDeposit, interestRate, creditScore } = sliderState;
  const set = (key) => (val) => setSliderState((prev) => ({ ...prev, [key]: val }));
  const [completedStages, setCompletedStages] = useLocalStorage(COMPLETED_KEY, {});
  const [learnOpen, setLearnOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState(null);
  const stageRefs = useRef([]);

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
    const mo = months % 12;
    const goalDate =
      months === 0 ? "Already reached"
      : months >= 360 ? "36+ years"
      : years > 0 ? `${years}y ${mo}m`
      : `${mo} months`;

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

    const actions = [];
    if (creditScore < 670) actions.push("Check your credit report for errors via TransUnion or Experian (free once a year)");
    actions.push(`Automate a R${monthlySave.toLocaleString()} debit order into your dedicated deposit savings account`);
    if (savingsRate < 20) actions.push("Review last month's spending — identify one category to cut by 10%");
    actions.push("Compare TFSA interest rates across FNB, Nedbank, and Standard Bank");
    if (creditScore >= 600) actions.push("Get pre-qualified at your bank to understand your current bond eligibility");
    if (months > 24) actions.push("Consider supplementary income streams to accelerate your deposit timeline");
    actions.push("Confirm your emergency fund still covers at least 3 months of expenses");

    return { pct, remaining, months, goalDate, savingsRate, alerts, actions };
  }, [takeHome, monthlySave, savings, targetDeposit, interestRate, creditScore]);

  const stageStatuses = useMemo(() => {
    const metrics = { savings, targetDeposit, creditScore };
    return TRACK.stages.map((stage, i) => {
      if (completedStages[stage.id]) return "done";
      if (stage.requirement && stage.requirement(metrics)) return "done";
      if (i === 0) return "active";
      const prevDone =
        completedStages[TRACK.stages[i - 1].id] ||
        (TRACK.stages[i - 1].requirement && TRACK.stages[i - 1].requirement(metrics));
      return prevDone ? "active" : "locked";
    });
  }, [savings, targetDeposit, creditScore, completedStages]);

  const doneCount = stageStatuses.filter((s) => s === "done").length;

  const nudgeMetrics = useMemo(
    () => ({
      savingsRate: computed.savingsRate,
      creditScore,
      depositPct: computed.pct,
      months: computed.months,
    }),
    [computed, creditScore],
  );

  const { activeNudges, dismissNudge } = useNudges(TRACK.nudges, nudgeMetrics, {}, NUDGES_KEY);

  const handleComplete = (stageId) => {
    setCompletedStages((prev) => ({
      ...prev,
      [stageId]: new Date().toISOString(),
    }));
  };

  const handleTimelineSelect = (i) => {
    setExpandedStage((prev) => (prev === i ? null : i));
    setTimeout(() => {
      stageRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const alertClass = (type) =>
    type === "warn" ? `${styles.alert} ${styles.alertWarn}`
    : type === "good" ? `${styles.alert} ${styles.alertGood}`
    : `${styles.alert} ${styles.alertInfo}`;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className={styles.hero}>
        <div className={styles.trackPill}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="4" fill="var(--clr-accent)" />
          </svg>
          {TRACK.pill}
        </div>
        <h1 className={styles.heroTitle}>
          {TRACK.heroTitle[0]}
          <br />
          {TRACK.heroTitle[1]}
        </h1>
        <p className={styles.heroSub}>{TRACK.heroSub}</p>
        <div className={styles.heroStats}>
          {TRACK.heroStats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {activeNudges.length > 0 && (
        <div className={styles.nudgesWrap}>
          {activeNudges.map((nudge) => (
            <NudgeBanner key={nudge.id} nudge={nudge} onDismiss={dismissNudge} />
          ))}
        </div>
      )}

      <div className={styles.learnCard}>
        <button className={styles.learnToggle} onClick={() => setLearnOpen((v) => !v)}>
          How this track works
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            <p className={styles.learnIntro}>{TRACK.learnIntro}</p>
            <div className={styles.learnGrid}>
              {TRACK.learnItems.map((item) => (
                <div key={item.title} className={styles.learnItem}>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 1 — Your Situation</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Financial Profile</h2>
        <p className={styles.cardSub}>
          Adjust the sliders to reflect your current situation. All outputs update in real time — and your inputs are saved automatically.
        </p>
        <div className={styles.twoCol}>
          <div>
            <SliderField label="Monthly Take-Home Pay" min={8000} max={120000} step={500} value={takeHome} onChange={set("takeHome")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Monthly Savings Contribution" min={500} max={30000} step={250} value={monthlySave} onChange={set("monthlySave")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Savings Interest Rate" min={4} max={14} step={0.25} value={interestRate} onChange={set("interestRate")} suffix="% p.a." info infoMap={INFO_CONTENT} />
          </div>
          <div>
            <SliderField label="Current Savings Balance" min={0} max={500000} step={5000} value={savings} onChange={set("savings")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Target Deposit" min={50000} max={600000} step={10000} value={targetDeposit} onChange={set("targetDeposit")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Credit Score" min={300} max={999} step={1} value={creditScore} onChange={set("creditScore")} info infoMap={INFO_CONTENT} />
          </div>
        </div>
      </div>

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

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 3 — Your Journey</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Six Stages to Home Ownership</h2>
        <p className={styles.cardSub}>
          Work through each stage in order. Click any stage to expand its actions, tradeoffs, and real examples. Mark it complete when you're done.
        </p>

        <TrackProgress totalStages={TRACK.stages.length} completedStages={doneCount} />

        <TrackTimeline
          stages={TRACK.stages}
          statuses={stageStatuses}
          activeIndex={expandedStage}
          onSelect={handleTimelineSelect}
        />

        <div className={styles.milestones}>
          {TRACK.stages.map((stage, i) => (
            <div key={stage.id} ref={(el) => (stageRefs.current[i] = el)}>
              <MilestoneStep
                stage={stage}
                status={stageStatuses[i]}
                isExpanded={expandedStage === i}
                onToggle={() => setExpandedStage((prev) => (prev === i ? null : i))}
                onComplete={() => handleComplete(stage.id)}
                completedAt={completedStages[stage.id] || null}
                stageNumber={i + 1}
              />
            </div>
          ))}
        </div>
      </div>

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
              <div key={i} className={alertClass(a.type)}>
                <span className={styles.alertIcon}>
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
                <div className={styles.actionDot} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
              ["Monthly Savings", `R ${monthlySave.toLocaleString()}`, `R ${Math.round(takeHome * 0.2).toLocaleString()} (20%)`],
              ["Savings Rate", `${computed.savingsRate.toFixed(1)}%`, "20%+"],
              ["Deposit Progress", `${Math.min(Math.round(computed.pct), 100)}%`, "100%"],
              ["Credit Score", `${creditScore}`, "670+ for approval"],
              ["Time to Goal", computed.goalDate, "< 36 months ideal"],
              ["Property Budget", `R ${Math.round(targetDeposit / 0.1).toLocaleString()}`, "Based on 10% deposit"],
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
          you're projected to reach your R {targetDeposit.toLocaleString()} deposit target in{" "}
          <strong>{computed.goalDate}</strong>.
          {computed.savingsRate < 20
            ? ` Increasing monthly contributions by R${Math.round(takeHome * 0.05).toLocaleString()} could shave approximately ${Math.round(computed.months * 0.15)} months off your timeline.`
            : " You're ahead of the 20% savings benchmark — stay consistent and review your credit score next."}
        </div>
      </div>
    </div>
  );
}