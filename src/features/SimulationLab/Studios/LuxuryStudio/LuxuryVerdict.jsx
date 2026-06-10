/**
 * CarVerdict.jsx
 * Verdict panel for the Luxury Car vs Investing simulation.
 * Shows: winner banner, verdict text, upfront cost breakdown,
 *        total cost of ownership summary, and "Things to Consider" list.
 */
import styles from "../../Studios.module.css";
import { fmtRand } from "../../utils/StudioCalculations";

const WINNER_COLORS = {
  Investing:   "#a78bfa",
  "Luxury Car": "var(--clr-gold, #f8d299)",
};

export default function CarVerdict({ results, horizon }) {
  if (!results) return null;

  const { car, investing, winner, verdict, breakevenYear } = results;
  const winnerColor = WINNER_COLORS[winner] || "var(--clr-gold)";

  const TABLE_ROWS = [
    {
      label:       "Monthly Finance Repayment",
      carVal:      `R ${car.monthlyPayment.toLocaleString("en-ZA")}`,
      investVal:   "—",
      investWins:  true,
    },
    {
      label:       "Monthly Running Costs",
      carVal:      `R ${car.monthlyRunning.toLocaleString("en-ZA")}`,
      investVal:   "—",
      investWins:  true,
    },
    {
      label:       "Total Cash Outlay",
      carVal:      car.cashOutlayFmt,
      investVal:   investing.cashOutlayFmt,
      investWins:  investing.cashOutlay < car.cashOutlay,
    },
    {
      label:       "Residual / Portfolio Value",
      carVal:      car.residualFmt,
      investVal:   investing.portfolioFmt,
      investWins:  investing.portfolioValue > car.residualValue,
    },
    {
      label:       `Net Worth at Year ${horizon}`,
      carVal:      car.networthFmt,
      investVal:   investing.networthFmt,
      investWins:  investing.networth > car.networth,
    },
    {
      label:       "Total Interest on Finance",
      carVal:      car.totalFinanceFmt,
      investVal:   "—",
      investWins:  true,
    },
    {
      label:       "Liquidity",
      carVal:      "Low",
      investVal:   "High",
      investWins:  true,
    },
  ];

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
              ["Cash Deposit",            fmtRand(results.inputs.deposit)],
              ["Licensing & Registration", car.onceOffFeesFmt],
              ["Amount Financed",         car.loanAmountFmt],
              ["Total Finance Cost (interest)", car.totalFinanceFmt],
            ].map(([label, value], i) => (
              <tr key={label}>
                <td className={styles.rowLabel}>{label}</td>
                <td style={{ textAlign: "right" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Things to Consider */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Things to Consider</h2>
        <ul className={styles.considerList}>
          <li>
            <strong>Depreciation is front-loaded.</strong> A luxury car loses roughly 20% of its value in the first year alone, and ~35–50% over three years. The asset declines fastest when it's most expensive to finance.
          </li>
          <li>
            <strong>Insurance on luxury vehicles</strong> is significantly higher than on standard cars — especially for drivers under 35. Factor in excess amounts and how a claim could affect your premium.
          </li>
          <li>
            <strong>Fuel efficiency matters at scale.</strong> Larger-engined vehicles can cost R2 000–R4 000 more per month in fuel versus a comparable everyday car. Over five years, that difference compounds.
          </li>
          <li>
            <strong>Service plans end.</strong> Many luxury vehicles include a plan for the first 3–5 years. After that, labour and parts costs on premium marques are substantially higher than on mainstream brands.
          </li>
          <li>
            <strong>Opportunity cost is real.</strong> Every rand tied up in a depreciating asset is a rand not compounding in an investment portfolio. The longer the horizon, the wider this gap becomes.
          </li>
          <li>
            <strong>The car does provide utility.</strong> Reliability, comfort, safety features, and status all have genuine value not captured by this model — only you can weigh how much that's worth to you.
          </li>
        </ul>
      </div>
    </>
  );
}