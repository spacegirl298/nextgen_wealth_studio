import React, { createContext, useState, useContext, useMemo } from "react";

const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial must be used within FinancialProvider");
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  // Income
  const [salary, setSalary] = useState(46000);
  const [offshoreIncome, setOffshoreIncome] = useState(0);
  const [investIncome, setInvestIncome] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [sideIncome, setSideIncome] = useState(0);

  // Expenses
  const [rentBond, setRentBond] = useState(12500);
  const [medicalAid, setMedicalAid] = useState(3000);
  const [insurance, setInsurance] = useState(1500);
  const [studentLoan, setStudentLoan] = useState(0);
  const [personalLoan, setPersonalLoan] = useState(0);
  const [subscriptions, setSubscriptions] = useState(500);
  const [retailAccounts, setRetailAccounts] = useState(0);
  const [debtRepayments, setDebtRepayments] = useState(0);
  const [groceries, setGroceries] = useState(5000);
  const [dining, setDining] = useState(2000);
  const [transport, setTransport] = useState(3000);
  const [entertainment, setEntertainment] = useState(2000);
  const [shopping, setShopping] = useState(2000);
  const [totalDebt, setTotalDebt] = useState(160000);
  const [minPayments, setMinPayments] = useState(2000);
  const [avgInterest, setAvgInterest] = useState(12);

  // Savings
  const [emergencyFund, setEmergencyFund] = useState(20000);
  const [tfsa, setTfsa] = useState(15000);
  const [preAnnuity, setPreAnnuity] = useState(80000);
  const [offshoreInv, setOffshoreInv] = useState(10000);
  const [localInv, setLocalInv] = useState(25000);

  // Goals
  const [goals, setGoals] = useState([
    { name: "Debt Free", target: 50000, saved: 10000, monthly: 2000 },
    { name: "Emergency Fund", target: 30000, saved: 20000, monthly: 1000 },
    { name: "Travel Savings", target: 20000, saved: 5000, monthly: 500 },
    { name: "Retirement Annuity", target: 500000, saved: 80000, monthly: 3000 },
  ]);

  // SARS Tax Tables
  function calcPAYE(annualIncome) {
    const brackets = [
      { limit: 237100, rate: 0.18, base: 0 },
      { limit: 370500, rate: 0.26, base: 42678 },
      { limit: 512800, rate: 0.31, base: 77362 },
      { limit: 673000, rate: 0.36, base: 121475 },
      { limit: 857900, rate: 0.39, base: 179147 },
      { limit: 1817000, rate: 0.41, base: 251258 },
      { limit: Infinity, rate: 0.45, base: 644489 },
    ];
    const rebate = 17235;
    let tax = 0;
    for (let i = 0; i < brackets.length; i++) {
      const prev = i === 0 ? 0 : brackets[i - 1].limit;
      if (annualIncome <= brackets[i].limit) {
        tax = brackets[i].base + (annualIncome - prev) * brackets[i].rate;
        break;
      }
    }
    return Math.max(0, tax - rebate) / 12;
  }

  // Calculations
  const grossMonthly = useMemo(
    () =>
      salary +
      offshoreIncome +
      investIncome +
      rentalIncome +
      bonuses +
      sideIncome,
    [salary, offshoreIncome, investIncome, rentalIncome, bonuses, sideIncome],
  );

  const paye = useMemo(() => Math.round(calcPAYE(salary * 12)), [salary]);
  const takeHome = useMemo(
    () => Math.round(grossMonthly - paye),
    [grossMonthly, paye],
  );

  const fixedCosts = useMemo(
    () =>
      rentBond +
      medicalAid +
      insurance +
      studentLoan +
      personalLoan +
      subscriptions +
      retailAccounts +
      debtRepayments,
    [
      rentBond,
      medicalAid,
      insurance,
      studentLoan,
      personalLoan,
      subscriptions,
      retailAccounts,
      debtRepayments,
    ],
  );

  const variableSpending = useMemo(
    () => groceries + dining + transport + entertainment + shopping,
    [groceries, dining, transport, entertainment, shopping],
  );

  const totalMonthlyExpenses = useMemo(
    () => fixedCosts + variableSpending,
    [fixedCosts, variableSpending],
  );

  const totalSavings = useMemo(
    () => emergencyFund + tfsa + preAnnuity + offshoreInv + localInv,
    [emergencyFund, tfsa, preAnnuity, offshoreInv, localInv],
  );

  const disposable = useMemo(
    () => Math.max(0, takeHome - fixedCosts - variableSpending),
    [takeHome, fixedCosts, variableSpending],
  );

  // Health Score
  const healthScore = useMemo(() => {
    let score = 0;
    if (emergencyFund >= takeHome * 3) score += 25;
    else score += (emergencyFund / (takeHome * 3)) * 25;
    const debtToIncome = totalDebt / (grossMonthly * 12);
    if (debtToIncome < 0.2) score += 25;
    else if (debtToIncome < 0.4) score += 15;
    else score += 5;
    const savingsRate = totalSavings / Math.max(grossMonthly, 1);
    if (savingsRate >= 0.15) score += 25;
    else score += (savingsRate / 0.15) * 25;
    if (fixedCosts / takeHome < 0.5) score += 25;
    else score += Math.max(0, 25 - (fixedCosts / takeHome - 0.5) * 100);
    return Math.round(Math.min(score, 100));
  }, [
    emergencyFund,
    takeHome,
    totalDebt,
    grossMonthly,
    totalSavings,
    fixedCosts,
  ]);

  const value = {
    // States
    salary,
    setSalary,
    offshoreIncome,
    setOffshoreIncome,
    investIncome,
    setInvestIncome,
    rentalIncome,
    setRentalIncome,
    bonuses,
    setBonuses,
    sideIncome,
    setSideIncome,
    rentBond,
    setRentBond,
    medicalAid,
    setMedicalAid,
    insurance,
    setInsurance,
    studentLoan,
    setStudentLoan,
    personalLoan,
    setPersonalLoan,
    subscriptions,
    setSubscriptions,
    retailAccounts,
    setRetailAccounts,
    debtRepayments,
    setDebtRepayments,
    groceries,
    setGroceries,
    dining,
    setDining,
    transport,
    setTransport,
    entertainment,
    setEntertainment,
    shopping,
    setShopping,
    totalDebt,
    setTotalDebt,
    minPayments,
    setMinPayments,
    avgInterest,
    setAvgInterest,
    emergencyFund,
    setEmergencyFund,
    tfsa,
    setTfsa,
    preAnnuity,
    setPreAnnuity,
    offshoreInv,
    setOffshoreInv,
    localInv,
    setLocalInv,
    goals,
    setGoals,

    grossMonthly,
    totalMonthlyExpenses,
    totalDebt,
    healthScore,
    paye,
    takeHome,
    fixedCosts,
    variableSpending,
    totalSavings,
    disposable,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
