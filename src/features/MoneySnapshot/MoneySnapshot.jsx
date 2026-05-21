import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import styles from "./Snapshot.module.css";
import { useFinancial } from "../../components/FinancialContext";

//Info Content
const INFO_CONTENT = {
  "Gross Monthly Salary": {
    title: "Gross Monthly Salary",
    body: "Your total salary before any deductions. This is the figure on your employment contract and is used to calculate your PAYE tax.",
  },
  "Current Offshore Savings": {
    title: "Offshore Savings",
    body: "Any savings or investments held in foreign currency or offshore accounts. These are excluded from local tax calculations but still count toward your net worth.",
  },
  "Investment Income": {
    title: "Investment Income",
    body: "Monthly income from local investments such as dividends, interest on unit trusts, or rental income from properties you own.",
  },
  "Rental Income": {
    title: "Rental Income",
    body: "Monthly income received from tenants if you own rental property. Note: rental income is taxable in South Africa and should be declared to SARS.",
  },
  Bonuses: {
    title: "Bonuses",
    body: "Any regular performance or annual bonuses spread across months. Include 1/12 of your expected annual bonus here for accurate monthly planning.",
  },
  "Side Business Income": {
    title: "Side Business Income",
    body: "Monthly income from freelancing, consulting, or any other business activity outside your primary employment. This income is also taxable.",
  },
  "Rent / Bond": {
    title: "Rent / Bond",
    body: "Your monthly rent payment or bond repayment (mortgage). This is typically the largest fixed expense and should not exceed 30% of gross income.",
  },
  "Medical Aid": {
    title: "Medical Aid",
    body: "Monthly medical aid premium for yourself and any dependents. In South Africa, medical aid contributions qualify for a tax credit, reducing your PAYE liability.",
  },
  Insurance: {
    title: "Insurance",
    body: "All short-term insurance premiums including car, home contents, and life cover. These protect your assets but should be reviewed annually for competitiveness.",
  },
  "Student Loan": {
    title: "Student Loan",
    body: "Monthly repayment on any student or education loans. NSFAS and private study loans should both be included here.",
  },
  "Personal Loan": {
    title: "Personal Loan",
    body: "Monthly repayment on personal loans from banks or other credit providers. High-interest personal loans are expensive — prioritise paying these down.",
  },
  Subscriptions: {
    title: "Subscriptions",
    body: "Recurring monthly subscriptions such as streaming services, gym memberships, news apps, and software. Small amounts add up quickly.",
  },
  "Retail Accounts": {
    title: "Retail Accounts",
    body: "Monthly repayments on store credit accounts (e.g. Edgars, Woolworths credit). These often carry high interest rates (20–30% p.a.).",
  },
  "Debt Repayments": {
    title: "Debt Repayments",
    body: "Any additional debt repayments not captured above. Consolidate all debt obligations here for an accurate view of your fixed commitments.",
  },
  Groceries: {
    title: "Groceries",
    body: "Monthly spend on food, household supplies, and personal care items from supermarkets. One of the highest variable expenses for most households.",
  },
  "Dining Out": {
    title: "Dining Out",
    body: "Restaurants, takeaways, coffee shops, and food delivery services. This is one of the easiest categories to cut when tightening your budget.",
  },
  Transport: {
    title: "Transport",
    body: "Monthly fuel, taxi, Uber, or public transport costs. Include petrol, parking, e-tolls, and any commuting-related expenses.",
  },
  Entertainment: {
    title: "Entertainment",
    body: "Spending on movies, events, concerts, holidays, and leisure activities. Budget for fun — but keep it proportional to your income.",
  },
  Shopping: {
    title: "Shopping",
    body: "Clothing, electronics, home décor, and general retail purchases. This is often an underestimated variable expense.",
  },
  "Total Outstanding Debt": {
    title: "Total Outstanding Debt",
    body: "The total amount you owe across all credit facilities — bonds, personal loans, car loans, credit cards, and store accounts.",
  },
  "Total Monthly Minimum Payments": {
    title: "Monthly Minimum Payments",
    body: "The minimum required payments across all your debt accounts. Always pay at least the minimum to avoid default and credit score damage.",
  },
  "Weighted Average Interest Rate": {
    title: "Weighted Average Interest Rate",
    body: "The average interest rate across all your debts, weighted by balance. A high average rate signals that debt reduction should be a priority.",
  },
  "Emergency Fund": {
    title: "Emergency Fund",
    body: "Money set aside for unexpected expenses like job loss, medical emergencies, or urgent repairs. Aim for 3–6 months of take-home pay.",
  },
  "Tax Free Savings Account": {
    title: "Tax Free Savings Account",
    body: "Your TFSA balance. Contributions up to R36,000 per year (R500,000 lifetime) grow completely tax-free. This is one of the best savings vehicles in South Africa.",
  },
  "Pre-Annuity Amount": {
    title: "Pre-Annuity Amount",
    body: "The current value of your retirement annuity (RA). RA contributions are tax-deductible up to 27.5% of taxable income (max R350,000 p.a.).",
  },
  "Offshore Investments": {
    title: "Offshore Investments",
    body: "The current value of investments held in foreign markets. South Africans can externalise up to R10 million per year via the foreign investment allowance.",
  },
  "Local Investments": {
    title: "Local Investments",
    body: "The current value of unit trusts, ETFs, shares, or other locally-held investments outside of your TFSA or RA.",
  },
  "Debt Free": {
    title: "Debt Free Goal",
    body: "Target amount to clear all outstanding debt. Track your progress here to stay motivated on your debt-free journey.",
  },
  "Emergency Fund Goal": {
    title: "Emergency Fund Goal",
    body: "Target amount for your emergency fund. Typically 3–6 months of total monthly expenses.",
  },
  "Travel Savings": {
    title: "Travel Savings Goal",
    body: "Your saving target for travel or holidays. Having a dedicated travel fund prevents holiday spending from disrupting your main budget.",
  },
  "Retirement Annuity": {
    title: "Retirement Annuity Goal",
    body: "Your retirement savings goal. South Africa's National Treasury recommends saving at least 15% of income for retirement throughout your working life.",
  },
  "House Savings": {
    title: "House Savings Goal",
    body: "Your target for a property deposit or house purchase fund. Most banks require a minimum 10% deposit for bond approval.",
  },
};

