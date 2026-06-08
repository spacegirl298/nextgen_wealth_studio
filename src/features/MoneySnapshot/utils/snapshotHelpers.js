/**
 * snapshotHelpers.js
 * ─────────────────────────────────────────────────────────────
 * Pure helper functions for snapshot logic.
 * No React dependencies — safe to import anywhere.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * createSnapshot(financialData)
 * Formats current derived data into a snapshot object with timestamp.
 * @param {object} derived — the `derived` object returned by useSnapshotStore
 * @returns {object} snapshot
 */
export function createSnapshot(derived) {
  return {
    id: Date.now(),
    date: new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }),
    grossMonthly: derived.grossMonthly,
    takeHome: derived.takeHome,
    paye: derived.paye,
    totalMonthlyExpenses: derived.totalExpenses,
    totalSavings: derived.totalSavings,
    disposable: derived.metrics.disposable,
    healthScore: derived.healthScore,
    dti: derived.metrics.dti,
    savingsRate: derived.metrics.savingsRate,
    emergencyMonths: derived.metrics.emergencyMonths,
  };
}

/**
 * compareSnapshots(snapshotA, snapshotB)
 * Returns a delta object with absolute and relative change per metric.
 * snapshotA is the "newer" snapshot, snapshotB is the "older" baseline.
 * @returns {object} delta
 */
export function compareSnapshots(snapshotA, snapshotB) {
  const keys = ["grossMonthly", "takeHome", "totalMonthlyExpenses", "totalSavings", "healthScore", "dti", "savingsRate", "emergencyMonths", "disposable"];
  return Object.fromEntries(keys.map(k => {
    const curr = snapshotA[k] ?? 0;
    const prev = snapshotB[k] ?? 0;
    const diff = curr - prev;
    const pct  = prev !== 0 ? (diff / Math.abs(prev)) * 100 : 0;
    return [k, { curr, prev, diff, pct }];
  }));
}

/**
 * getSnapshotTrend(history)
 * Analyses an array of snapshots (newest-first) and returns trend directions.
 * Returns an object keyed by metric with values: "up" | "down" | "flat"
 * @param {object[]} history
 * @returns {object}
 */
export function getSnapshotTrend(history) {
  if (!history || history.length < 2) return {};
  const [newest, ...rest] = history;
  const oldest = rest[rest.length - 1];
  const keys = ["healthScore", "savingsRate", "dti", "emergencyMonths", "totalSavings"];
  return Object.fromEntries(keys.map(k => {
    const diff = (newest[k] ?? 0) - (oldest[k] ?? 0);
    return [k, diff > 0.5 ? "up" : diff < -0.5 ? "down" : "flat"];
  }));
}

/**
 * formatSnapshotSummary(snapshot)
 * Returns a short human-readable string for a snapshot.
 * @param {object} snapshot
 * @returns {string}
 */
export function formatSnapshotSummary(snapshot) {
  if (!snapshot) return "";
  const fmt = n => `R${Math.round(n ?? 0).toLocaleString()}`;
  return `Take-home ${fmt(snapshot.takeHome)} · Expenses ${fmt(snapshot.totalMonthlyExpenses)} · Health ${snapshot.healthScore ?? 0}%`;
}

/**
 * generateInsights({ dti, savingsRate, emergencyMonths, disposable, housing, netIncome })
 * Returns an array of { text, sentiment } objects for NarrativeInsights.
 */
export function generateInsights({ dti, savingsRate, emergencyMonths, disposable, housing, netIncome }) {
  const insights = [];
  const housingPct = netIncome > 0 ? (housing / netIncome) * 100 : 0;

  if (housingPct > 40)
    insights.push({ text: `Your housing costs are ${housingPct.toFixed(0)}% of take-home pay — significantly above the recommended 30% ceiling. Consider whether downsizing or finding a flatmate is viable.`, sentiment: "warning" });
  else if (housingPct > 30)
    insights.push({ text: `Housing is at ${housingPct.toFixed(0)}% of take-home pay, slightly above the 30% benchmark. You're managing, but there's limited flexibility for unexpected costs.`, sentiment: "neutral" });
  else if (housingPct > 0)
    insights.push({ text: `Your housing costs are a healthy ${housingPct.toFixed(0)}% of take-home pay — well within the recommended 30% threshold.`, sentiment: "positive" });

  if (dti > 50)
    insights.push({ text: `Your debt-to-income ratio of ${dti.toFixed(0)}% is critically high. Over half your income services debt, leaving little room for savings or emergencies. Prioritise aggressive debt reduction.`, sentiment: "warning" });
  else if (dti > 36)
    insights.push({ text: `Your DTI of ${dti.toFixed(0)}% exceeds the healthy 36% threshold. Lenders may view new credit applications unfavourably. Consider a debt snowball strategy.`, sentiment: "neutral" });
  else if (dti > 0)
    insights.push({ text: `Your debt-to-income ratio of ${dti.toFixed(0)}% is within healthy bounds. You have good capacity to absorb financial shocks.`, sentiment: "positive" });

  if (savingsRate < 5)
    insights.push({ text: `You're currently saving less than 5% of your income. South Africa's National Treasury recommends at least 15% for retirement security. Even small increases compound significantly over time.`, sentiment: "warning" });
  else if (savingsRate < 15)
    insights.push({ text: `Your savings rate of ${savingsRate.toFixed(0)}% is a good start. Aim to push this toward 15–20% to build long-term financial resilience.`, sentiment: "neutral" });
  else
    insights.push({ text: `Excellent — you're saving ${savingsRate.toFixed(0)}% of your income, exceeding the 15% benchmark. Your future self will thank you.`, sentiment: "positive" });

  if (emergencyMonths < 1)
    insights.push({ text: `You have less than one month of expenses in emergency savings. This is your most urgent priority — aim for 3 months minimum before increasing investments.`, sentiment: "warning" });
  else if (emergencyMonths < 3)
    insights.push({ text: `Your emergency fund covers ${emergencyMonths.toFixed(1)} months of expenses. Build this to at least 3 months to protect against job loss or medical emergencies.`, sentiment: "neutral" });
  else
    insights.push({ text: `Your emergency fund covers ${emergencyMonths.toFixed(1)} months of expenses — providing a solid financial safety net.`, sentiment: "positive" });

  if (disposable < 0)
    insights.push({ text: `Warning: your expenses exceed your take-home income by R${Math.abs(Math.round(disposable)).toLocaleString()} per month. This is unsustainable — review your largest spending categories immediately.`, sentiment: "warning" });

  return insights;
}

