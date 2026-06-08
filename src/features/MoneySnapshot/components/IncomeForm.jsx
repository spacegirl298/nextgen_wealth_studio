/**
 * IncomeForm.jsx
 * ─────────────────────────────────────────────────────────────
 * Income entry with live SARS 2025/26 tax calculation.
 * Reads/writes via useSnapshotStore — auto-saves on every change.
 * Inline glossary callouts replace the Education tab for tax terms.
 * ─────────────────────────────────────────────────────────────
 */

import styles from "../Snapshot.module.css";
import { SliderField, MultiSegmentBar } from "../components/SnapshotUI";
import { calcMedicalAidCredit } from "../../../hooks/usesSnapshotStore";

const TAX_BRACKETS = [
  { min: 0,        max: 237100,   base: 0,      rate: 0.18 },
  { min: 237100,   max: 370500,   base: 42678,  rate: 0.26 },
  { min: 370500,   max: 512800,   base: 77362,  rate: 0.31 },
  { min: 512800,   max: 673000,   base: 121475, rate: 0.36 },
  { min: 673000,   max: 857900,   base: 179147, rate: 0.39 },
  { min: 857900,   max: 1817000,  base: 251258, rate: 0.41 },
  { min: 1817000,  max: Infinity, base: 644489, rate: 0.45 },
];

/** Inline callout for contextual definitions — replaces the Education tab */
function GlossaryCallout({ term, definition }) {
  return (
    <details className={styles.glossaryItem} style={{ marginBottom: "0.5rem" }}>
      <summary className={styles.glossaryTerm} style={{ fontSize: "0.78rem", opacity: 0.75 }}>
        What is {term}?
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <p className={styles.glossaryDef}>{definition}</p>
    </details>
  );
}

