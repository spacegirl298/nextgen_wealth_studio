
import styles from "../../Studios.module.css";

const WINNER_COLORS = {
  "Offshore-blended": "var(--clr-gold, #f8d299)",
  "Local only":       "#a78bfa",
};

export default function OffshoreVerdict({ results }) {
  if (!results) return null;

  const { blended, winner, verdict, breakevenYear } = results;
  const winnerColor = WINNER_COLORS[winner] || "var(--clr-gold)";

  const { localReturn, offshoreReturn, randDepreciation, taxRate } = results.inputs;

  const offshoreZarReturn = (offshoreReturn * (1 - taxRate / 100) + randDepreciation).toFixed(2);
  const localNetReturn    = (localReturn    * (1 - taxRate / 100)).toFixed(2);

  return (
    <>
      {/* Winner + verdict */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Studio Verdict</h2>
        <div className={styles.verdictWinner} style={{ color: winnerColor }}>
          {winner} wins
        </div>
        <p className={styles.verdictText}>{verdict}</p>
        {breakevenYear && (
          <p className={styles.verdictText} style={{ marginTop: "0.5rem", opacity: 0.75 }}>
            Your blend overtakes local-only in <strong>year {breakevenYear}</strong>.
          </p>
        )}
      </div>

      {/* Return breakdown */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Effective Returns</h2>
        <p className={styles.cardSub}>
          How your assumption inputs translate into after-tax ZAR returns for each allocation.
        </p>
        <table className={styles.table}>
          <tbody>
            {[
              ["Local (after tax)",        `${localNetReturn}% p.a.`],
              ["Offshore USD (after tax)", `${(offshoreReturn * (1 - taxRate / 100)).toFixed(2)}% p.a.`],
              ["Rand depreciation uplift", `+${randDepreciation}% p.a.`],
              ["Offshore in ZAR (total)",  `${offshoreZarReturn}% p.a.`],
              ["Blended portfolio",        `${blended.blendedReturnPct}% p.a.`],
            ].map(([label, value], i) => (
              <tr key={label} style={i === 4 ? { borderTop: "1px solid rgba(248,210,153,0.4)" } : {}}>
                <td className={styles.rowLabel}>{label}</td>
                <td style={{ textAlign: "right", color: i === 4 ? "var(--clr-gold)" : undefined }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}