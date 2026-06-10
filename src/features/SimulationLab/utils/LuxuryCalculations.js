/**
 * CarCalculations.js
 * Pure financial calculation functions for the Luxury Car vs Investing simulation.
 * No React imports — safe to use in any context.
 *
 * Exported functions:
 *   calcCar(inputs)  → { car, investing, winner, verdict, chart, breakevenYear }
 *   CAR_NUDGES       — contextual nudge definitions
 */

import { fmtRand, fmtRandShort } from "./StudioCalculations";

/* ── Car depreciation model ─────────────────────────────────── */
/**
 * South African luxury car depreciation approximation.
 * Year 1: ~20%, Year 2–3: ~12%/yr, Year 4+: ~8%/yr
 * Returns residual value at end of given year.
 */
export function calcCarResidual(purchasePrice, year) {
  let value = purchasePrice;
  for (let y = 1; y <= year; y++) {
    const rate = y === 1 ? 0.20 : y <= 3 ? 0.12 : 0.08;
    value *= 1 - rate;
  }
  return Math.max(0, value);
}

/* ── Finance repayment (standard amortisation) ──────────────── */
export function calcFinanceRepayment(principal, annualRate, termYears) {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ── Main car vs investing calculation ──────────────────────── */
/**
 * @param {object} inputs
 * @param {number} inputs.horizon          years
 * @param {number} inputs.carPrice         ZAR — OTR price of the car
 * @param {number} inputs.deposit          ZAR — cash deposit on the car
 * @param {number} inputs.financeRate      % per annum — vehicle finance rate
 * @param {number} inputs.financeTerm      years — finance term
 * @param {number} inputs.monthlyInsurance ZAR/month — comprehensive insurance
 * @param {number} inputs.monthlyFuel      ZAR/month — estimated monthly fuel
 * @param {number} inputs.annualService    ZAR/year — service plan / maintenance
 * @param {number} inputs.investReturn     % per annum — portfolio return if invested
 * @returns {object}
 */
export function calcCar({
  horizon,
  carPrice,
  deposit,
  financeRate,
  financeTerm,
  monthlyInsurance,
  monthlyFuel,
  annualService,
  investReturn = 10,
}) {
  const monthlyInvestReturn = investReturn / 100 / 12;
  const loanAmount          = Math.max(0, carPrice - deposit);
  const financePayment      = calcFinanceRepayment(loanAmount, financeRate, financeTerm);

  // Licensing / registration fees (once-off, SA approximation)
  const onceOffFees = carPrice <= 500_000 ? 3_000 : carPrice <= 1_000_000 ? 5_000 : 8_000;

  // Monthly car total cost (finance + insurance + fuel + monthly share of service)
  const monthlyServiceShare = annualService / 12;
  const monthlyCarCost      = financePayment + monthlyInsurance + monthlyFuel + monthlyServiceShare;

  // The investing path: deposit + monthly car-equivalent costs go into a portfolio
  let investPortfolio = deposit; // lump sum invested from day 1
  let carCashOutlay   = deposit + onceOffFees;
  let investCashOutlay = deposit;

  const chartData = [];

  for (let yr = 1; yr <= horizon; yr++) {
    for (let mo = 1; mo <= 12; mo++) {
      const m = (yr - 1) * 12 + mo;
      const financeActive = m <= financeTerm * 12;

      // Car path: pay finance while active, then just running costs
      const monthlyCarActual = financeActive
        ? monthlyCarCost
        : monthlyInsurance + monthlyFuel + monthlyServiceShare;

      carCashOutlay += monthlyCarActual;

      // Investing path: invest the equivalent of what the car path spends
      investPortfolio =
        investPortfolio * (1 + monthlyInvestReturn) + monthlyCarActual;
      investCashOutlay += monthlyCarActual;
    }

    // Car residual value at year-end
    const carResidual = calcCarResidual(carPrice, yr);

    // Car net position: residual minus outstanding finance balance
    const paidMonths  = Math.min(yr * 12, financeTerm * 12);
    const monthlyRate = financeRate / 100 / 12;
    const numPayments = financeTerm * 12;
    const financeBalance =
      loanAmount > 0 && monthlyRate > 0
        ? (loanAmount *
            (Math.pow(1 + monthlyRate, numPayments) -
              Math.pow(1 + monthlyRate, paidMonths))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : Math.max(0, loanAmount - financePayment * paidMonths);

    const carNetworth  = Math.max(0, carResidual - Math.max(0, financeBalance));
    const investNetworth = investPortfolio;

    chartData.push({
      year:          yr,
      label:         `Year ${yr}`,
      car:           Math.round(carNetworth),
      investing:     Math.round(investNetworth),
      carResidual:   Math.round(carResidual),
      financeBalance: Math.round(Math.max(0, financeBalance)),
    });
  }

  /* ── Final values ──────────────────────────── */
  const last            = chartData[chartData.length - 1];
  const carNetworth     = last.car;
  const investNetworth  = last.investing;
  const finalCarValue   = last.carResidual;
  const totalFinanceCost = financePayment * financeTerm * 12 - loanAmount;

  /* ── Breakeven ─────────────────────────────── */
  let breakevenYear = null;
  for (let i = 1; i < chartData.length; i++) {
    const prev = chartData[i - 1];
    const curr = chartData[i];
    if (prev.investing <= prev.car && curr.investing > curr.car) {
      breakevenYear = curr.year;
      break;
    }
  }

  /* ── Verdict ───────────────────────────────── */
  const delta      = Math.abs(investNetworth - carNetworth);
  const deltaShort = fmtRandShort(delta);
  const winner     = investNetworth > carNetworth ? "Investing" : "Luxury Car";

  let verdict;
  if (investNetworth > carNetworth) {
    verdict = breakevenYear
      ? `The investing path overtakes the car in year ${breakevenYear} and ends ${deltaShort} ahead — compounding returns outpace the car's residual value as depreciation accelerates.`
      : `Over ${horizon} years, investing the equivalent outlay builds ${deltaShort} more wealth than owning the luxury car.`;
  } else {
    verdict = `The luxury car retains enough residual value that its net position ends ${deltaShort} ahead of investing over ${horizon} years — though lifestyle costs and depreciation are still significant.`;
  }

  return {
    car: {
      cashOutlay:      Math.round(carCashOutlay),
      cashOutlayFmt:   fmtRand(carCashOutlay),
      residualValue:   Math.round(finalCarValue),
      residualFmt:     fmtRand(finalCarValue),
      networth:        carNetworth,
      networthFmt:     fmtRand(carNetworth),
      monthlyPayment:  Math.round(financePayment),
      monthlyPaymentFmt: fmtRand(financePayment),
      monthlyRunning:  Math.round(monthlyInsurance + monthlyFuel + monthlyServiceShare),
      totalFinanceCost: Math.round(totalFinanceCost),
      totalFinanceFmt:  fmtRand(totalFinanceCost),
      onceOffFees,
      onceOffFeesFmt:  fmtRand(onceOffFees),
      loanAmount:      Math.round(loanAmount),
      loanAmountFmt:   fmtRand(loanAmount),
    },
    investing: {
      cashOutlay:      Math.round(investCashOutlay),
      cashOutlayFmt:   fmtRand(investCashOutlay),
      portfolioValue:  Math.round(investNetworth),
      portfolioFmt:    fmtRand(investNetworth),
      networth:        investNetworth,
      networthFmt:     fmtRand(investNetworth),
    },
    winner,
    verdict,
    breakevenYear,
    chart: chartData,
    inputs: {
      horizon, carPrice, deposit, financeRate, financeTerm,
      monthlyInsurance, monthlyFuel, annualService, investReturn,
    },
  };
}

/* ── Nudge definitions for CarSim ───────────────────────────── */
export const CAR_NUDGES = [
  {
    id: "car_over_30pct_income",
    severity: "warn",
    condition: ({ financePayment, monthlyIncome }) =>
      monthlyIncome > 0 && financePayment / monthlyIncome > 0.30,
    message:
      "Your monthly finance repayment exceeds 30% of your gross income. South African banks typically use this as an affordability ceiling — the application may be declined or you could be overextended.",
  },
  {
    id: "low_deposit",
    severity: "warn",
    condition: ({ deposit, carPrice }) =>
      carPrice > 0 && deposit / carPrice < 0.10,
    message:
      "A deposit below 10% means you're financing most of the car. With depreciation running at ~20% in year one alone, you risk being 'underwater' — owing more than the car is worth for the first few years.",
  },
  {
    id: "long_term_short_horizon",
    severity: "warn",
    condition: ({ financeTerm, horizon }) => financeTerm > horizon,
    message:
      "Your finance term is longer than your simulation horizon. You'll still be paying off the car when the comparison ends — the true cost is higher than the chart shows.",
  },
  {
    id: "high_running_costs",
    severity: "info",
    condition: ({ monthlyInsurance, monthlyFuel, annualService }) =>
      monthlyInsurance + monthlyFuel + annualService / 12 > 8_000,
    message:
      "Your running costs (insurance, fuel, and servicing) exceed R8 000/month before the finance payment. These recurring costs compound significantly over time and are often underestimated when the purchase decision is made.",
  },
  {
    id: "depreciation_warning",
    severity: "info",
    condition: ({ carPrice }) => carPrice >= 800_000,
    message:
      "Luxury vehicles above R800k can lose 35–50% of their value in the first three years. The more premium the badge, the steeper the initial depreciation — unless you're buying a certified limited-production asset.",
  },
  {
    id: "rate_risk",
    severity: "info",
    condition: ({ financeRate }) => financeRate < 11,
    message:
      "Vehicle finance rates in South Africa are typically prime-linked (currently 11.25%). A rate below prime may reflect a promotional offer — confirm whether it's fixed or variable, as a rate increase changes your repayments.",
  },
];