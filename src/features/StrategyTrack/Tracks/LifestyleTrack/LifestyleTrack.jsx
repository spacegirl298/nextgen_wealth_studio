/**
 * BalancedLifestyle.jsx
 * Balanced Lifestyle & Investing — full strategy track page.
 */
import { useState, useMemo, useRef } from "react";
import styles from "../../Tracks.module.css";
import { useLocalStorage } from "../../../../hooks/userLocalStorage";
import { useNudges } from "../../../../hooks/useNudges";
import { TRACKS } from "../../data/tracksData";
import TrackTimeline from "../../components/TrackTimeline";
import TrackProgress from "../../components/TrackProgress";
import MilestoneStep from "../../components/MilestoneStep";
import { SliderField } from "../../components/SharedControls";

const TRACK_META = TRACKS.balancedLifestyle;

const STAGES = [
  {
    id: 1,
    icon: "[N]",
    title: "Know Your Numbers",
    desc: "Map every rand: income, fixed costs, discretionary spending, and what's left to save.",
    badge: "Awareness",
    actions: [
      "Download 3 months of bank statements and categorise every transaction.",
      "Separate non-negotiable fixed costs (rent, insurance, debit orders) from discretionary spending.",
      "Calculate your real savings rate: monthly savings ÷ take-home × 100.",
      "Use the 50/30/20 split as a diagnostic — not a strict rule — to identify where you're skewed.",
      "Set a single monthly spending cap for your highest discretionary category (dining, travel, etc.).",
    ],
    tradeoffs: [
      { pro: "Clarity on spending breaks the cycle of month-end anxiety.", con: "Categorising transactions takes 1–2 hours upfront." },
      { pro: "Knowing your real savings rate reveals whether lifestyle creep is happening.", con: "The numbers may reveal uncomfortable truths about your spending habits." },
    ],
    warnings: [
      "Avoid tracking in too much detail — over-granular budgets are abandoned quickly. Stick to 6–8 categories max.",
      "Do not confuse gross salary with take-home pay in your calculations — always use what hits your account.",
    ],
    glossary: [
      { term: "Savings rate", def: "Monthly savings as a percentage of take-home pay. 20% is a solid baseline for long-term wealth building alongside present enjoyment." },
      { term: "Discretionary spending", def: "Money spent on wants rather than needs: dining, travel, entertainment, clothing beyond basics. This is the flex category in your budget." },
      { term: "50/30/20 rule", def: "A budgeting framework: 50% to needs, 30% to wants, 20% to savings/investments. Treat it as a starting calibration, not a rigid law." },
    ],
    example: "Lerato earned R45 000/month but never felt financially secure. After reviewing her statements, she found R8 200/month going to subscriptions, takeaways, and impulse online shopping — none of which she valued highly. Redirecting just R3 000 of that changed her savings rate from 8% to 15%.",
    requirement: () => true,
  },
  {
    id: 2,
    icon: "[M]",
    title: "Automate the Foundation",
    desc: "Set up automatic savings and investment debit orders so your wealth builds without willpower.",
    badge: "Automation",
    actions: [
      "Open a dedicated TFSA for long-term investing — separate from your emergency fund.",
      "Schedule a debit order into your TFSA on the day after payday so you never see the money.",
      "Set up a separate 'Lifestyle Fund' account for planned discretionary spending — holidays, big purchases.",
      "Automate a minimum R500/month into a low-cost ETF (like a global index fund) even if you plan to increase later.",
      "Review your debit order schedule quarterly — increase investment contributions by 1% of income per year.",
    ],
    tradeoffs: [
      { pro: "Automation removes decision fatigue — you can't spend what isn't in your main account.", con: "Over-automating can leave too little buffer for irregular expenses mid-month." },
      { pro: "Investing on payday maximises time in the market across every contribution.", con: "Requires careful cash flow planning to avoid debit order bounces." },
    ],
    warnings: [
      "Do not invest money you might need within 12 months. Market fluctuations are normal — but only tolerable if you have a separate emergency fund.",
      "Avoid splitting savings across too many small accounts. Two or three purposeful accounts are better than six unfocused ones.",
    ],
    glossary: [
      { term: "TFSA", def: "Tax-Free Savings Account. Interest, dividends, and capital gains inside are completely tax-free. Annual limit R36 000. Ideal for long-term investing." },
      { term: "ETF", def: "Exchange-Traded Fund. A basket of shares that tracks an index (e.g. all JSE top 40 companies or global markets). Low fees, instant diversification." },
      { term: "Debit order", def: "An automatic bank instruction that transfers a fixed amount on a set date. The foundation of consistent, automated saving." },
    ],
    example: "After setting up two debit orders — R3 500 to a TFSA ETF and R2 000 to a lifestyle fund — Marcus stopped manually deciding whether to save each month. His investment balance grew R52 000 in the first year without a single conscious transfer.",
    requirement: (m) => m.savingsRate >= 10,
  },
  {
    id: 3,
    icon: "[T]",
    title: "Design Your Lifestyle Budget",
    desc: "Deliberately allocate money for experiences and enjoyment — without guilt, without overspend.",
    badge: "Intentional Spend",
    actions: [
      "List your top 5 lifestyle priorities: travel, dining, sport, culture, personal development, etc.",
      "Assign a monthly or annual budget to each priority — not a vague cap, a real number.",
      "Create a 'yes list' (things you'll consciously spend on) and a 'no list' (default cuts).",
      "Use a dedicated lifestyle debit card so you can see spending at a glance without reviewing your whole account.",
      "Plan big lifestyle purchases 3–6 months ahead — save into your lifestyle fund monthly rather than hitting credit.",
    ],
    tradeoffs: [
      { pro: "Intentional lifestyle spending eliminates the guilt-and-splurge cycle.", con: "Requires honest self-knowledge about what actually brings you satisfaction." },
      { pro: "A lifestyle fund prevents credit card debt from holiday and experience spending.", con: "Slower accumulation in the lifestyle fund means patience before bigger experiences." },
    ],
    warnings: [
      "Lifestyle inflation is the biggest risk here. Every time income increases, resist the urge to expand all categories simultaneously.",
      "Do not skip building your lifestyle fund and go straight to credit. Debt-funded experiences have a compounding cost.",
    ],
    glossary: [
      { term: "Lifestyle inflation", def: "The tendency to increase spending proportionally with every income increase. The enemy of long-term wealth building." },
      { term: "Sinking fund", def: "A dedicated savings pot for a known future expense: a holiday, a new laptop, a wedding. Funded monthly to avoid lump-sum shocks." },
    ],
    example: "Nadia budgeted R4 000/month for travel by saving R1 000/month for four months before each trip rather than putting it on credit. She took three holidays in a year, paid cash for all of them, and had no post-holiday debt hangover.",
    requirement: (m) => m.savingsRate >= 15,
  },
  {
    id: 4,
    icon: "[D]",
    title: "Diversify Your Investments",
    desc: "Spread risk across asset classes and geographies to smooth long-term returns.",
    badge: "Diversification",
    actions: [
      "Ensure your TFSA holds growth assets (equity ETFs) rather than only cash or money market.",
      "Add offshore exposure: a global ETF like a MSCI World tracker provides currency and market diversification.",
      "Consider a Retirement Annuity (RA) if you're not maximising employer pension contributions — tax deductible up to 27.5% of income.",
      "Rebalance your portfolio annually — don't let one asset class dominate after a strong run.",
      "Avoid putting all discretionary savings into property or a single stock.",
    ],
    tradeoffs: [
      { pro: "Offshore diversification protects against rand depreciation and SA-specific risk.", con: "Foreign exchange costs and platform fees must be factored into real returns." },
      { pro: "An RA reduces your taxable income now while building retirement wealth.", con: "RA funds are locked until age 55 — not suitable for medium-term goals." },
    ],
    warnings: [
      "Do not chase last year's best-performing fund. Past performance in volatile markets has little predictive power.",
      "Beware of high-fee actively managed funds. Index funds with fees below 0.5% p.a. outperform the majority of active funds over 10+ year periods.",
    ],
    glossary: [
      { term: "Asset allocation", def: "How your portfolio is split between equities, bonds, property, and cash. Equity-heavy portfolios grow faster over time but with more short-term volatility." },
      { term: "Retirement Annuity (RA)", def: "A long-term investment vehicle with significant tax advantages. Contributions are tax-deductible up to 27.5% of taxable income. Locked until age 55." },
      { term: "MSCI World Index", def: "A benchmark index covering large- and mid-cap equities from 23 developed markets. A widely used standard for global equity exposure." },
    ],
    example: "Khaled had 100% of his savings in a local equity fund. After learning about rand volatility, he moved 30% of his TFSA into a global ETF. Over the next two years, the offshore allocation outperformed and cushioned the rand's depreciation.",
    requirement: (m) => m.savingsRate >= 20 && m.investmentRate >= 10,
  },
  {
    id: 5,
    icon: "[R]",
    title: "Maintain & Review",
    desc: "Build the quarterly review habit to keep your balance between living well and growing wealth.",
    badge: "Sustainable",
    actions: [
      "Schedule a 30-minute financial review every quarter — savings rate, investment performance, spending categories.",
      "When you receive a raise or bonus, commit to a 50/50 split: 50% lifestyle upgrade, 50% investment increase.",
      "Revisit your 'yes list' and 'no list' annually — priorities shift and your budget should reflect that.",
      "Increase TFSA contributions each February when the new tax year opens.",
      "Reassess your asset allocation every 1–2 years or after a major life event.",
    ],
    tradeoffs: [
      { pro: "Regular reviews prevent lifestyle drift going unnoticed for years.", con: "Reviews require discipline and can be uncomfortable if numbers have slipped." },
      { pro: "Splitting raises between lifestyle and saving sustains motivation while still building wealth.", con: "It's slower than maximising all savings — but far more sustainable long-term." },
    ],
    warnings: [
      "Skipping reviews for more than 6 months often leads to silent lifestyle inflation and a declining savings rate.",
      "Do not use a short market dip as a reason to pause investing. Time in the market matters more than timing the market.",
    ],
    glossary: [
      { term: "Rebalancing", def: "Adjusting your portfolio back to your target asset allocation after market movements cause it to drift." },
      { term: "Lifestyle creep", def: "Gradual, often unconscious increase in spending as income rises. Detected by tracking your savings rate over time." },
    ],
    example: "After her first annual review, Priya noticed her savings rate had slipped from 22% to 14% after a promotion. She traced it to restaurant spend doubling and two new streaming subscriptions. A single debit order increase and two cancellations restored her rate within a month.",
    requirement: (m) => m.savingsRate >= 20 && m.investmentRate >= 15,
  },
];

