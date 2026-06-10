
import styles from "../Snapshot.module.css";
import { StatCard, CircleProgress } from "../components/SnapshotUI";

function HealthBadge({ health }) {
  const map = {
    healthy:  { label: "Healthy",    color: "#4ade80" },
    "at-risk":{ label: "At Risk",    color: "#f59e0b" },
    critical: { label: "Needs Work", color: "#f87171" },
  };
  const config = map[health] ?? map.critical;
  return (
    <span className={styles.healthBadge} style={{ background: `${config.color}22`, color: config.color, borderColor: `${config.color}55` }}>
      {config.label}
    </span>
  );
}

export default function MetricsSummary({ state, derived }) {
  const { metrics, healthScore, goals, fmt } = derived;
  const { dti, savingsRate, emergencyMonths, disposable, health } = metrics;

  const scoreColor = healthScore >= 75 ? "#4ade80" : healthScore >= 50 ? "#f59e0b" : "#f87171";
  const circ = 2 * Math.PI * 56;

  return (
    <>
      {/* Four key stat cards */}
      <div className={styles.statsRow}>
        <StatCard
          label="Debt-to-Income"
          value={`${dti.toFixed(0)}%`}
          sub={dti < 36 ? "Healthy" : dti < 50 ? "Elevated" : "High"}
          accent={dti < 36 ? "#4ade80" : dti < 50 ? "#f59e0b" : "#f87171"}
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          sub={savingsRate >= 15 ? "Excellent" : savingsRate >= 5 ? "Adequate" : "Low"}
          accent={savingsRate >= 15 ? "#4ade80" : savingsRate >= 5 ? "#f59e0b" : "#f87171"}
        />
        <StatCard
          label="Emergency Cover"
          value={`${emergencyMonths.toFixed(1)} mo`}
          sub={emergencyMonths >= 3 ? "Secure" : "Build this up"}
          accent={emergencyMonths >= 3 ? "#4ade80" : "#f59e0b"}
        />
        <StatCard
          label="Disposable Income"
          value={fmt(disposable)}
          sub="After expenses & savings"
          accent={disposable >= 0 ? "#f8d299" : "#f87171"}
        />
      </div>

      <div className={styles.twoCol}>
        {/* Health metrics detail */}
        <div className={styles.sectionCard}>
          <div className={styles.metricsHeaderRow}>
            <h2 className={styles.cardTitle}>Financial Health</h2>
            <HealthBadge health={health} />
          </div>
          <p className={styles.cardSub}>Key ratios measured against South African benchmarks.</p>

          {[
            {
              label: "Debt-to-Income Ratio",
              value: `${dti.toFixed(1)}%`,
              detail: "Healthy: below 36%",
              color: dti < 36 ? "#4ade80" : dti < 50 ? "#f59e0b" : "#f87171",
              fillPct: Math.min(dti / 50 * 100, 100),
            },
            {
              label: "Savings Rate",
              value: `${savingsRate.toFixed(1)}%`,
              detail: "Target: 15%+",
              color: savingsRate >= 15 ? "#4ade80" : savingsRate >= 5 ? "#f59e0b" : "#f87171",
              fillPct: Math.min(savingsRate / 20 * 100, 100),
            },
            {
              label: "Emergency Fund",
              value: `${emergencyMonths.toFixed(1)} months`,
              detail: "Target: 3–6 months",
              color: emergencyMonths >= 3 ? "#4ade80" : emergencyMonths >= 1 ? "#f59e0b" : "#f87171",
              fillPct: Math.min((emergencyMonths / 6) * 100, 100),
            },
            {
              label: "Housing Ratio",
              value: `${derived.takeHome > 0 ? ((derived.housing / derived.takeHome) * 100).toFixed(1) : 0}%`,
              detail: "Limit: 30%",
              color: derived.takeHome > 0 && derived.housing / derived.takeHome < 0.30 ? "#4ade80" : "#f59e0b",
              fillPct: derived.takeHome > 0 ? Math.min((derived.housing / derived.takeHome / 0.30) * 100, 120) : 0,
            },
          ].map(row => (
            <div key={row.label} className={styles.healthRow}>
              <div className={styles.healthRowHeader}>
                <span className={styles.healthLabel}>{row.label}</span>
                <span className={styles.healthVal} style={{ color: row.color }}>{row.value}</span>
              </div>
              <div className={styles.healthTrack}>
                <div className={styles.healthFill} style={{ width: `${Math.min(row.fillPct, 100)}%`, background: row.color }} />
              </div>
              <div className={styles.healthDetail}>{row.detail}</div>
            </div>
          ))}
        </div>

        {/* Health Score gauge */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>Health Score</h2>
          <div className={styles.healthScoreWrap}>
            <svg width="140" height="140" viewBox="0 0 140 140" role="img"
              aria-label={`Financial health score: ${healthScore}%`}>
              <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle cx="70" cy="70" r="56" fill="none"
                stroke={scoreColor} strokeWidth="12"
                strokeDasharray={`${(healthScore / 100) * circ} ${circ}`}
                strokeDashoffset={circ * 0.25} strokeLinecap="round" />
              <text x="70" y="74" textAnchor="middle" fill={scoreColor} fontSize="26" fontWeight="700">
                {healthScore}%
              </text>
            </svg>
            <p className={styles.healthScoreLabel}>
              {healthScore >= 75
                ? "Excellent — you're on track for long-term financial security."
                : healthScore >= 50
                  ? "Good — a few areas to improve. Check the Insights tab for next steps."
                  : "Needs attention — focus on debt reduction and building your emergency fund first."}
            </p>
          </div>

          {/* Score breakdown */}
          <div className={styles.scoreBreakdown}>
            {[
              { label: "DTI",             score: dti < 36 ? 25 : dti < 50 ? 12 : 0,         max: 25 },
              { label: "Savings Rate",    score: savingsRate >= 15 ? 25 : savingsRate >= 5 ? 12 : 0, max: 25 },
              { label: "Emergency Fund",  score: emergencyMonths >= 3 ? 25 : emergencyMonths >= 1 ? 12 : 0, max: 25 },
              { label: "Cash Flow",       score: disposable > 0 ? 15 : 0,                    max: 15 },
              { label: "TFSA",            score: state.tfsa > 0 ? 10 : 0,                    max: 10 },
            ].map(row => (
              <div key={row.label} className={styles.scoreRow}>
                <span className={styles.scoreRowLabel}>{row.label}</span>
                <div className={styles.scoreRowTrack}>
                  <div className={styles.scoreRowFill}
                    style={{ width: `${(row.score / row.max) * 100}%`, background: row.score === row.max ? "#4ade80" : row.score > 0 ? "#f59e0b" : "#f87171" }} />
                </div>
                <span className={styles.scoreRowVal}>{row.score}/{row.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className={styles.sectionCard}>
        <h3 className={styles.cardTitle}>Goal Progress</h3>
        <p className={styles.cardSub}>Set and track your financial goals in the Progress tab.</p>
        <div className={styles.circleRow}>
          {goals.map(g => (
            <CircleProgress key={g.name}
              pct={g.target > 0 ? (g.saved / g.target) * 100 : 0}
              label={g.name} />
          ))}
        </div>
      </div>
    </>
  );
}