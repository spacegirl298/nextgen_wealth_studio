/**
 * MoneySnapshot.jsx
 * ─────────────────────────────────────────────────────────────
 * Money Snapshot — main page shell.
 *
 * All financial state lives in useSnapshotStore and auto-saves
 * to localStorage on every change. Each tab is its own component.
 *
 * Tab structure:
 *   Overview   → StatCards + budget bar + goal circles
 *   Income     → IncomeForm (with embedded glossary callouts)
 *   Expenses   → ExpenseCategories (with embedded benchmarks)
 *   Savings    → savings balances + portfolio summary (with embedded glossary)
 *   Progress   → goal editors + health detail
 *   Analysis   → NarrativeInsights (renamed from Insights, Education removed)
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import styles from "./Snapshot.module.css";

import { useSnapshotStore }       from "../../hooks/usesSnapshotStore";

import { LearnMore, NudgeBanner, StatCard, MultiSegmentBar, CircleProgress, SliderField, AutoSaveIndicator } from "./components/SnapshotUI";
import SectionCard         from "./components/SectionCard";
import IncomeForm          from "./components/IncomeForm";
import ExpenseCategories   from "./components/ExpenseCategories";
import MetricsSummary      from "./components/MetricsSummary";
import NarrativeInsights   from "./components/NarrativeInsights";

const TABS = ["Overview", "Income", "Expenses", "Savings", "Progress", "Analysis"];

export default function MoneySnapshot() {
  const [activeTab, setActiveTab] = useState("Overview");

  const store = useSnapshotStore();
  const { state, update, updateGoal, derived, activeNudges, dismissNudge, lastSaved } = store;
  const { grossMonthly, paye, uif, takeHome, housing, mobility, lifestyle, debtPayments, totalSavings, tfsaUsePct, metrics, healthScore, fmt, pct } = derived;

  // ── OVERVIEW ──────────────────────────────────────────────
  const renderOverview = () => (
    <>
      <div className={styles.statsRow}>
        <StatCard label="Gross Monthly Income" value={fmt(grossMonthly)}  sub="Before tax" />
        <StatCard label="Estimated PAYE Tax"   value={fmt(paye)}          sub={`${derived.tax.effectiveRate.toFixed(1)}% effective rate`} />
        <StatCard label="Take-Home Pay"        value={fmt(takeHome)}      sub="After PAYE & UIF" />
        <StatCard label="Monthly Disposable"   value={fmt(metrics.disposable)} sub="After all expenses" />
      </div>

      <SectionCard title="Monthly Budget">
        <MultiSegmentBar segments={[
          { label: "PAYE + UIF",        value: paye + uif,              color: "var(--clr-cat-purple-light)" },
          { label: "Housing",           value: housing,                 color: "var(--clr-cat-purple)" },
          { label: "Mobility",          value: mobility,                color: "var(--clr-cat-gold)" },
          { label: "Lifestyle",         value: lifestyle,               color: "var(--clr-cat-lavender)" },
          { label: "Debt Repayments",   value: debtPayments,            color: "var(--clr-cat-white-dim)" },
          { label: "Savings",           value: state.monthlySavingsContrib, color: "var(--clr-cat-blue)" },
        ]} />
        <div className={styles.barLegend}>
          {[
            { label: "PAYE + UIF",      val: fmt(paye + uif),       pctVal: pct(paye + uif, grossMonthly),             color: "var(--clr-cat-purple-light)", basis: "gross" },
            { label: "Housing",         val: fmt(housing),          pctVal: pct(housing, takeHome),                    color: "var(--clr-cat-purple)", basis: "take-home" },
            { label: "Mobility",        val: fmt(mobility),         pctVal: pct(mobility, takeHome),                   color: "var(--clr-cat-gold)", basis: "take-home" },
            { label: "Lifestyle",       val: fmt(lifestyle),        pctVal: pct(lifestyle, takeHome),                  color: "var(--clr-cat-lavender)", basis: "take-home" },
            { label: "Debt Repayments", val: fmt(debtPayments),     pctVal: pct(debtPayments, takeHome),               color: "var(--clr-cat-white-dim)", basis: "take-home" },
            { label: "Savings",         val: fmt(state.monthlySavingsContrib), pctVal: pct(state.monthlySavingsContrib, takeHome), color: "var(--clr-cat-blue)", basis: "take-home" },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>{item.val} · {item.pctVal}% of {item.basis}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Metric summary cards */}
      <div className={styles.statsRow}>
        <StatCard label="Debt-to-Income"  value={`${metrics.dti.toFixed(0)}%`}            sub={metrics.dti < 36 ? "Healthy" : metrics.dti < 50 ? "Elevated" : "High"} />
        <StatCard label="Savings Rate"    value={`${metrics.savingsRate.toFixed(0)}%`}     sub={metrics.savingsRate >= 15 ? "Excellent" : metrics.savingsRate >= 5 ? "Adequate" : "Low"} />
        <StatCard label="Emergency Cover" value={`${metrics.emergencyMonths.toFixed(1)} mo`} sub={metrics.emergencyMonths >= 3 ? "Secure" : "Build this up"} />
        <StatCard label="Health Score"    value={`${healthScore}%`}                        sub={healthScore >= 75 ? "Excellent" : healthScore >= 50 ? "Good" : "Needs work"} />
      </div>

      <SectionCard title="Goal Progress">
        <div className={styles.circleRow}>
          {derived.goals.map(g => (
            <CircleProgress key={g.name} pct={g.target > 0 ? (g.saved / g.target) * 100 : 0} label={g.name} />
          ))}
        </div>
      </SectionCard>
    </>
  );

  // ── SAVINGS ───────────────────────────────────────────────
  const renderSavings = () => (
    <>
      <div className={styles.twoCol}>
        <SectionCard
          title="Savings & Investments"
          subtitle="Current balances across all savings vehicles."
        >
          <SliderField label="Emergency Fund"             min={0} max={500000}  step={1000} value={state.emergencyFund}          onChange={v => update("emergencyFund", v)}          prefix="R " />
          <SliderField label="TFSA Balance"               min={0} max={500000}  step={1000} value={state.tfsa}                   onChange={v => update("tfsa", v)}                   prefix="R " />
          <SliderField label="Retirement Annuity"         min={0} max={2000000} step={5000} value={state.preAnnuity}             onChange={v => update("preAnnuity", v)}             prefix="R " />
          <SliderField label="Offshore Investments"       min={0} max={2000000} step={5000} value={state.offshoreInv}            onChange={v => update("offshoreInv", v)}             prefix="R " />
          <SliderField label="Local Investments"          min={0} max={2000000} step={5000} value={state.localInv}               onChange={v => update("localInv", v)}               prefix="R " />
          <SliderField label="Monthly Savings Contribution" min={0} max={50000} step={500}  value={state.monthlySavingsContrib}  onChange={v => update("monthlySavingsContrib", v)}  prefix="R " />
        </SectionCard>

        <SectionCard title="Portfolio Summary">
          <div className={styles.bigStatWrap}>
            <div className={styles.bigStat}>{fmt(totalSavings)}</div>
            <div className={styles.bigStatLabel}>Total Portfolio Value</div>
          </div>
          <div className={styles.divider} />

          <h3 className={styles.cardTitle} style={{ fontSize: "0.9rem", marginTop: "0.75rem" }}>TFSA Utilisation</h3>
          <div className={styles.tfsaBar}>
            <div className={styles.tfsaFill} style={{ width: `${tfsaUsePct}%` }} />
          </div>
          <div className={styles.tfsaMeta}>
            <span>{fmt(state.tfsa)} used</span>
            <span>R500,000 lifetime · {tfsaUsePct.toFixed(1)}%</span>
          </div>

          <div className={styles.divider} />
          <h3 className={styles.cardTitle} style={{ fontSize: "0.9rem" }}>Emergency Fund Coverage</h3>
          <div className={styles.tfsaBar}>
            <div className={styles.tfsaFill} style={{
              width: `${Math.min((metrics.emergencyMonths / 6) * 100, 100)}%`,
              background: metrics.emergencyMonths >= 3 ? "var(--clr-positive)" : metrics.emergencyMonths >= 1 ? "var(--clr-warning)" : "var(--clr-danger)",
            }} />
          </div>
          <div className={styles.tfsaMeta}>
            <span>{metrics.emergencyMonths.toFixed(1)} months covered</span>
            <span>Target: 3–6 months</span>
          </div>

          <div className={styles.divider} />
          {[
            ["Emergency Fund",         fmt(state.emergencyFund)],
            ["TFSA",                   fmt(state.tfsa)],
            ["Retirement Annuity",     fmt(state.preAnnuity)],
            ["Offshore Investments",   fmt(state.offshoreInv)],
            ["Local Investments",      fmt(state.localInv)],
            ["Total Portfolio",        fmt(totalSavings)],
          ].map(([k, v]) => (
            <div key={k} className={styles.taxRow}>
              <span className={styles.taxLabel}>{k}</span>
              <span className={styles.taxVal}>{v}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Savings benchmarks — embedded from Education */}
      <SectionCard
        title="Savings Benchmarks"
        subtitle="SA rules of thumb for building long-term financial resilience."
      >
        {[
          { rule: "Emergency fund = 3–6 months of expenses",   detail: "3 months for dual-income households; 6 months for single income or self-employed." },
          { rule: "Retirement savings = 15%+ of income",       detail: "National Treasury recommendation. Starting at 25 vs 35 requires roughly 3× less monthly contribution for the same outcome." },
          { rule: "TFSA: R36,000/year, R500,000 lifetime",     detail: "All growth inside a TFSA is completely tax-free. Unused annual allowances cannot be carried over." },
          { rule: "RA deduction = 27.5% of taxable income",    detail: "Capped at R350,000/year. Contributions reduce your taxable income, lowering PAYE immediately." },
        ].map(({ rule, detail }) => (
          <div key={rule} className={styles.benchmarkItem}>
            <div className={styles.benchmarkRule}>{rule}</div>
            <div className={styles.benchmarkDetail}>{detail}</div>
          </div>
        ))}
      </SectionCard>

      {/* Portfolio breakdown bar */}
      <SectionCard title="Portfolio Breakdown">
        <MultiSegmentBar segments={[
          { label: "Emergency Fund",      value: state.emergencyFund, color: "var(--clr-cat-lavender)" },
          { label: "TFSA",                value: state.tfsa,          color: "var(--clr-cat-purple)" },
          { label: "Retirement Annuity",  value: state.preAnnuity,    color: "var(--clr-cat-purple-light)" },
          { label: "Offshore Investments",value: state.offshoreInv,   color: "var(--clr-cat-gold)" },
          { label: "Local Investments",   value: state.localInv,      color: "var(--clr-cat-gold-dim)" },
        ]} />
        <div className={styles.barLegend}>
          {[
            { label: "Emergency Fund", val: fmt(state.emergencyFund), raw: state.emergencyFund, color: "var(--clr-cat-lavender)" },
            { label: "TFSA",                 val: fmt(state.tfsa),          color: "var(--clr-cat-purple)" },
            { label: "Retirement Annuity",   val: fmt(state.preAnnuity),    color: "var(--clr-cat-purple-light)" },
            { label: "Offshore Investments", val: fmt(state.offshoreInv),   color: "var(--clr-cat-gold)" },
            { label: "Local Investments",    val: fmt(state.localInv),      color: "var(--clr-cat-gold-dim)" },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <div>
                <div className={styles.legendLabel}>{item.label}</div>
                <div className={styles.legendVal}>{item.val} · {pct(item.raw, totalSavings)}%</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );

  // ── PROGRESS (Goals) ─────────────────────────────────────
  const renderProgress = () => (
    <>
      <div className={styles.twoCol}>
        {derived.goals.map((goal, i) => (
          <SectionCard key={i} title={`Goal ${i + 1}`}>
            <div className={styles.goalNameRow}>
              <label htmlFor={`goal-name-${i}`} className={styles.fieldLabel}>Goal Name</label>
              <input id={`goal-name-${i}`} className={styles.goalNameInput}
                value={goal.name} onChange={e => updateGoal(i, "name", e.target.value)}
                placeholder="e.g. Emergency Fund" />
            </div>
            <SliderField label="Target Amount"     min={0} max={1000000} step={1000} value={goal.target}  onChange={v => updateGoal(i, "target", v)}  prefix="R " />
            <SliderField label="Current Saved"     min={0} max={1000000} step={1000} value={goal.saved}   onChange={v => updateGoal(i, "saved", v)}   prefix="R " />
            <SliderField label="Monthly Allocation"min={0} max={20000}   step={100}  value={goal.monthly} onChange={v => updateGoal(i, "monthly", v)} prefix="R " />
            {goal.target > 0 && goal.monthly > 0 && goal.saved < goal.target && (
              <div className={styles.goalEta}>
                ~{Math.ceil((goal.target - goal.saved) / goal.monthly)} months to reach goal
              </div>
            )}
            <div className={styles.goalProgress}>
              <div className={styles.goalProgressBar}>
                <div className={styles.goalProgressFill}
                  style={{ width: `${goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0}%` }} />
              </div>
              <span className={styles.goalProgressPct}>
                {goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0}%
              </span>
            </div>
          </SectionCard>
        ))}
      </div>

      <MetricsSummary state={state} derived={derived} />
    </>
  );

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Money Snapshot</h1>
        <p className={styles.heroSub}>
          Let's unpack your financial position.
        </p>
        <AutoSaveIndicator lastSaved={lastSaved} />
      </div>

      <LearnMore />

      <NudgeBanner nudges={activeNudges} onDismiss={dismissNudge} />

      <nav aria-label="Snapshot sections">
        <div className={styles.tabs} role="tablist">
          {TABS.map(tab => (
            <button key={tab} role="tab" aria-selected={activeTab === tab} type="button"
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <div className={styles.tabContent} role="tabpanel" aria-label={`${activeTab} section`}>
          {activeTab === "Overview"  && renderOverview()}
          {activeTab === "Income"    && <IncomeForm        state={state} update={update} derived={derived} />}
          {activeTab === "Expenses"  && <ExpenseCategories state={state} update={update} derived={derived} />}
          {activeTab === "Savings"   && renderSavings()}
          {activeTab === "Progress"  && renderProgress()}
          {activeTab === "Analysis"  && <NarrativeInsights state={state} derived={derived} />}
        </div>
      </main>
    </div>
  );
}