/**
 * SA Financial glossary terms
 */
export const GLOSSARY = [
  { term: "PAYE",                  definition: "Pay As You Earn — the system where your employer deducts income tax from your salary each month and pays it directly to SARS on your behalf." },
  { term: "UIF",                   definition: "Unemployment Insurance Fund — a 1% employee contribution (matched by employer) that provides short-term relief if you lose your job, become ill, or go on maternity leave." },
  { term: "TFSA",                  definition: "Tax Free Savings Account — contributions up to R36,000/year (R500,000 lifetime) grow completely free of income tax, dividends tax, and capital gains tax." },
  { term: "Debt-to-Income (DTI)",  definition: "Total monthly debt repayments divided by net monthly income. Below 36% is healthy; above 50% is a debt crisis by most SA lender standards." },
  { term: "Effective Tax Rate",    definition: "The actual percentage of your gross income that goes to PAYE after applying rebates and credits. Always lower than your marginal rate." },
  { term: "Retirement Annuity",    definition: "A tax-advantaged vehicle where contributions up to 27.5% of taxable income (max R350,000/year) are tax-deductible, reducing your PAYE now." },
  { term: "Emergency Fund",        definition: "Liquid savings kept exclusively for unexpected expenses. Planners recommend 3–6 months of total monthly expenses in an accessible notice account." },
  { term: "Disposable Income",     definition: "What remains of your take-home pay after all fixed and variable expenses are accounted for. Positive disposable income means capacity to save or invest." },
  { term: "Savings Rate",          definition: "The percentage of net income saved or invested each month. National Treasury recommends at least 15% throughout your working life." },
  { term: "Medical Aid Credit",    definition: "A fixed monthly tax credit (not deduction) that directly reduces your PAYE. 2025/26: R364 primary member, R246 per additional dependant." },
  { term: "Bond",                  definition: "A home loan secured by property. SA banks typically require a 10% deposit and assess affordability against your DTI ratio." },
  { term: "Marginal Tax Rate",     definition: "The rate applied to the last rand you earn. Your effective rate is always lower than your marginal rate." },
];

/**
 * SA Financial benchmarks for the Education tab
 */
export const SA_BENCHMARKS = [
  { rule: "Housing ≤ 30% of gross income",                detail: "The ceiling used by SA banks when assessing bond affordability." },
  { rule: "Emergency fund = 3–6 months of expenses",      detail: "3 months for dual-income households; 6 months for single income or self-employed." },
  { rule: "Retirement savings = 15%+ of income",          detail: "National Treasury recommendation. Starting at 25 vs 35 requires roughly 3× less monthly contribution for the same outcome." },
  { rule: "Debt-to-income ratio < 36%",                   detail: "Above 40%, most banks decline further credit. Above 50% is considered a debt crisis." },
  { rule: "TFSA: R36,000/year, R500,000 lifetime",        detail: "All growth inside a TFSA is completely tax-free. Unused annual allowances cannot be carried over." },
  { rule: "Vehicle finance ≤ 15% of gross income",        detail: "Vehicles depreciate — over-financing a car is one of the fastest ways to destroy household wealth." },
  { rule: "RA deduction = 27.5% of taxable income",       detail: "Capped at R350,000/year. Contributions reduce your taxable income, lowering PAYE immediately." },
  { rule: "Medical aid credit (2025/26): R364 + R246/dep",detail: "A direct reduction in PAYE, not a deduction from income." },
];