// Sub-components
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
          left: Math.min(rect.left - 120, window.innerWidth - 280),
        });
      }
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target))
        setOpen(false);
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
  prefix = "",
  suffix = "",
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
      <InfoTooltip field={label} />
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className={styles.statCard}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statCardInfo}>
      <InfoTooltip field={label} />
    </div>
  </div>
);

const MultiSegmentBar = ({ segments }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  return (
    <div className={styles.multiBar}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className={styles.multiBarSeg}
          style={{
            width: `${total > 0 ? (seg.value / total) * 100 : 0}%`,
            background: seg.color,
          }}
          title={seg.label}
        />
      ))}
    </div>
  );
};

const CircleProgress = ({ pct, label }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <div className={styles.circleWrap}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--clr-gold)"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fill="var(--clr-gold)"
          fontSize="12"
          fontWeight="700"
        >
          {Math.round(pct)}%
        </text>
      </svg>
      <span className={styles.circleLabel}>{label}</span>
    </div>
  );
};

const LearnMore = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.learnCard}>
      <button className={styles.learnToggle} onClick={() => setOpen((v) => !v)}>
        Learn More
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div className={styles.learnBody}>
          A money snapshot is a financial snapshot showing your income, taxes,
          expenses, and savings in one place. It helps you see where your money
          goes each month and whether you're on track for your goals. Without a
          snapshot, most people underestimate savings. This view helps you catch
          problems early like high debt or low emergency savings. In South
          Africa, many households face high debt-to-income ratios. A clear
          snapshot helps you avoid over-committing to credit, store cards, or
          vehicle finance. Update this monthly to ensure you stay on track with
          your finances.
        </div>
      )}
    </div>
  );
};

