// StudioVerdict.jsx
import styles from "../../Studios.module.css";

const GlossaryTerm = ({ term, definition }) => (
  <span className={styles.glossaryTerm} title={definition}>
    {term}
    <span className={styles.glossaryTooltip}>{definition}</span>
  </span>
);

export default function StudioVerdict({
  buyingBetter,
  wealthDifference,
  timeHorizon,
  finalBuyNetWorth,
  finalRentNetWorth,
  monthlyBuyCost,
  monthlyRent,
  totalInterestPaid,
  equity,
  totalRentPaid,
  transferDuty,
  bondRegistrationCost,
  depositAmount,
  loanAmount,
  crossoverYear,
  propGrowthRate,
}) {
  const monthlyDifference = Math.abs(monthlyBuyCost - monthlyRent);
  const rentIsCheaperMonthly = monthlyRent < monthlyBuyCost;
  
  return (
    <div className={styles.verdictContainer}>
      {/* Main Verdict */}
      <div className={`${styles.sectionCard} ${styles.verdictCard}`}>
        <h2 className={styles.cardTitle}>Studio Verdict</h2>
        <div className={styles.verdictBadge}>
          <span className={buyingBetter ? styles.winnerBuy : styles.winnerRent}>
            {buyingBetter ? "✓ BUYING WINS" : "✓ RENTING WINS"}
          </span>
        </div>
        <p className={styles.verdictStatement}>
          {buyingBetter 
            ? `Over ${timeHorizon} years, buying builds R${(wealthDifference / 1000).toFixed(0)}k more wealth than renting.`
            : `Over ${timeHorizon} years, renting and investing builds R${(wealthDifference / 1000).toFixed(0)}k more wealth than buying.`}
        </p>
        {crossoverYear && crossoverYear <= timeHorizon && (
          <p className={styles.verdictDetail}>
            {buyingBetter 
              ? `Buying becomes the better financial choice after year ${crossoverYear}.`
              : `Even with crossover at year ${crossoverYear}, renting remains ahead over your horizon.`}
          </p>
        )}
      </div>
      
      {/* Comparison Table */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Financial Comparison</h2>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Buying</th>
              <th>Renting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Cost</td>
              <td>R{monthlyBuyCost.toLocaleString()}</td>
              <td>R{monthlyRent.toLocaleString()}</td>
            </tr>
            <tr className={rentIsCheaperMonthly ? styles.highlightRent : styles.highlightBuy}>
              <td>Monthly Difference</td>
              <td colSpan="2">
                {rentIsCheaperMonthly 
                  ? `Renting is R${monthlyDifference.toLocaleString()}/m cheaper`
                  : `Buying is R${monthlyDifference.toLocaleString()}/m cheaper`}
              </td>
            </tr>
            <tr>
              <td>Upfront Cost</td>
              <td>R{(depositAmount + transferDuty + bondRegistrationCost).toLocaleString()}</td>
              <td>R0 (plus deposit)</td>
            </tr>
            <tr>
              <td>Total Interest</td>
              <td>R{totalInterestPaid.toLocaleString()}</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Total Rent Paid</td>
              <td>—</td>
              <td>R{totalRentPaid.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Equity / Investment Value</td>
              <td>R{equity.toLocaleString()}</td>
              <td>R{finalRentNetWorth.toLocaleString()}</td>
            </tr>
            <tr className={styles.finalRow}>
              <td><strong>Final Net Worth</strong></td>
              <td><strong>R{finalBuyNetWorth.toLocaleString()}</strong></td>
              <td><strong>R{finalRentNetWorth.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Things to Consider */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Things to Consider</h2>
        <div className={styles.considerGrid}>
          <div className={styles.considerItem}>
            <h4>🏠 Upfront Buying Costs</h4>
            <ul>
              <li><GlossaryTerm term="Transfer Duty" definition="Tax paid to SARS on properties over R1.1M. Calculated on a sliding scale up to 12%." />: R{transferDuty.toLocaleString()}</li>
              <li><GlossaryTerm term="Bond Registration" definition="Legal fees paid to conveyancing attorney for registering the bond." />: ~1.5% of property value</li>
              <li><GlossaryTerm term="Deposit" definition="Minimum 10% typically required by SA banks for bond approval." />: {((depositAmount / (depositAmount + loanAmount)) * 100).toFixed(0)}% of purchase price</li>
            </ul>
          </div>
          <div className={styles.considerItem}>
            <h4>💰 Ongoing Costs</h4>
            <ul>
              <li><GlossaryTerm term="Maintenance" definition="Budget 1% of property value annually for repairs and upkeep." />: ~1% of value/year</li>
              <li><GlossaryTerm term="Levies & Rates" definition="Body corporate levies (sectional title) + municipal property rates." /></li>
              <li><GlossaryTerm term="Bond Interest" definition="Total interest paid over loan term. Can exceed principal amount." /></li>
            </ul>
          </div>
          <div className={styles.considerItem}>
            <h4>📈 Investment Returns</h4>
            <ul>
              <li>Difference between buying/renting invested at 10% annual return</li>
              <li>Property growth assumed at {propGrowthRate}% annually</li>
              <li>Returns not guaranteed - past performance ≠ future results</li>
            </ul>
          </div>
          <div className={styles.considerItem}>
            <h4>🔄 Flexibility & Risk</h4>
            <ul>
              <li>Buying: Lower liquidity, harder to move, maintenance responsibility</li>
              <li>Renting: Higher flexibility, predictable costs, no equity building</li>
              <li>Joburg context: Area decline, security, infrastructure issues affect property values</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Methodology Note */}
      <div className={styles.methodologyNote}>
        <h4>📐 Methodology & Assumptions</h4>
        <p>
          Calculations assume a 10% annual return on invested savings (SA long-term equity average). 
          Property maintenance budgeted at 1% of value annually. Transfer duty calculated using 2025 SARS brackets 
          (0% under R1.1M, escalating to 12% over R3.75M). Bond interest calculated with monthly compounding.
          Rental increases compounded annually. All figures are nominal (not inflation-adjusted).
        </p>
      </div>
    </div>
  );
}