/**
 * ExpenseCategories.jsx
 * ─────────────────────────────────────────────────────────────
 * Categorised expense input and breakdown.
 * Categories: Housing · Mobility · Lifestyle · Debt · Savings
 * Reads/writes via useSnapshotStore — auto-saves on every change.
 * Inline benchmark callouts replace the Education tab for expense terms.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import styles from "../Snapshot.module.css";
import { SliderField, MultiSegmentBar } from "../components/SnapshotUI";

/** Inline callout for contextual SA benchmarks / term definitions */
function BenchmarkCallout({ rule, detail }) {
  return (
    <details className={styles.glossaryItem} style={{ marginBottom: "0.5rem" }}>
      <summary className={styles.glossaryTerm} style={{ fontSize: "0.78rem", opacity: 0.75 }}>
        SA benchmark: {rule}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <p className={styles.glossaryDef}>{detail}</p>
    </details>
  );
}

export default function ExpenseCategories({ state, update, derived }) {
  const [activeCategory, setActiveCategory] = useState("Housing");
  const { takeHome, totalExpenses, fmt, pct } = derived;

  const {
    rentBond, levies, rates,
    carPayment, petrol, insurance,
    medicalAid, groceries, dining, subscriptions, entertainment, shopping,
    studentLoan, personalLoan, retailAccounts, creditCard,
    totalDebt, minPayments, avgInterest,
    monthlySavingsContrib,
  } = state;

  const housing      = rentBond + levies + rates;
  const mobility     = carPayment + petrol + insurance;
  const lifestyle    = medicalAid + groceries + dining + subscriptions + entertainment + shopping;
  const debtPayments = studentLoan + personalLoan + retailAccounts + creditCard;

  const categories = {
    Housing: {
      label: "Housing", color: "#c84bff", total: housing, benchmark: 30,
      fields: [
        { label: "Rent / Bond",      val: rentBond,  set: v => update("rentBond", v),  max: 30000, step: 250 },
        { label: "Levies",           val: levies,    set: v => update("levies", v),    max: 5000,  step: 100 },
        { label: "Rates & Municipal",val: rates,     set: v => update("rates", v),     max: 5000,  step: 100 },
      ],
      callout: {
        rule: "Housing ≤ 30% of gross income",
        detail: "The primary affordability ceiling used by SA banks when assessing bond applications. Exceeding 30% of take-home pay limits your ability to save and absorb unexpected costs.",
      },
    },
    Mobility: {
      label: "Mobility", color: "#f8d299", total: mobility, benchmark: 15,
      fields: [
        { label: "Car Payment",      val: carPayment, set: v => update("carPayment", v), max: 20000, step: 250 },
        { label: "Petrol / Transport",val: petrol,    set: v => update("petrol", v),     max: 10000, step: 100 },
        { label: "Insurance",        val: insurance,  set: v => update("insurance", v),  max: 5000,  step: 100 },
      ],
      callout: {
        rule: "Vehicle finance ≤ 15% of gross income",
        detail: "Vehicles depreciate rapidly — over-financing a car is one of the fastest ways to destroy household wealth. Include petrol and insurance to see your true mobility cost.",
      },
    },
    Lifestyle: {
      label: "Lifestyle", color: "#4ade80", total: lifestyle, benchmark: 30,
      fields: [
        { label: "Medical Aid",  val: medicalAid,   set: v => update("medicalAid", v),   max: 10000, step: 100 },
        { label: "Groceries",    val: groceries,    set: v => update("groceries", v),    max: 20000, step: 250 },
        { label: "Dining Out",   val: dining,       set: v => update("dining", v),       max: 10000, step: 100 },
        { label: "Subscriptions",val: subscriptions,set: v => update("subscriptions", v),max: 5000,  step: 50  },
        { label: "Entertainment",val: entertainment,set: v => update("entertainment", v),max: 10000, step: 100 },
        { label: "Shopping",     val: shopping,     set: v => update("shopping", v),     max: 10000, step: 100 },
      ],
      callout: {
        rule: "Lifestyle spending — budget consciously",
        detail: "Dining out, subscriptions, and shopping are the most flexible categories. Small daily spending is easy to underestimate — tracking it here reveals where discretionary cuts are possible.",
      },
    },
    Debt: {
      label: "Debt Repayments", color: "#f87171", total: debtPayments, benchmark: 15,
      fields: [
        { label: "Student Loan",     val: studentLoan,    set: v => update("studentLoan", v),    max: 10000, step: 100 },
        { label: "Personal Loan",    val: personalLoan,   set: v => update("personalLoan", v),   max: 10000, step: 100 },
        { label: "Retail Accounts",  val: retailAccounts, set: v => update("retailAccounts", v), max: 10000, step: 100 },
        { label: "Credit Card",      val: creditCard,     set: v => update("creditCard", v),     max: 10000, step: 100 },
      ],
      callout: {
        rule: "Debt-to-income ratio < 36%",
        detail: "Your total monthly debt repayments divided by net income. Above 40%, most SA banks decline further credit. Above 50% is considered a debt crisis — prioritise aggressive repayment.",
      },
    },
    Savings: {
      label: "Savings", color: "#60a5fa", total: monthlySavingsContrib, benchmark: 15,
      fields: [
        { label: "Monthly Savings Contribution", val: monthlySavingsContrib, set: v => update("monthlySavingsContrib", v), max: 50000, step: 500 },
      ],
      callout: {
        rule: "Save at least 15% of net income",
        detail: "National Treasury recommends saving at least 15% of income throughout your working life for retirement security. Even small increases compound significantly over decades.",
      },
    },
  };

  const cat = categories[activeCategory];
  const catPct        = takeHome > 0 ? (cat.total / takeHome) * 100 : 0;
  const overBenchmark = catPct > cat.benchmark;

  return (
    <>
      {/* Category pills */}
      <div className={styles.categoryPills} role="tablist" aria-label="Expense categories">
        {Object.entries(categories).map(([key, c]) => {
          const isActive = activeCategory === key;
          const p        = takeHome > 0 ? (c.total / takeHome) * 100 : 0;
          const over     = p > c.benchmark;
          return (
            <button key={key} type="button" role="tab" aria-selected={isActive}
              onClick={() => setActiveCategory(key)}
              className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ""} ${over && !isActive ? styles.categoryPillWarning : ""}`}
              style={isActive ? { background: c.color, borderColor: c.color, color: "#000" } : undefined}>
              {c.label}
              {over && !isActive && <span className={styles.categoryPillBadge}>↑</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.twoCol}>
        {/* Active category editor */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>{cat.label}</h2>
          <p className={styles.cardSub}>Benchmark: max {cat.benchmark}% of take-home income.</p>

          {cat.fields.map(f => (
            <SliderField key={f.label} label={f.label} min={0} max={f.max} step={f.step}
              value={f.val} onChange={f.set} prefix="R " />
          ))}

          <div className={styles.totalRow}>
            <span>Total {cat.label}</span>
            <span className={styles.totalVal} style={overBenchmark ? { color: "#f87171" } : undefined}>
              {fmt(cat.total)}
            </span>
          </div>

          {overBenchmark && (
            <div className={styles.benchmarkWarning}>
              ⚠️ {cat.label} is at {catPct.toFixed(0)}% of take-home — above the {cat.benchmark}% benchmark.
            </div>
          )}

          {/* Inline SA benchmark for this category */}
          <div style={{ marginTop: "1rem" }}>
            <BenchmarkCallout rule={cat.callout.rule} detail={cat.callout.detail} />
          </div>
        </div>

        {/* All categories overview */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>All Categories</h2>
          <p className={styles.cardSub}>Monthly spend vs take-home pay.</p>
          {Object.entries(categories).map(([key, c]) => {
            const p    = takeHome > 0 ? (c.total / takeHome) * 100 : 0;
            const over = p > c.benchmark;
            const fill = Math.min((p / c.benchmark) * 100, 100);
            return (
              <div key={key} className={styles.categoryOverviewRow}>
                <div className={styles.categoryOverviewHeader}>
                  <span className={styles.categoryOverviewLabel}>{c.label}</span>
                  <span className={styles.categoryOverviewAmt} style={over ? { color: "#f87171" } : undefined}>
                    {fmt(c.total)} · {p.toFixed(0)}%
                  </span>
                </div>
                <div className={styles.categoryOverviewTrack}>
                  <div className={styles.categoryOverviewFill}
                    style={{ width: `${fill}%`, background: over ? "#f87171" : c.color }} />
                </div>
                <div className={styles.categoryOverviewBenchmark}>Benchmark: {c.benchmark}%</div>
              </div>
            );
          })}
          <div className={styles.totalRow}>
            <span>Total Monthly Expenses</span>
            <span className={styles.totalVal}>{fmt(totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Breakdown bar */}
      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Expense Breakdown</h3>
        <MultiSegmentBar segments={Object.values(categories).map(c => ({
          label: c.label, value: c.total, color: c.color,
        }))} />
        <div className={styles.barLegend}>
          {Object.values(categories).map(c => (
            <div key={c.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: c.color }} />
              <div>
                <div className={styles.legendLabel}>{c.label}</div>
                <div className={styles.legendVal}>{fmt(c.total)} · {pct(c.total, totalExpenses)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debt overview */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Total Debt Position</h2>
        <p className={styles.cardSub}>Outstanding balances and interest burden.</p>
        <div className={styles.twoCol}>
          <div>
            <SliderField label="Total Outstanding Debt"         min={0} max={2000000} step={5000}
              value={totalDebt}    onChange={v => update("totalDebt", v)}    prefix="R " />
            <SliderField label="Monthly Minimum Payments"       min={0} max={20000}   step={250}
              value={minPayments}  onChange={v => update("minPayments", v)}  prefix="R " />
            <SliderField label="Weighted Average Interest Rate" min={0} max={30}      step={0.5}
              value={avgInterest}  onChange={v => update("avgInterest", v)}  suffix="%" />

            <BenchmarkCallout
              rule="Retail accounts carry 20–30% p.a. interest"
              detail="Store credit (Edgars, Woolworths, Truworths) is among the most expensive debt in SA. Prioritise clearing these before investing."
            />
          </div>
          <div>
            {[
              ["Total Debt",               fmt(totalDebt)],
              ["Annual Interest Cost",     fmt(totalDebt * (avgInterest / 100))],
              ["Debt-to-Income Ratio",     `${derived.metrics.dti.toFixed(1)}%`],
              ["Months to pay off (mins)", totalDebt > 0 && minPayments > 0 ? `~${Math.ceil(totalDebt / minPayments)} mo` : "—"],
            ].map(([k, v]) => (
              <div key={k} className={styles.taxRow}>
                <span className={styles.taxLabel}>{k}</span>
                <span className={styles.taxVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}