// Main Component
export default function MoneySnapshot() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Income", "Expenses", "Savings", "Progress"];

  const {
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
    paye,
    takeHome,
    fixedCosts,
    variableSpending,
    totalSavings,
    disposable,
    healthScore,
  } = useFinancial();

  const tfsaLimit = useMemo(() => Math.min((tfsa / 500000) * 100, 100), [tfsa]);
  const fmt = (n) => `R${Math.round(n).toLocaleString()}`;
  const pct = (v, total) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const updateGoal = (i, field, value) => {
    setGoals((prev) =>
      prev.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)),
    );
  };

  //Tab renderers
  const renderOverview = () => (
    <>
      <div className={styles.statsRow}>
        <StatCard label="Gross Monthly Income" value={fmt(grossMonthly)} />
        <StatCard label="Estimated PAYE Tax" value={fmt(paye)} />
        <StatCard label="Take-Home Pay" value={fmt(takeHome)} />
        <StatCard label="Monthly Disposable" value={fmt(disposable)} />
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Monthly Income Breakdown</h3>
        <MultiSegmentBar
          segments={[
            { label: "Gross Monthly Salary", value: salary, color: "#c84bff" },
            {
              label: "Investment Income",
              value: investIncome,
              color: "#f8d299",
            },
            {
              label: "Rental Income",
              value: rentalIncome,
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Bonuses",
              value: bonuses,
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Side Business Income",
              value: sideIncome,
              color: "#f0e8ff",
            },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Gross Monthly Salary",
              val: fmt(salary),
              pctVal: pct(salary, takeHome + paye),
              color: "#c84bff",
            },
            {
              label: "Investment Income",
              val: fmt(investIncome),
              pctVal: pct(investIncome, takeHome + paye),
              color: "#f8d299",
            },
            {
              label: "Rental Income",
              val: fmt(rentalIncome),
              pctVal: pct(rentalIncome, takeHome + paye),
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Bonuses",
              val: fmt(bonuses),
              pctVal: pct(bonuses, takeHome + paye),
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Side Business Income",
              val: fmt(sideIncome),
              pctVal: pct(sideIncome, takeHome + paye),
              color: "#f0e8ff",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Monthly Expense Breakdown</h3>
        <MultiSegmentBar
          segments={[
            {
              label: "Fixed Monthly Costs",
              value: fixedCosts,
              color: "#c84bff",
            },
            {
              label: "Variable Spending",
              value: variableSpending,
              color: "#f8d299",
            },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Fixed Monthly Costs",
              val: fmt(fixedCosts),
              pctVal: pct(fixedCosts, fixedCosts + variableSpending),
              color: "#c84bff",
            },
            {
              label: "Variable Spending",
              val: fmt(variableSpending),
              pctVal: pct(variableSpending, fixedCosts + variableSpending),
              color: "#f8d299",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Goal Progress</h3>
        <div className={styles.circleRow}>
          {goals.map((g) => (
            <CircleProgress
              key={g.name}
              pct={g.target > 0 ? (g.saved / g.target) * 100 : 0}
              label={g.name}
            />
          ))}
        </div>
      </div>
    </>
  );

  const renderIncome = () => (
    <>
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Income Inputs</h2>
          <p className={styles.cardSub}>
            Enter all sources of monthly income below.
          </p>
          <SliderField
            label="Gross Monthly Salary"
            min={0}
            max={200000}
            step={500}
            value={salary}
            onChange={setSalary}
            prefix="R "
          />
          <SliderField
            label="Current Offshore Savings"
            min={0}
            max={500000}
            step={1000}
            value={offshoreIncome}
            onChange={setOffshoreIncome}
            prefix="R "
          />
          <SliderField
            label="Investment Income"
            min={0}
            max={50000}
            step={250}
            value={investIncome}
            onChange={setInvestIncome}
            prefix="R "
          />
          <SliderField
            label="Rental Income"
            min={0}
            max={50000}
            step={250}
            value={rentalIncome}
            onChange={setRentalIncome}
            prefix="R "
          />
          <SliderField
            label="Bonuses"
            min={0}
            max={50000}
            step={250}
            value={bonuses}
            onChange={setBonuses}
            prefix="R "
          />
          <SliderField
            label="Side Business Income"
            min={0}
            max={50000}
            step={250}
            value={sideIncome}
            onChange={setSideIncome}
            prefix="R "
          />
          <div className={styles.totalRow}>
            <span>Total Gross Monthly Income:</span>
            <span className={styles.totalVal}>{fmt(grossMonthly)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total Take-Home Income:</span>
            <span className={styles.totalVal}>{fmt(takeHome)}</span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>SARS Tax Breakdown</h2>
          <p className={styles.cardSub}>
            Estimated PAYE based on 2025/26 tax tables.
          </p>
          <div className={styles.taxTable}>
            {[
              [
                "Annual Gross Income",
                `R${(grossMonthly * 12).toLocaleString()}`,
              ],
              ["Annual PAYE", `R${(paye * 12).toLocaleString()}`],
              [
                "Effective Tax Rate",
                `${grossMonthly > 0 ? ((paye / grossMonthly) * 100).toFixed(1) : 0}%`,
              ],
              ["Monthly PAYE", fmt(paye)],
              ["Monthly Take-Home", fmt(takeHome)],
            ].map(([k, v]) => (
              <div key={k} className={styles.taxRow}>
                <span className={styles.taxLabel}>{k}</span>
                <span className={styles.taxVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Monthly Income Breakdown</h3>
        <MultiSegmentBar
          segments={[
            { label: "Gross Monthly Salary", value: salary, color: "#c84bff" },
            {
              label: "Investment Income",
              value: investIncome,
              color: "#f8d299",
            },
            {
              label: "Rental Income",
              value: rentalIncome,
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Bonuses",
              value: bonuses,
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Side Business Income",
              value: sideIncome,
              color: "#f0e8ff",
            },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Gross Monthly Salary",
              val: fmt(salary),
              pctVal: pct(salary, takeHome + paye),
              color: "#c84bff",
            },
            {
              label: "Investment Income",
              val: fmt(investIncome),
              pctVal: pct(investIncome, takeHome + paye),
              color: "#f8d299",
            },
            {
              label: "Rental Income",
              val: fmt(rentalIncome),
              pctVal: pct(rentalIncome, takeHome + paye),
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Bonuses",
              val: fmt(bonuses),
              pctVal: pct(bonuses, takeHome + paye),
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Side Business Income",
              val: fmt(sideIncome),
              pctVal: pct(sideIncome, takeHome + paye),
              color: "#f0e8ff",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderExpenses = () => (
    <>
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Fixed Monthly Costs</h2>
          <p className={styles.cardSub}>
            These are predictable, recurring monthly obligations.
          </p>
          <SliderField
            label="Rent / Bond"
            min={0}
            max={30000}
            step={250}
            value={rentBond}
            onChange={setRentBond}
            prefix="R "
          />
          <SliderField
            label="Medical Aid"
            min={0}
            max={10000}
            step={100}
            value={medicalAid}
            onChange={setMedicalAid}
            prefix="R "
          />
          <SliderField
            label="Insurance"
            min={0}
            max={10000}
            step={100}
            value={insurance}
            onChange={setInsurance}
            prefix="R "
          />
          <SliderField
            label="Student Loan"
            min={0}
            max={10000}
            step={100}
            value={studentLoan}
            onChange={setStudentLoan}
            prefix="R "
          />
          <SliderField
            label="Personal Loan"
            min={0}
            max={10000}
            step={100}
            value={personalLoan}
            onChange={setPersonalLoan}
            prefix="R "
          />
          <SliderField
            label="Subscriptions"
            min={0}
            max={5000}
            step={50}
            value={subscriptions}
            onChange={setSubscriptions}
            prefix="R "
          />
          <SliderField
            label="Retail Accounts"
            min={0}
            max={10000}
            step={100}
            value={retailAccounts}
            onChange={setRetailAccounts}
            prefix="R "
          />
          <SliderField
            label="Debt Repayments"
            min={0}
            max={20000}
            step={250}
            value={debtRepayments}
            onChange={setDebtRepayments}
            prefix="R "
          />
          <div className={styles.totalRow}>
            <span>Total Fixed Monthly Costs:</span>
            <span className={styles.totalVal}>{fmt(fixedCosts)}</span>
          </div>
        </div>

        <div>
          <div
            className={styles.sectionCard}
            style={{ marginBottom: "1.25rem" }}
          >
            <h2 className={styles.cardTitle}>Variable Month Spending</h2>
            <p className={styles.cardSub}>
              These fluctuate month-to-month based on lifestyle choices.
            </p>
            <SliderField
              label="Groceries"
              min={0}
              max={20000}
              step={250}
              value={groceries}
              onChange={setGroceries}
              prefix="R "
            />
            <SliderField
              label="Dining Out"
              min={0}
              max={10000}
              step={100}
              value={dining}
              onChange={setDining}
              prefix="R "
            />
            <SliderField
              label="Transport"
              min={0}
              max={10000}
              step={100}
              value={transport}
              onChange={setTransport}
              prefix="R "
            />
            <SliderField
              label="Entertainment"
              min={0}
              max={10000}
              step={100}
              value={entertainment}
              onChange={setEntertainment}
              prefix="R "
            />
            <SliderField
              label="Shopping"
              min={0}
              max={10000}
              step={100}
              value={shopping}
              onChange={setShopping}
              prefix="R "
            />
            <div className={styles.totalRow}>
              <span>Total Variable Month Spending:</span>
              <span className={styles.totalVal}>{fmt(variableSpending)}</span>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Debt</h2>
            <p className={styles.cardSub}>
              Summary of your total debt position.
            </p>
            <SliderField
              label="Total Outstanding Debt"
              min={0}
              max={2000000}
              step={5000}
              value={totalDebt}
              onChange={setTotalDebt}
              prefix="R "
            />
            <SliderField
              label="Total Monthly Minimum Payments"
              min={0}
              max={20000}
              step={250}
              value={minPayments}
              onChange={setMinPayments}
              prefix="R "
            />
            <SliderField
              label="Weighted Average Interest Rate"
              min={0}
              max={30}
              step={0.5}
              value={avgInterest}
              onChange={setAvgInterest}
              suffix="%"
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Monthly Expense Breakdown</h3>
        <MultiSegmentBar
          segments={[
            {
              label: "Fixed Monthly Costs",
              value: fixedCosts,
              color: "#c84bff",
            },
            {
              label: "Variable Spending",
              value: variableSpending,
              color: "#f8d299",
            },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Fixed Monthly Costs",
              val: fmt(fixedCosts),
              pctVal: pct(fixedCosts, fixedCosts + variableSpending),
              color: "#c84bff",
            },
            {
              label: "Variable Spending",
              val: fmt(variableSpending),
              pctVal: pct(variableSpending, fixedCosts + variableSpending),
              color: "#f8d299",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Fixed Monthly Cost Breakdown</h3>
        <MultiSegmentBar
          segments={[
            { label: "Rent/Bond", value: rentBond, color: "#c84bff" },
            { label: "Medical Aid", value: medicalAid, color: "#f8d299" },
            {
              label: "Insurance",
              value: insurance,
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Student Loan",
              value: studentLoan,
              color: "rgba(200, 75, 255, 0.35)",
            },
            { label: "Personal Loan", value: personalLoan, color: "#f0e8ff" },
            {
              label: "Subscriptions",
              value: subscriptions,
              color: "rgba(240, 232, 255, 0.3)",
            },
            {
              label: "Retail Accounts",
              value: retailAccounts,
              color: "#f1b862",
            },
            {
              label: "Debt Repayments",
              value: debtRepayments,
              color: "rgba(180, 100, 255, 0.325)",
            },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Rent/Bond",
              val: fmt(rentBond),
              pctVal: pct(rentBond, fixedCosts),
              color: "#c84bff",
            },
            {
              label: "Medical Aid",
              val: fmt(medicalAid),
              pctVal: pct(medicalAid, fixedCosts),
              color: "#f8d299",
            },
            {
              label: "Insurance",
              val: fmt(insurance),
              pctVal: pct(insurance, fixedCosts),
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Student Loan",
              val: fmt(studentLoan),
              pctVal: pct(studentLoan, fixedCosts),
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Personal Loan",
              val: fmt(personalLoan),
              pctVal: pct(personalLoan, fixedCosts),
              color: "#f0e8ff",
            },
            {
              label: "Subscriptions",
              val: fmt(subscriptions),
              pctVal: pct(subscriptions, fixedCosts),
              color: "rgba(240, 232, 255, 0.3)",
            },
            {
              label: "Retail Accounts",
              val: fmt(retailAccounts),
              pctVal: pct(retailAccounts, fixedCosts),
              color: "#f1b862",
            },
            {
              label: "Debt Repayments",
              val: fmt(debtRepayments),
              pctVal: pct(debtRepayments, fixedCosts),
              color: "rgba(180, 100, 255, 0.325)",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Variable Month Spending Breakdown</h3>
        <MultiSegmentBar
          segments={[
            { label: "Groceries", value: groceries, color: "#c84bff" },
            { label: "Dining Out", value: dining, color: "#f8d299" },
            {
              label: "Transport",
              value: transport,
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Entertainment",
              value: entertainment,
              color: "rgba(200, 75, 255, 0.35)",
            },
            { label: "Shopping", value: shopping, color: "#f0e8ff" },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Groceries",
              val: fmt(groceries),
              pctVal: pct(groceries, variableSpending),
              color: "#c84bff",
            },
            {
              label: "Dining Out",
              val: fmt(dining),
              pctVal: pct(dining, variableSpending),
              color: "#f8d299",
            },
            {
              label: "Transport",
              val: fmt(transport),
              pctVal: pct(transport, variableSpending),
              color: "rgba(180, 100, 255, 0.45)",
            },
            {
              label: "Entertainment",
              val: fmt(entertainment),
              pctVal: pct(entertainment, variableSpending),
              color: "rgba(200, 75, 255, 0.35)",
            },
            {
              label: "Shopping",
              val: fmt(shopping),
              pctVal: pct(shopping, variableSpending),
              color: "#f0e8ff",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>
                  {item.val} · {item.pctVal}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSavings = () => (
    <>
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>
            Current Savings &amp; Investments
          </h2>
          <p className={styles.cardSub}>
            Enter current balances for each savings vehicle.
          </p>
          <SliderField
            label="Emergency Fund"
            min={0}
            max={500000}
            step={1000}
            value={emergencyFund}
            onChange={setEmergencyFund}
            prefix="R "
          />
          <SliderField
            label="Tax Free Savings Account"
            min={0}
            max={500000}
            step={1000}
            value={tfsa}
            onChange={setTfsa}
            prefix="R "
          />
          <SliderField
            label="Pre-Annuity Amount"
            min={0}
            max={2000000}
            step={5000}
            value={preAnnuity}
            onChange={setPreAnnuity}
            prefix="R "
          />
          <SliderField
            label="Offshore Investments"
            min={0}
            max={2000000}
            step={5000}
            value={offshoreInv}
            onChange={setOffshoreInv}
            prefix="R "
          />
          <SliderField
            label="Local Investments"
            min={0}
            max={2000000}
            step={5000}
            value={localInv}
            onChange={setLocalInv}
            prefix="R "
          />
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Total Savings</h2>
          <p className={styles.cardSub}>
            Your combined savings and investment portfolio.
          </p>
          <div className={styles.bigStatWrap}>
            <div className={styles.bigStat}>{fmt(totalSavings)}</div>
            <div className={styles.bigStatLabel}>Total Portfolio Value</div>
          </div>
          <div className={styles.divider} />
          <h3
            className={styles.cardTitle}
            style={{ fontSize: "0.95rem", marginTop: "1rem" }}
          >
            TFSA Limit Used
          </h3>
          <div className={styles.tfsaBar}>
            <div
              className={styles.tfsaFill}
              style={{ width: `${tfsaLimit}%` }}
            />
          </div>
          <div className={styles.tfsaMeta}>
            <span>{fmt(tfsa)} used</span>
            <span>R500,000 lifetime limit · {tfsaLimit.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Savings Breakdown</h3>
        <MultiSegmentBar
          segments={[
            { label: "Emergency Fund", value: emergencyFund, color: "#7c3aed" },
            { label: "TFSA", value: tfsa, color: "#4f46e5" },
            {
              label: "Retirement Annuity",
              value: preAnnuity,
              color: "#c084fc",
            },
            { label: "Offshore", value: offshoreInv, color: "#f8d299" },
            { label: "Local Investments", value: localInv, color: "#e0c97a" },
          ]}
        />
        <div className={styles.barLegend}>
          {[
            {
              label: "Emergency Fund",
              val: fmt(emergencyFund),
              color: "#7c3aed",
            },
            { label: "TFSA", val: fmt(tfsa), color: "#4f46e5" },
            {
              label: "Retirement Annuity",
              val: fmt(preAnnuity),
              color: "#c084fc",
            },
            {
              label: "Offshore Investments",
              val: fmt(offshoreInv),
              color: "#f8d299",
            },
            {
              label: "Local Investments",
              val: fmt(localInv),
              color: "#e0c97a",
            },
          ].map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderProgress = () => (
    <>
      <div className={styles.twoCol}>
        {goals.map((goal, i) => (
          <div key={i} className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Goal {i + 1}</h2>
            <div className={styles.goalNameRow}>
              <label className={styles.fieldLabel}>Goal Name</label>
              <input
                className={styles.goalNameInput}
                value={goal.name}
                onChange={(e) => updateGoal(i, "name", e.target.value)}
                placeholder="e.g. Emergency Fund"
              />
            </div>
            <SliderField
              label="Target Amount"
              min={0}
              max={1000000}
              step={1000}
              value={goal.target}
              onChange={(v) => updateGoal(i, "target", v)}
              prefix="R "
            />
            <SliderField
              label="Current Saved"
              min={0}
              max={1000000}
              step={1000}
              value={goal.saved}
              onChange={(v) => updateGoal(i, "saved", v)}
              prefix="R "
            />
            <SliderField
              label="Monthly Allocation"
              min={0}
              max={20000}
              step={100}
              value={goal.monthly}
              onChange={(v) => updateGoal(i, "monthly", v)}
              prefix="R "
            />
            <div className={styles.goalProgress}>
              <div className={styles.goalProgressBar}>
                <div
                  className={styles.goalProgressFill}
                  style={{
                    width: `${goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0}%`,
                  }}
                />
              </div>
              <span className={styles.goalProgressPct}>
                {goal.target > 0
                  ? Math.round((goal.saved / goal.target) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Financial Health</h2>
          <p className={styles.cardSub}>
            Key ratios that determine your financial wellbeing.
          </p>
          {[
            [
              "Emergency Fund",
              `${fmt(emergencyFund)} of ${fmt(takeHome * 3)} target (3 months)`,
            ],
            [
              "Debt-to-Income Ratio",
              `${grossMonthly > 0 ? ((totalDebt / (grossMonthly * 12)) * 100).toFixed(1) : 0}% (${totalDebt / (grossMonthly * 12) < 0.36 ? "Healthy" : "High"})`,
            ],
            [
              "Savings Rate",
              `${grossMonthly > 0 ? (totalSavings / grossMonthly).toFixed(1) : 0}x monthly income saved`,
            ],
            [
              "Credit Health",
              `${fixedCosts / Math.max(takeHome, 1) < 0.5 ? "Good" : "Review needed"} — fixed costs are ${takeHome > 0 ? Math.round((fixedCosts / takeHome) * 100) : 0}% of take-home`,
            ],
          ].map(([k, v]) => (
            <div key={k} className={styles.healthRow}>
              <span className={styles.healthLabel}>{k}</span>
              <span className={styles.healthVal}>{v}</span>
            </div>
          ))}
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Financial Health Score</h2>
          <div className={styles.healthScoreWrap}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="56"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r="56"
                fill="none"
                stroke="var(--clr-gold)"
                strokeWidth="12"
                strokeDasharray={`${(healthScore / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                strokeDashoffset={2 * Math.PI * 56 * 0.25}
                strokeLinecap="round"
              />
              <text
                x="70"
                y="74"
                textAnchor="middle"
                fill="var(--clr-gold)"
                fontSize="26"
                fontWeight="700"
              >
                {healthScore}%
              </text>
            </svg>
            <p className={styles.healthScoreLabel}>
              {healthScore >= 75
                ? "Excellent — you're on track"
                : healthScore >= 50
                  ? "Good — a few areas to improve"
                  : "Needs attention — review your budget"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Money Snapshot</h1>
        <p className={styles.heroSub}>
          This dashboard provides you with a clear, organised overview of your
          financial state.
        </p>
      </div>

      <LearnMore />

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Overview" && renderOverview()}
        {activeTab === "Income" && renderIncome()}
        {activeTab === "Expenses" && renderExpenses()}
        {activeTab === "Savings" && renderSavings()}
        {activeTab === "Progress" && renderProgress()}
      </div>
    </div>
  );
}
