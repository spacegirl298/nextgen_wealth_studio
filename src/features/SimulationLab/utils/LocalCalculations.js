/**
 * OffshoreCalculations.js
 * Pure financial calculation functions for the Local vs Offshore Investing simulation.
 * No React imports — safe to use in any context.
 *
 * Models two portfolio paths — a local-only allocation and an offshore-tilted
 * allocation — over a given horizon, incorporating rand depreciation,
 * distinct return rates, and tax drag on both.
 *
 * Exported:
 *   calcOffshore(inputs)  → { local, offshore, blended, winner, verdict, chart }
 *   OFFSHORE_NUDGES       — contextual nudge definitions
 */

import { fmtRand, fmtRandShort } from "../utils/StudioCalculations";

/* ── Compound growth helper ─────────────────────────────────── */
function futureValue(present, annualRate, years) {
  return present * Math.pow(1 + annualRate / 100, years);
}

/* ── Main offshore vs local calculation ─────────────────────── */
/**
 * @param {object} inputs
 * @param {number} inputs.horizon             years
 * @param {number} inputs.monthlyContribution ZAR/month
 * @param {number} inputs.lumpSum             ZAR — existing savings deployed from day 1
 * @param {number} inputs.localReturn         % per annum — JSE / local portfolio return
 * @param {number} inputs.offshoreReturn      % per annum — global portfolio return (USD-based)
 * @param {number} inputs.randDepreciation    % per annum — expected ZAR/USD weakening
 * @param {number} inputs.taxRate             % — effective annual tax drag (dividends + CGT estimate)
 * @param {number} inputs.offshoreAllocation  % — share of portfolio in offshore assets (0–100)
 * @returns {object}
 */
export function calcOffshore({
  horizon,
  monthlyContribution,
  lumpSum,
  localReturn,
  offshoreReturn,
  randDepreciation,
  taxRate,
  offshoreAllocation,
}) {
  const localAllocation = 100 - offshoreAllocation;

  // After-tax rates
  const localNet    = localReturn    * (1 - taxRate / 100);
  const offshoreNet = offshoreReturn * (1 - taxRate / 100);

  // Offshore return in ZAR terms = offshore USD return + rand depreciation
  const offshoreNetZar = offshoreNet + randDepreciation;

  // Blended weighted-average annual return for the mixed portfolio
  const blendedReturn =
    (localAllocation / 100) * localNet +
    (offshoreAllocation / 100) * offshoreNetZar;

  const monthlyLocalRate    = localNet    / 100 / 12;
  const monthlyOffshoreRate = offshoreNetZar / 100 / 12;
  const monthlyBlendedRate  = blendedReturn / 100 / 12;

  // Split monthly contribution and lump sum by allocation
  const monthlyLocal    = monthlyContribution * (localAllocation / 100);
  const monthlyOffshore = monthlyContribution * (offshoreAllocation / 100);
  const lumpLocal       = lumpSum * (localAllocation / 100);
  const lumpOffshore    = lumpSum * (offshoreAllocation / 100);

  let localPortfolio    = lumpLocal;
  let offshorePortfolio = lumpOffshore; // in ZAR equivalent
  let blendedPortfolio  = lumpSum;

  // For reference: a pure-local-only portfolio (0% offshore)
  let pureLocalPortfolio   = lumpSum;
  // And a pure-offshore-only portfolio (100% offshore)
  let pureOffshorePortfolio = lumpSum;

  const chartData = [];

  for (let yr = 1; yr <= horizon; yr++) {
    for (let mo = 1; mo <= 12; mo++) {
      localPortfolio    = localPortfolio    * (1 + monthlyLocalRate)    + monthlyLocal;
      offshorePortfolio = offshorePortfolio * (1 + monthlyOffshoreRate) + monthlyOffshore;
      blendedPortfolio  = blendedPortfolio  * (1 + monthlyBlendedRate)  + monthlyContribution;

      pureLocalPortfolio    = pureLocalPortfolio    * (1 + monthlyLocalRate)    + monthlyContribution;
      pureOffshorePortfolio = pureOffshorePortfolio * (1 + monthlyOffshoreRate) + monthlyContribution;
    }

    const totalBlended = localPortfolio + offshorePortfolio;

    chartData.push({
      year:          yr,
      label:         `Year ${yr}`,
      blended:       Math.round(totalBlended),
      pureLocal:     Math.round(pureLocalPortfolio),
      pureOffshore:  Math.round(pureOffshorePortfolio),
    });
  }

  /* ── Final values ──────────────────────────── */
  const last             = chartData[chartData.length - 1];
  const finalBlended     = last.blended;
  const finalPureLocal   = last.pureLocal;
  const finalPureOffshore = last.pureOffshore;

  // Total contributions over horizon
  const totalContributed = lumpSum + monthlyContribution * 12 * horizon;

  /* ── Breakeven — when does the blended beat pure local? ───── */
  let breakevenYear = null;
  for (let i = 1; i < chartData.length; i++) {
    const prev = chartData[i - 1];
    const curr = chartData[i];
    if (prev.blended <= prev.pureLocal && curr.blended > curr.pureLocal) {
      breakevenYear = curr.year;
      break;
    }
  }

  /* ── Winner: blended vs pure local ─────────── */
  const delta      = Math.abs(finalBlended - finalPureLocal);
  const deltaShort = fmtRandShort(delta);

  const blendedWins = finalBlended > finalPureLocal;
  const winner      = blendedWins ? "Offshore-blended" : "Local only";

  let verdict;
  if (blendedWins) {
    verdict = breakevenYear
      ? `Your ${offshoreAllocation}% offshore allocation pulls ahead in year ${breakevenYear} and ends ${deltaShort} richer than a local-only portfolio — rand depreciation and global growth more than offset local market returns.`
      : `A ${offshoreAllocation}% offshore allocation builds ${deltaShort} more than a fully local portfolio over ${horizon} years, driven by currency tailwinds and global diversification.`;
  } else {
    verdict = `At your inputs, a local-only portfolio ends ${deltaShort} ahead of your ${offshoreAllocation}% offshore blend over ${horizon} years. Strong JSE returns outweigh the additional currency and offshore return benefit at this allocation.`;
  }

  return {
    blended: {
      finalValue:        Math.round(finalBlended),
      finalValueFmt:     fmtRand(finalBlended),
      totalContributed:  Math.round(totalContributed),
      totalContributedFmt: fmtRand(totalContributed),
      blendedReturnPct:  blendedReturn.toFixed(2),
      localShare:        `${localAllocation}%`,
      offshoreShare:     `${offshoreAllocation}%`,
    },
    pureLocal: {
      finalValue:    Math.round(finalPureLocal),
      finalValueFmt: fmtRand(finalPureLocal),
      returnPct:     localNet.toFixed(2),
    },
    pureOffshore: {
      finalValue:    Math.round(finalPureOffshore),
      finalValueFmt: fmtRand(finalPureOffshore),
      returnPct:     offshoreNetZar.toFixed(2),
    },
    winner,
    verdict,
    breakevenYear,
    chart: chartData,
    inputs: {
      horizon, monthlyContribution, lumpSum, localReturn, offshoreReturn,
      randDepreciation, taxRate, offshoreAllocation,
    },
  };
}

