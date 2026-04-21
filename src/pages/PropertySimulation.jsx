import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Home.module.css'

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

// ── Goal Progress Card ─────────────────────────────────────────────────────
function GoalCard({ percent = 44, delay = 0 }) {
  const r = 42
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference

  return (
    <Link to="/strategy-tracker" className={`${styles.statCard} ${styles.goalCard}`} style={{ animationDelay: `${delay}ms` }}>
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
  <svg viewBox="0 0 120 60" className={styles.patternSvg}>
    <polyline points="0,50 20,42 40,30 60,35 80,18 100,10 120,5"
      fill="none" stroke="rgba(200,75,255,0.5)" strokeWidth="2"/>
    <polyline points="0,50 20,42 40,30 60,35 80,18 100,10 120,5"
      fill="none" stroke="url(#sLine)" strokeWidth="1.5" opacity="0.5"/>
    <defs>
      <linearGradient id="sLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c84bff" stopOpacity="0"/>
        <stop offset="100%" stopColor="#e8b84b"/>
      </linearGradient>
    </defs>
  </svg>
)

const StrategyPattern = () => (
  <svg viewBox="0 0 120 60" className={styles.patternSvg}>
    {[0,20,40,60,80,100].map((x, i) => (
      <rect key={i} x={x+2} y={60 - [30,45,25,50,35,55][i]} width="16"
        height={[30,45,25,50,35,55][i]} rx="3"
        fill={`rgba(200,75,255,${0.15 + i*0.07})`}/>
    ))}
  </svg>
)

const SimPattern = () => (
  <svg viewBox="0 0 120 60" className={styles.patternSvg}>
    <path d="M0,50 C30,50 30,10 60,10 C90,10 90,40 120,20"
      fill="none" stroke="rgba(200,75,255,0.6)" strokeWidth="2" strokeDasharray="4 3"/>
    <path d="M0,50 C30,48 50,30 80,28 C100,26 110,35 120,32"
      fill="none" stroke="rgba(232,184,75,0.5)" strokeWidth="1.5"/>
  </svg>
)

const DNAPattern = () => (
  <svg viewBox="0 0 120 60" className={styles.patternSvg}>
    {Array.from({length:7}).map((_,i) => (
      <ellipse key={i} cx={i*20+10} cy={30} rx="8" ry={8+Math.sin(i*1.2)*10}
        fill="none" stroke={`rgba(200,75,255,${0.2+i*0.07})`} strokeWidth="1.5"/>
    ))}
  </svg>
)

// ── Home Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null)

  return (
    <main className={styles.main}>
      {/* ── Background orbs ── */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      <div className={styles.grid} />

      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroContent}>
          <p className={styles.heroPre}>ABSA NEXT GEN WEALTH</p>
          <h1 className={styles.heroHeading}>
            Take Control of Your<br />
            <em>FINANCES</em>
          </h1>
          <p className={styles.heroCopy}>
            You're not just banking. You're building wealth from day one. Absa Next Gen
            Wealth gives you a real-time cockpit for your money — designed for the critical
            first five years of your financial journey.
          </p>
          <Link to="/money-snapshot" className={styles.ctaBtn}>
            Start my 5-year plan
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </section>

      {/* ── STAT CARDS ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <StatCard label="TOTAL INCOME"  value="R46 000"   to="/money-snapshot"    delay={0}   />
          <StatCard label="FIXED COSTS"   value="R41 150"   to="/strategy-tracker"  delay={80}  />
          <StatCard label="DEBT BALANCE"  value="R160 000"  to="/simulation-lab"    delay={160} />
          <GoalCard percent={44} delay={240} />
        </div>
      </section>

      {/* ── WHY FIVE YEARS ── */}
      <section className={styles.whySection}>
        <div className={styles.whyCard}>
          <div className={styles.whyTopLine} />
          <h2 className={styles.whyHeading}>Why Five Years?</h2>
          <p className={styles.whyCopy}>
            Most people drift through their early earning years. We don't think you should.
            The gap between your first real paycheck and year five is where small habits
            become massive wealth. Absa Next Gen Wealth is your co-pilot for that exact
            window — tracking, teaching, and automating your progress.
          </p>
          <div className={styles.whyBottomLine} />
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <FeatureCard title="MONEY SNAPSHOT"   to="/money-snapshot"   pattern={<MoneyPattern />}   delay={0}   />
          <FeatureCard title="STRATEGY TRACKER" to="/strategy-tracker" pattern={<StrategyPattern />} delay={80}  />
          <FeatureCard title="SIMULATION LAB"   to="/simulation-lab"   pattern={<SimPattern />}      delay={160} />
          <FeatureCard title="BANKING DNA"       to="/banking-dna"       pattern={<DNAPattern />}      delay={240} />
        </div>
      </section>
    </main>
  )
}
