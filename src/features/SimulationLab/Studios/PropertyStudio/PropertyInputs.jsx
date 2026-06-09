// PropertyInputs.jsx
import { useState } from "react";
import styles from "../../Studios.module.css";

const InfoTooltip = ({ title, content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className={styles.tooltipWrapper}>
      <button 
        className={styles.infoIcon}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>
      {show && (
        <div className={styles.tooltipContent}>
          <h4>{title}</h4>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

const SliderInput = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip }) => (
  <div className={styles.inputGroup}>
    <div className={styles.inputHeader}>
      <label className={styles.inputLabel}>{label}</label>
      <InfoTooltip title={label} content={tooltip} />
    </div>
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.inputValue}>
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
  </div>
);

export default function PropertyInputs({
  timeHorizon, setTimeHorizon,
  propGrowthRate, setPropGrowthRate,
  purchasePrice, setPurchasePrice,
  depositPercent, setDepositPercent,
  interestRate, setInterestRate,
  bondTerm, setBondTerm,
  monthlyLevies, setMonthlyLevies,
  monthlyRent, setMonthlyRent,
  rentalIncrease, setRentalIncrease,
  monthlyIncome, setMonthlyIncome,
  savings, setSavings,
}) {
  return (
    <div className={styles.inputsContainer}>
      {/* General Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>General Settings</h2>
        <div className={styles.inputsGrid}>
          <SliderInput
            label="Monthly Income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            min={0} max={200000} step={1000}
            prefix="R "
            tooltip="Your gross monthly income before tax. Used to calculate housing affordability ratios."
          />
          <SliderInput
            label="Available Savings"
            value={savings}
            onChange={setSavings}
            min={0} max={2000000} step={25000}
            prefix="R "
            tooltip="Total savings available for deposit and upfront costs."
          />
          <SliderInput
            label="Time Horizon"
            value={timeHorizon}
            onChange={setTimeHorizon}
            min={1} max={30} step={1}
            suffix=" years"
            tooltip="How long you plan to stay. Longer horizons typically favour buying due to equity growth."
          />
          <SliderInput
            label="Property Growth Rate"
            value={propGrowthRate}
            onChange={setPropGrowthRate}
            min={0} max={15} step={0.5}
            suffix="%"
            tooltip="Expected annual property value increase. SA long-term average is 4-6%."
          />
        </div>
      </div>
      
      {/* Buying Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Buying Costs</h2>
        <div className={styles.inputsGrid}>
          <SliderInput
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={300000} max={5000000} step={50000}
            prefix="R "
            tooltip="Property purchase price. Properties over R1.1M attract transfer duty."
          />
          <SliderInput
            label="Deposit Percentage"
            value={depositPercent}
            onChange={setDepositPercent}
            min={0} max={50} step={1}
            suffix="%"
            tooltip="Minimum 10% typically required by SA banks for bond approval."
          />
          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={7} max={20} step={0.25}
            suffix="%"
            tooltip="Bond interest rate. Prime is 11.25% (2025). Your rate depends on credit profile."
          />
          <SliderInput
            label="Bond Term"
            value={bondTerm}
            onChange={setBondTerm}
            min={5} max={30} step={1}
            suffix=" years"
            tooltip="Loan repayment period. Longer terms mean lower monthly payments but more interest."
          />
          <SliderInput
            label="Monthly Levies & Rates"
            value={monthlyLevies}
            onChange={setMonthlyLevies}
            min={0} max={10000} step={100}
            prefix="R "
            tooltip="Body corporate levies (if sectional title) plus municipal rates."
          />
        </div>
      </div>
      
      {/* Renting Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Renting Costs</h2>
        <div className={styles.inputsGrid}>
          <SliderInput
            label="Monthly Rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={2000} max={50000} step={250}
            prefix="R "
            tooltip="Current monthly rent for a comparable property."
          />
          <SliderInput
            label="Annual Rental Increase"
            value={rentalIncrease}
            onChange={setRentalIncrease}
            min={0} max={15} step={0.5}
            suffix="%"
            tooltip="Expected yearly rent escalation. Typical SA range is 6-10%."
          />
        </div>
      </div>
      
      {/* Educational Note */}
      <div className={styles.educationalNote}>
        <h4>📘 Understanding SA Property Costs</h4>
        <p>
          <strong>Transfer Duty:</strong> Tax paid to SARS when buying property over R1.1M. Calculated on a sliding scale up to 12%.
          <br />
          <strong>Bond Registration:</strong> Legal fees (~1.5% of property value) paid to the conveyancing attorney.
          <br />
          <strong>Maintenance:</strong> Budget 1% of property value annually for repairs and upkeep.
          <br />
          <strong>Investment Return:</strong> Difference between buying and renting costs is invested at 10% annual return (SA long-term equity average).
        </p>
      </div>
    </div>
  );
}