const NUDGES = [
  {
    id: "bl_low_savings",
    severity: "warn",
    message: "Your savings rate is below 15%. Try the 50/30/20 framework — even reaching 15% unlocks meaningful long-term compounding.",
    condition: (m) => m.savingsRate < 15,
  },
  {
    id: "bl_lifestyle_heavy",
    severity: "warn",
    message: "Your lifestyle spend is above 40% of income. Consider whether all of it is intentional — or if some is default drift.",
    condition: (m) => m.lifestylePct > 40,
  },
  {
    id: "bl_no_investment",
    severity: "warn",
    message: "Your investment allocation is under 5% of income. Even a small automated ETF contribution builds the habit and compounds meaningfully over time.",
    condition: (m) => m.investmentRate < 5,
  },
  {
    id: "bl_good_balance",
    severity: "good",
    message: "You're saving 20%+ while keeping lifestyle spending intentional. This is exactly the balance this track is designed to help you maintain.",
    condition: (m) => m.savingsRate >= 20 && m.lifestylePct <= 35,
  },
  {
    id: "bl_raise_opportunity",
    severity: "info",
    message: "If your income has increased recently, consider the 50/50 rule: half to lifestyle, half to investment increases. It's the most sustainable way to grow both.",
    condition: (m) => m.savingsRate >= 15 && m.savingsRate < 20,
  },
  {
    id: "bl_tfsa_gap",
    severity: "info",
    message: "You have room to increase your TFSA contribution. The R36 000/year limit is a tax-free growth advantage — use as much of it as you can.",
    condition: (m) => m.monthlyInvest < 3000,
  },
];

