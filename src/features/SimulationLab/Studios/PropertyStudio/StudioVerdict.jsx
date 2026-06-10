/**
 * StudioVerdict.jsx
 * Verdict panel for the Property simulation.
 * Shows: winner banner, verdict text, comparison table,
 *        upfront buying cost breakdown, and "Things to Consider" list.
 */
import styles from "../../Studios.module.css";
import { fmtRand } from "../../utils/StudioCalculations";

const WINNER_COLORS = {
  Buying:  "var(--clr-gold, #f8d299)",
  Renting: "#a78bfa",
};

/* ── Small helper: coloured value cell ─── */
const Val = ({ children, highlight }) => (
  <td style={{ color: highlight ? "var(--clr-gold)" : undefined }}>
    {children}
  </td>
);

export default function StudioVerdict({ results, horizon }) {
  if (!results) return null;

  const { buying, renting, winner, verdict, breakevenYear } = results;
  const winnerColor = WINNER_COLORS[winner] || "var(--clr-gold)";

  const TABLE_ROWS = [
    {
      label:    "Monthly Repayment / Rent",
      rent:     `R ${renting.avgMonthlyCost.toLocaleString("en-ZA")}`,
      buy:      `R ${buying.avgMonthlyCost.toLocaleString("en-ZA")}`,
      rentWins: renting.avgMonthlyCost < buying.avgMonthlyCost,
    },
    {
      label:    "Total Cash Outlay",
      rent:     `R ${renting.cashOutlay.toLocaleString("en-ZA")}`,
      buy:      `R ${buying.cashOutlay.toLocaleString("en-ZA")}`,
      rentWins: renting.cashOutlay < buying.cashOutlay,
    },
    {
      label:    "Final Asset / Portfolio Value",
      rent:     `R ${renting.investmentValue.toLocaleString("en-ZA")}`,
      buy:      `R ${buying.assetValue.toLocaleString("en-ZA")}`,
      rentWins: renting.investmentValue > buying.assetValue,
    },
    {
      label:    "Net Worth at Year " + horizon,
      rent:     `R ${renting.networth.toLocaleString("en-ZA")}`,
      buy:      `R ${buying.networth.toLocaleString("en-ZA")}`,
      rentWins: renting.networth > buying.networth,
    },
    {
      label:    "Total Interest Paid",
      rent:     "—",
      buy:      buying.totalInterestFmt,
      rentWins: true,
    },
    {
      label:    "Flexibility",
      rent:     renting.flexibility,
      buy:      buying.flexibility,
      rentWins: true,
    },
    {
      label:    "Maintenance Risk",
      rent:     renting.maintenanceRisk,
      buy:      buying.maintenanceRisk,
      rentWins: true,
    },
  ];

  return (
    <>
      {/* Winner + verdict */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Studio Verdict</h2>
        <div
          className={styles.verdictWinner}
          style={{ color: winnerColor }}
        >
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
              ["Deposit",              fmtRand(results.inputs.savings)],
              ["Transfer Duty",        buying.transferDutyFmt],
              ["Transfer Attorney Fees", buying.transferFeesFmt],
              ["Bond Registration",    buying.bondRegCostsFmt],
              ["Total Upfront",        buying.upfrontCostFmt],
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

      {/* Things to Consider */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Things to Consider</h2>
        <ul className={styles.considerList}>
          <li>
            <strong>Transfer duty</strong> is a government tax on property transfers above R1.1m — it's non-negotiable and can add R12k–R97k+ to your upfront costs.
          </li>
          <li>
            <strong>Bond registration</strong> is paid to your bank's attorneys to register the bond at the Deeds Office — a once-off cost of roughly R8k–R32k.
          </li>
          <li>
            <strong>Maintenance</strong> is estimated at 1% of property value per year — for a R1.5m home that's R15 000/year (R1 250/month) in unplanned repairs.
          </li>
          <li>
            <strong>Liquidity trade-off:</strong> property is illiquid. Selling takes 3–6 months and costs ~5% in agent commissions.
          </li>
          <li>
            <strong>Property growth varies by suburb.</strong> Area decline in Joburg can be rapid — crime, service delivery, and business migration all affect values.
          </li>
          <li>
            <strong>Investment returns are not guaranteed.</strong> The 10% default is a JSE long-run average — actual returns depend on your fund selection and market conditions.
          </li>
        </ul>
      </div>
    </>
  );
}