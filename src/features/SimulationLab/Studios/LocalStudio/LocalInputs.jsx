
import styles from "../../Studios.module.css";
import { SliderField } from "../../components/SimUI";

const T = {
  income: {
    title: "Gross Monthly Income",
    body: "Your total income before tax and deductions. Used to flag whether your contribution rate is on track relative to your earnings.",
  },
  lumpSum: {
    title: "Existing Savings (Lump Sum)",
    body: "Any savings or investments you're deploying from day one. This capital is split by your offshore allocation and starts compounding immediately — even a modest lump sum has an outsized long-run effect.",
  },
  monthlyContribution: {
    title: "Monthly Contribution",
    body: "The amount you invest each month across both portfolios. Contributions are split by your allocation — e.g. 30% offshore means R300 of every R1 000 goes into offshore assets.",
  },
  horizon: {
    title: "Investment Horizon",
    body: "How many years you plan to stay invested. Compounding rewards patience non-linearly — the difference between a 10-year and a 20-year horizon is far more than 2×.",
  },
  offshoreAllocation: {
    title: "Offshore Allocation",
    body: "The percentage of your portfolio invested in offshore (global) assets. South African residents can externalise up to R10m per year with SARS tax clearance. Common starting points for young professionals are 30–50%.",
  },
  localReturn: {
    title: "Local Portfolio Return",
    body: "Expected annual return on your JSE-exposed investments. The JSE All Share Index has returned ~11–13% per annum historically, though recent decades have been more modest at ~8–10%. Adjust for your fund's actual performance.",
  },
  offshoreReturn: {
    title: "Offshore Portfolio Return (USD)",
    body: "Expected annual return on your global investments in USD terms. The MSCI World Index has returned ~9–11% per annum over the long run. This is the USD return before adding rand depreciation.",
  },
  randDepreciation: {
    title: "Annual Rand Depreciation",
    body: "The expected annual weakening of the rand against the USD. Historically the rand has depreciated ~5–8% per year on average, though this is volatile. Depreciation adds to your offshore return in rand terms — making offshore more attractive the weaker the rand.",
  },
  taxRate: {
    title: "Effective Tax Drag",
    body: "The annual percentage drag from taxes on your investment returns — dividends tax (20%), capital gains tax on disposals, and withholding tax on foreign income. Using a Tax-Free Savings Account (TFSA) can reduce this to near zero within its R36 000/year limit.",
  },
};

export default function OffshoreInputs({
  monthlyIncome, setMonthlyIncome,
  lumpSum, setLumpSum,
  monthlyContribution, setMonthlyContribution,
  horizon, setHorizon,
  offshoreAllocation, setOffshoreAllocation,
  localReturn, setLocalReturn,
  offshoreReturn, setOffshoreReturn,
  randDepreciation, setRandDepreciation,
  taxRate, setTaxRate,
}) {
  return (
    <>
      {/* Shared profile */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Profile</h2>
        <p className={styles.cardSub}>
          These inputs are shared across all simulation labs so you don't have to re-enter them.
        </p>
        <SliderField label="Gross Monthly Income"    min={5000} max={200000}  step={1000}  value={monthlyIncome}        onChange={setMonthlyIncome}        prefix="R " tooltip={T.income} />
        <SliderField label="Existing Savings"        min={0}    max={2000000} step={10000} value={lumpSum}              onChange={setLumpSum}              prefix="R " tooltip={T.lumpSum} />
        <SliderField label="Monthly Contribution"    min={500}  max={50000}   step={500}   value={monthlyContribution}  onChange={setMonthlyContribution}  prefix="R " tooltip={T.monthlyContribution} />
        <SliderField label="Investment Horizon"      min={1}    max={30}      step={1}     value={horizon}              onChange={setHorizon}              suffix=" yrs" tooltip={T.horizon} />
      </div>

      {/* Allocation + Assumptions side by side */}
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Portfolio Mix</h2>
          <p className={styles.cardSub}>
            Drag to change your offshore allocation. The remainder stays in local (JSE-exposed) assets.
          </p>
          <SliderField
            label="Offshore Allocation"
            min={0} max={100} step={5}
            value={offshoreAllocation}
            onChange={setOffshoreAllocation}
            suffix="%"
            tooltip={T.offshoreAllocation}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--clr-text-muted)", marginTop: "0.25rem", padding: "0 0.1rem" }}>
            <span>Local: {100 - offshoreAllocation}%</span>
            <span>Offshore: {offshoreAllocation}%</span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Return Assumptions</h2>
          <p className={styles.cardSub}>
            Offshore returns are converted to ZAR by adding rand depreciation — the weaker the rand, the more your offshore assets are worth locally.
          </p>
          <SliderField label="Local Return (JSE)"        min={3}   max={20}  step={0.5} value={localReturn}       onChange={setLocalReturn}       suffix="%" tooltip={T.localReturn} />
          <SliderField label="Offshore Return (USD)"     min={3}   max={20}  step={0.5} value={offshoreReturn}    onChange={setOffshoreReturn}    suffix="%" tooltip={T.offshoreReturn} />
          <SliderField label="Rand Depreciation / yr"   min={0}   max={15}  step={0.5} value={randDepreciation}  onChange={setRandDepreciation}  suffix="%" tooltip={T.randDepreciation} />
          <SliderField label="Effective Tax Drag"        min={0}   max={30}  step={0.5} value={taxRate}           onChange={setTaxRate}           suffix="%" tooltip={T.taxRate} />
        </div>
      </div>
    </>
  );
}