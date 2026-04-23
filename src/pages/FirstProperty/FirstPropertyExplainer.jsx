import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'


import MoneyImg from "../../assets/Home/MoneyImg.png";
import SimImg from "../../assets/Home/SimImg.png";
import StatImg from "../../assets/Home/StatImg.png";
import DNAImg from "../../assets/Home/DNAImg.png"


// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, to, delay = 0 }) {
  return (
    <Link to={to} className={styles.statCard} style={{ animationDelay: `${delay}ms` }}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statArrow}>↗</span>
    </Link>
  )
}

// Goal Progress Card 
function GoalCard({ percent = 44, delay = 0 }) {
  const r = 42
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference

  return (
    <Link to="/money-snapshot" className={`${styles.statCard} ${styles.goalCard}`} style={{ animationDelay: `${delay}ms` }}>
      <span className={styles.statLabel}>GOAL PROGRESS</span>
      <div className={styles.ringWrap}>
        <svg width="100" height="100" viewBox="0 0 100 100" className={styles.ring}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(200,75,255,0.12)" strokeWidth="8"/>
          <circle
            cx="50" cy="50" r={r}
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
              <stop offset="0%" stopColor="#c84bff"/>
              <stop offset="100%" stopColor="#e8b84b"/>
            </linearGradient>
          </defs>
        </svg>
        <span className={styles.ringPct}>{percent}%</span>
      </div>
      <span className={styles.statArrow}>↗</span>
    </Link>
  )
}

// ── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ title, to, pattern, delay = 0 }) {
  return (
    <Link to={to} className={styles.featureCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.featurePattern}>{pattern}</div>
      <span className={styles.featureTitle}>{title}</span>
      <span className={styles.featureArrow}>↗</span>
    </Link>
  )
}

// ── Sparkline SVG patterns ─────────────────────────────────────────────────
const MoneyPattern = () => (
  <div 
    className={styles.patternBg}
  >
    <img src = {MoneyImg}/>
  </div>
)

const StrategyPattern = () => (
   <div 
    className={styles.patternBg}
  >
    <img src = {StatImg}/>
  </div>
)

const SimPattern = () => (
   <div 
    className={styles.patternBg}
  >
    <img src = {SimImg}/>
  </div>
)

const DNAPattern = () => (
   <div 
    className={styles.patternBg}
  >
    <img src = {DNAImg}/>
  </div>
);


  

