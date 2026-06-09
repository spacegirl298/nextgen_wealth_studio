// PropertySim.jsx - Main container
import { useState, useMemo, useEffect } from "react";
import PropertyInputs from "./PropertyInputs";
import ComparisonChart from "./ComparisonChart";
import StudioVerdict from "./StudioVerdict";
import { useLocalStorage } from "../../../../hooks/userLocalStorage";
import { useNudges } from "../../../../hooks/useNudges";
import { nudgeDefinitions } from "../../../../utils/nudgeDefinitions";
import styles from "../../Studios.module.css";

export default function PropertySim() {
  // All state with localStorage persistence
  const [timeHorizon, setTimeHorizon] = useLocalStorage("prop_timeHorizon", 5);
  const [propGrowthRate, setPropGrowthRate] = useLocalStorage("prop_growthRate", 5);
  const [purchasePrice, setPurchasePrice] = useLocalStorage("prop_purchasePrice", 1500000);
  const [depositPercent, setDepositPercent] = useLocalStorage("prop_depositPercent", 10);
  const [interestRate, setInterestRate] = useLocalStorage("prop_interestRate", 11.25);
  const [bondTerm, setBondTerm] = useLocalStorage("prop_bondTerm", 20);
  const [monthlyLevies, setMonthlyLevies] = useLocalStorage("prop_monthlyLevies", 1200);
  const [monthlyRent, setMonthlyRent] = useLocalStorage("prop_monthlyRent", 8500);
  const [rentalIncrease, setRentalIncrease] = useLocalStorage("prop_rentalIncrease", 7);
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage("prop_monthlyIncome", 35000);
  const [savings, setSavings] = useLocalStorage("prop_savings", 150000);
  const [dismissedNudges, setDismissedNudges] = useLocalStorage("prop_dismissedNudges", []);

  // Calculate deposit amount
  const depositAmount = purchasePrice * (depositPercent / 100);
  
  // Calculate transfer duty (SA brackets 2025)
  const calculateTransferDuty = (price) => {
    if (price <= 1100000) return 0;
    if (price <= 1350000) return (price - 1100000) * 0.03;
    if (price <= 1750000) return 7500 + (price - 1350000) * 0.06;
    if (price <= 2250000) return 31500 + (price - 1750000) * 0.08;
    if (price <= 2750000) return 71500 + (price - 2250000) * 0.09;
    if (price <= 3250000) return 116500 + (price - 2750000) * 0.10;
    if (price <= 3750000) return 166500 + (price - 3250000) * 0.11;
    return 221500 + (price - 3750000) * 0.12;
  };
  
  const transferDuty = calculateTransferDuty(purchasePrice);
  const bondRegistrationCost = purchasePrice * 0.015;
  const totalBuyUpfront = depositAmount + transferDuty + bondRegistrationCost;

  // Calculate monthly bond payment
  const calculateBondPayment = (loanAmount, rate, termYears) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = termYears * 12;
    if (loanAmount <= 0 || monthlyRate === 0) return 0;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };
  
  const loanAmount = purchasePrice - depositAmount;
  const monthlyBondPayment = calculateBondPayment(loanAmount, interestRate, bondTerm);
  const monthlyBuyCost = monthlyBondPayment + monthlyLevies + (purchasePrice * 0.01 / 12); // +1% maintenance annually

  // Calculate projections over time horizon
  const calculateProjections = () => {
    const years = timeHorizon;
    const months = years * 12;
    
    let buyResults = [];
    let rentResults = [];
    let buyNetWorth = 0;
    let rentNetWorth = totalBuyUpfront; // Invest upfront savings if renting
    let cumulativeBuyCost = totalBuyUpfront;
    let cumulativeRentCost = 0;
    let crossoverYear = null;
    
    const propertyValueGrowth = 1 + (propGrowthRate / 100);
    const rentInflationRate = 1 + (rentalIncrease / 100);
    const investmentReturnRate = 1 + (0.10 / 12); // 10% annual return on investments
    
    for (let year = 1; year <= years; year++) {
      // Buying calculations
      const propertyValue = purchasePrice * Math.pow(propertyValueGrowth, year);
      
      // Calculate remaining bond balance
      const monthsPaid = year * 12;
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = bondTerm * 12;
      let bondBalance = loanAmount;
      if (monthsPaid < totalPayments && monthlyRate > 0) {
        bondBalance = loanAmount * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, monthsPaid)) / 
                     (Math.pow(1 + monthlyRate, totalPayments) - 1);
      } else if (monthsPaid >= totalPayments) {
        bondBalance = 0;
      }
      
      const equity = propertyValue - bondBalance;
      const totalInterestPaid = (monthlyBondPayment * monthsPaid) - (loanAmount - bondBalance);
      
      // Yearly costs
      const yearlyBuyCost = (monthlyBuyCost * 12);
      cumulativeBuyCost += yearlyBuyCost;
      
      buyResults.push({
        year,
        propertyValue,
        bondBalance,
        equity,
        totalInterestPaid,
        totalCost: cumulativeBuyCost,
        netWorth: equity,
      });
      
      // Renting calculations
      const yearlyRent = monthlyRent * Math.pow(rentInflationRate, year - 1) * 12;
      cumulativeRentCost += yearlyRent;
      
      // Invest the difference between buying cost and rent
      const monthlyDiff = Math.max(0, monthlyBuyCost - (yearlyRent / 12));
      for (let m = 0; m < 12; m++) {
        rentNetWorth = rentNetWorth * investmentReturnRate + monthlyDiff;
      }
      
      rentResults.push({
        year,
        yearlyRent,
        cumulativeRent: cumulativeRentCost,
        netWorth: rentNetWorth,
        totalCost: cumulativeRentCost,
      });
      
      // Check for crossover (buying net worth > renting net worth)
      if (crossoverYear === null && equity > rentNetWorth) {
        crossoverYear = year;
      }
    }
    
    return { buyResults, rentResults, crossoverYear };
  };
  
  const { buyResults, rentResults, crossoverYear } = useMemo(() => calculateProjections(), 
    [timeHorizon, purchasePrice, depositPercent, interestRate, bondTerm, monthlyLevies, 
     monthlyRent, rentalIncrease, propGrowthRate, totalBuyUpfront, monthlyBuyCost, loanAmount]);
  
  const finalBuyNetWorth = buyResults[buyResults.length - 1]?.netWorth || 0;
  const finalRentNetWorth = rentResults[rentResults.length - 1]?.netWorth || 0;
  const wealthDifference = Math.abs(finalBuyNetWorth - finalRentNetWorth);
  const buyingBetter = finalBuyNetWorth > finalRentNetWorth;
  
  // Context for nudges
  const metrics = {
    timeHorizon,
    monthlyBuyCost,
    monthlyRent,
    monthlyIncome,
    savings,
    depositPercent,
    depositAmount,
    loanToValue: loanAmount / purchasePrice,
    interestRate,
    monthlyBuyToIncome: monthlyBuyCost / monthlyIncome,
    monthlyRentToIncome: monthlyRent / monthlyIncome,
    buyingBetter,
    crossoverYear,
    propGrowthRate,
    rentalIncrease,
  };
  
  const { activeNudges, dismissNudge } = useNudges(
    nudgeDefinitions,
    metrics,
    { storageKey: "prop_nudges" },
    "prop_nudges_dismissed"
  );
  
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Property Studio</h1>
        <p className={styles.heroSub}>
          Compare buying vs renting in South Africa with real-time calculations
        </p>
      </div>
      
      {/* Inputs Section */}
      <PropertyInputs
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        propGrowthRate={propGrowthRate}
        setPropGrowthRate={setPropGrowthRate}
        purchasePrice={purchasePrice}
        setPurchasePrice={setPurchasePrice}
        depositPercent={depositPercent}
        setDepositPercent={setDepositPercent}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        bondTerm={bondTerm}
        setBondTerm={setBondTerm}
        monthlyLevies={monthlyLevies}
        setMonthlyLevies={setMonthlyLevies}
        monthlyRent={monthlyRent}
        setMonthlyRent={setMonthlyRent}
        rentalIncrease={rentalIncrease}
        setRentalIncrease={setRentalIncrease}
        monthlyIncome={monthlyIncome}
        setMonthlyIncome={setMonthlyIncome}
        savings={savings}
        setSavings={setSavings}
      />
      
      {/* Chart Section */}
      <ComparisonChart
        buyData={buyResults}
        rentData={rentResults}
        crossoverYear={crossoverYear}
        timeHorizon={timeHorizon}
      />
      
      {/* Nudges Section */}
      {activeNudges.length > 0 && (
        <div className={styles.nudgesContainer}>
          {activeNudges.map((nudge) => (
            <div key={nudge.id} className={`${styles.nudgeCard} ${styles[nudge.severity]}`}>
              <div className={styles.nudgeContent}>
                <span className={styles.nudgeIcon}>{nudge.icon}</span>
                <div className={styles.nudgeText}>
                  <strong>{nudge.title}</strong>
                  <p>{nudge.message}</p>
                </div>
              </div>
              <button 
                className={styles.nudgeDismiss}
                onClick={() => dismissNudge(nudge.id)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Verdict Section */}
      <StudioVerdict
        buyingBetter={buyingBetter}
        wealthDifference={wealthDifference}
        timeHorizon={timeHorizon}
        finalBuyNetWorth={finalBuyNetWorth}
        finalRentNetWorth={finalRentNetWorth}
        monthlyBuyCost={monthlyBuyCost}
        monthlyRent={monthlyRent}
        totalInterestPaid={buyResults[buyResults.length - 1]?.totalInterestPaid || 0}
        equity={buyResults[buyResults.length - 1]?.equity || 0}
        totalRentPaid={rentResults[rentResults.length - 1]?.totalCost || 0}
        transferDuty={transferDuty}
        bondRegistrationCost={bondRegistrationCost}
        depositAmount={depositAmount}
        loanAmount={loanAmount}
        crossoverYear={crossoverYear}
        propGrowthRate={propGrowthRate}
      />
    </div>
  );
}