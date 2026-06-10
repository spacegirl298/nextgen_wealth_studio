
import { useState } from "react";
import styles from "../Snapshot.module.css";
import { InsightCard } from "../components/SnapshotUI";
import { generateInsights, GLOSSARY, SA_BENCHMARKS } from "../utils/snapshotHelpers";

export default function NarrativeInsights({ state, derived }) {
  const [glossarySearch, setGlossarySearch] = useState("");
  const { metrics, housing, takeHome, totalExpenses, healthScore, fmt } = derived;
  const { dti, savingsRate, emergencyMonths, disposable } = metrics;

  const insights = generateInsights({
    dti, savingsRate, emergencyMonths, disposable,
    housing, netIncome: takeHome, totalExpenses,
  });

  const recommendations = [
    emergencyMonths < 3 && {
      action: "Build your emergency fund first",
      detail: `You need ${fmt(Math.max(0, totalExpenses * 3 - state.emergencyFund))} more to reach a 3-month safety net. Open a separate notice account and automate a fixed monthly transfer.`,
      priority: "High",
    },
    dti > 36 && {
      action: "Reduce high-interest debt",
      detail: "List all debts by interest rate and apply any disposable income to the highest-rate debt first (avalanche method). Even R500/month extra makes a measurable difference.",
      priority: "High",
    },
    state.tfsa < 36000 && {
      action: "Top up your TFSA",
      detail: `You can still contribute R${(36000 - state.tfsa).toLocaleString()} to your TFSA this tax year. Growth inside a TFSA is completely free of income tax, dividends tax, and CGT.`,
      priority: "Medium",
    },
    savingsRate < 15 && {
      action: "Increase your savings rate to 15%",
      detail: `Target: ${fmt(takeHome * 0.15)}/month. Consider a salary deduction into an RA or unit trust so the money never touches your current account.`,
      priority: "Medium",
    },
    state.preAnnuity === 0 && {
      action: "Start a Retirement Annuity",
      detail: "RA contributions are tax-deductible up to 27.5% of taxable income. This reduces your PAYE now while building tax-sheltered wealth for retirement.",
      priority: "Medium",
    },
  ].filter(Boolean);

  const filteredGlossary = glossarySearch
    ? GLOSSARY.filter(g =>
        g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
      )
    : GLOSSARY;

  return (
    <>
      {/* Score summary + insights */}
      <div className={styles.sectionCard}>
        <div className={styles.insightScoreRow}>
          <div>
            <h2 className={styles.cardTitle}>Your Financial Picture</h2>
            <p className={styles.cardSub}>Plain-English analysis based on South African benchmarks.</p>
          </div>
          <div className={styles.insightScoreBadge}
            style={{ color: healthScore >= 75 ? "#4ade80" : healthScore >= 50 ? "#f59e0b" : "#f87171" }}>
            {healthScore}%
            <span className={styles.insightScoreBadgeLabel}>Health Score</span>
          </div>
        </div>

        {insights.length > 0
          ? insights.map((ins, i) => <InsightCard key={i} text={ins.text} sentiment={ins.sentiment} />)
          : (
            <div className={styles.emptyState}>
              Enter your income and expenses to generate personalised insights.
            </div>
          )}
      </div>

      {/* Recommended actions */}
      {recommendations.length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Recommended Actions</h2>
          <p className={styles.cardSub}>Prioritised next steps based on your current position.</p>

          {recommendations.map((rec, i) => (
            <div key={i} className={`${styles.recCard} ${rec.priority === "High" ? styles.recCardHigh : styles.recCardMed}`}>
              <div className={styles.recCardHeader}>
                <span className={styles.recCardAction}>{rec.action}</span>
                <span className={`${styles.recCardBadge} ${rec.priority === "High" ? styles.recCardBadgeHigh : styles.recCardBadgeMed}`}>
                  {rec.priority}
                </span>
              </div>
              <p className={styles.recCardDetail}>{rec.detail}</p>
            </div>
          ))}
        </div>
      )}

      {recommendations.length === 0 && insights.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.allGoodState}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="#4ade80" strokeWidth="2" />
              <path d="M12 20l6 6 10-12" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>You're hitting all the key benchmarks. Keep maintaining your current habits and review monthly.</p>
          </div>
        </div>
      )}

      {/* SA Financial Benchmarks — embedded from Education */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>SA Financial Benchmarks</h2>
        <p className={styles.cardSub}>Rules of thumb used by South African financial planners — how your numbers stack up.</p>
        {SA_BENCHMARKS.map(({ rule, detail }) => (
          <div key={rule} className={styles.benchmarkItem}>
            <div className={styles.benchmarkRule}>{rule}</div>
            <div className={styles.benchmarkDetail}>{detail}</div>
          </div>
        ))}
      </div>

      {/* Glossary — embedded from Education */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Terms Explained</h2>
        <p className={styles.cardSub}>South African financial terms in plain English.</p>
        <div className={styles.glossarySearch}>
          <input
            type="search"
            placeholder="Search terms…"
            value={glossarySearch}
            onChange={e => setGlossarySearch(e.target.value)}
            aria-label="Search glossary terms"
            className={styles.glossaryInput}
          />
        </div>
        {filteredGlossary.map(({ term, definition }) => (
          <details key={term} className={styles.glossaryItem}>
            <summary className={styles.glossaryTerm}>
              {term}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </summary>
            <p className={styles.glossaryDef}>{definition}</p>
          </details>
        ))}
      </div>
    </>
  );
}