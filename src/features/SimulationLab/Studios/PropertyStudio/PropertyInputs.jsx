
import styles from "../../Studios.module.css";
import { SliderField } from "../../components/SimUI";


const T = {
  income: {
    title: "Gross Monthly Income",
    body: "Your total income before tax and deductions. Used to assess affordability — banks typically limit bond repayments to 30% of gross income.",
  },
  housingBudget: {
    title: "Monthly Housing Budget",
    body: "The maximum you're comfortable spending on housing per month. Covers bond repayment or rent, plus levies, rates, and insurance.",
  },
  savings: {
    title: "Savings for Deposit",
    body: "The cash available as a deposit. Most South African banks require at least 10% of the purchase price. A larger deposit reduces your bond amount and improves approval odds.",
  },
  horizon: {
    title: "Time Horizon",
    body: "How many years you intend to compare the two options. The longer the horizon, the more buying benefits from compounding equity. Short horizons (under 3 years) usually favour renting due to high upfront buying costs.",
  },
  purchasePrice: {
    title: "Purchase Price",
    body: "The asking price of the property. This drives your bond amount, transfer duty (SARS 2025 table), bond registration costs, and long-term equity calculations.",
  },
  bondRate: {
    title: "Bond Interest Rate",
    body: "The annual interest rate on your home loan. As of 2025, SA's prime lending rate is 11.25%. Your rate may be prime ± a margin depending on your credit profile and the bank.",
  },
  bondTerm: {
    title: "Bond Term",
    body: "The number of years to repay the home loan. Longer terms mean lower monthly payments but significantly more total interest paid. Most SA bonds run for 20 years.",
  },
  priceGrowth: {
    title: "Annual Property Price Growth",
    body: "Expected annual appreciation of the property's value. Joburg's long-run average is 4–6% per year, but this varies hugely by suburb. High-demand nodes (Sandton, Fourways, Waterfall) tend to outperform.",
  },
  monthlyRent: {
    title: "Monthly Rent",
    body: "Current monthly rent for a comparable property. The simulation compounds this by the annual escalation rate each year and compares it to buying costs.",
  },
  rentalInflation: {
    title: "Annual Rental Escalation",
    body: "The rate at which your rent increases each year. Most Joburg landlords apply 6–10% annual escalations. Over a long horizon, rising rent erodes renting's upfront cost advantage.",
  },
  investReturn: {
    title: "Investment Return (Renting Path)",
    body: "The annual return assumed on the renter's invested capital — the deposit amount, plus the monthly difference when renting is cheaper than buying. A JSE-indexed unit trust has historically returned ~10–12% per annum.",
  },
};

export default function PropertyInputs({
  monthlyIncome, setMonthlyIncome,
  housingBudget, setHousingBudget,
  savings, setSavings,
  horizon, setHorizon,
  purchasePrice, setPurchasePrice,
  bondRate, setBondRate,
  bondTerm, setBondTerm,
  priceGrowth, setPriceGrowth,
  monthlyRent, setMonthlyRent,
  rentalInflation, setRentalInflation,
  investReturn, setInvestReturn,
}) {
  return (
    <>
      {/* General */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Profile</h2>
        <p className={styles.cardSub}>
          These inputs are shared across all simulation labs so you don't have to re-enter them.
        </p>
        <SliderField label="Gross Monthly Income"       min={5000}  max={200000} step={1000}  value={monthlyIncome}  onChange={setMonthlyIncome}  prefix="R " tooltip={T.income} />
        <SliderField label="Monthly Housing Budget"     min={2000}  max={60000}  step={500}   value={housingBudget}  onChange={setHousingBudget}  prefix="R " tooltip={T.housingBudget} />
        <SliderField label="Savings Available"          min={0}     max={2000000} step={10000} value={savings}       onChange={setSavings}        prefix="R " tooltip={T.savings} />
        <SliderField label="Time Horizon"               min={1}     max={30}     step={1}     value={horizon}        onChange={setHorizon}        suffix=" yrs" tooltip={T.horizon} />
      </div>

      {/* Buying + Renting */}
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Buying</h2>
          <p className={styles.cardSub}>
            Bond repayment, maintenance (~1%/year), levies, transfer duty, and registration costs are all factored in.
          </p>
          <SliderField label="Purchase Price"           min={300000} max={5000000} step={50000} value={purchasePrice} onChange={setPurchasePrice} prefix="R " tooltip={T.purchasePrice} />
          <SliderField label="Bond Interest Rate"       min={7}      max={20}      step={0.25}  value={bondRate}      onChange={setBondRate}      suffix="%" tooltip={T.bondRate} />
          <SliderField label="Bond Term"                min={5}      max={30}      step={1}     value={bondTerm}      onChange={setBondTerm}      suffix=" yrs" tooltip={T.bondTerm} />
          <SliderField label="Annual Price Growth"      min={0}      max={15}      step={0.5}   value={priceGrowth}   onChange={setPriceGrowth}   suffix="%" tooltip={T.priceGrowth} />
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Renting</h2>
          <p className={styles.cardSub}>
            No equity build-up, but the deposit and monthly savings are assumed to be invested.
          </p>
          <SliderField label="Monthly Rent"             min={2000} max={40000} step={250} value={monthlyRent}     onChange={setMonthlyRent}     prefix="R " tooltip={T.monthlyRent} />
          <SliderField label="Annual Rental Escalation" min={0}    max={15}    step={0.5} value={rentalInflation} onChange={setRentalInflation} suffix="%" tooltip={T.rentalInflation} />
          <SliderField label="Investment Return"        min={4}    max={20}    step={0.5} value={investReturn}    onChange={setInvestReturn}    suffix="%" tooltip={T.investReturn} />
        </div>
      </div>
    </>
  );
}