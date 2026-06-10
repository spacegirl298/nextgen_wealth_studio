
import styles from "../../Studios.module.css";
import { SliderField } from "../../components/SimUI";

const T = {
  income: {
    title: "Gross Monthly Income",
    body: "Your total income before tax and deductions. Used to flag affordability — the general rule is that all debt repayments should not exceed 40% of gross income.",
  },
  savings: {
    title: "Liquid Savings",
    body: "The cash you have available. In the investing path, this is assumed to be deployed into a portfolio from day one, compounding over the full horizon.",
  },
  horizon: {
    title: "Time Horizon",
    body: "How many years to compare the two paths. Depreciation is heaviest in early years, so a longer horizon tends to favour the investing path as compounding accelerates.",
  },
  carPrice: {
    title: "Car Purchase Price (OTR)",
    body: "The on-the-road price including VAT, dealer fees, and delivery. This is the total you'll finance or pay — not the advertised sticker price, which often excludes on-road costs.",
  },
  deposit: {
    title: "Cash Deposit",
    body: "The amount you put down upfront. A larger deposit reduces the financed amount, lowers monthly repayments, and reduces the risk of being 'underwater' due to early depreciation.",
  },
  financeRate: {
    title: "Finance Interest Rate",
    body: "The annual interest rate on your vehicle finance agreement. Rates are typically prime-linked (currently 11.25% in SA). A lower rate may be a promotional offer — check if it's fixed or variable.",
  },
  financeTerm: {
    title: "Finance Term",
    body: "The number of years to repay the vehicle loan. Longer terms lower monthly payments but dramatically increase total interest paid. Most SA vehicle finance runs for 60–72 months (5–6 years).",
  },
  monthlyInsurance: {
    title: "Monthly Insurance",
    body: "Comprehensive insurance on a luxury vehicle. Premiums are determined by the car's value, your area, your age, and your claims history. Luxury models attract significantly higher premiums than standard vehicles.",
  },
  monthlyFuel: {
    title: "Monthly Fuel Cost",
    body: "Your estimated monthly fuel spend for this vehicle. Luxury and performance cars typically have larger engines and lower fuel efficiency — factor in your typical daily commute and weekend driving.",
  },
  annualService: {
    title: "Annual Service & Maintenance",
    body: "Yearly cost for servicing, tyres, and unplanned repairs not covered by a service plan. Many luxury vehicles come with a service plan for 3–5 years, but tyre wear and consumables remain your cost.",
  },
  investReturn: {
    title: "Investment Return",
    body: "The assumed annual return on the investing path — where your deposit and the monthly car-equivalent outlay are invested instead. A JSE-indexed ETF has historically returned ~10–12% per annum before fees.",
  },
};

export default function CarInputs({
  monthlyIncome, setMonthlyIncome,
  savings, setSavings,
  horizon, setHorizon,
  carPrice, setCarPrice,
  deposit, setDeposit,
  financeRate, setFinanceRate,
  financeTerm, setFinanceTerm,
  monthlyInsurance, setMonthlyInsurance,
  monthlyFuel, setMonthlyFuel,
  annualService, setAnnualService,
  investReturn, setInvestReturn,
}) {
  return (
    <>
      {/* Shared profile */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Your Profile</h2>
        <p className={styles.cardSub}>
          These inputs are shared across all simulation labs so you don't have to re-enter them.
        </p>
        <SliderField label="Gross Monthly Income" min={5000}   max={200000}  step={1000}  value={monthlyIncome} onChange={setMonthlyIncome} prefix="R " tooltip={T.income} />
        <SliderField label="Liquid Savings"        min={0}      max={2000000} step={10000} value={savings}       onChange={setSavings}       prefix="R " tooltip={T.savings} />
        <SliderField label="Time Horizon"          min={1}      max={15}      step={1}     value={horizon}       onChange={setHorizon}       suffix=" yrs" tooltip={T.horizon} />
      </div>

      {/* Car + Investing side by side */}
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Luxury Car</h2>
          <p className={styles.cardSub}>
            Finance costs, depreciation, insurance, fuel, and servicing are all modelled year-by-year.
          </p>
          <SliderField label="Car Price (OTR)"        min={300000} max={3000000} step={25000} value={carPrice}         onChange={setCarPrice}         prefix="R " tooltip={T.carPrice} />
          <SliderField label="Cash Deposit"           min={0}      max={1000000} step={10000} value={deposit}          onChange={setDeposit}          prefix="R " tooltip={T.deposit} />
          <SliderField label="Finance Interest Rate"  min={7}      max={20}      step={0.25}  value={financeRate}      onChange={setFinanceRate}      suffix="%" tooltip={T.financeRate} />
          <SliderField label="Finance Term"           min={1}      max={7}       step={1}     value={financeTerm}      onChange={setFinanceTerm}      suffix=" yrs" tooltip={T.financeTerm} />
          <SliderField label="Monthly Insurance"      min={1000}   max={20000}   step={250}   value={monthlyInsurance} onChange={setMonthlyInsurance} prefix="R " tooltip={T.monthlyInsurance} />
          <SliderField label="Monthly Fuel"           min={500}    max={10000}   step={250}   value={monthlyFuel}      onChange={setMonthlyFuel}      prefix="R " tooltip={T.monthlyFuel} />
          <SliderField label="Annual Servicing"       min={0}      max={60000}   step={1000}  value={annualService}    onChange={setAnnualService}    prefix="R " tooltip={T.annualService} />
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Investing the Difference</h2>
          <p className={styles.cardSub}>
            Your deposit is invested from day one. Every rand spent on the car is instead added to the portfolio monthly.
          </p>
          <SliderField label="Investment Return" min={4} max={20} step={0.5} value={investReturn} onChange={setInvestReturn} suffix="%" tooltip={T.investReturn} />
        </div>
      </div>
    </>
  );
}