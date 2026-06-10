/**
 * AggressiveGlobalInvestor.jsx
 * Aggressive Global Investor — full strategy track page.
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

const TRACK_META = TRACKS.aggressiveGlobal;

const STAGES = [
  {
    id: 1,
    icon: "[B]",
    title: "Maximise Your Tax-Efficient Base",
    desc: "Fill every tax-advantaged container before deploying capital into taxable accounts.",
    badge: "Tax Foundation",
    actions: [
      "Max out your TFSA annual contribution (R36 000/year) — this is non-negotiable, every year.",
      "Calculate your Retirement Annuity (RA) headroom: you can deduct up to 27.5% of taxable income annually.",
      "If you have an employer pension or provident fund, confirm you're contributing enough to receive the full employer match.",
      "Consolidate old employer pension fund benefits into a Preservation Fund rather than cashing out.",
      "Document your current tax bracket to quantify exactly how much an RA contribution saves you in cash today.",
    ],
    tradeoffs: [
      { pro: "A R10 000/month RA contribution saves R4 100/month in tax for a 41% marginal taxpayer — an immediate 41% return.", con: "RA funds are locked until age 55. Do not over-commit if you may need liquidity before then." },
      { pro: "TFSA growth is completely tax-free forever — the most efficient vehicle for aggressive long-term compounding.", con: "TFSA annual limit caps how much you can shelter. Everything above R36 000/year must go into taxable accounts." },
    ],
    warnings: [
      "Never cash out a pension or provident fund when changing jobs. The tax hit is severe and the compound growth lost is irreplaceable.",
      "RA contributions above 27.5% of income are not immediately deductible — the excess carries forward, but plan carefully.",
    ],
    glossary: [
      { term: "TFSA", def: "Tax-Free Savings Account. R36 000/year, R500 000 lifetime limit. All growth — dividends, interest, capital gains — is completely tax-free." },
      { term: "Retirement Annuity (RA)", def: "Long-term investment vehicle with tax-deductible contributions up to 27.5% of taxable income. Locked until age 55. Growth inside is tax-free until drawdown." },
      { term: "Preservation Fund", def: "A vehicle to park employer pension money when changing jobs. Keeps the funds invested, deferred from tax, until retirement." },
      { term: "Marginal tax rate", def: "The tax rate applied to your last rand of income. In South Africa, this reaches 45% for income above R1.8M. RA contributions reduce income at this rate." },
    ],
    example: "Yusuf earns R1.2M/year (marginal rate 41%). He contributes R27 500/month to an RA (27.5% of R1.2M). His annual tax saving is R135 300 — effectively a guaranteed 41% return on that portion of his savings before market growth is even considered.",
    requirement: (m) => m.savingsRate >= 25,
  },
  {
    id: 2,
    icon: "[G]",
    title: "Build Offshore Exposure",
    desc: "Protect against rand depreciation and access higher-growth global markets.",
    badge: "Offshore",
    actions: [
      "Open an offshore investment account — platforms like EasyEquities USD, Investec Global, or a direct foreign brokerage.",
      "Start with a global index ETF (e.g. MSCI World, S&P 500 tracker) for broad developed market exposure.",
      "Use your annual R1M single discretionary allowance for offshore transfers without SARS approval.",
      "For amounts above R1M, apply for a Foreign Investment Allowance (up to R10M per year with SARS tax clearance).",
      "Track your cost base carefully — capital gains on offshore assets are taxed in rands when you realise them.",
    ],
    tradeoffs: [
      { pro: "Offshore allocation hedges rand depreciation — if the rand weakens 10%, your offshore assets grow 10% in rand terms even with no market movement.", con: "Rand strengthening temporarily reduces the rand value of offshore holdings — requires a long-term horizon to smooth this." },
      { pro: "Global equity markets (US, Europe, Japan) offer sector and currency diversity unavailable on the JSE.", con: "Foreign exchange conversion costs and platform fees (typically 0.5–1.5%) must be factored into expected returns." },
    ],
    warnings: [
      "Do not try to time rand/dollar movements. Currency prediction has a poor track record. Invest consistently offshore regardless of the current rate.",
      "Ensure you declare all offshore assets and income to SARS. Non-disclosure carries severe penalties.",
    ],
    glossary: [
      { term: "Single Discretionary Allowance", def: "Every South African adult may transfer up to R1 million offshore per calendar year without prior SARS approval." },
      { term: "Foreign Investment Allowance", def: "Allows SA residents to transfer up to R10 million offshore per year with a SARS tax clearance certificate." },
      { term: "MSCI World Index", def: "Covers large- and mid-cap equities across 23 developed markets. A single MSCI World ETF gives exposure to ~1 500 companies." },
      { term: "Currency risk", def: "The exposure to gains or losses from fluctuations in the ZAR/USD (or other) exchange rate on your foreign assets." },
    ],
    example: "Aisha transferred R800 000 offshore in 2021 at a R15/USD rate, buying an S&P 500 ETF. By 2024, the rand had weakened to R18/USD and the ETF itself had grown 35% in USD terms. Her rand return was approximately 60% — combining market growth with currency depreciation.",
    requirement: (m) => m.savingsRate >= 30 && m.offshoreAllocation >= 15,
  },
  {
    id: 3,
    icon: "[A]",
    title: "Optimise Your Portfolio Structure",
    desc: "Build a deliberate asset allocation strategy — not just a collection of accounts.",
    badge: "Asset Strategy",
    actions: [
      "Define your target asset allocation: e.g. 60% global equity, 20% SA equity, 10% bonds, 10% property.",
      "Separate your RA (locked, long-term, bond/equity mix) from your TFSA (equity-heavy) and taxable accounts.",
      "Hold tax-inefficient assets (bonds, REITs) inside your TFSA where distributions are tax-free.",
      "Hold growth equity ETFs in taxable accounts — capital gains are only taxed on realisation, not annually.",
      "Rebalance annually: sell overweight positions, buy underweight. Use new contributions to rebalance before selling.",
    ],
    tradeoffs: [
      { pro: "Intentional asset allocation reduces risk without necessarily reducing returns over the long run.", con: "Rebalancing into underperforming assets feels counterintuitive and requires discipline." },
      { pro: "Tax-location optimisation (placing the right assets in the right accounts) can add 0.5–1% to after-tax returns annually.", con: "Managing multiple accounts with deliberate asset location adds complexity and requires regular review." },
    ],
    warnings: [
      "Avoid holding too much in a single stock, sector, or country — including South Africa. Concentration risk is the primary wealth destroyer for high earners.",
      "Chasing last year's best-performing fund is a documented losing strategy. Stick to your allocation and rebalance into underperformers.",
    ],
    glossary: [
      { term: "Asset allocation", def: "The strategic split of your portfolio across asset classes (equity, bonds, property, cash) and geographies. Determines 90%+ of long-run performance." },
      { term: "Tax location", def: "Placing each asset in the account type that minimises its tax drag. E.g. high-yield bonds inside a TFSA; growth ETFs in a taxable account." },
      { term: "REIT", def: "Real Estate Investment Trust. A listed vehicle that holds property and pays out most income as distributions — tax-efficient inside a TFSA." },
      { term: "Rebalancing", def: "Adjusting back to your target allocation after market movements cause drift. Systematically enforces 'buy low, sell high'." },
    ],
    example: "Stefan built a portfolio of 70% SA equities — almost entirely JSE top 40. After restructuring to 40% global equity ETF / 30% SA equity / 20% bonds / 10% REIT (all offshore ETFs held in TFSA), his 3-year annualised return improved while volatility dropped due to lower correlation between positions.",
    requirement: (m) => m.savingsRate >= 30 && m.offshoreAllocation >= 20,
  },
  {
    id: 4,
    icon: "[E]",
    title: "Engage Emerging Opportunities",
    desc: "Allocate a disciplined satellite portion to higher-risk, higher-potential positions.",
    badge: "Satellite",
    actions: [
      "Define a maximum satellite allocation: typically 10–20% of total investable assets for higher-risk positions.",
      "Research thematic ETFs: clean energy, technology, emerging markets, healthcare innovation.",
      "Consider small and mid-cap global indices as a satellite position alongside your large-cap core.",
      "Evaluate direct share investing only if you have time to analyse individual companies properly — most high earners are better served by index funds.",
      "Review satellite positions annually — if a theme has played out, rotate into the next opportunity or back into core.",
    ],
    tradeoffs: [
      { pro: "A well-timed satellite position in a high-growth sector can significantly outperform a pure index portfolio.", con: "Thematic ETFs and individual stocks can underperform for years. The core portfolio must be robust enough to absorb this." },
      { pro: "Engaging with emerging opportunities keeps you financially curious and up to date on global markets.", con: "Time and attention cost. Poorly researched satellite positions often destroy value rather than create it." },
    ],
    warnings: [
      "Never let your satellite allocation grow beyond 25% of your total portfolio. If it outperforms dramatically, rebalance back — this is risk management, not pessimism.",
      "Cryptocurrency may fit in a satellite position at 5% or less for risk-tolerant investors — but only money you can afford to lose entirely.",
    ],
    glossary: [
      { term: "Core-satellite strategy", def: "An investment framework where the majority (core) is in low-cost diversified index funds, and a minority (satellite) is in targeted, higher-risk positions." },
      { term: "Thematic ETF", def: "An ETF focused on a specific trend or sector: AI, clean energy, genomics, etc. Higher concentration risk than a broad market index." },
      { term: "Emerging markets", def: "Economies in earlier growth stages: Brazil, India, Vietnam, South Africa itself. Higher growth potential but also higher volatility and political risk." },
    ],
    example: "Celeste kept 80% of her portfolio in MSCI World and SA equity index funds and allocated 15% to a clean energy ETF when it was out of favour. Over three years the satellite returned 2.4× her core and lifted her overall portfolio return by 4% annually — without risking her financial security.",
    requirement: (m) => m.savingsRate >= 35 && m.offshoreAllocation >= 25,
  },
  {
    id: 5,
    icon: "[T]",
    title: "Advanced Tax Optimisation",
    desc: "Minimise your effective tax rate through legal structuring, timing, and entity selection.",
    badge: "Tax Strategy",
    actions: [
      "Consult a fee-only financial planner or tax specialist to model your full tax picture annually.",
      "Harvest capital losses before year-end to offset taxable capital gains from portfolio rebalancing.",
      "Consider a Section 12J investment (if eligible) or other SARS-approved tax incentives for high earners.",
      "Review whether a trust structure is appropriate for estate planning purposes given your asset base.",
      "Ensure donation and charitable giving strategies are structured for Section 18A deductibility.",
    ],
    tradeoffs: [
      { pro: "Capital gains harvesting and RA maximisation can reduce effective tax rate by 3–8% — material at high income levels.", con: "Advanced tax structures add administrative complexity, cost, and require ongoing professional oversight." },
      { pro: "Estate planning through trusts can significantly reduce estate duty and ensure efficient wealth transfer.", con: "Trust administration costs (R15 000–40 000/year) only make economic sense above a certain asset threshold." },
    ],
    warnings: [
      "Never use aggressive or artificial tax avoidance schemes. SARS applies a General Anti-Avoidance Rule (GAAR) and penalties are severe.",
      "Tax optimisation is a means to wealth, not the goal. Don't let tax tail wag the investment dog — only reduce tax when it doesn't compromise your underlying return.",
    ],
    glossary: [
      { term: "Capital gains tax (CGT)", def: "In SA, 40% of capital gains are included in taxable income for individuals. The annual exclusion is R40 000. Effective CGT rate for high earners is approximately 18%." },
      { term: "Tax-loss harvesting", def: "Selling investments at a loss before year-end to offset capital gains realised elsewhere in the portfolio. Reduces your CGT bill for that tax year." },
      { term: "Section 18A", def: "A SARS provision that allows deductions for donations to approved public benefit organisations — up to 10% of taxable income." },
      { term: "Estate duty", def: "SA death tax at 20% on the first R30M of dutiable estate, 25% above. Proper planning (trusts, life policies) can significantly reduce the exposure." },
    ],
    example: "Ravi realised R480 000 in capital gains from portfolio rebalancing. Before year-end he also sold a satellite holding sitting at a R120 000 loss. His net taxable gain dropped to R360 000, saving approximately R21 600 in CGT at his effective rate.",
    requirement: (m) => m.savingsRate >= 35 && m.offshoreAllocation >= 25,
  },
  {
    id: 6,
    icon: "[M]",
    title: "Compound and Stay the Course",
    desc: "The terminal stage: protect your system from your own short-term impulses.",
    badge: "Long Game",
    actions: [
      "Set a formal investment policy statement (IPS): target allocation, rebalancing rules, and what would — and would not — cause you to deviate.",
      "Automate everything that can be automated. Human intervention in a working system is usually harmful.",
      "Review your full financial picture annually with a professional — not just your investment accounts.",
      "Guard against lifestyle inflation with a fixed savings percentage target that increases by 1% per year.",
      "Define your wealth number: the invested asset base at which work becomes truly optional. Use it as a north star.",
    ],
    tradeoffs: [
      { pro: "A written investment policy statement prevents panic selling during market drawdowns — the single most wealth-destructive behaviour.", con: "An IPS requires honest self-reflection and commitment. It only works if you follow it when it's uncomfortable." },
      { pro: "Staying fully invested through downturns allows full participation in recoveries, which are often swift and concentrated.", con: "Watching a portfolio drop 30–40% without acting requires genuine conviction in your long-term strategy." },
    ],
    warnings: [
      "Market corrections of 20–40% are normal in equity investing and happen every 5–8 years on average. They are opportunities, not emergencies.",
      "Complexity is the enemy at this stage. Resist adding new products, platforms, or strategies unless there is a clear, quantifiable benefit.",
    ],
    glossary: [
      { term: "Investment Policy Statement", def: "A written document defining your investment goals, asset allocation, rebalancing triggers, and rules for when you would change your strategy." },
      { term: "Wealth number", def: "The invested asset base required to fund your desired lifestyle indefinitely — typically 25× annual expenses using the 4% withdrawal rule." },
      { term: "4% rule", def: "A widely cited withdrawal guideline: if you withdraw 4% of your portfolio annually, it has historically sustained a 30-year retirement across most market conditions." },
    ],
    example: "During the March 2020 COVID crash, Themba's portfolio dropped 34% in six weeks. His IPS stated: 'Do not sell equity. Rebalance into equities if allocation drops below 55%.' He bought more. By December 2020 his portfolio was up 22% from its pre-crash level.",
    requirement: (m) => m.savingsRate >= 40 && m.offshoreAllocation >= 30,
  },
];

const NUDGES = [
  {
    id: "ag_low_savings",
    severity: "warn",
    message: "Your savings rate is below 30%. This track is designed for high-rate accumulators. Consider auditing your fixed costs before increasing income-dependent expenses.",
    condition: (m) => m.savingsRate < 30,
  },
  {
    id: "ag_no_offshore",
    severity: "warn",
    message: "No offshore allocation detected. Currency and geographic concentration in South Africa is a significant uncompensated risk at high asset levels.",
    condition: (m) => m.offshoreAllocation < 10,
  },
  {
    id: "ag_low_offshore",
    severity: "info",
    message: "Your offshore allocation is below 20%. Most aggressive global investors target 30–50% offshore for optimal diversification. Consider increasing via your annual discretionary allowance.",
    condition: (m) => m.offshoreAllocation >= 10 && m.offshoreAllocation < 20,
  },
  {
    id: "ag_strong_profile",
    severity: "good",
    message: "Savings rate above 40% and meaningful offshore exposure — you're operating at aggressive global investor level. Focus now on tax optimisation and portfolio structure.",
    condition: (m) => m.savingsRate >= 40 && m.offshoreAllocation >= 25,
  },
  {
    id: "ag_tfsa_underuse",
    severity: "warn",
    message: "If you're not maxing your TFSA at R36 000/year, you're leaving tax-free compounding on the table. This is the first lever to pull before any other optimisation.",
    condition: (m) => m.monthlyTfsa < 3000,
  },
  {
    id: "ag_ra_opportunity",
    severity: "info",
    message: "Have you modelled your RA contribution against your marginal tax rate? At 41%+, each R1 000 contributed costs you only R590 after tax — a 41% guaranteed return before market growth.",
    condition: (m) => m.savingsRate >= 30 && m.raContribution < 10,
  },
];

const STORAGE_KEY = "ag_state_v1";
const COMPLETED_KEY = "ag_completed_v1";
const NUDGES_KEY = "ag_nudges_dismissed_v1";

const INFO_CONTENT = {
  "Monthly Take-Home Pay": {
    title: "Monthly Take-Home Pay",
    body: "Your net income after tax and deductions. Use your actual take-home, not your gross salary. This is the base for all ratios on this track.",
  },
  "Monthly Total Savings": {
    title: "Monthly Total Savings",
    body: "Everything going into savings or investments each month: TFSA, RA, ETF debit orders, offshore transfers, and any other investment contributions.",
  },
  "TFSA Monthly Contribution": {
    title: "TFSA Monthly Contribution",
    body: "Your monthly TFSA investment. Maximum is R3 000/month (R36 000/year). This is your most tax-efficient vehicle — prioritise filling it annually.",
  },
  "Offshore Allocation (%)": {
    title: "Offshore Allocation (%)",
    body: "The percentage of your total investable portfolio held outside South Africa. Aggressive global investors typically target 30–50% offshore for currency diversification and access to global markets.",
  },
  "RA Contribution (% of income)": {
    title: "RA Contribution (% of income)",
    body: "Your Retirement Annuity contribution as a percentage of taxable income. The deductible limit is 27.5%. At a 41% marginal tax rate, each R1 contributed costs you only R0.59 after the tax saving.",
  },
  "Expected Annual Return": {
    title: "Expected Annual Return",
    body: "Long-term return assumption for your growth portfolio. Aggressive global equity portfolios have historically returned 10–12% p.a. over 20-year periods. Use 9–10% as a realistic planning assumption.",
  },
};

const CompoundChart = ({ monthlyInvest, offshoreAllocation, returnRate }) => {
  const localRate = returnRate / 100 / 12;
  const offshoreRate = (returnRate + 1.5) / 100 / 12;
  const offshoreShare = offshoreAllocation / 100;
  const localShare = 1 - offshoreShare;

  const milestones = [5, 10, 15, 20];
  const data = milestones.map((years) => {
    let local = 0;
    let offshore = 0;
    for (let i = 0; i < years * 12; i++) {
      local = local * (1 + localRate) + monthlyInvest * localShare;
      offshore = offshore * (1 + offshoreRate) + monthlyInvest * offshoreShare;
    }
    return { years, local: Math.round(local), offshore: Math.round(offshore), total: Math.round(local + offshore) };
  });

  const maxVal = data[data.length - 1].total;

  return (
    <div className={styles.compoundChart}>
      {data.map((d) => (
        <div key={d.years} className={styles.chartRow}>
          <div className={styles.chartHeader}>
            <span>{d.years} years</span>
            <span className={styles.chartHeaderValue}>R {d.total.toLocaleString()}</span>
          </div>
          <div className={styles.chartBarTrack}>
            <div className={styles.chartBarLocal} style={{ width: `${(d.local / maxVal) * 100}%` }} />
            <div className={styles.chartBarOffshore} style={{ width: `${(d.offshore / maxVal) * 100}%` }} />
          </div>
        </div>
      ))}
      <div className={styles.chartLegend}>
        <div className={styles.chartLegendItem}>
          <span className={styles.chartLegendLocal} />
          <span>Local ({(100 - offshoreAllocation).toFixed(0)}%)</span>
        </div>
        <div className={styles.chartLegendItem}>
          <span className={styles.chartLegendOffshore} />
          <span>Offshore ({offshoreAllocation}%)</span>
        </div>
      </div>
    </div>
  );
};

const SavingsRateGauge = ({ rate }) => {
  const pct = Math.min(rate / 50 * 100, 100);
  const color = rate >= 40 ? "var(--clr-gold)" : rate >= 30 ? "var(--clr-gold)" : "var(--clr-accent)";
  const label = rate >= 40 ? "Aggressive" : rate >= 30 ? "High" : rate >= 20 ? "Moderate" : "Low";
  const r = 68;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutContainer}>
        <svg className={styles.donutSvg} width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
          <circle 
            cx="80" cy="80" r={r} fill="none" 
            stroke={color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ}`} 
            strokeDashoffset={circ * 0.25} 
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        <div className={styles.donutInner}>
          <span className={styles.donutPct} style={{ color }}>{rate.toFixed(0)}%</span>
          <span className={styles.donutLbl}>{label}</span>
        </div>
      </div>
      <div className={styles.savingsTiers}>
        {[
          { label: "Entry Level", threshold: 25, color: "var(--clr-accent)" },
          { label: "High Rate", threshold: 30, color: "var(--clr-gold)" },
          { label: "Aggressive", threshold: 40, color: "var(--clr-gold)" },
        ].map((tier) => (
          <div key={tier.label} className={styles.savingsTier}>
            <span>{tier.label}</span>
            <span className={rate >= tier.threshold ? styles.savingsTierMet : styles.savingsTierUnmet}>
              {tier.threshold}%+ {rate >= tier.threshold ? "✓" : ""}
            </span>
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

export default function AggressiveGlobalInvestor() {
  const [sliderState, setSliderState] = useLocalStorage(STORAGE_KEY, {
    takeHome: 80000,
    monthlySave: 30000,
    monthlyTfsa: 3000,
    offshoreAllocation: 20,
    raContribution: 15,
    returnRate: 10,
  });

  const { takeHome, monthlySave, monthlyTfsa, offshoreAllocation, raContribution, returnRate } = sliderState;
  const set = (key) => (val) => setSliderState((prev) => ({ ...prev, [key]: val }));

  const [completedStages, setCompletedStages] = useLocalStorage(COMPLETED_KEY, {});
  const [learnOpen, setLearnOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState(null);
  const stageRefs = useRef([]);

  const computed = useMemo(() => {
    const savingsRate = takeHome > 0 ? (monthlySave / takeHome) * 100 : 0;
    const tfsaAnnual = monthlyTfsa * 12;
    const raMonthly = (raContribution / 100) * takeHome;

    const monthlyExpenses = Math.max(0, takeHome - monthlySave);
    const wealthNumber = monthlyExpenses * 12 * 25;

    const r = returnRate / 100 / 12;
    let balance = 0;
    let monthsToWealth = 0;
    if (monthlySave > 0 && wealthNumber > 0) {
      while (balance < wealthNumber && monthsToWealth < 600) {
        balance = balance * (1 + r) + monthlySave;
        monthsToWealth++;
      }
    }
    const yearsToWealth = monthsToWealth < 600 ? (monthsToWealth / 12).toFixed(1) : "40+";

    let bal10 = 0;
    for (let i = 0; i < 120; i++) bal10 = bal10 * (1 + r) + monthlySave;
    let bal20 = 0;
    for (let i = 0; i < 240; i++) bal20 = bal20 * (1 + r) + monthlySave;

    const marginalRate = takeHome > 150000 ? 0.45 : takeHome > 100000 ? 0.41 : takeHome > 60000 ? 0.36 : 0.26;
    const raTaxSaving = Math.round(raMonthly * marginalRate);

    const alerts = [];
    if (savingsRate < 30)
      alerts.push({ type: "warn", text: `Savings rate of ${savingsRate.toFixed(0)}% is below the 30% entry threshold for this track. Review your fixed costs and largest discretionary categories.` });
    if (offshoreAllocation < 15)
      alerts.push({ type: "warn", text: "Less than 15% offshore is significant concentration risk. Use your annual R1M discretionary allowance to build global exposure incrementally." });
    if (tfsaAnnual < 36000)
      alerts.push({ type: "info", text: `You have R${(36000 - tfsaAnnual).toLocaleString()} of unused TFSA capacity this year. This is your highest-priority tax-free compounding vehicle.` });
    if (savingsRate >= 40 && offshoreAllocation >= 25)
      alerts.push({ type: "good", text: `Strong profile: ${savingsRate.toFixed(0)}% savings rate, ${offshoreAllocation}% offshore. Focus shifts to tax optimisation and portfolio structure at this level.` });
    if (raTaxSaving > 0)
      alerts.push({ type: "good", text: `Your RA contributions save approximately R${raTaxSaving.toLocaleString()}/month in tax at your estimated marginal rate — an immediate ${(marginalRate * 100).toFixed(0)}% return on those contributions.` });
    if (alerts.length === 0)
      alerts.push({ type: "good", text: "Your aggressive profile is on track. Review your asset allocation structure and offshore tax compliance annually." });

    const actions = [];
    if (tfsaAnnual < 36000) actions.push("Increase TFSA debit order to R3 000/month — max out the annual limit before any other move");
    if (offshoreAllocation < 20) actions.push(`Transfer R${Math.round(takeHome * 0.5).toLocaleString()} offshore this month — use your discretionary allowance proactively`);
    actions.push("Review your RA contribution against your marginal tax rate — model the exact after-tax cost vs gross contribution");
    if (savingsRate < 35) actions.push(`Identify R${Math.round((35 - savingsRate) / 100 * takeHome).toLocaleString()}/month in cuttable fixed costs to reach 35% savings rate`);
    actions.push("Confirm your offshore ETF platform has the lowest available fees for your investment size");
    actions.push("Review your asset allocation — rebalance if any position has drifted more than 5% from target");

    return { savingsRate, tfsaAnnual, raMonthly, raTaxSaving, wealthNumber, yearsToWealth, projected10y: Math.round(bal10), projected20y: Math.round(bal20), alerts, actions };
  }, [takeHome, monthlySave, monthlyTfsa, offshoreAllocation, raContribution, returnRate]);

  const stageStatuses = useMemo(() => {
    const metrics = {
      savingsRate: computed.savingsRate,
      offshoreAllocation,
      monthlyTfsa,
      raContribution,
    };
    return STAGES.map((stage, i) => {
      if (completedStages[stage.id]) return "done";
      if (stage.requirement && stage.requirement(metrics)) return "done";
      if (i === 0) return "active";
      const prev = STAGES[i - 1];
      const prevDone = completedStages[prev.id] || (prev.requirement && prev.requirement(metrics));
      return prevDone ? "active" : "locked";
    });
  }, [computed, offshoreAllocation, monthlyTfsa, raContribution, completedStages]);

  const doneCount = stageStatuses.filter((s) => s === "done").length;

  const nudgeMetrics = useMemo(() => ({
    savingsRate: computed.savingsRate,
    offshoreAllocation,
    monthlyTfsa,
    raContribution,
  }), [computed, offshoreAllocation, monthlyTfsa, raContribution]);

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
            {TRACK_META.learnItems.length > 0 && (
              <div className={styles.learnGrid}>
                {TRACK_META.learnItems.map((item) => (
                  <div key={item.title} className={styles.learnItem}>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            )}
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
          Adjust the sliders to reflect your current income and investment activity. 
        </p>
        <div className={styles.twoCol}>
          <div>
            <SliderField label="Monthly Take-Home Pay" min={20000} max={300000} step={2000} value={takeHome} onChange={set("takeHome")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="Monthly Total Savings" min={5000} max={150000} step={1000} value={monthlySave} onChange={set("monthlySave")} prefix="R " info infoMap={INFO_CONTENT} />
            <SliderField label="TFSA Monthly Contribution" min={0} max={3000} step={250} value={monthlyTfsa} onChange={set("monthlyTfsa")} prefix="R " info infoMap={INFO_CONTENT} />
          </div>
          <div>
            <SliderField label="Offshore Allocation (%)" min={0} max={70} step={5} value={offshoreAllocation} onChange={set("offshoreAllocation")} suffix="%" info infoMap={INFO_CONTENT} />
            <SliderField label="RA Contribution (% of income)" min={0} max={27.5} step={0.5} value={raContribution} onChange={set("raContribution")} suffix="%" info infoMap={INFO_CONTENT} />
            <SliderField label="Expected Annual Return" min={6} max={16} step={0.25} value={returnRate} onChange={set("returnRate")} suffix="% p.a." info infoMap={INFO_CONTENT} />
          </div>
        </div>
      </div>

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 2 — Your Portfolio</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Savings Rate</h2>
          <p className={styles.cardSub}>Your rate relative to aggressive investor benchmarks</p>
          <SavingsRateGauge rate={computed.savingsRate} />
          <div className={styles.divider} />
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Monthly savings</span>
            <span className={styles.summaryVal}>R {monthlySave.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>RA monthly cost (after tax)</span>
            <span className={styles.summaryValGood}>
              R {Math.round(computed.raMonthly * (1 - (takeHome > 100000 ? 0.41 : 0.36))).toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>RA tax saving</span>
            <span className={styles.summaryValGood}>R {computed.raTaxSaving.toLocaleString()}/mo</span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Compound Projection</h2>
          <p className={styles.cardSub}>Portfolio growth by horizon, split local vs offshore</p>
          <CompoundChart monthlyInvest={monthlySave} offshoreAllocation={offshoreAllocation} returnRate={returnRate} />
          <div className={styles.divider} />
          <div className={styles.goalEstimate}>
            <div className={styles.goalEstimateLbl}>Wealth Number (25× expenses)</div>
            <div className={styles.goalEstimateVal}>R {computed.wealthNumber.toLocaleString()}</div>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Years to reach it</span>
            <span className={computed.savingsRate >= 35 ? styles.summaryValGood : styles.summaryVal}>
              {computed.yearsToWealth} years
            </span>
          </div>
        </div>
      </div>

      <div className={styles.sectionLabel}>
        <span className={styles.sectionLabelText}>Step 3 — Your Journey</span>
        <div className={styles.sectionLabelLine} />
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Six Stages to Global Investor</h2>
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
          A snapshot of your aggressive global investor profile based on your current inputs.
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
              ["Monthly Savings", `R ${monthlySave.toLocaleString()}`, `R ${Math.round(takeHome * 0.35).toLocaleString()} (35%)`],
              ["Savings Rate", `${computed.savingsRate.toFixed(1)}%`, "35–50%"],
              ["TFSA Annual", `R ${computed.tfsaAnnual.toLocaleString()}`, "R 36 000 (max)"],
              ["Offshore Allocation", `${offshoreAllocation}%`, "30–50%"],
              ["RA Contribution", `${raContribution}%`, "20–27.5%"],
              ["10-Year Projection", `R ${computed.projected10y.toLocaleString()}`, `R ${Math.round(takeHome * 0.3 * 12 * 10 * 1.7).toLocaleString()} at 10%`],
              ["Wealth Number", `R ${computed.wealthNumber.toLocaleString()}`, "25× annual expenses"],
              ["Years to Wealth", `${computed.yearsToWealth} yrs`, "< 20 years ideal"],
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
          <strong>Simulation Insight:</strong> At your current savings rate of {computed.savingsRate.toFixed(0)}% and {offshoreAllocation}% offshore allocation,
          your portfolio is projected to reach{" "}
          <strong>R {computed.projected10y.toLocaleString()}</strong> in 10 years and{" "}
          <strong>R {computed.projected20y.toLocaleString()}</strong> in 20 years at a {returnRate}% assumed return.
          Your wealth number (financial independence threshold) is{" "}
          <strong>R {computed.wealthNumber.toLocaleString()}</strong>, reachable in approximately{" "}
          <strong>{computed.yearsToWealth} years</strong> at your current rate.
          {computed.savingsRate < 35
            ? ` Increasing your savings rate to 35% by redirecting R${Math.round((35 - computed.savingsRate) / 100 * takeHome).toLocaleString()}/month would materially accelerate your timeline.`
            : " You're operating at a high-performance savings rate. The next lever is optimising tax structure and offshore allocation."}
        </div>
      </div>
    </div>
  );
}