const STORAGE_KEY = "bl_state_v1";
const COMPLETED_KEY = "bl_completed_v1";
const NUDGES_KEY = "bl_nudges_dismissed_v1";

const INFO_CONTENT = {
  "Monthly Take-Home Pay": {
    title: "Monthly Take-Home Pay",
    body: "Your net salary after tax and all deductions. This is the base number for all your ratios — use what actually lands in your account each month.",
  },
  "Monthly Savings Contribution": {
    title: "Monthly Savings Contribution",
    body: "Total amount set aside for savings and investments each month. Includes TFSA contributions, ETF debit orders, and any retirement annuity top-ups.",
  },
  "Monthly Lifestyle Spending": {
    title: "Monthly Lifestyle Spending",
    body: "What you consciously spend on wants — dining, travel, entertainment, sport, personal experiences. This track encourages intentional enjoyment, not elimination.",
  },
  "Monthly Investment Amount": {
    title: "Monthly Investment Amount",
    body: "The portion of your savings going into growth assets: ETFs, unit trusts, an RA, or similar. Separate from your emergency fund or short-term savings.",
  },
  "Expected Annual Return": {
    title: "Expected Annual Return",
    body: "A realistic long-term return assumption for a diversified portfolio. A global equity ETF has historically returned 9–11% p.a. over 10+ year periods. Use 8–9% as a conservative estimate.",
  },
};