export default function IncomeForm({ state, update, derived }) {
  const { salary, investIncome, rentalIncome, bonuses, sideIncome, medDependants } = state;
  const { grossMonthly, paye, uif, takeHome, tax, fmt } = derived;

  return (
    <>
      <div className={styles.twoCol}>
        {/* Income Sources */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Income Sources</h2>
          <p className={styles.cardSub}>Enter all sources of monthly income. Changes save automatically.</p>

          <SliderField label="Gross Monthly Salary" min={0} max={200000} step={500}
            value={salary} onChange={v => update("salary", v)} prefix="R " />
          <SliderField label="Investment Income" min={0} max={50000} step={250}
            value={investIncome} onChange={v => update("investIncome", v)} prefix="R " />
          <SliderField label="Rental Income" min={0} max={50000} step={250}
            value={rentalIncome} onChange={v => update("rentalIncome", v)} prefix="R " />
          <SliderField label="Bonuses" min={0} max={50000} step={250}
            value={bonuses} onChange={v => update("bonuses", v)} prefix="R " />
          <SliderField label="Side Business Income" min={0} max={50000} step={250}
            value={sideIncome} onChange={v => update("sideIncome", v)} prefix="R " />

          <div className={styles.totalRow}>
            <span>Total Gross Monthly</span>
            <span className={styles.totalVal}>{fmt(grossMonthly)}</span>
          </div>

          {/* Inline term definitions — contextual and always visible */}
          <div style={{ marginTop: "1.25rem" }}>
            <GlossaryCallout
              term="PAYE"
              definition="Pay As You Earn — your employer deducts income tax from your salary each month and pays it directly to SARS on your behalf. Calculated using annual brackets, then divided by 12."
            />
            <GlossaryCallout
              term="UIF"
              definition="Unemployment Insurance Fund — 1% of your gross salary (capped at R177.12/month) that provides short-term relief if you lose your job, become ill, or go on maternity leave."
            />
            <GlossaryCallout
              term="Effective Tax Rate"
              definition="The actual percentage of your gross income going to PAYE after rebates and credits are applied. Always lower than your marginal (bracket) rate."
            />
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>SARS Tax Breakdown</h2>
          <p className={styles.cardSub}>2025/26 PAYE brackets · Primary rebate R17,235 · Medical aid credits applied.</p>

          <div className={styles.fieldRow} style={{ marginBottom: "1rem" }}>
            <label htmlFor="med-dependants" className={styles.fieldLabel}>Medical Aid Dependants</label>
            <div className={styles.sliderWrap}>
              <div className={styles.sliderTrackWrap}>
                <input id="med-dependants" type="range" min={0} max={8} step={1}
                  value={medDependants} onChange={e => update("medDependants", Number(e.target.value))}
                  className={styles.slider} style={{ "--pct": `${(medDependants / 8) * 100}%` }}
                  aria-label={`Medical aid dependants: ${medDependants}`} />
              </div>
              <span className={styles.sliderValue}>{medDependants}</span>
            </div>
          </div>

          <GlossaryCallout
            term="Medical Aid Credit"
            definition="A fixed monthly credit that directly reduces your PAYE — not just your taxable income. 2025/26 rates: R364 for the primary member, plus R246 per additional dependant."
          />

          <div className={styles.taxTable} style={{ marginTop: "0.75rem" }}>
            {[
              ["Annual Gross Income",         `R${(grossMonthly * 12).toLocaleString()}`],
              ["Tax before credits",          `R${Math.round((tax.annualTax ?? 0) + calcMedicalAidCredit(medDependants) * 12).toLocaleString()}`],
              ["Medical Aid Credit (annual)", `-R${Math.round(calcMedicalAidCredit(medDependants) * 12).toLocaleString()}`],
              ["Annual PAYE (after credits)", `R${Math.round(tax.annualTax ?? 0).toLocaleString()}`],
              ["Monthly PAYE",                fmt(paye)],
              ["Monthly UIF (1%, capped)",    fmt(uif)],
              ["Effective PAYE Rate",         `${(tax.effectiveRate ?? 0).toFixed(2)}%`],
              ["Monthly Take-Home",           fmt(takeHome)],
            ].map(([k, v]) => (
              <div key={k} className={styles.taxRow}>
                <span className={styles.taxLabel}>{k}</span>
                <span className={styles.taxVal} style={k === "Monthly Take-Home" ? { color: "var(--clr-gold)" } : undefined}>{v}</span>
              </div>
            ))}
          </div>

          <div className={styles.taxDisclaimer}>
            Calculated using SARS 2025/26 brackets. UIF capped at R177.12/month.
            For complex situations, consult a tax practitioner.
          </div>
        </div>
      </div>

      {/* Income Breakdown Bar */}
      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Income Breakdown</h3>
        <MultiSegmentBar segments={[
          { label: "Salary",           value: salary,       color: "#c84bff" },
          { label: "Investment Income",value: investIncome, color: "#f8d299" },
          { label: "Rental Income",    value: rentalIncome, color: "rgba(180,100,255,0.55)" },
          { label: "Bonuses",          value: bonuses,      color: "rgba(200,75,255,0.4)" },
          { label: "Side Income",      value: sideIncome,   color: "#f0e8ff" },
        ]} />
        <div className={styles.barLegend}>
          {[
            { label: "Salary",           val: fmt(salary),       color: "#c84bff" },
            { label: "Investment Income",val: fmt(investIncome), color: "#f8d299" },
            { label: "Rental Income",    val: fmt(rentalIncome), color: "rgba(180,100,255,0.55)" },
            { label: "Bonuses",          val: fmt(bonuses),      color: "rgba(200,75,255,0.4)" },
            { label: "Side Income",      val: fmt(sideIncome),   color: "#f0e8ff" },
          ].filter(item => {
            const raw = item.val.replace(/[R,\s]/g, "");
            return Number(raw) > 0;
          }).map(item => (
            <div key={item.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax bracket reference */}
      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Tax Brackets 2025/26</h3>
        <p className={styles.cardSub}>SARS individual income tax — primary rebate R17,235 deducted from gross tax.</p>

        <GlossaryCallout
          term="Marginal Tax Rate"
          definition="The rate applied to the last rand you earn — i.e. the bracket your income falls into. Your effective rate is always lower because lower portions of your income are taxed at lower rates."
        />

        <div className={styles.taxTable} style={{ marginTop: "0.75rem" }}>
          {TAX_BRACKETS.filter(b => b.max !== Infinity).map((b, i) => (
            <div key={i} className={`${styles.taxRow} ${tax.annualGross > b.min && tax.annualGross <= b.max ? styles.taxRowActive : ""}`}>
              <span className={styles.taxLabel}>R{b.min.toLocaleString()} – R{b.max.toLocaleString()}</span>
              <span className={styles.taxVal}>{(b.rate * 100).toFixed(0)}% marginal</span>
            </div>
          ))}
          <div className={`${styles.taxRow} ${tax.annualGross > 1817000 ? styles.taxRowActive : ""}`}>
            <span className={styles.taxLabel}>R1,817,001 and above</span>
            <span className={styles.taxVal}>45% marginal</span>
          </div>
        </div>
      </div>
    </>
  );
}