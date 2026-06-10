/**
 * CarSim.jsx
 * Luxury Car vs Investing the Difference simulation lab.
 *
 * Architecture:
 *   - Shared profile state (income, savings) is read from SimContext.
 *   - Car-specific inputs live in local state.
 *   - All results computed live via useMemo — no calculate button needed.
 *   - Contextual nudges fire against live metrics via useNudges.
 *   - Sub-components: CarInputs, CarChart, CarVerdict.
 */
import { useEffect, useState, useMemo } from "react";
import styles from "../../Studios.module.css";

import { useSimProfile } from "../../components/SimContext";
import { useNudges } from "../../../../hooks/useNudges";
import { NudgeBar } from "../../components/SimUI";

import { calcCar, CAR_NUDGES } from "../../utils/LuxuryCalculations";
import CarInputs from "./LuxuryInputs";
import CarChart from "./LuxuryChart";
import CarVerdict from "./LuxuryVerdict";

const LEARN_CONTENT = `
The question isn't whether you can afford the repayment — it's what that money could become if it went to work instead. 
A luxury car delivers real value: comfort, safety, status, and reliability. But it is a depreciating asset that loses 
value from the moment it leaves the showroom, while simultaneously generating ongoing costs in insurance, fuel, and servicing.

The investing path models an alternative: take everything you would spend on the car — the deposit, the monthly finance 
repayment, the insurance, the fuel, the service — and invest that equivalent amount in a diversified portfolio each month. 
Compounding means the gap between the two paths typically widens every year.

Methodology: The car path applies a South African depreciation schedule (Year 1: ~20%, Year 2–3: ~12%, Year 4+: ~8%) 
to estimate residual value annually, and tracks net position as residual value minus outstanding finance balance. 
Monthly running costs include insurance, fuel, and a monthly share of annual servicing. The investing path deposits 
your cash upfront and adds the car-equivalent monthly outlay to a compounding portfolio each month.
`;

export default function CarSim() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const [learnOpen, setLearnOpen] = useState(false);

  const { profile, setProfile } = useSimProfile();
  const { monthlyIncome, savings } = profile;

  /* Car-specific state */
  const [horizon,          setHorizon]          = useState(5);
  const [carPrice,         setCarPrice]          = useState(850_000);
  const [deposit,          setDeposit]           = useState(150_000);
  const [financeRate,      setFinanceRate]        = useState(11.25);
  const [financeTerm,      setFinanceTerm]        = useState(5);
  const [monthlyInsurance, setMonthlyInsurance]   = useState(4_500);
  const [monthlyFuel,      setMonthlyFuel]        = useState(3_000);
  const [annualService,    setAnnualService]      = useState(12_000);
  const [investReturn,     setInvestReturn]       = useState(10);

  const results = useMemo(
    () =>
      calcCar({
        horizon,
        carPrice,
        deposit,
        financeRate,
        financeTerm,
        monthlyInsurance,
        monthlyFuel,
        annualService,
        investReturn,
      }),
    [horizon, carPrice, deposit, financeRate, financeTerm, monthlyInsurance, monthlyFuel, annualService, investReturn],
  );

  const nudgeMetrics = useMemo(
    () => ({
      financePayment:  results.car.monthlyPayment,
      monthlyIncome,
      deposit,
      carPrice,
      financeTerm,
      horizon,
      monthlyInsurance,
      monthlyFuel,
      annualService,
      financeRate,
    }),
    [results, monthlyIncome, deposit, carPrice, financeTerm, horizon, monthlyInsurance, monthlyFuel, annualService, financeRate],
  );

  const { activeNudges, dismissNudge } = useNudges(
    CAR_NUDGES,
    nudgeMetrics,
    {},
    "car_nudges_dismissed_v1",
  );

  const { car, investing } = results;

  const TABLE_ROWS = [
    ["Monthly Finance Repayment",  `R ${car.monthlyPayment.toLocaleString("en-ZA")}`,  "—"],
    ["Monthly Running Costs",       `R ${car.monthlyRunning.toLocaleString("en-ZA")}`,  "—"],
    ["Total Cash Outlay",           car.cashOutlayFmt,                                   investing.cashOutlayFmt],
    ["Residual / Portfolio Value",  car.residualFmt,                                     investing.portfolioFmt],
    [`Net Worth at Year ${horizon}`, car.networthFmt,                                    investing.networthFmt],
    ["Liquidity",                  "Low",                                                "High"],
  ];

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Luxury Car vs Investing</h1>
        <p className={styles.heroSub}>
          Compare the real financial cost of owning a luxury vehicle against investing the equivalent amount.
          Adjust any input — results update instantly.
        </p>
      </div>

      <div className={styles.learnCard}>
        <button className={styles.learnToggle} onClick={() => setLearnOpen(!learnOpen)}>
          How this works
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="12" height="12" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            {LEARN_CONTENT.trim().split("\n\n").map((para, i) => (
              <p key={i} style={{ margin: i === 0 ? 0 : "0.75rem 0 0" }}>{para.trim()}</p>
            ))}
          </div>
        )}
      </div>

      <NudgeBar nudges={activeNudges} onDismiss={dismissNudge} />

      <CarInputs
        monthlyIncome={monthlyIncome}       setMonthlyIncome={(v) => setProfile("monthlyIncome", v)}
        savings={savings}                   setSavings={(v) => setProfile("savings", v)}
        horizon={horizon}                   setHorizon={setHorizon}
        carPrice={carPrice}                 setCarPrice={setCarPrice}
        deposit={deposit}                   setDeposit={setDeposit}
        financeRate={financeRate}           setFinanceRate={setFinanceRate}
        financeTerm={financeTerm}           setFinanceTerm={setFinanceTerm}
        monthlyInsurance={monthlyInsurance} setMonthlyInsurance={setMonthlyInsurance}
        monthlyFuel={monthlyFuel}           setMonthlyFuel={setMonthlyFuel}
        annualService={annualService}       setAnnualService={setAnnualService}
        investReturn={investReturn}         setInvestReturn={setInvestReturn}
      />

      <CarChart chartData={results.chart} breakevenYear={results.breakevenYear} />

      <div className={styles.resultsGrid}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
            After {horizon} {horizon === 1 ? "year" : "years"}
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}></th>
                <th>Luxury Car</th>
                <th>Investing</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(([label, carVal, investVal]) => (
                <tr key={label}>
                  <td className={styles.rowLabel}>{label}</td>
                  <td style={{ textAlign: "right" }}>{carVal}</td>
                  <td style={{ textAlign: "right" }}>{investVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.verdictCol}>
          <CarVerdict results={results} horizon={horizon} />
        </div>
      </div>
    </div>
  );
}