/**
 * useSnapshotStore.js
 * 
 * Centralised state for the Money Snapshot feature.
 * All data is auto-saved to localStorage on every change —
 * no manual save required, and it persists across pages/tabs.
 *
 * Import anywhere on your site:
 *   import { useSnapshotStore } from "./useSnapshotStore";
 *
 * The hook returns { state, update, derived, history, saveSnapshot }
 * 
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "../context/UserContext";

//  Storage keys (versioned so old data doesn't break new shape) 
export const STORAGE_KEY     = "moneySnapshot_v3";
export const HISTORY_KEY     = "moneySnapshot_history_v3";
export const DISMISSED_KEY   = "moneySnapshot_dismissed_nudges_v3";

//  SA TAX 2025/26 
const TAX_BRACKETS = [
  { min: 0,        max: 237100,   base: 0,      rate: 0.18 },
  { min: 237100,   max: 370500,   base: 42678,  rate: 0.26 },
  { min: 370500,   max: 512800,   base: 77362,  rate: 0.31 },
  { min: 512800,   max: 673000,   base: 121475, rate: 0.36 },
  { min: 673000,   max: 857900,   base: 179147, rate: 0.39 },
  { min: 857900,   max: 1817000,  base: 251258, rate: 0.41 },
  { min: 1817000,  max: Infinity, base: 644489, rate: 0.45 },
];
const PRIMARY_REBATE      = 17235;
const UIF_RATE            = 0.01;
const UIF_CAP_MONTHLY     = 177.12;

export function calcMedicalAidCredit(dependants = 0) {
  if (dependants === 0) return 364;
  if (dependants === 1) return 364 + 246;
  return 364 + 246 + (dependants - 1) * 246;
}

export function calcAnnualTax(annualGross) {
  if (annualGross <= 0) return 0;
  const bracket = TAX_BRACKETS.find(b => annualGross <= b.max) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return Math.max(0, bracket.base + (annualGross - bracket.min) * bracket.rate - PRIMARY_REBATE);
}

export function calcTaxBreakdown(grossMonthly, medDependants = 0) {
  if (!grossMonthly || grossMonthly <= 0) {
    return { paye: 0, uif: 0, medCredit: 0, netIncome: 0, effectiveRate: 0, annualTax: 0, annualGross: 0 };
  }
  const annualGross       = grossMonthly * 12;
  const annualMedCredit   = calcMedicalAidCredit(medDependants) * 12;
  const annualTaxBefore   = calcAnnualTax(annualGross);
  const annualTax         = Math.max(0, annualTaxBefore - annualMedCredit);
  const monthlyPaye       = annualTax / 12;
  const monthlyUif        = Math.min(grossMonthly * UIF_RATE, UIF_CAP_MONTHLY);
  const netIncome         = grossMonthly - monthlyPaye - monthlyUif;
  const effectiveRate     = grossMonthly > 0 ? (monthlyPaye / grossMonthly) * 100 : 0;
  return { paye: monthlyPaye, uif: monthlyUif, medCredit: calcMedicalAidCredit(medDependants), netIncome, effectiveRate, annualTax, annualGross };
}

//  METRICS 
export function calcMetrics({ netIncome, totalExpenses, totalDebtPayments, emergencyFund, totalMonthlySavings }) {
  const dti              = netIncome > 0 ? (totalDebtPayments / netIncome) * 100 : 0;
  const savingsRate      = netIncome > 0 ? (totalMonthlySavings / netIncome) * 100 : 0;
  const disposable       = netIncome - totalExpenses - totalMonthlySavings;
  const emergencyMonths  = totalExpenses > 0 ? emergencyFund / totalExpenses : 0;
  let health = "critical";
  if (dti < 36 && savingsRate >= 10 && emergencyMonths >= 3) health = "healthy";
  else if (dti < 50 && savingsRate >= 5) health = "at-risk";
  return { dti, savingsRate, disposable, emergencyMonths, health };
}

//  HEALTH SCORE 
export function calcHealthScore(metrics, tfsa, disposable) {
  let score = 0;
  if (metrics.dti < 36) score += 25; else if (metrics.dti < 50) score += 12;
  if (metrics.savingsRate >= 15) score += 25; else if (metrics.savingsRate >= 5) score += 12;
  if (metrics.emergencyMonths >= 3) score += 25; else if (metrics.emergencyMonths >= 1) score += 12;
  if (disposable > 0) score += 15;
  if (tfsa > 0) score += 10;
  return Math.min(100, score);
}

//  NUDGES 
export const ALL_NUDGES = [
  { id: "dti_high",       condition: (m)    => m.dti > 50,                                        message: "⚠️ Your debt is consuming over half your income. Explore debt consolidation options.", severity: "danger"  },
  { id: "no_emergency",   condition: (m)    => m.emergencyMonths < 1,                              message: "🚨 No emergency fund detected. Start with just R500/month in a separate account.",   severity: "danger"  },
  { id: "savings_low",    condition: (m)    => m.savingsRate < 5,                                   message: "💡 Savings below 5%. Even R200/month into a TFSA compounds significantly over time.", severity: "warning" },
  { id: "tfsa_unused",    condition: (m, d) => d.tfsa < 36000,                                     message: "📈 You still have TFSA room this year. Tax-free growth is one of SA's best financial tools.", severity: "info" },
  { id: "housing_high",   condition: (m, d) => d.takeHome > 0 && d.housing / d.takeHome > 0.40,   message: "🏠 Housing exceeds 40% of take-home pay. This limits your ability to save or cover unexpected costs.", severity: "warning" },
];

//  DEFAULT STATE 
export const DEFAULT_STATE = {
  // Income
  salary:               0,
  investIncome:         0,
  rentalIncome:         0,
  bonuses:              0,
  sideIncome:           0,
  medDependants:        0,
  // Housing
  rentBond:             0,
  levies:               0,
  rates:                0,
  // Mobility
  carPayment:           0,
  petrol:               0,
  insurance:            0,
  // Lifestyle
  medicalAid:           0,
  groceries:            0,
  dining:               0,
  subscriptions:        0,
  entertainment:        0,
  shopping:             0,
  // Debt
  studentLoan:          0,
  personalLoan:         0,
  retailAccounts:       0,
  creditCard:           0,
  totalDebt:            0,
  minPayments:          0,
  avgInterest:          0,
  // Savings
  emergencyFund:        0,
  tfsa:                 0,
  preAnnuity:           0,
  offshoreInv:          0,
  localInv:             0,
  monthlySavingsContrib: 0,
  // Goals
  goals: [
    { name: "Emergency Fund", target: 0, saved: 0, monthly: 0 },
    { name: "TFSA", target: 0, saved: 0, monthly: 0 },
    { name: "Travel Fund", target: 0, saved: 0, monthly: 0 },
    { name: "Retirement Annuity", target: 0, saved: 0, monthly: 0 },
  ],
};

//  STORAGE HELPERS 
function read(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Unable to persist snapshot data", error);
  }
}

//  MAIN HOOK 
export function useSnapshotStore() {
  const { getUserStorageKey } = useUser();
  const storageKey = getUserStorageKey ? getUserStorageKey(STORAGE_KEY) : STORAGE_KEY;
  const historyKey = getUserStorageKey ? getUserStorageKey(HISTORY_KEY) : HISTORY_KEY;
  const dismissedKey = getUserStorageKey ? getUserStorageKey(DISMISSED_KEY) : DISMISSED_KEY;

  const [state, setState] = useState(() => {
    const saved = read(storageKey, null);
    return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
  });

  const [history, setHistory]         = useState(() => read(historyKey, []));
  const [dismissed, setDismissed]     = useState(() => read(dismissedKey, []));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-save state to localStorage on every change
  useEffect(() => {
    write(storageKey, state);
  }, [storageKey, state]);

  const [lastSaved, setLastSaved] = useState(new Date());

useEffect(() => {
  write(storageKey, state);
  setLastSaved(new Date());   // ← only updates when state actually changes
}, [storageKey, state]);

  // Granular updater — pass a partial object or a key/value pair
  const update = useCallback((keyOrPatch, value) => {
    setState(prev => {
      if (typeof keyOrPatch === "object") return { ...prev, ...keyOrPatch };
      return { ...prev, [keyOrPatch]: value };
    });
  }, []);

  // Update a goal by index
  const updateGoal = useCallback((index, field, value) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === index ? { ...g, [field]: value } : g),
    }));
  }, []);

  // Dismiss a nudge
  const dismissNudge = useCallback((id) => {
    setDismissed(prev => {
      const next = [...prev, id];
      write(dismissedKey, next);
      return next;
    });
  }, [dismissedKey]);

  // Save a named snapshot to history
  const saveSnapshot = useCallback(() => {
    const tax        = calcTaxBreakdown(state.salary, state.medDependants);
    const grossMonthly = state.salary + state.investIncome + state.rentalIncome + state.bonuses + state.sideIncome;
    const housing    = state.rentBond + state.levies + state.rates;
    const mobility   = state.carPayment + state.petrol + state.insurance;
    const lifestyle  = state.medicalAid + state.groceries + state.dining + state.subscriptions + state.entertainment + state.shopping;
    const debtPay    = state.studentLoan + state.personalLoan + state.retailAccounts + state.creditCard;
    const totalExp   = housing + mobility + lifestyle + debtPay;
    const totalSav   = state.emergencyFund + state.tfsa + state.preAnnuity + state.offshoreInv + state.localInv;
    const metrics    = calcMetrics({ netIncome: tax.netIncome, totalExpenses: totalExp, totalDebtPayments: debtPay, emergencyFund: state.emergencyFund, totalMonthlySavings: state.monthlySavingsContrib });
    const hs         = calcHealthScore(metrics, state.tfsa, metrics.disposable);

    const snap = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }),
      grossMonthly,
      takeHome: tax.netIncome,
      paye: tax.paye,
      totalMonthlyExpenses: totalExp,
      totalSavings: totalSav,
      disposable: metrics.disposable,
      healthScore: hs,
      dti: metrics.dti,
      savingsRate: metrics.savingsRate,
      emergencyMonths: metrics.emergencyMonths,
    };
    const updated = [snap, ...history].slice(0, 12);
    setHistory(updated);
    write(historyKey, updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [state, history, historyKey]);

  //  All derived values, computed once here 
  const derived = useMemo(() => {
    const { salary, investIncome, rentalIncome, bonuses, sideIncome, medDependants,
      rentBond, levies, rates, carPayment, petrol, insurance,
      medicalAid, groceries, dining, subscriptions, entertainment, shopping,
      studentLoan, personalLoan, retailAccounts, creditCard,
      totalDebt, minPayments, avgInterest,
      emergencyFund, tfsa, preAnnuity, offshoreInv, localInv,
      monthlySavingsContrib, goals } = state;

    const grossMonthly  = salary + investIncome + rentalIncome + bonuses + sideIncome;
    const tax           = calcTaxBreakdown(salary, medDependants);
    const takeHome      = tax.netIncome;
    const paye          = tax.paye;
    const uif           = tax.uif;

    const housing       = rentBond + levies + rates;
    const mobility      = carPayment + petrol + insurance;
    const lifestyle     = medicalAid + groceries + dining + subscriptions + entertainment + shopping;
    const debtPayments  = studentLoan + personalLoan + retailAccounts + creditCard;
    const totalExpenses = housing + mobility + lifestyle + debtPayments;
    const totalSavings  = emergencyFund + tfsa + preAnnuity + offshoreInv + localInv;
    const tfsaUsePct    = Math.min((tfsa / 500000) * 100, 100);

    const metrics = calcMetrics({
      netIncome: takeHome,
      totalExpenses,
      totalDebtPayments: debtPayments,
      emergencyFund,
      totalMonthlySavings: monthlySavingsContrib,
    });
    const healthScore = calcHealthScore(metrics, tfsa, metrics.disposable);

    const fmt  = n => `R${Math.round(n).toLocaleString()}`;
    const pct  = (v, total) => total > 0 ? Math.round((v / total) * 100) : 0;

    return {
      grossMonthly, takeHome, paye, uif, tax,
      housing, mobility, lifestyle, debtPayments, totalExpenses, totalSavings,
      tfsaUsePct, metrics, healthScore, goals,
      totalDebt, minPayments, avgInterest,
      fmt, pct,
    };
  }, [state]);

  //  Active nudges 
  const activeNudges = useMemo(() =>
    ALL_NUDGES.filter(n =>
      !dismissed.includes(n.id) &&
      n.condition(derived.metrics, { tfsa: state.tfsa, housing: derived.housing, takeHome: derived.takeHome })
    ),
    [derived, dismissed, state.tfsa]
  );

  return { state, update, updateGoal, derived, history, activeNudges, dismissNudge, saveSnapshot, saveSuccess, lastSaved };
}