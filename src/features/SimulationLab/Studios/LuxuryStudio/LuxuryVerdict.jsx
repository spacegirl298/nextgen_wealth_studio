/**
 * LuxuryVerdict.jsx
 * Verdict panel for the Luxury Car vs Investing simulation.
 * Shows: winner banner, verdict text, upfront cost breakdown.
 * "Things to Consider" is rendered by the parent in the left column.
 */
import styles from "../../Studios.module.css";
import { fmtRand } from "../../utils/StudioCalculations";

const WINNER_COLORS = {
  Investing:    "#a78bfa",
  "Luxury Car": "var(--clr-gold, #f8d299)",
};

export default function CarVerdict({ results, horizon }) {
  if (!results) return null;

  const { car, investing, winner, verdict, breakevenYear } = results;
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
            Investing overtakes the car in <strong>year {breakevenYear}</strong>.
          </p>
        )}
      </div>

      {/* Upfront and setup costs */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Upfront Car Costs</h2>
        <p className={styles.cardSub}>
          Costs paid before you leave the dealership — separate from your monthly repayments.
        </p>
        <table className={styles.table}>
          <tbody>
            {[
              ["Cash Deposit",                   fmtRand(results.inputs.deposit)],
              ["Licensing & Registration",        car.onceOffFeesFmt],
              ["Amount Financed",                 car.loanAmountFmt],
              ["Total Finance Cost (interest)",   car.totalFinanceFmt],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className={styles.rowLabel}>{label}</td>
                <td style={{ textAlign: "right" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}