/*
Buy vs Rent studio container.
–	Manages all input state for the studio
–	Passes inputs to calculation functions from constants.js
–	Computes: monthly bond repayment, total cost of buying over N years, total cost of renting over N years
–	Passes computed data to ComparisonChart, StudioVerdict
–	Reads user income from FinancialContext for affordability context
–	Contains educational intro explaining the buy vs rent decision
*/
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../Studios.module.css";

const INFO_CONTENT = {
  "Gross Monthly Income": {
    title: "Gross Monthly Income",
    body: "Your total income before tax and deductions. This helps determine how much of your budget is realistically available for housing costs. A general rule of thumb is to spend no more than 30% of gross income on housing.",
  },
  "Available Monthly Housing Budget": {
    title: "Monthly Housing Budget",
    body: "The maximum you're comfortable spending on housing each month. This covers bond repayments (if buying) or rent (if renting), plus associated costs like levies, rates, and insurance.",
  },
  "Savings Available for Deposit": {
    title: "Savings for Deposit",
    body: "The amount you have saved to put down as a deposit. A larger deposit reduces your bond amount, lowers your monthly repayment, and improves your chances of bond approval. Most South African banks require at least 10% of the purchase price.",
  },
  "Time Horizon": {
    title: "Time Horizon",
    body: "How many years you plan to stay in the property or compare the two options. The longer the horizon, the more buying tends to benefit from capital growth and equity accumulation. Short horizons often favour renting due to high upfront buying costs.",
  },
  "Purchase Price": {
    title: "Purchase Price",
    body: "The full asking price of the property you intend to buy. This determines your bond amount (purchase price minus deposit), transfer duties, and bond registration fees. In Joburg, transfer duty kicks in on properties above R1.1 million.",
  },
  "Bond Interest Rate": {
    title: "Bond Interest Rate",
    body: "The annual interest rate on your home loan. South African banks typically link this to the prime lending rate. As of 2025, prime is around 11.25%. Your rate may be prime minus or plus a margin depending on your credit profile.",
  },
  "Bond Term": {
    title: "Bond Term",
    body: "The number of years over which you repay your home loan. A longer term means lower monthly payments but significantly more interest paid over time. Most South African bonds are over 20 years.",
  },
  "Annual Property Price Growth": {
    title: "Property Price Growth",
    body: "The expected annual percentage increase in your property's value. Joburg's long-run average is around 4–6% per year, though this varies hugely by suburb. High-demand areas like Sandton or Bryanston tend to outperform lower-demand areas.",
  },
  "Monthly Rent": {
    title: "Monthly Rent",
    body: "The current rent you would pay for a comparable property. This is used to calculate total rental outlay over your time horizon and to determine how much of the difference (vs buying costs) could be invested monthly.",
  },
  "Annual Rental Inflation": {
    title: "Annual Rental Inflation",
    body: "The rate at which your rent increases each year. Most Joburg landlords apply annual escalations of 6–10%. Over time, rising rent erodes the initial cost advantage of renting compared to a fixed bond repayment.",
  },
};

const InfoTooltip = ({ field }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const info = INFO_CONTENT[field];

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left - 120,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!info) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.infoIcon}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Info about ${field}`}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <circle
            cx="7"
            cy="7"
            r="6"
            stroke="var(--clr-gold)"
            strokeWidth="1"
          />
          <text
            x="7"
            y="7"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="var(--clr-gold)"
          >
            i
          </text>
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            className={styles.tooltipBox}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              zIndex: 999999,
            }}
            role="tooltip"
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{info.title}</span>
              <button
                className={styles.tooltipClose}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className={styles.tooltipBody}>{info.body}</p>
          </div>,
          document.body,
        )}
    </>
  );
};

const SliderField = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  prefix,
  suffix,
  info,
}) => (
  <div className={styles.fieldRow}>
    <label className={styles.fieldLabel}>{label}</label>
    <div className={styles.sliderWrap}>
      <div className={styles.sliderTrackWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          style={{ "--pct": `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <span className={styles.sliderValue}>
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </span>
      {info && <InfoTooltip field={label} />}
    </div>
  </div>
);

