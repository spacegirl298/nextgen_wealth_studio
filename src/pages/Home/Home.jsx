/*Marketing landing page.
–	Hero section: headline, subheadline, CTA buttons (Get Started / Log In)
–	Feature highlights section: 3 cards for Snapshot, Tracks, Simulation
–	How it works: 3-step explainer
–	South African context callout (SA tax, SA rates, SA property market)
–	Footer CTA
–	If authenticated: redirects to /snapshot or shows 'Continue where you left off'
*/
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useFinancial } from "../../components/FinancialContext";

import MoneyImg from "../../assets/Home/MoneyImg.png";
import SimImg from "../../assets/Home/SimImg.png";
import StatImg from "../../assets/Home/StatImg.png";
import DNAImg from "../../assets/Home/DNAImg.png";

// Stat Card
function StatCard({ label, value, to, delay = 0 }) {
  return (
    <Link
      to={to}
      className={styles.statCard}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statArrow}>↗</span>
    </Link>
  );
}

// Goal Progress Card
function GoalCard({ percent = 44, delay = 0 }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Link
      to="/money"
      className={`${styles.statCard} ${styles.goalCard}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={styles.statLabel}>HEALTH SCORE</span>
      <div className={styles.ringWrap}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className={styles.ring}
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(200,75,255,0.12)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className={styles.ringProgress}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c84bff" />
              <stop offset="100%" stopColor="#e8b84b" />
            </linearGradient>
          </defs>
        </svg>
        <span className={styles.ringPct}>{percent}%</span>
      </div>
      <span className={styles.statArrow}>↗</span>
    </Link>
  );
}

// Feature Car
function FeatureCard({ title, to, pattern, delay = 0 }) {
  return (
    <Link
      to={to}
      className={styles.featureCard}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.featurePattern}>{pattern}</div>
      <span className={styles.featureTitle}>{title}</span>
      <span className={styles.featureArrow}>↗</span>
    </Link>
  );
}

// Sparkline SVG
const MoneyPattern = () => (
  <div className={styles.patternBg}>
    <img src={MoneyImg} alt="Money" />
  </div>
);

const StrategyPattern = () => (
  <div className={styles.patternBg}>
    <img src={StatImg} alt="Strategy" />
  </div>
);

const SimPattern = () => (
  <div className={styles.patternBg}>
    <img src={SimImg} alt="Simulation" />
  </div>
);

const DNAPattern = () => (
  <div className={styles.patternBg}>
    <img src={DNAImg} alt="DNA" />
  </div>
);

// Home Page
export default function Home() {
  const heroRef = useRef(null);
  const { grossMonthly, totalMonthlyExpenses, totalDebt, healthScore } =
    useFinancial();

  const formatCurrency = (value) => {
    return `R${Math.round(value).toLocaleString()}`;
  };

  return (
    <main className={styles.main}>
      {/* hero */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroContent}>
          <p className={styles.heroPre}>ABSA NEXT GEN WEALTH</p>
          <h1 className={styles.heroHeading}>
            Take Control of Your
            <br />
            <em>FINANCES</em>
          </h1>
          <p className={styles.heroCopy}>
            You're not just banking. You're building wealth from day one. Absa
            Next Gen Wealth gives you a real-time cockpit for your money —
            designed for the critical first five years of your financial
            journey.
          </p>
          <Link to="/profile" className={styles.ctaBtn}>
            Start my 5-year plan
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </section>

      {/* start cards */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <StatCard
            label="TOTAL INCOME"
            value={formatCurrency(grossMonthly)}
            to="/money"
            delay={0}
          />
          <StatCard
            label="TOTAL EXPENSES"
            value={formatCurrency(totalMonthlyExpenses)}
            to="/money"
            delay={80}
          />
          <StatCard
            label="DEBT BALANCE"
            value={formatCurrency(totalDebt)}
            to="/money"
            delay={160}
          />
          <GoalCard percent={healthScore} delay={240} />
        </div>
      </section>

      {/*why  years */}
      <section className={styles.whySection}>
        <div className={styles.whyCard}>
          <div className={styles.whyTopLine} />
          <h2 className={styles.whyHeading}>Why Five Years?</h2>
          <p className={styles.whyCopy}>
            Most people drift through their early earning years. We don't think
            you should. The gap between your first real paycheck and year five
            is where small habits become massive wealth. Absa Next Gen Wealth is
            your co-pilot for that exact window — tracking, teaching, and
            automating your progress.
          </p>
          <div className={styles.whyBottomLine} />
        </div>
      </section>

      {/*feature careds*/}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <FeatureCard
            title="MONEY SNAPSHOT"
            to="/money"
            pattern={<MoneyPattern />}
            delay={0}
          />
          <FeatureCard
            title="STRATEGY TRACKER"
            to="/track"
            pattern={<StrategyPattern />}
            delay={80}
          />
          <FeatureCard
            title="SIMULATION LAB"
            to="/simulation"
            pattern={<SimPattern />}
            delay={160}
          />
          <FeatureCard
            title="BANKING DNA"
            to="/DNA"
            pattern={<DNAPattern />}
            delay={240}
          />
        </div>
      </section>
    </main>
  );
}