const BalanceGauge = ({ savingsRate, lifestylePct, needsPct }) => {
  const remaining = Math.max(0, 100 - savingsRate - lifestylePct - needsPct);
  const segments = [
    { label: "Needs", pct: Math.min(needsPct, 100), color: "var(--clr-cat-white-dim)" },
    { label: "Lifestyle", pct: Math.min(lifestylePct, 100 - needsPct), color: "var(--clr-gold)" },
    { label: "Savings", pct: Math.min(savingsRate, 100 - needsPct - lifestylePct), color: "var(--clr-gold)" },
    { label: "Unallocated", pct: remaining, color: "rgba(255,255,255,0.08)" },
  ];

  let cumulative = 0;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutContainer}>
        <svg className={styles.donutSvg} width="160" height="160" viewBox="0 0 160 160">
          {segments.map((seg, i) => {
            const r = 68;
            const circ = 2 * Math.PI * r;
            const dash = (seg.pct / 100) * circ;
            const offset = circ * 0.25 - (cumulative / 100) * circ;
            cumulative += seg.pct;
            if (seg.pct <= 0) return null;
            return (
              <circle key={i} cx="80" cy="80" r={r} fill="none"
                stroke={seg.color} strokeWidth="14"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className={styles.donutInner}>
          <span className={styles.donutPct} style={{ color: savingsRate >= 20 ? "var(--clr-gold)" : "var(--clr-accent)" }}>
            {savingsRate.toFixed(0)}%
          </span>
          <span className={styles.donutLbl}>saved</span>
        </div>
      </div>
      <div className={styles.balanceLegend}>
        {segments.filter(s => s.pct > 0).map((seg) => (
          <div key={seg.label} className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: seg.color }} />
            <span className={styles.legendLabel}>{seg.label}</span>
            <span className={styles.legendPercent}>{seg.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NudgeBanner = ({ nudge, onDismiss }) => {
  const cls =
    nudge.severity === "warn" ? `${styles.alert} ${styles.alertWarn}`
    : nudge.severity === "good" ? `${styles.alert} ${styles.alertGood}`
    : `${styles.alert} ${styles.alertInfo}`;
  const icon = nudge.severity === "warn" ? "!" : nudge.severity === "good" ? "✓" : "i";
  return (
    <div className={`${cls} ${styles.nudgeBanner}`}>
      <span className={styles.alertIcon}>{icon}</span>
      <span style={{ flex: 1 }}>{nudge.message}</span>
      <button className={styles.nudgeDismiss} onClick={() => onDismiss(nudge.id)} aria-label="Dismiss">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default function BalancedLifestyle() {
  const [sliderState, setSliderState] = useLocalStorage(STORAGE_KEY, {
    takeHome: 38000,
    monthlySave: 6000,
    monthlyLifestyle: 10000,
    monthlyInvest: 3500,
    returnRate: 9,
  });

  const { takeHome, monthlySave, monthlyLifestyle, monthlyInvest, returnRate } = sliderState;
  const set = (key) => (val) => setSliderState((prev) => ({ ...prev, [key]: val }));

  const [completedStages, setCompletedStages] = useLocalStorage(COMPLETED_KEY, {});
  const [learnOpen, setLearnOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState(null);
  const stageRefs = useRef([]);

  const computed = useMemo(() => {
    const savingsRate = takeHome > 0 ? (monthlySave / takeHome) * 100 : 0;
    const investmentRate = takeHome > 0 ? (monthlyInvest / takeHome) * 100 : 0;
    const lifestylePct = takeHome > 0 ? (monthlyLifestyle / takeHome) * 100 : 0;
    const fixedEstimate = Math.max(0, takeHome - monthlySave - monthlyLifestyle);
    const needsPct = takeHome > 0 ? (fixedEstimate / takeHome) * 100 : 0;

    const r = returnRate / 100 / 12;
    let balance = 0;
    for (let i = 0; i < 120; i++) {
      balance = balance * (1 + r) + monthlyInvest;
    }
    const projected10y = Math.round(balance);

    let bal20 = 0;
    for (let i = 0; i < 240; i++) {
      bal20 = bal20 * (1 + r) + monthlyInvest;
    }
    const projected20y = Math.round(bal20);

    const alerts = [];
    if (savingsRate < 15)
      alerts.push({ type: "warn", text: `You're saving ${savingsRate.toFixed(0)}% of income — aim for at least 20% to build meaningful long-term wealth while enjoying life now.` });
    if (lifestylePct > 40)
      alerts.push({ type: "warn", text: `Lifestyle spending is at ${lifestylePct.toFixed(0)}% of income. Some of this may be unintentional drift rather than deliberate enjoyment.` });
    if (investmentRate < 5)
      alerts.push({ type: "warn", text: "Your investment rate is below 5%. Even a small automated ETF contribution compounds into a significant sum over 10 years." });
    if (savingsRate >= 20 && lifestylePct <= 35)
      alerts.push({ type: "good", text: `Strong balance: ${savingsRate.toFixed(0)}% savings and ${lifestylePct.toFixed(0)}% lifestyle. You're in the zone this track is designed for.` });
    if (savingsRate >= 15 && savingsRate < 20)
      alerts.push({ type: "info", text: "You're close to the 20% savings target. A R500–1 000/month increase would cross the threshold without significantly impacting your lifestyle." });
    if (alerts.length === 0)
      alerts.push({ type: "good", text: "Your numbers look solid. Keep reviewing quarterly to catch lifestyle creep early." });

    const actions = [];
    if (investmentRate < 10) actions.push(`Increase your monthly ETF investment by R${Math.round(takeHome * 0.02).toLocaleString()} — direct this from your next raise`);
    actions.push("Review last month's top 3 discretionary categories and confirm each aligns with your 'yes list'");
    if (savingsRate < 20) actions.push("Set up or increase a TFSA debit order — the tax-free compounding advantage is significant over 10+ years");
    actions.push("Check your TFSA balance against your R36 000 annual limit — any remaining room this tax year?");
    if (monthlyLifestyle > takeHome * 0.35) actions.push("Identify one discretionary category to trim by 15% — redirect it to your investment account");
    actions.push("Schedule your next quarterly financial review — 30 minutes to keep your balance on track");

    return { savingsRate, investmentRate, lifestylePct, needsPct, projected10y, projected20y, alerts, actions };
  }, [takeHome, monthlySave, monthlyLifestyle, monthlyInvest, returnRate]);

  const stageStatuses = useMemo(() => {
    const metrics = {
      savingsRate: computed.savingsRate,
      investmentRate: computed.investmentRate,
    };
    return STAGES.map((stage, i) => {
      if (completedStages[stage.id]) return "done";
      if (stage.requirement && stage.requirement(metrics)) return "done";
      if (i === 0) return "active";
      const prev = STAGES[i - 1];
      const prevDone =
        completedStages[prev.id] ||
        (prev.requirement && prev.requirement(metrics));
      return prevDone ? "active" : "locked";
    });
  }, [computed, completedStages]);

  const doneCount = stageStatuses.filter((s) => s === "done").length;

  const nudgeMetrics = useMemo(() => ({
    savingsRate: computed.savingsRate,
    investmentRate: computed.investmentRate,
    lifestylePct: computed.lifestylePct,
    monthlyInvest,
  }), [computed, monthlyInvest]);

  const { activeNudges, dismissNudge } = useNudges(NUDGES, nudgeMetrics, {}, NUDGES_KEY);

  const handleComplete = (stageId) => {
    setCompletedStages((prev) => ({ ...prev, [stageId]: new Date().toISOString() }));
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
          {TRACK_META.pill}
        </div>
        <h1 className={styles.heroTitle}>
          {TRACK_META.heroTitle[0]}
          <br />
          {TRACK_META.heroTitle[1]}
        </h1>
        <p className={styles.heroSub}>{TRACK_META.heroSub}</p>
        <div className={styles.heroStats}>
          {TRACK_META.heroStats.map((s) => (
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
          <svg className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            <p className={styles.learnIntro}>{TRACK_META.learnIntro}</p>
            <div className={styles.learnGrid}>
              {TRACK_META.learnItems.map((item) => (
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
          Adjust the sliders to reflect your current income and spending. 
        </p>
        <div className={styles.twoCol}>
          <div>
            <SliderField label="Monthly Take-Home Pay" min={10000} max={150000} step={1000} value={takeHome} onChange={set("takeHome")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Monthly Savings Contribution" min={500} max={50000} step={500} value={monthlySave} onChange={set("monthlySave")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Expected Annual Return" min={4} max={15} step={0.25} value={returnRate} onChange={set("returnRate")} suffix="% p.a." info infoMap={INFO_CONTENT} />
          </div>
          <div>
            <SliderField label="Monthly Lifestyle Spending" min={1000} max={80000} step={500} value={monthlyLifestyle} onChange={set("monthlyLifestyle")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Monthly Investment Amount" min={500} max={40000} step={500} value={monthlyInvest} onChange={set("monthlyInvest")} prefix="R " info infoMap={INFO_CONTENT} />
          </div>
        </div>
      </div>

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 2 — Your Balance</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Income Allocation</h2>
          <p className={styles.cardSub}>How your take-home is split across categories</p>
          <BalanceGauge
            savingsRate={computed.savingsRate}
            lifestylePct={computed.lifestylePct}
            needsPct={computed.needsPct}
          />
          <div className={styles.divider} />
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Savings Rate</span>
            <span className={computed.savingsRate >= 20 ? styles.summaryValGood : styles.summaryValWarn}>
              {computed.savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Investment Rate</span>
            <span className={computed.investmentRate >= 10 ? styles.summaryValGood : styles.summaryValWarn}>
              {computed.investmentRate.toFixed(1)}%
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Lifestyle Spend</span>
            <span className={computed.lifestylePct <= 35 ? styles.summaryValGood : styles.summaryValWarn}>
              {computed.lifestylePct.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Investment Projection</h2>
          <p className={styles.cardSub}>What your monthly investment grows to over time</p>
          <div className={styles.divider} />
          <div className={styles.goalEstimate} style={{ marginBottom: "16px" }}>
            <div className={styles.goalEstimateLbl}>10-Year Projection</div>
            <div className={styles.goalEstimateVal}>R {computed.projected10y.toLocaleString()}</div>
          </div>
          <div className={styles.goalEstimate}>
            <div className={styles.goalEstimateLbl}>20-Year Projection</div>
            <div className={styles.goalEstimateVal}>R {computed.projected20y.toLocaleString()}</div>
          </div>
          <div className={styles.divider} />
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Monthly invested</span>
            <span className={styles.summaryVal}>R {monthlyInvest.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Assumed return</span>
            <span className={styles.summaryVal}>{returnRate}% p.a.</span>
          </div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginTop: "16px" }}>
            <span className={styles.alertIcon}>i</span>
            <span>Projections assume consistent contributions and do not account for inflation or tax drag outside a TFSA.</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 3 — Your Journey</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Five Stages to Balanced Wealth</h2>
        <p className={styles.cardSub}>
          Work through each stage in order. Click any stage to expand its actions, tradeoffs, and real examples. Mark it complete when you're done.
        </p>

        <TrackProgress totalStages={STAGES.length} completedStages={doneCount} />

        <TrackTimeline
          stages={STAGES}
          statuses={stageStatuses}
          activeIndex={expandedStage}
          onSelect={handleTimelineSelect}
        />

        <div className={styles.milestones}>
          {STAGES.map((stage, i) => (
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
                  {a.type === "warn" ? "!" : a.type === "good" ? "✓" : "i"}
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
          A snapshot of your balance between present enjoyment and long-term wealth building.
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
              ["Investment Rate", `${computed.investmentRate.toFixed(1)}%`, "10%+"],
              ["Lifestyle Spend", `${computed.lifestylePct.toFixed(1)}%`, "25–35% ideal"],
              ["10-Year Projection", `R ${computed.projected10y.toLocaleString()}`, `R ${Math.round(takeHome * 0.1 * 12 * 10 * 1.7).toLocaleString()} at 10% rate`],
              ["20-Year Projection", `R ${computed.projected20y.toLocaleString()}`, `R ${Math.round(takeHome * 0.1 * 12 * 20 * 3.8).toLocaleString()} at 10% rate`],
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
          <strong>Simulation Insight:</strong> At your current investment rate of {computed.investmentRate.toFixed(0)}% and a {returnRate}% assumed annual return,
          your R {monthlyInvest.toLocaleString()}/month grows to{" "}
          <strong>R {computed.projected10y.toLocaleString()}</strong> in 10 years and{" "}
          <strong>R {computed.projected20y.toLocaleString()}</strong> in 20 years.
          {computed.savingsRate < 20
            ? ` Increasing contributions by R${Math.round(takeHome * 0.03).toLocaleString()}/month — about ${(computed.savingsRate + 3).toFixed(0)}% of income — meaningfully accelerates your wealth without eliminating lifestyle spending.`
            : " You're ahead of the 20% savings benchmark. Focus on diversifying your investment allocation and maintaining your lifestyle discipline."}
        </div>
      </div>
    </div>
  );
}