export default function PropertyLab() {
  const [learnOpen, setLearnOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(35000);
  const [housingBudget, setHousingBudget] = useState(10000);
  const [savings, setSavings] = useState(200000);
  const [horizon, setHorizon] = useState(5);
  const [purchasePrice, setPurchasePrice] = useState(1500000);
  const [bondRate, setBondRate] = useState(11.5);
  const [bondTerm, setBondTerm] = useState(20);
  const [priceGrowth, setPriceGrowth] = useState(5);
  const [monthlyRent, setMonthlyRent] = useState(8500);
  const [rentalInflation, setRentalInflation] = useState(6);
  const [results, setResults] = useState(null);

  const runSimulation = () => {
    const years = horizon;
    const monthlyRate = bondRate / 100 / 12;
    const numPayments = bondTerm * 12;
    const deposit = savings;
    const loanAmount = purchasePrice - deposit;
    const bondPayment =
      loanAmount > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;
    const transferCosts = purchasePrice * 0.04;
    const totalBuyCashOutlay = deposit + transferCosts;
    const finalPropertyValue =
      purchasePrice * Math.pow(1 + priceGrowth / 100, years);
    const bondBalance =
      (loanAmount *
        (Math.pow(1 + monthlyRate, numPayments) -
          Math.pow(1 + monthlyRate, years * 12))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const buyNetworth = finalPropertyValue - bondBalance;
    const monthlyBuyCost = bondPayment + (purchasePrice * 0.01) / 12;
    const rentInfRate = rentalInflation / 100;
    let rentCashOutlay = 0;
    let investmentValue = deposit;
    const monthlyInvestReturn = 0.1 / 12;

    for (let m = 0; m < years * 12; m++) {
      const yr = Math.floor(m / 12);
      const currentRent = monthlyRent * Math.pow(1 + rentInfRate, yr);
      rentCashOutlay += currentRent;
      const diff = Math.max(0, monthlyBuyCost - currentRent);
      investmentValue = investmentValue * (1 + monthlyInvestReturn) + diff;
    }

    const rentNetworth = investmentValue;
    const avgRentCost =
      monthlyRent * (1 + ((rentalInflation / 100) * years) / 2);

    setResults({
      renting: {
        cashOutlay: Math.round(rentCashOutlay).toLocaleString(),
        assetValue: "0",
        investmentValue: Math.round(rentNetworth).toLocaleString(),
        networth: Math.round(rentNetworth).toLocaleString(),
        avgMonthlyCost: Math.round(avgRentCost).toLocaleString(),
        flexibility: "High",
        maintenanceRisk: "Low",
      },
      buying: {
        cashOutlay: Math.round(totalBuyCashOutlay).toLocaleString(),
        assetValue: Math.round(finalPropertyValue).toLocaleString(),
        investmentValue: "—",
        networth: Math.round(buyNetworth).toLocaleString(),
        avgMonthlyCost: Math.round(monthlyBuyCost).toLocaleString(),
        flexibility: "Low",
        maintenanceRisk: "High",
      },
      verdict:
        buyNetworth > rentNetworth
          ? `Over ${years} years, buying builds R${Math.round((buyNetworth - rentNetworth) / 1000)}k more wealth than renting — if the property appreciates as projected.`
          : `Over ${years} years, renting and investing the difference builds R${Math.round((rentNetworth - buyNetworth) / 1000)}k more wealth than buying — mainly due to investment returns and lower upfront costs.`,
      winner: buyNetworth > rentNetworth ? "Buying" : "Renting",
    });
  };

  return (
    <div className={styles.page}>
      {/* Back Button */}
      <button
        className={styles.backBtn}
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Property vs Renting in Joburg</h1>
        <p className={styles.heroSub}>
          This simulation lab allows you to explore and compare the financial
          outcomes of renting versus buying in Johannesburg.
        </p>
      </div>

      {/* Learn More */}
      <div className={styles.learnCard}>
        <button
          className={styles.learnToggle}
          onClick={() => setLearnOpen(!learnOpen)}
        >
          Learn More
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            <p>
              When deciding whether to rent or buy in Joburg, the right answer
              depends entirely on your time horizon, savings, and knowledge of
              surprise costs. Buying a property builds long-term wealth through
              equity and capital growth, but requires a large upfront deposit
              and leaves you fully responsible for every repair, bond, levy,
              security upgrade, and municipal rate issue. Renting, on the other
              hand, offers flexibility, predictable monthly costs, and no
              maintenance costs, but your monthly payment builds no equity. In
              Johannesburg specifically, area decline can happen quickly due to
              crime, potholes, or businesses moving, so renters can leave easily
              while owners may take a financial hit.
            </p>
          </div>
        )}
      </div>

      {/* General */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>General</h2>
        <SliderField
          label="Gross Monthly Income"
          min={5000}
          max={200000}
          step={1000}
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          prefix="R "
          info
        />
        <SliderField
          label="Available Monthly Housing Budget"
          min={2000}
          max={60000}
          step={500}
          value={housingBudget}
          onChange={setHousingBudget}
          prefix="R "
          info
        />
        <SliderField
          label="Savings Available for Deposit"
          min={0}
          max={2000000}
          step={10000}
          value={savings}
          onChange={setSavings}
          prefix="R "
          info
        />
        <SliderField
          label="Time Horizon"
          min={1}
          max={30}
          step={1}
          value={horizon}
          onChange={setHorizon}
          suffix=" years"
          info
        />
      </div>

      {/* Buying + Renting */}
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Buying</h2>
          <p className={styles.cardSub}>
            Buying includes bond repayment, property rates, maintenance and
            opportunity cost of deposit. You hold equity but have less
            liquidity.
          </p>
          <SliderField
            label="Purchase Price"
            min={300000}
            max={5000000}
            step={50000}
            value={purchasePrice}
            onChange={setPurchasePrice}
            prefix="R "
            info
          />
          <SliderField
            label="Bond Interest Rate"
            min={7}
            max={20}
            step={0.1}
            value={bondRate}
            onChange={setBondRate}
            suffix="%"
            info
          />
          <SliderField
            label="Bond Term"
            min={5}
            max={30}
            step={1}
            value={bondTerm}
            onChange={setBondTerm}
            suffix=" years"
            info
          />
          <SliderField
            label="Annual Property Price Growth"
            min={0}
            max={15}
            step={0.5}
            value={priceGrowth}
            onChange={setPriceGrowth}
            suffix="%"
            info
          />
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Renting</h2>
          <p className={styles.cardSub}>
            Renting has no maintenance costs or bond risks, but you don't build
            rental value over time.
          </p>
          <SliderField
            label="Monthly Rent"
            min={2000}
            max={40000}
            step={250}
            value={monthlyRent}
            onChange={setMonthlyRent}
            prefix="R "
            info
          />
          <SliderField
            label="Annual Rental Inflation"
            min={0}
            max={15}
            step={0.5}
            value={rentalInflation}
            onChange={setRentalInflation}
            suffix="%"
            info
          />
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaWrap}>
        <button className={styles.ctaBtn} onClick={runSimulation}>
          Run Simulation
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className={styles.resultsGrid}>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
              Buying vs Renting over {horizon} years
            </h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Renting</th>
                  <th>Buying</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Total Cash Outlay",
                    results.renting.cashOutlay,
                    results.buying.cashOutlay,
                    "R",
                  ],
                  [
                    "Asset Value",
                    results.renting.assetValue,
                    results.buying.assetValue,
                    "R",
                  ],
                  [
                    "Investment/Savings Value",
                    results.renting.investmentValue,
                    results.buying.investmentValue,
                    "R",
                  ],
                  [
                    "Networth",
                    results.renting.networth,
                    results.buying.networth,
                    "R",
                  ],
                  [
                    "Monthly Average Cost",
                    results.renting.avgMonthlyCost,
                    results.buying.avgMonthlyCost,
                    "R",
                  ],
                  [
                    "Flexibility",
                    results.renting.flexibility,
                    results.buying.flexibility,
                    "",
                  ],
                  [
                    "Maintenance Risk",
                    results.renting.maintenanceRisk,
                    results.buying.maintenanceRisk,
                    "",
                  ],
                ].map(([label, rent, buy, prefix]) => (
                  <tr key={label}>
                    <td className={styles.rowLabel}>{label}</td>
                    <td>
                      {prefix}
                      {rent}
                    </td>
                    <td>
                      {prefix}
                      {buy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.verdictCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Studio Verdict</h2>
              <div className={styles.verdictWinner}>{results.winner} wins</div>
              <p className={styles.verdictText}>{results.verdict}</p>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Things to Consider:</h2>
              <ul className={styles.considerList}>
                <li>Property values in Joburg vary widely by suburb</li>
                <li>Bond approval depends on your credit profile</li>
                <li>Transfer duties and legal fees add ~4% upfront</li>
                <li>Levies & rates can rise faster than inflation</li>
                <li>Investment returns are not guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!results && (
        <div className={styles.resultsGrid}>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
              Buying vs Renting over {horizon} years
            </h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Renting</th>
                  <th>Buying</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Total Cash Outlay",
                  "Asset Value",
                  "Investment/Savings Value",
                  "Networth",
                  "Monthly Average Cost",
                  "Flexibility",
                  "Maintenance Risk",
                ].map((label) => (
                  <tr key={label}>
                    <td className={styles.rowLabel}>{label}</td>
                    <td className={styles.emptyCell}>—</td>
                    <td className={styles.emptyCell}>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.verdictCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Studio Verdict</h2>
              <p className={styles.emptyVerdict}>
                Run the simulation to see results
              </p>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Things to Consider:</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
