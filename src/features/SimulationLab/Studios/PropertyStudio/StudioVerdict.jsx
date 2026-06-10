/**
 * StudioVerdict.jsx
 * Verdict panel for the Property simulation.
 * Shows: winner banner, verdict text, upfront buying cost breakdown.
 * "Things to Consider" is rendered by the parent in the left column.
 */
import styles from "../../Studios.module.css";
import { fmtRand } from "../../utils/StudioCalculations";

const WINNER_COLORS = {
  Buying:  "var(--clr-gold, #f8d299)",
  Renting: "#a78bfa",
};

const Val = ({ children, highlight }) => (
  <td style={{ color: highlight ? "var(--clr-gold)" : undefined }}>
    {children}
  </td>
);

export default function StudioVerdict({ results, horizon }) {
  if (!results) return null;

  const { buying, renting, winner, verdict, breakevenYear } = results;
  const winnerColor = WINNER_COLORS[winner] || "var(--clr-gold)";

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
            Buying overtakes renting in <strong>year {breakevenYear}</strong>.
          </p>
        )}
      </div>

      {/* Upfront buying costs breakdown */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Upfront Buying Costs</h2>
        <p className={styles.cardSub}>
          These costs are paid before you get the keys — they don't appear in your monthly repayment.
        </p>
        <table className={styles.table}>
          <tbody>
            {[
              ["Deposit",                fmtRand(results.inputs.savings)],
              ["Transfer Duty",          buying.transferDutyFmt],
              ["Transfer Attorney Fees", buying.transferFeesFmt],
              ["Bond Registration",      buying.bondRegCostsFmt],
              ["Total Upfront",          buying.upfrontCostFmt],
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