/* ── Nudge definitions for OffshoreSim ─────────────────────── */
export const OFFSHORE_NUDGES = [
  {
    id: "no_offshore_exposure",
    severity: "warn",
    condition: ({ offshoreAllocation }) => offshoreAllocation === 0,
    message:
      "A 0% offshore allocation means your entire portfolio is exposed to rand risk. South Africa makes up less than 0.5% of global market capitalisation — a fully local portfolio concentrates both currency and country risk.",
  },
  {
    id: "too_much_offshore",
    severity: "warn",
    condition: ({ offshoreAllocation }) => offshoreAllocation > 75,
    message:
      "South African residents are subject to SARS exchange control limits on offshore investment. Most retail investors can externalise up to R10m per year with tax clearance — confirm your allowance before committing to a heavy offshore tilt.",
  },
  {
    id: "low_contribution",
    severity: "info",
    condition: ({ monthlyContribution, monthlyIncome }) =>
      monthlyIncome > 0 && monthlyContribution / monthlyIncome < 0.10,
    message:
      "Your monthly investment contribution is below 10% of your income. Most financial planners recommend saving at least 15% of gross income for long-term wealth building — increasing contributions even slightly has an outsized compounding effect.",
  },
  {
    id: "high_rand_depreciation",
    severity: "info",
    condition: ({ randDepreciation }) => randDepreciation >= 8,
    message:
      "An 8%+ annual rand depreciation assumption is aggressive, though not historically unprecedented. At this rate, offshore investments receive a significant currency tailwind that can dominate the total return calculation — stress-test with a lower figure too.",
  },
  {
    id: "low_tax_rate",
    severity: "info",
    condition: ({ taxRate }) => taxRate < 5,
    message:
      "A tax drag below 5% may underestimate the real impact. SA investors face withholding tax on foreign dividends (20%), dividends tax on local payouts (20%), and CGT on disposals. Consider using a tax-efficient wrapper like a TFSA to reduce this drag.",
  },
  {
    id: "short_horizon",
    severity: "info",
    condition: ({ horizon }) => horizon <= 3,
    message:
      "Short investment horizons amplify sequence-of-returns risk. Currency swings and market volatility have a larger impact over 3 years than over 10. A shorter horizon generally warrants a more conservative, locally-anchored allocation.",
  },
];