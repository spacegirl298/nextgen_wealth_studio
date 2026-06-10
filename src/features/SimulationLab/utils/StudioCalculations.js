/**
 * StudioCalculations.js
 * Pure financial calculation functions for all simulation labs.
 * No React imports — safe to use in any context.
 *
 * Exported functions:
 *   calcProperty(inputs)  → { renting, buying, winner, verdict, chart }
 *   fmtRand(n)            → formatted ZAR string
 *   calcBondRepayment(principal, annualRate, termYears) → monthly repayment
 *   calcTransferDuty(price) → transfer duty (SA 2025 SARS table)
 *   calcBondRegistration(price) → estimated bond registration costs
 */

/* ── Formatting helpers ─────────────────────────────────────── */
export const fmtRand = (n) =>
  "R " + Math.round(n).toLocaleString("en-ZA");

export const fmtRandShort = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000)     return `R${(n / 1_000).toFixed(0)}k`;
  return `R${Math.round(n)}`;
};

/* ── Bond repayment (standard amortisation) ─────────────────── */
export function calcBondRepayment(principal, annualRate, termYears) {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ── Transfer Duty — SARS 2025 table ────────────────────────── */
export function calcTransferDuty(price) {
  if (price <= 1_100_000)  return 0;
  if (price <= 1_512_500)  return (price - 1_100_000) * 0.03;
  if (price <= 2_117_500)  return 12_375  + (price - 1_512_500) * 0.06;
  if (price <= 2_722_500)  return 48_675  + (price - 2_117_500) * 0.08;
  if (price <= 12_100_000) return 97_075  + (price - 2_722_500) * 0.11;
  return                          1_128_600 + (price - 12_100_000) * 0.13;
}

/* ── Bond registration costs (estimated) ────────────────────── */
export function calcBondRegistration(bondAmount) {
  // Attorney and Deeds Office fees — approximate South African schedule
  if (bondAmount <= 0)         return 0;
  if (bondAmount <= 500_000)   return 8_500;
  if (bondAmount <= 1_000_000) return 12_000;
  if (bondAmount <= 1_500_000) return 16_000;
  if (bondAmount <= 2_000_000) return 20_000;
  if (bondAmount <= 3_000_000) return 26_000;
  return                              32_000;
}

/* ── Conveyancing/attorney fees (transfer) ──────────────────── */
export function calcTransferFees(price) {
  // Approximate recommended sliding-scale attorney fees
  if (price <= 500_000)   return 9_000;
  if (price <= 1_000_000) return 14_000;
  if (price <= 1_500_000) return 19_000;
  if (price <= 2_000_000) return 24_000;
  if (price <= 3_000_000) return 30_000;
  return                          38_000;
}

/* ── Main property calculation ──────────────────────────────── */
/**
 * @param {object} inputs
 * @param {number} inputs.horizon          years
 * @param {number} inputs.purchasePrice    ZAR
 * @param {number} inputs.bondRate         % per annum
 * @param {number} inputs.bondTerm         years
 * @param {number} inputs.savings          ZAR deposit
 * @param {number} inputs.priceGrowth      % per annum
 * @param {number} inputs.monthlyRent      ZAR/month
 * @param {number} inputs.rentalInflation  % per annum
 * @param {number} [inputs.investReturn=10] % per annum — return on invested difference
 * @returns {object} { renting, buying, winner, verdict, chart, breakeven }
 */
export function calcProperty({
  horizon,
  purchasePrice,
  bondRate,
  bondTerm,
  savings,
  priceGrowth,
  monthlyRent,
  rentalInflation,
  investReturn = 10,
}) {
  const years = horizon;
  const monthlyInvestReturn = investReturn / 100 / 12;

  /* ── Buying setup ──────────────────────────── */
  const deposit         = savings;
  const loanAmount      = Math.max(0, purchasePrice - deposit);
  const bondPayment     = calcBondRepayment(loanAmount, bondRate, bondTerm);
  const transferDuty    = calcTransferDuty(purchasePrice);
  const transferFees    = calcTransferFees(purchasePrice);
  const bondRegCosts    = calcBondRegistration(loanAmount);
  const upfrontBuyCost  = deposit + transferDuty + transferFees + bondRegCosts;

  // Monthly buying cost: bond + 1% of value/year maintenance + est R1 500 levy
  const monthlyMaintenance = (purchasePrice * 0.01) / 12;
  const monthlyLevy         = 1_500;
  const monthlyBuyCost      = bondPayment + monthlyMaintenance + monthlyLevy;

  /* ── Renting setup ─────────────────────────── */
  const rentInfRate      = rentalInflation / 100;

  /* ── Year-by-year simulation ─────────────────
     Both paths track cumulative outlay and net worth at each year-end
  */
  const chartData = [];

  let rentCashOutlay   = 0;
  let rentInvestValue  = deposit; // renter invests the deposit + monthly difference

  let buyCashOutlay    = upfrontBuyCost;
  const numPayments    = bondTerm * 12;
  const monthlyRate    = bondRate / 100 / 12;

  for (let yr = 1; yr <= years; yr++) {
    for (let mo = 1; mo <= 12; mo++) {
      // Renting: accumulate rent outlay, invest difference vs buying
      const currentRent = monthlyRent * Math.pow(1 + rentInfRate, yr - 1);
      rentCashOutlay += currentRent;
      const diff = Math.max(0, monthlyBuyCost - currentRent);
      rentInvestValue = rentInvestValue * (1 + monthlyInvestReturn) + diff;

      // Buying: accumulate total spend
      buyCashOutlay += monthlyBuyCost;
    }

    // Property value at year-end
    const propertyValue = purchasePrice * Math.pow(1 + priceGrowth / 100, yr);

    // Outstanding bond balance at year-end
    const paidMonths = Math.min(yr * 12, numPayments);
    const bondBalance =
      loanAmount > 0 && monthlyRate > 0
        ? (loanAmount * (Math.pow(1 + monthlyRate, numPayments) - Math.pow(1 + monthlyRate, paidMonths))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : Math.max(0, loanAmount - bondPayment * paidMonths);

    const buyEquity   = propertyValue - Math.max(0, bondBalance);
    const buyNetworth = buyEquity; // homeowner's net worth = equity

    const rentNetworth = rentInvestValue; // renter's net worth = investment portfolio

    chartData.push({
      year: yr,
      label: `Year ${yr}`,
      buying: Math.round(buyNetworth),
      renting: Math.round(rentNetworth),
      propertyValue: Math.round(propertyValue),
      bondBalance: Math.round(Math.max(0, bondBalance)),
    });
  }

  /* ── Final-year values ─────────────────────── */
  const last           = chartData[chartData.length - 1];
  const buyNetworth    = last.buying;
  const rentNetworth   = last.renting;
  const finalPropValue = last.propertyValue;

  // Total interest paid over full bond term (for display)
  const totalInterestPaid = bondPayment * numPayments - loanAmount;

  /* ── Breakeven year ────────────────────────── */
  let breakevenYear = null;
  for (let i = 1; i < chartData.length; i++) {
    const prev = chartData[i - 1];
    const curr = chartData[i];
    if (prev.buying <= prev.renting && curr.buying > curr.renting) {
      breakevenYear = curr.year;
      break;
    }
  }

  /* ── Verdict ───────────────────────────────── */
  const delta      = Math.abs(buyNetworth - rentNetworth);
  const deltaShort = fmtRandShort(delta);
  const winner     = buyNetworth > rentNetworth ? "Buying" : "Renting";

  let verdict;
  if (buyNetworth > rentNetworth) {
    verdict = breakevenYear
      ? `Buying pulls ahead in year ${breakevenYear} and ends ${deltaShort} better off after ${years} years — driven by equity growth and property appreciation.`
      : `Over ${years} years, buying builds ${deltaShort} more wealth than renting, primarily through equity accumulation.`;
  } else {
    verdict = `Renting and investing the difference comes out ${deltaShort} ahead over ${years} years — lower upfront costs and strong investment returns outpace property equity growth at your inputs.`;
  }

  return {
    renting: {
      cashOutlay:      Math.round(rentCashOutlay),
      cashOutlayFmt:   fmtRand(rentCashOutlay),
      assetValue:      0,
      assetValueFmt:   "None",
      investmentValue: Math.round(rentNetworth),
      investValueFmt:  fmtRand(rentNetworth),
      networth:        Math.round(rentNetworth),
      networthFmt:     fmtRand(rentNetworth),
      avgMonthlyCost:  Math.round(monthlyRent * (1 + (rentInfRate * years) / 2)),
      flexibility:     "High",
      maintenanceRisk: "Low",
    },
    buying: {
      cashOutlay:      Math.round(buyCashOutlay),
      cashOutlayFmt:   fmtRand(buyCashOutlay),
      assetValue:      Math.round(finalPropValue),
      assetValueFmt:   fmtRand(finalPropValue),
      investmentValue: 0,
      investValueFmt:  "—",
      networth:        Math.round(buyNetworth),
      networthFmt:     fmtRand(buyNetworth),
      avgMonthlyCost:  Math.round(monthlyBuyCost),
      flexibility:     "Low",
      maintenanceRisk: "High",
      bondPayment:     Math.round(bondPayment),
      bondPaymentFmt:  fmtRand(bondPayment),
      totalInterest:   Math.round(totalInterestPaid),
      totalInterestFmt: fmtRand(totalInterestPaid),
      transferDuty,
      transferDutyFmt: fmtRand(transferDuty),
      transferFees,
      transferFeesFmt: fmtRand(transferFees),
      bondRegCosts,
      bondRegCostsFmt: fmtRand(bondRegCosts),
      upfrontCost:     Math.round(upfrontBuyCost),
      upfrontCostFmt:  fmtRand(upfrontBuyCost),
      equity:          Math.round(last.buyEquity ?? buyNetworth),
    },
    winner,
    verdict,
    breakevenYear,
    chart: chartData,
    inputs: { horizon, purchasePrice, bondRate, bondTerm, savings, priceGrowth, monthlyRent, rentalInflation },
  };
}

/* ── Nudge definitions for PropertySim ─────────────────────── */
export const PROPERTY_NUDGES = [
  {
    id: "deposit_low",
    severity: "warn",
    condition: ({ savings, purchasePrice }) =>
      purchasePrice > 0 && savings / purchasePrice < 0.1,
    message:
      "Your deposit is below 10% of the purchase price. Most South African banks require at least 10% — and a higher deposit means a smaller bond, lower monthly repayments, and better interest rate offers.",
  },
  {
    id: "bond_over_30pct_income",
    severity: "warn",
    condition: ({ bondPayment, monthlyIncome }) =>
      monthlyIncome > 0 && bondPayment / monthlyIncome > 0.30,
    message:
      "Your estimated bond repayment exceeds 30% of your gross income. This is the typical bank affordability ceiling — your application may be declined or approved for a lower amount than expected.",
  },
  {
    id: "short_horizon",
    severity: "info",
    condition: ({ horizon }) => horizon <= 3,
    message:
      "With a horizon under 3 years, upfront buying costs (transfer duty, registration fees, agent commissions on resale) often make renting the more cost-effective choice. Buying typically needs 5+ years to break even.",
  },
  {
    id: "high_rental_inflation",
    severity: "info",
    condition: ({ rentalInflation }) => rentalInflation >= 9,
    message:
      "High rental escalations erode the cost advantage of renting over time. A fixed bond repayment becomes relatively cheaper each year as your rent keeps rising.",
  },
  {
    id: "low_property_growth",
    severity: "info",
    condition: ({ priceGrowth, bondRate }) =>
      priceGrowth < bondRate / 2,
    message:
      "Your property growth assumption is less than half your bond rate. In this scenario, renting and investing the difference may generate better returns — make sure your suburb's growth outlook justifies buying.",
  },
  {
    id: "interest_rate_risk",
    severity: "info",
    condition: ({ bondRate }) => bondRate < 10,
    message:
      "South Africa's prime rate has historically ranged from 10% to 15%+. A low rate assumption makes buying look more attractive — consider stress-testing with a higher rate to see how repayments change.",
  },
];