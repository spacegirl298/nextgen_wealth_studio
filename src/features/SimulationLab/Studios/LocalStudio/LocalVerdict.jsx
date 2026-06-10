/**
 * OffshoreVerdict.jsx
 * Verdict panel for the Local vs Offshore Investing simulation.
 * Shows: winner banner, verdict text, return breakdown table,
 *        allocation summary, and "Things to Consider" list.
 */
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

  // Effective ZAR return on offshore portion
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

      {/* Things to Consider */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Things to Consider</h2>
        <ul className={styles.considerList}>
          <li>
            <strong>Rand depreciation is the key variable.</strong> Over the past 30 years, the rand has averaged ~6–8% annual depreciation against the dollar. In good years it strengthens; in crisis years (2001, 2008, 2020) it can move 20–30% in a matter of weeks.
          </li>
          <li>
            <strong>Tax-Free Savings Accounts (TFSAs)</strong> let you contribute up to R36 000/year tax-free. Using a TFSA for your offshore ETF eliminates dividends tax and CGT, significantly improving after-tax returns — prioritise this wrapper first.
          </li>
          <li>
            <strong>SARS exchange control allowances:</strong> SA residents get a R1m single discretionary allowance and up to R10m per year with tax clearance (TCC). Global ETFs listed on the JSE (like Satrix MSCI World) give offshore exposure without these limits.
          </li>
          <li>
            <strong>Diversification reduces country risk.</strong> South Africa makes up less than 0.5% of global market cap. A portfolio with no offshore exposure is highly concentrated — both in rand and in a single economy's fortunes.
          </li>
          <li>
            <strong>Currency risk cuts both ways.</strong> Rand depreciation boosts offshore returns when converted back to ZAR — but if the rand strengthens unexpectedly, your offshore portfolio loses value in local terms. Rebalancing annually helps manage this.
          </li>
          <li>
            <strong>Platform and fund fees matter.</strong> This model assumes gross-of-fee returns. Actively managed funds often charge 1–1.5% annually — a drag that compounds significantly. Low-cost index ETFs (0.1–0.3% TER) are a meaningful structural advantage.
          </li>
        </ul>
      </div>
    </>
  );
}