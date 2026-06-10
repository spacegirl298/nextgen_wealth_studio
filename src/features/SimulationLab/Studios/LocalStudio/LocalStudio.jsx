/**
 * OffshoreSim.jsx
 * Local vs Offshore Investing simulation lab.
 *
 * Architecture:
 *   - Shared profile state (income, savings as lump sum) is read from SimContext.
 *   - Investing-specific inputs (allocation, returns, horizon) live in local state.
 *   - All results computed live via useMemo — no calculate button needed.
 *   - Contextual nudges fire against live metrics via useNudges.
 *   - Sub-components: OffshoreInputs, OffshoreChart, OffshoreVerdict.
 */
import { useEffect, useState, useMemo } from "react";
import styles from "../../Studios.module.css";

import { useSimProfile } from "../../components/SimContext";
import { useNudges } from "../../../../hooks/useNudges";
import { NudgeBar } from "../../components/SimUI";

import { calcOffshore, OFFSHORE_NUDGES } from "../../utils/LocalCalculations";
import OffshoreInputs from "./LocalInputs";
import OffshoreChart from "./LocalChart";
import OffshoreVerdict from "./LocalVerdict";

const LEARN_CONTENT = `
South Africa holds a privileged and precarious position for individual investors. The JSE has delivered 
strong long-run nominal returns, but a weakening rand and high concentration risk — South Africa is less 
than 0.5% of global market capitalisation — mean that a local-only portfolio carries significant hidden risk.

Offshore investing provides genuine diversification: exposure to global technology, healthcare, consumer, 
and industrial sectors that simply don't exist at scale on the JSE. The rand's long-run depreciation trend 
also acts as a structural tailwind for offshore returns when converted back to ZAR.

The question is not whether to invest offshore, but how much. This simulation models three portfolios 
simultaneously: your chosen blend, a 100% local-only portfolio, and a 100% offshore portfolio — so you 
can see the return spectrum and understand what you're trading off.

Methodology: Local and offshore returns are entered separately and adjusted for an effective tax drag 
(dividends tax, CGT estimate). The offshore return is converted to ZAR by adding the expected annual 
rand depreciation. Monthly contributions and any lump sum are split by allocation and compounded 
independently each month. All output values are in South African rand.
`;

export default function OffshoreSim() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const [learnOpen, setLearnOpen] = useState(false);

  const { profile, setProfile } = useSimProfile();
  const { monthlyIncome, savings: lumpSum } = profile;

  /* Investing-specific state */
  const [monthlyContribution, setMonthlyContribution] = useState(5_000);
  const [horizon,             setHorizon]             = useState(10);
  const [offshoreAllocation,  setOffshoreAllocation]  = useState(40);
  const [localReturn,         setLocalReturn]         = useState(10);
  const [offshoreReturn,      setOffshoreReturn]      = useState(10);
  const [randDepreciation,    setRandDepreciation]    = useState(6);
  const [taxRate,             setTaxRate]             = useState(8);

  const results = useMemo(
    () =>
      calcOffshore({
        horizon,
        monthlyContribution,
        lumpSum,
        localReturn,
        offshoreReturn,
        randDepreciation,
        taxRate,
        offshoreAllocation,
      }),
    [horizon, monthlyContribution, lumpSum, localReturn, offshoreReturn, randDepreciation, taxRate, offshoreAllocation],
  );

  const nudgeMetrics = useMemo(
    () => ({
      offshoreAllocation,
      monthlyContribution,
      monthlyIncome,
      randDepreciation,
      taxRate,
      horizon,
    }),
    [offshoreAllocation, monthlyContribution, monthlyIncome, randDepreciation, taxRate, horizon],
  );

  const { activeNudges, dismissNudge } = useNudges(
    OFFSHORE_NUDGES,
    nudgeMetrics,
    {},
    "offshore_nudges_dismissed_v1",
  );

  const { blended, pureLocal, pureOffshore } = results;

  const TABLE_ROWS = [
    ["Your Blend (" + offshoreAllocation + "% offshore)", blended.finalValueFmt,     "—",                         "—"],
    ["100% Local only",                                   "—",                        pureLocal.finalValueFmt,     "—"],
    ["100% Offshore only",                                "—",                        "—",                         pureOffshore.finalValueFmt],
    ["Total Contributed",                                 blended.totalContributedFmt, blended.totalContributedFmt, blended.totalContributedFmt],
    ["Blended Return (after tax)",                        `${blended.blendedReturnPct}% p.a.`, `${pureLocal.returnPct}% p.a.`, `${pureOffshore.returnPct}% p.a.`],
  ];

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Local vs Offshore Investing</h1>
        <p className={styles.heroSub}>
          Find the allocation that works for your goals. Compare a blended local-offshore portfolio
          against going fully local or fully global — all in rand terms.
        </p>
      </div>

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

      <NudgeBar nudges={activeNudges} onDismiss={dismissNudge} />

      <OffshoreInputs
        monthlyIncome={monthlyIncome}               setMonthlyIncome={(v) => setProfile("monthlyIncome", v)}
        lumpSum={lumpSum}                           setLumpSum={(v) => setProfile("savings", v)}
        monthlyContribution={monthlyContribution}   setMonthlyContribution={setMonthlyContribution}
        horizon={horizon}                           setHorizon={setHorizon}
        offshoreAllocation={offshoreAllocation}     setOffshoreAllocation={setOffshoreAllocation}
        localReturn={localReturn}                   setLocalReturn={setLocalReturn}
        offshoreReturn={offshoreReturn}             setOffshoreReturn={setOffshoreReturn}
        randDepreciation={randDepreciation}         setRandDepreciation={setRandDepreciation}
        taxRate={taxRate}                           setTaxRate={setTaxRate}
      />

      <OffshoreChart
        chartData={results.chart}
        breakevenYear={results.breakevenYear}
        offshoreAllocation={offshoreAllocation}
      />

      <div className={styles.resultsGrid}>
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
            After {horizon} {horizon === 1 ? "year" : "years"}
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}></th>
                <th>Blend</th>
                <th>Local</th>
                <th>Offshore</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(([label, blend, local, offshore]) => (
                <tr key={label}>
                  <td className={styles.rowLabel}>{label}</td>
                  <td style={{ textAlign: "right" }}>{blend}</td>
                  <td style={{ textAlign: "right" }}>{local}</td>
                  <td style={{ textAlign: "right" }}>{offshore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.verdictCol}>
          <OffshoreVerdict results={results} horizon={horizon} />
        </div>
      </div>
    </div>
  );
}