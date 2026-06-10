/* SimulationLab.jsx
   Simulation Lab overview/selection page matching Strategy Track styling.
   
   – Hero header explaining what the Simulation Lab is
   – Three studio cards: Property, Luxury, Local vs Offshore
   – Each card: pill, title, tagline, description, stat row, CTA
   – Consistent card layout with StrategyTrack cards
   – Navigation to all three studio routes (all ready, no "Coming Soon")
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/SelectionLayout.module.css";
import PropImg from "../../assets/Simulation/PropImg.jpg";
import CarImg from "../../assets/Simulation/CarImg.jpg";
import LocalImg from "../../assets/Simulation/LocalImg.jpg";

// ─── Icons ─────────────────────────────────────────────────────────────
const Chevron = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
  >
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Explainer items for Simulation Lab ─────────────────────────────────
const EXPLAINER_ITEMS = [
  {
    title: "Real-time calculations",
    body: "Adjust your income, savings, or expenses and see the impact on your financial future instantly — no refresh needed.",
  },
  {
    title: "Side-by-side comparisons",
    body: "Compare two scenarios directly: rent vs buy, spend vs invest, local vs offshore — clear, visual trade-offs.",
  },
  {
    title: "Personalized projections",
    body: "Based on your actual financial numbers, each simulation shows projections tailored to your situation.",
  },
  {
    title: "Data-driven clarity",
    body: "Get hard numbers on affordability, long-term returns, and opportunity costs — so you can decide with confidence.",
  },
];

// ─── Simulation Card Component (matches TrackCard styling) ─────────────
function SimulationCard({
  pill,
  title,
  tagline,
  description,
  stats,
  imageSrc,
  onLaunch,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={imageSrc} alt={title} />
        <div className={styles.cardOverlay} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.cardPill}>{pill}</span>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardTagline}>{tagline}</p>
        </div>

        <div className={styles.cardStats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.cardDescription}>
          <p>{description}</p>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.ctaBtn} onClick={onLaunch}>
            Enter Studio <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Simulation definitions ───────────────────────────────────────────
const SIMULATIONS = [
  {
    id: "property",
    pill: "Simulation · Property",
    title: "Property vs Renting in Joburg",
    tagline: "Should you buy or rent? See the numbers side by side.",
    description: "This simulation allows you to explore and compare the financial outcomes of renting versus buying property in Johannesburg. By inputting your personal financial details — such as income, savings, expenses, and expected property costs — you can generate tailored projections that illustrate the long-term impact of each option. Understand monthly affordability, interest rates, and overall investment value with clear, data-driven comparisons.",
    imageSrc: PropImg,
    route: "/simulation/property",
    stats: [
      { val: "Rent", label: "vs" },
      { val: "Buy", label: "Compare" },
      { val: "20+", label: "Variables" },
    ],
  },
  {
    id: "luxury",
    pill: "Simulation · Lifestyle",
    title: "Luxury Car vs Investing the Difference",
    tagline: "Status now or wealth later? See the real trade-off.",
    description: "This simulation helps you explore the trade-off between making status-driven purchases and prioritizing long-term wealth building. While buying a luxury car can offer immediate satisfaction, it often comes with significant financial implications over time. Compare the short-term rewards against the long-term impact on savings, investments, and overall financial growth.",
    imageSrc: CarImg,
    route: "/simulation/luxury",
    stats: [
      { val: "Spend", label: "vs" },
      { val: "Invest", label: "Compare" },
      { val: "10y", label: "Horizon" },
    ],
  },
  {
    id: "investing",
    pill: "Simulation · Investing",
    title: "Local vs Offshore Investing",
    tagline: "Find your optimal global-local balance.",
    description: "This simulation helps you navigate the decision of balancing your investment portfolio between local and offshore opportunities. By exploring different allocation scenarios, you can better understand the potential risks, returns, and long-term implications of each approach. Making this decision more accessible, informative, and less intimidating.",
    imageSrc: LocalImg,
    route: "/simulation/local",
    stats: [
      { val: "Local", label: "vs" },
      { val: "Global", label: "Compare" },
      { val: "Risk", label: "Profile" },
    ],
  },
];

// ─── Main Page Component ──────────────────────────────────────────────
export default function SimulationLab() {
  const navigate = useNavigate();
  const [explainerOpen, setExplainerOpen] = useState(false);

  const handleLaunch = (route) => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    navigate(route);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Simulation Lab</h1>
          <p className={styles.heroSub}>
            Test out your financial decisions before making them in real life.
            Adjust your information and instantly see how different choices 
            could affect your finances — clear, data-driven, and personalized.
          </p>
        </div>

        {/* Collapsible explainer */}
        <div className={styles.learnCard}>
          <button
            className={`${styles.learnToggle} ${explainerOpen ? styles.open : ""}`}
            onClick={() => setExplainerOpen(!explainerOpen)}
          >
            <span>What is the Simulation Lab?</span>
            <Chevron open={explainerOpen} />
          </button>
          {explainerOpen && (
            <div className={styles.learnBody}>
              <div className={styles.explainerGrid}>
                {EXPLAINER_ITEMS.map((item) => (
                  <div key={item.title} className={styles.explainerItem}>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Simulation cards */}
        <div className={styles.cardsContainer}>
          {SIMULATIONS.map((simulation) => (
            <SimulationCard
              key={simulation.id}
              {...simulation}
              onLaunch={() => handleLaunch(simulation.route)}
            />
          ))}
        </div>

        {/* Back button */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </main>
    </div>
  );
}