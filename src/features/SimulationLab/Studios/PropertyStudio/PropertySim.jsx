/**
 * PropertySim.jsx
 * Buy vs Rent simulation lab for Johannesburg.
 *
 * Architecture:
 *   - Shared profile state (income, savings, housing budget) is read from
 *     SimContext — changes here persist and are available to other labs.
 *   - Property-specific inputs live in local state.
 *   - All results computed live via useMemo — no button needed.
 *   - Contextual nudges fire against live metrics via useNudges.
 *   - Sub-components: PropertyInputs, ComparisonChart, StudioVerdict.
 */
import { useEffect, useState, useMemo } from "react";
import styles from "../../Studios.module.css";

// Shared infrastructure
import { useSimProfile } from "../../components/SimContext";
import { useNudges } from "../../../../hooks/useNudges";
import { NudgeBar } from "../../components/SimUI";

// Property-specific
import { calcProperty, PROPERTY_NUDGES } from "../../utils/StudioCalculations";
import PropertyInputs from "./PropertyInputs";
import ComparisonChart from "./ComparisonChart";
import StudioVerdict from "./StudioVerdict";

/* ── Learn More content ─────────────────────────────────────── */
const LEARN_CONTENT = `
When deciding whether to rent or buy in Joburg, the right answer depends entirely on your time horizon, 
savings, and awareness of the hidden costs of ownership. Buying builds long-term wealth through equity 
and capital appreciation, but requires a large upfront deposit, transfer duty, bond registration fees, 
and leaves you responsible for every repair — plus bond, levy, and municipal rate increases.

Renting offers flexibility, predictable monthly costs, and no maintenance exposure. The key insight 
often missed: the renter who invests their deposit and monthly savings difference into a JSE-indexed 
fund can build substantial wealth too. The simulation models both paths honestly.

Methodology: The buying path calculates bond repayments (standard amortisation), adds 1% annual 
maintenance and R1 500/month levy, and tracks equity as property value minus outstanding bond balance. 
The renting path assumes the deposit is invested from day one, and the monthly difference between 
buying and renting costs is added to the portfolio each month. Transfer duty uses the SARS 2025 table.
`;

export default function PropertySim() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const [learnOpen, setLearnOpen] = useState(false);

  /* Shared profile — persisted across all labs via SimContext */
  const { profile, setProfile } = useSimProfile();
  const { monthlyIncome, housingBudget, savings } = profile;

  /* Property-specific state */
  const [horizon,        setHorizon]        = useState(7);
  const [purchasePrice,  setPurchasePrice]  = useState(1_500_000);
  const [bondRate,       setBondRate]       = useState(11.25);
  const [bondTerm,       setBondTerm]       = useState(20);
  const [priceGrowth,    setPriceGrowth]    = useState(5);
  const [monthlyRent,    setMonthlyRent]    = useState(8_500);
  const [rentalInflation, setRentalInflation] = useState(7);
  const [investReturn,   setInvestReturn]   = useState(10);

  /* Live results */
  const results = useMemo(
    () =>
      calcProperty({
        horizon,
        purchasePrice,
        bondRate,
        bondTerm,
        savings,
        priceGrowth,
        monthlyRent,
        rentalInflation,
        investReturn,
      }),
    [horizon, purchasePrice, bondRate, bondTerm, savings, priceGrowth, monthlyRent, rentalInflation, investReturn],
  );

  /* Nudges — metrics passed to condition functions */
  const nudgeMetrics = useMemo(
    () => ({
      savings,
      purchasePrice,
      bondPayment:   results.buying.bondPayment,
      monthlyIncome,
      horizon,
      rentalInflation,
      priceGrowth,
      bondRate,
    }),
    [savings, purchasePrice, results, monthlyIncome, horizon, rentalInflation, priceGrowth, bondRate],
  );

  const { activeNudges, dismissNudge } = useNudges(
    PROPERTY_NUDGES,
    nudgeMetrics,
    {},
    "property_nudges_dismissed_v1",
  );

  /* ── Comparison table rows ─────────────────────────────────── */
  const { buying, renting } = results;

  const TABLE_ROWS = [
    ["Total Cash Outlay",        renting.cashOutlayFmt,   buying.cashOutlayFmt],
    ["Final Asset / Portfolio",  renting.investValueFmt,  buying.assetValueFmt],
    ["Net Worth at Year " + horizon, renting.networthFmt, buying.networthFmt],
    ["Avg Monthly Cost",         `R ${renting.avgMonthlyCost.toLocaleString("en-ZA")}`, `R ${buying.avgMonthlyCost.toLocaleString("en-ZA")}`],
    ["Flexibility",              renting.flexibility,     buying.flexibility],
    ["Maintenance Risk",         renting.maintenanceRisk, buying.maintenanceRisk],
  ];

  return (
    <div className={styles.page}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Property vs Renting in Joburg</h1>
        <p className={styles.heroSub}>
          Compare the real financial outcomes of buying or renting in Johannesburg.
          Adjust any input — results update instantly.
        </p>
      </div>

      {/* Learn More / Methodology */}
      <div className={styles.learnCard}>
        <button className={styles.learnToggle} onClick={() => setLearnOpen(!learnOpen)}>
          How this works
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="12" height="12" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            {LEARN_CONTENT.trim().split("\n\n").map((para, i) => (
              <p key={i} style={{ margin: i === 0 ? 0 : "0.75rem 0 0" }}>{para.trim()}</p>
            ))}
          </div>
        )}
      </div>

      {/* Contextual nudges — non-intrusive, dismissible */}
      <NudgeBar nudges={activeNudges} onDismiss={dismissNudge} />

      {/* All inputs */}
      <PropertyInputs
        monthlyIncome={monthlyIncome}    setMonthlyIncome={(v) => setProfile("monthlyIncome", v)}
        housingBudget={housingBudget}    setHousingBudget={(v) => setProfile("housingBudget", v)}
        savings={savings}               setSavings={(v) => setProfile("savings", v)}
        horizon={horizon}               setHorizon={setHorizon}
        purchasePrice={purchasePrice}   setPurchasePrice={setPurchasePrice}
        bondRate={bondRate}             setBondRate={setBondRate}
        bondTerm={bondTerm}             setBondTerm={setBondTerm}
        priceGrowth={priceGrowth}       setPriceGrowth={setPriceGrowth}
        monthlyRent={monthlyRent}       setMonthlyRent={setMonthlyRent}
        rentalInflation={rentalInflation} setRentalInflation={setRentalInflation}
        investReturn={investReturn}     setInvestReturn={setInvestReturn}
      />

      {/* Chart — full width */}
      <ComparisonChart chartData={results.chart} breakevenYear={results.breakevenYear} />

      {/* Results grid: comparison table + verdict column */}
      <div className={styles.resultsGrid}>
        {/* Left: comparison table */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
            After {horizon} {horizon === 1 ? "year" : "years"}
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}></th>
                <th>Renting</th>
                <th>Buying</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(([label, rent, buy]) => (
                <tr key={label}>
                  <td className={styles.rowLabel}>{label}</td>
                  <td style={{ textAlign: "right" }}>{rent}</td>
                  <td style={{ textAlign: "right" }}>{buy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: verdict stack */}
        <div className={styles.verdictCol}>
          <StudioVerdict results={results} horizon={horizon} />
        </div>
      </div>
    </div>
  );
}