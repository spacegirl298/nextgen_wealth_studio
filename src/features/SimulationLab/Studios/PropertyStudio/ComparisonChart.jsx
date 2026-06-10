/**
 * ComparisonChart.jsx
 * Dual-line chart: net worth of buying vs renting over the time horizon.
 * Crossover year is highlighted with a reference line.
 * Uses recharts LineChart.
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fmtRandShort } from "../../utils/StudioCalculations";
import styles from "../../Studios.module.css";

const GOLD   = "var(--clr-gold, #f8d299)";
const PURPLE = "#a78bfa";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "rgba(18,10,30,0.97)",
      border: "1px solid rgba(248,210,153,0.3)",
      borderRadius: 8,
      padding: "0.7rem 1rem",
      fontFamily: "var(--font-body)",
      fontSize: "0.78rem",
    }}>
      <p style={{ margin: "0 0 0.4rem", fontWeight: 600, color: "var(--clr-gold)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "0.15rem 0", color: p.color }}>
          {p.name}: {fmtRandShort(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function ComparisonChart({ chartData, breakevenYear }) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.cardTitle} style={{ marginBottom: "0.25rem" }}>
        Net Worth Over Time
      </h2>
      <p className={styles.cardSub} style={{ marginBottom: "1.25rem" }}>
        Buying builds equity; renting grows via investing the difference. The line that finishes higher wins.
        {breakevenYear && (
          <> The paths cross in <strong style={{ color: "var(--clr-gold)" }}>year {breakevenYear}</strong>.</>
        )}
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtRandShort}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={62}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.78rem", fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}
          />

          {breakevenYear && (
            <ReferenceLine
              x={`Year ${breakevenYear}`}
              stroke="rgba(248,210,153,0.4)"
              strokeDasharray="4 3"
              label={{
                value: `Crossover yr ${breakevenYear}`,
                fill: "rgba(248,210,153,0.7)",
                fontSize: 10,
                position: "insideTopLeft",
                fontFamily: "var(--font-body)",
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="buying"
            name="Buying (equity)"
            stroke={GOLD}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: GOLD }}
          />
          <Line
            type="monotone"
            dataKey="renting"
            name="Renting (investments)"
            stroke={PURPLE}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: PURPLE }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}