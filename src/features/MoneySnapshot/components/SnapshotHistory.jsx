
import styles from "../Snapshot.module.css";
import { compareSnapshots, getSnapshotTrend } from "../utils/snapshotHelpers";

function TrendIcon({ direction, inverse = false }) {
  const positive = inverse ? direction === "down" : direction === "up";
  const color    = direction === "flat" ? "rgba(255,255,255,0.4)" : positive ? "#4ade80" : "#f87171";
  const arrow    = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  return <span style={{ color, fontWeight: 700, fontSize: "1rem" }}>{arrow}</span>;
}

export default function SnapshotHistory({ history, derived, onSave, saveSuccess }) {
  const fmt = derived.fmt;
  const trends = getSnapshotTrend(history);

  return (
    <>
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Snapshot History</h2>
        <p className={styles.cardSub}>
          Your data saves automatically as you make changes. Use the button below to bookmark your
          current position and track progress over time. Up to 12 snapshots stored.
        </p>

        <div className={styles.saveSnapshotRow}>
          <button type="button" onClick={onSave}
            className={`${styles.saveBtn} ${saveSuccess ? styles.saveBtnSuccess : ""}`}
            aria-live="polite">
            {saveSuccess
              ? <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Snapshot saved!</>
              : "Save current snapshot"}
          </button>
          {history.length > 0 && (
            <span className={styles.snapshotCount}>{history.length} snapshot{history.length !== 1 ? "s" : ""} saved</span>
          )}
        </div>

        {history.length === 0 ? (
          <div className={styles.emptyState}>
            No snapshots yet — save your first one to start tracking progress over time.
          </div>
        ) : (
          <div className={styles.snapshotList}>
            {history.map((snap, i) => (
              <div key={snap.id}
                className={`${styles.snapshotItem} ${i === 0 ? styles.snapshotItemLatest : ""}`}>
                <div className={styles.snapshotItemHeader}>
                  <span className={styles.snapshotDate}>{snap.date}</span>
                  {i === 0 && <span className={styles.latestBadge}>Latest</span>}
                </div>
                <div className={styles.snapshotGrid}>
                  {[
                    { label: "Take-Home",  value: fmt(snap.takeHome) },
                    { label: "Expenses",   value: fmt(snap.totalMonthlyExpenses) },
                    { label: "Savings",    value: fmt(snap.totalSavings) },
                    { label: "Health",     value: `${snap.healthScore}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.snapshotMetric}>
                      <div className={styles.snapshotMetricLabel}>{label}</div>
                      <div className={styles.snapshotMetricValue}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delta comparison — newest vs previous */}
      {history.length >= 2 && (() => {
        const delta = compareSnapshots(history[0], history[1]);
        const rows = [
          { label: "Take-Home Pay",    key: "takeHome",              inverse: false },
          { label: "Monthly Expenses", key: "totalMonthlyExpenses",  inverse: true  },
          { label: "Total Savings",    key: "totalSavings",          inverse: false },
          { label: "Health Score",     key: "healthScore",           inverse: false, suffix: "%" },
          { label: "Savings Rate",     key: "savingsRate",           inverse: false, suffix: "%" },
        ];
        return (
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Progress Since Last Snapshot</h2>
            <p className={styles.cardSub}>{history[0].date} vs {history[1].date}</p>
            <div className={styles.taxTable}>
              {rows.map(({ label, key, inverse, suffix }) => {
                const d        = delta[key];
                const positive = inverse ? d.diff < 0 : d.diff > 0;
                const color    = d.diff === 0 ? "rgba(255,255,255,0.4)" : positive ? "#4ade80" : "#f87171";
                const arrow    = d.diff > 0 ? "↑" : d.diff < 0 ? "↓" : "→";
                const amount   = suffix
                  ? `${Math.abs(d.diff).toFixed(1)}${suffix}`
                  : `R${Math.abs(Math.round(d.diff)).toLocaleString()}`;
                return (
                  <div key={label} className={styles.taxRow}>
                    <span className={styles.taxLabel}>{label}</span>
                    <span style={{ color, fontWeight: 600, fontSize: "0.82rem" }}>
                      {arrow} {amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Long-term trends */}
      {history.length >= 3 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Long-Term Trends</h2>
          <p className={styles.cardSub}>Across all {history.length} snapshots.</p>
          <div className={styles.trendRow}>
            {[
              { label: "Health Score",   key: "healthScore",   inverse: false },
              { label: "Savings Rate",   key: "savingsRate",   inverse: false },
              { label: "DTI Ratio",      key: "dti",           inverse: true  },
              { label: "Emergency Fund", key: "emergencyMonths", inverse: false },
              { label: "Total Savings",  key: "totalSavings",  inverse: false },
            ].map(({ label, key, inverse }) => {
              const dir = trends[key] ?? "flat";
              const positive = inverse ? dir === "down" : dir === "up";
              const color = dir === "flat" ? "rgba(255,255,255,0.4)" : positive ? "#4ade80" : "#f87171";
              return (
                <div key={label} className={styles.trendCard}>
                  <div className={styles.trendIcon} style={{ color }}>
                    {dir === "up" ? "↑" : dir === "down" ? "↓" : "→"}
                  </div>
                  <div className={styles.trendLabel}>{label}</div>
                  <div className={styles.trendDirection} style={{ color }}>
                    {dir === "flat" ? "Stable" : positive ? "Improving" : "Declining"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}