import { useState } from "react";
import styles from "./BankingDNA.module.css";
import { useLocalStorage } from "../../hooks/userLocalStorage";

//Personality Types
const PERSONALITY_TYPES = {
  spender: {
    id: "spender",
    label: "The Spender",
    tagline: "Strong earner. Lifestyle-first.",
    description:
      "You have strong earning potential but tend to prioritise immediate lifestyle gratification and frequent purchases. Savings and investments are inconsistent, which may slow progress toward financial goals — unless spending habits become more intentional.",
    color: "#c84bff",
    glow: "rgba(200, 75, 255, 0.35)",
    icon: "◈",
    traits: [
      "Lifestyle-first",
      "Impulsive buys",
      "High earner",
      "Inconsistent saver",
    ],
    levelPath:
      "Improve budgeting behaviours and reduce impulsive purchases to level up.",
    startLevel: 1,
  },
  builder: {
    id: "builder",
    label: "The Future Builder",
    tagline: "Disciplined. Long-term focused.",
    description:
      "You are focused on long-term milestones. You save aggressively and are comfortable delaying lifestyle upgrades to reach goals sooner. Every rand saved today is a brick in the foundation of tomorrow.",
    color: "#ff4bba",
    glow: "rgba(255, 75, 183, 0.35)",
    icon: "◆",
    traits: [
      "Goal-driven",
      "Disciplined saver",
      "Milestone tracker",
      "Delayed gratification",
    ],
    levelPath:
      "Gain levels through disciplined saving, milestone completion, and consistent goal tracking.",
    startLevel: 3,
  },
  maximiser: {
    id: "maximiser",
    label: "The Lifestyle Maximiser",
    tagline: "Life is for living. Balance is key.",
    description:
      "You utilise income for the enjoyment of life — travel, dining, experiences. Financial progress still happens, but major asset goals may take longer. The key is finding a sustainable balance.",
    color: "#4bbdff",
    glow: "rgba(75, 96, 255, 0.35)",
    icon: "◉",
    traits: [
      "Experience-seeker",
      "Social spender",
      "Moderate saver",
      "Travel-focused",
    ],
    levelPath:
      "Level up through improved balance between spending and savings.",
    startLevel: 2,
  },
  balancer: {
    id: "balancer",
    label: "The Strategic Balancer",
    tagline: "Steady. Intentional. Resilient.",
    description:
      "You maintain a middle ground between saving, investing, and living well. Progress feels steady and manageable. You are the rarest profile — the one most likely to win over time.",
    color: "#4bffab",
    glow: "rgba(75, 255, 165, 0.35)",
    icon: "◇",
    traits: [
      "Balanced approach",
      "Consistent investor",
      "Risk-aware",
      "Sustainable habits",
    ],
    levelPath:
      "Move through levels by maintaining sustainable financial habits across saving, investing, and lifestyle.",
    startLevel: 4,
  },
};
// Levels 
const LEVELS = [
  {
    level: 1,
    name: "Seedling",
    xpRequired: 0,
    color: "rgba(240, 232, 255, 0.3)",
    desc: "Just getting started. Every journey begins here.",
  },
  {
    level: 2,
    name: "Sprout",
    xpRequired: 200,
    color: "rgba(180, 100, 255, 0.45)",
    desc: "Awareness is growing. First habits are forming.",
  },
  {
    level: 3,
    name: "Sapling",
    xpRequired: 500,
    color: "rgba(240, 232, 255, 0.547)",
    desc: "Consistent effort is showing real results.",
  },
  {
    level: 4,
    name: "Grove",
    xpRequired: 900,
    color: "#f0e8ff",
    desc: "A balanced portfolio and steady growth trajectory.",
  },
  {
    level: 5,
    name: "Canopy",
    xpRequired: 1400,
    color: "#c84bff",
    desc: "Financial habits are strong and diversified.",
  },
  {
    level: 6,
    name: "Summit",
    xpRequired: 2000,
    color: "#f8d299",
    desc: "Wealth-building is systematic and intentional.",
  },
  {
    level: 7,
    name: "Apex",
    xpRequired: 2800,
    color: "#f1b862",
    desc: "You operate like a seasoned wealth builder.",
  },
];

// Quiz Questions 
const QUIZ = [
  {
    id: "q1",
    question:
      "When you receive a bonus or unexpected windfall, what do you typically do first?",
    options: [
      { label: "Treat myself — I've earned it", type: "spender", xp: 10 },
      { label: "Split it: some fun, some savings", type: "balancer", xp: 25 },
      {
        label: "Put most of it straight into savings or investments",
        type: "builder",
        xp: 35,
      },
      {
        label: "Book a trip or experience I've been wanting",
        type: "maximiser",
        xp: 15,
      },
    ],
  },
  {
    id: "q2",
    question:
      "How would you describe your current relationship with a monthly budget?",
    options: [
      {
        label: "Budget? I spend and hope for the best",
        type: "spender",
        xp: 5,
      },
      {
        label: "I have a rough idea and loosely stick to it",
        type: "maximiser",
        xp: 15,
      },
      {
        label: "I track spending categories and review monthly",
        type: "balancer",
        xp: 28,
      },
      {
        label: "I have a detailed budget and rarely deviate",
        type: "builder",
        xp: 38,
      },
    ],
  },
  {
    id: "q3",
    question:
      "Your friend invites you on an overseas trip next month. You haven't budgeted for it. What do you do?",
    options: [
      { label: "Book it immediately — life is short", type: "spender", xp: 5 },
      {
        label: "Book it and find ways to cut other costs",
        type: "maximiser",
        xp: 12,
      },
      {
        label: "Go, but set a strict spending limit for the trip",
        type: "balancer",
        xp: 22,
      },
      {
        label: "Decline and add the cost to a future travel fund",
        type: "builder",
        xp: 32,
      },
    ],
  },
  {
    id: "q4",
    question: "How many active financial goals do you currently track?",
    options: [
      { label: "None — I wing it month to month", type: "spender", xp: 5 },
      { label: "One or two vague goals", type: "maximiser", xp: 15 },
      { label: "Two or three with some structure", type: "balancer", xp: 25 },
      {
        label: "Four or more with clear targets and timelines",
        type: "builder",
        xp: 40,
      },
    ],
  },
  {
    id: "q5",
    question:
      "When you think about the next five years, what excites you most?",
    options: [
      { label: "Freedom to spend on whatever I want", type: "spender", xp: 8 },
      { label: "Amazing experiences and memories", type: "maximiser", xp: 14 },
      {
        label: "A balanced life where I can enjoy and grow",
        type: "balancer",
        xp: 24,
      },
      {
        label: "Real assets — property, investments, financial independence",
        type: "builder",
        xp: 36,
      },
    ],
  },
  {
    id: "q6",
    question:
      "How consistently do you contribute to savings or investments each month?",
    options: [
      {
        label: "Rarely — whatever is left over (usually nothing)",
        type: "spender",
        xp: 5,
      },
      { label: "Sometimes — depends on the month", type: "maximiser", xp: 15 },
      { label: "Most months, yes", type: "balancer", xp: 28 },
      { label: "Every single month, non-negotiable", type: "builder", xp: 42 },
    ],
  },
];

//Behaviour Signals
const BEHAVIOUR_SIGNALS = [
  { label: "Budget Consistency", key: "budget", max: 100 },
  { label: "Savings Rate", key: "savings", max: 100 },
  { label: "Goal Tracking", key: "goals", max: 100 },
  { label: "Debt Management", key: "debt", max: 100 },
  { label: "Investment Activity", key: "investment", max: 100 },
];

//Improvement Nudges 
const NUDGES = {
  spender: [
    "Set up an automatic debit order to savings on pay day — pay yourself first.",
    "Create a 24-hour rule: wait one day before any unplanned purchase over R500.",
    "Categorise your last 3 months of spending and identify your top impulse category.",
    "Start a 'lifestyle fund' — ring-fence money for fun so it doesn't bleed into savings.",
    "Track net worth monthly, not just spending — seeing growth is addictive.",
  ],
  builder: [
    "Introduce a small 'enjoyment fund' — sustainable habits need reward loops.",
    "Review your investment allocation quarterly for tax efficiency.",
    "Automate your TFSA contribution to reach the annual limit by month 10.",
    "Build a proper will and beneficiary structure for your growing assets.",
    "Consider an income protection policy — your ability to earn is your biggest asset.",
  ],
  maximiser: [
    "For every lifestyle expense over R1,000, match 20% into a savings account.",
    "Build a dedicated travel fund so trips don't interrupt core savings.",
    "Review subscriptions quarterly — experience seekers often over-subscribe.",
    "Set a 'lifestyle ceiling' — when income grows, increase savings before lifestyle.",
    "Automate a retirement contribution — even R500/month compounds dramatically.",
  ],
  balancer: [
    "Review your asset allocation annually — balance can drift over time.",
    "Increase your savings rate by 1% every time you get a raise.",
    "Build an offshore component to your portfolio for currency diversification.",
    "Consider a financial planner to optimise your tax position.",
    "Your discipline is your edge — formalise it with a written financial plan.",
  ],
};

//Utility 
function calcPersonality(answers) {
  const counts = { spender: 0, builder: 0, maximiser: 0, balancer: 0 };
  answers.forEach((a) => {
    if (a?.type) counts[a.type]++;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function calcXP(answers) {
  return answers.reduce((sum, a) => sum + (a?.xp || 0), 0);
}

function getCurrentLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

function getNextLevel(xp) {
  return LEVELS.find((l) => l.xpRequired > xp) || null;
}

//Components 
const RadarChart = ({ scores, color }) => {
  const cx = 120;
  const cy = 120;
  const r = 85;
  const keys = BEHAVIOUR_SIGNALS.map((b) => b.key);
  const labels = BEHAVIOUR_SIGNALS.map((b) => b.label);
  const n = keys.length;
  const toXY = (i, pct) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * pct * Math.cos(angle),
      y: cy + r * pct * Math.sin(angle),
    };
  };
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPaths = gridLevels.map((g) => {
    const pts = keys.map((_, i) => {
      const p = toXY(i, g);
      return `${p.x},${p.y}`;
    });
    return `M ${pts.join(" L ")} Z`;
  });
  const dataPts = keys.map((k, i) => {
    const pct = (scores[k] || 0) / 100;
    return toXY(i, pct);
  });
  const dataPath = `M ${dataPts.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;
  const labelPts = keys.map((_, i) => toXY(i, 1.22));

  return (
    <svg viewBox="0 0 240 240" className={styles.radar}>
      {gridPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
      {keys.map((_, i) => {
        const end = toXY(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}
      <path
        d={dataPath}
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
      ))}
      {labelPts.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8.5"
          fill="rgba(255,255,255,0.55)"
          fontFamily="inherit"
        >
          {labels[i].split(" ").map((w, wi) => (
            <tspan key={wi} x={p.x} dy={wi === 0 ? 0 : 10}>
              {w}
            </tspan>
          ))}
        </text>
      ))}
    </svg>
  );
};

const XPBar = ({ xp, current, next }) => {
  const pct = next
    ? Math.min(
        ((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) *
          100,
        100,
      )
    : 100;
  return (
    <div className={styles.xpBarWrap}>
      <div className={styles.xpBarTrack}>
        <div
          className={styles.xpBarFill}
          style={{ width: `${pct}%`, background: current.color }}
        />
      </div>
      <div className={styles.xpBarMeta}>
        <span style={{ color: current.color }}>
          {current.name} · Lv {current.level}
        </span>
        <span>
          {next
            ? `${xp - current.xpRequired} / ${next.xpRequired - current.xpRequired} XP to ${next.name}`
            : "MAX LEVEL"}
        </span>
      </div>
    </div>
  );
};

const LevelTrack = ({ currentLevel }) => (
  <div className={styles.levelTrack}>
    {LEVELS.map((lvl, i) => {
      const isReached = currentLevel.level >= lvl.level;
      const isCurrent = currentLevel.level === lvl.level;
      return (
        <div key={lvl.level} className={styles.levelStep}>
          {i < LEVELS.length - 1 && (
            <div
              className={`${styles.levelConnector} ${isReached ? styles.levelConnectorActive : ""}`}
              style={isReached ? { background: lvl.color } : {}}
            />
          )}
          <div
            className={`${styles.levelNode} ${isReached ? styles.levelNodeActive : ""} ${isCurrent ? styles.levelNodeCurrent : ""}`}
            style={
              isReached
                ? {
                    borderColor: lvl.color,
                    boxShadow: isCurrent ? `0 0 18px ${lvl.color}55` : "none",
                  }
                : {}
            }
          >
            <span
              className={styles.levelNum}
              style={isReached ? { color: lvl.color } : {}}
            >
              {lvl.level}
            </span>
          </div>
          <span
            className={styles.levelName}
            style={isCurrent ? { color: lvl.color } : {}}
          >
            {lvl.name}
          </span>
        </div>
      );
    })}
  </div>
);

// Main 
export default function BankingDNA() {
  // Persisted quiz result — survives page refresh
  const [savedResult, setSavedResult] = useLocalStorage("bankingDNA_result_v1", null);

  // Derive initial phase from saved result
  const [phase, setPhase] = useState(() => savedResult ? "result" : "intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState(() => savedResult?.answers || []);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(() => !!savedResult);
  const [learnOpen, setLearnOpen] = useState(false);

  const [signals, setSignals] = useState(() => savedResult?.signals || {
    budget: 45,
    savings: 30,
    goals: 55,
    debt: 60,
    investment: 25,
  });

  const personality =
    answers.length === QUIZ.length
      ? PERSONALITY_TYPES[calcPersonality(answers)]
      : null;
  const xp = calcXP(answers);
  const currentLevel = getCurrentLevel(xp);
  const nextLevel = getNextLevel(xp);
  const persona = personality || PERSONALITY_TYPES.balancer;

  const handleAnswer = (option) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (qIndex < QUIZ.length - 1) {
      setQIndex(qIndex + 1);
    } else {
     
      const type = calcPersonality(newAnswers);
      const defaults = {
        spender: {
          budget: 28,
          savings: 22,
          goals: 30,
          debt: 45,
          investment: 18,
        },
        builder: {
          budget: 88,
          savings: 82,
          goals: 90,
          debt: 70,
          investment: 75,
        },
        maximiser: {
          budget: 52,
          savings: 45,
          goals: 55,
          debt: 55,
          investment: 38,
        },
        balancer: {
          budget: 72,
          savings: 68,
          goals: 74,
          debt: 78,
          investment: 62,
        },
      };
      setSignals(defaults[type]);
      setSavedResult({ answers: newAnswers, signals: defaults[type], completedAt: Date.now() });
      setPhase("result");
      setTimeout(() => setRevealed(true), 300);
    }
  };

  const restart = () => {
    setSavedResult(null);
    setPhase("intro");
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  };

  const q = QUIZ[qIndex];
  const progress = (qIndex / QUIZ.length) * 100;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Banking DNA</h1>
        <p className={styles.heroSub}>
          Your financial behaviour leaves a fingerprint. This system analyses
          your spending habits, savings patterns, and goal consistency to reveal
          your money personality — and chart your path to the next level.
        </p>
      </div>

      {/* Learn More */}
      <div className={styles.learnCard}>
        <button
          className={styles.learnToggle}
          onClick={() => setLearnOpen((v) => !v)}
        >
          How Banking DNA Works
          <svg
            className={`${styles.chevron} ${learnOpen ? styles.chevronOpen : ""}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {learnOpen && (
          <div className={styles.learnBody}>
            Banking DNA brings together data from across the platform — your
            spending habits, income patterns, financial goals, and strategy
            tracks — to build a behavioural profile unique to you. By analysing
            how consistently you save, how you prioritise lifestyle versus
            long-term assets, and how you respond to nudges and milestones, the
            system calculates a financial personality type. Answer the profiling
            questions honestly to get your most accurate result. Your profile
            updates as your habits evolve, so check back monthly to track your
            progress.
          </div>
        )}
      </div>

      {/*Intro*/}
      {phase === "intro" && (
        <>
          <div className={styles.twoCol}>
            {Object.values(PERSONALITY_TYPES).map((p) => (
              <div
                key={p.id}
                className={styles.personaCard}
                style={{ "--persona-color": p.color, "--persona-glow": p.glow }}
              >
                <div className={styles.personaIcon} style={{ color: p.color }}>
                  {p.icon}
                </div>
                <div className={styles.personaLabel} style={{ color: p.color }}>
                  {p.label}
                </div>
                <div className={styles.personaTagline}>{p.tagline}</div>
                <div className={styles.personaTraits}>
                  {p.traits.map((t) => (
                    <span
                      key={t}
                      className={styles.trait}
                      style={{ borderColor: `${p.color}40`, color: p.color }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>The Level System</h2>
            <p className={styles.cardSub}>
              As your financial habits improve, you move up through seven levels
              — each representing a higher tier of wealth-building maturity.
            </p>
            <div className={styles.levelGridIntro}>
              {LEVELS.map((lvl) => (
                <div key={lvl.level} className={styles.levelIntroItem}>
                  <div
                    className={styles.levelIntroNum}
                    style={{ color: lvl.color, borderColor: `${lvl.color}40` }}
                  >
                    {lvl.level}
                  </div>
                  <div
                    className={styles.levelIntroName}
                    style={{ color: lvl.color }}
                  >
                    {lvl.name}
                  </div>
                  <div className={styles.levelIntroDesc}>{lvl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.ctaWrap}>
            <button className={styles.ctaBtn} onClick={() => setPhase("quiz")}>
              Discover My DNA →
            </button>
          </div>
        </>
      )}

      {/* Quiz*/}
      {phase === "quiz" && (
        <div className={styles.quizWrap}>
          <div className={styles.quizProgress}>
            <div className={styles.quizProgressTrack}>
              <div
                className={styles.quizProgressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.quizProgressLabel}>
              {qIndex} of {QUIZ.length} questions
            </span>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.quizQNum}>Question {qIndex + 1}</div>
            <h2 className={styles.quizQuestion}>{q.question}</h2>
            <div className={styles.quizOptions}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`${styles.quizOption} ${selected?.label === opt.label ? styles.quizOptionSelected : ""}`}
                  onClick={() => handleAnswer(opt)}
                >
                  <span className={styles.quizOptionLetter}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className={styles.quizActions}>
              {qIndex > 0 && (
                <button
                  className={styles.quizBack}
                  onClick={() => {
                    setQIndex(qIndex - 1);
                    setAnswers(answers.slice(0, -1));
                    setSelected(null);
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                className={`${styles.ctaBtn} ${!selected ? styles.ctaBtnDisabled : ""}`}
                onClick={handleNext}
                disabled={!selected}
              >
                {qIndex === QUIZ.length - 1 ? "Reveal My DNA →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* resultd*/}
      {phase === "result" && personality && (
        <div
          className={`${styles.resultWrap} ${revealed ? styles.resultVisible : ""}`}
        >
          
          <div
            className={styles.dnaHero}
            style={{
              "--persona-color": persona.color,
              "--persona-glow": persona.glow,
            }}
          >
            <div className={styles.dnaGlowOrb} />
            <div className={styles.dnaIconLarge}>{persona.icon}</div>
            <div className={styles.dnaPersonaLabel}>YOUR FINANCIAL DNA</div>
            <div
              className={styles.dnaPersonaName}
              style={{ color: persona.color }}
            >
              {persona.label}
            </div>
            <p className={styles.dnaPersonaDesc}>{persona.description}</p>
            <div
              className={styles.personaTraits}
              style={{ justifyContent: "center" }}
            >
              {persona.traits.map((t) => (
                <span
                  key={t}
                  className={styles.trait}
                  style={{
                    borderColor: `${persona.color}40`,
                    color: persona.color,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Lvel*/}
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Your Level</h2>
            <p className={styles.cardSub}>
              Based on your financial behaviours and quiz responses.
            </p>
            <LevelTrack
              currentLevel={currentLevel}
              personalityColor={persona.color}
            />
            <XPBar xp={xp} current={currentLevel} next={nextLevel} />
            <div
              className={styles.levelDescBox}
              style={{ borderColor: `${currentLevel.color}40` }}
            >
              <span style={{ color: currentLevel.color, fontWeight: 700 }}>
                {currentLevel.name}
              </span>
              <span> — {currentLevel.desc}</span>
            </div>
          </div>

         
          <div className={styles.twoCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Behavioural Profile</h2>
              <p className={styles.cardSub}>
                Your financial behaviour across five key dimensions.
              </p>
              <RadarChart scores={signals} color={persona.color} />
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Signal Breakdown</h2>
              <p className={styles.cardSub}>
                How your habits score across each dimension.
              </p>
              {BEHAVIOUR_SIGNALS.map((sig) => (
                <div key={sig.key} className={styles.signalRow}>
                  <span className={styles.signalLabel}>{sig.label}</span>
                  <div className={styles.signalBarTrack}>
                    <div
                      className={styles.signalBarFill}
                      style={{
                        width: `${signals[sig.key]}%`,
                        background: persona.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span
                    className={styles.signalPct}
                    style={{ color: persona.color }}
                  >
                    {signals[sig.key]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Level Up */}
          <div className={styles.twoCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>How to Level Up</h2>
              <p className={styles.cardSub}>{persona.levelPath}</p>
              <ul className={styles.nudgeList}>
                {NUDGES[persona.id].map((n, i) => (
                  <li key={i} className={styles.nudgeItem}>
                    <span
                      className={styles.nudgeBullet}
                      style={{ color: persona.color }}
                    >
                      →
                    </span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>Next Level Preview</h2>
              {nextLevel ? (
                <>
                  <p className={styles.cardSub}>
                    What awaits you at{" "}
                    <span style={{ color: nextLevel.color }}>
                      {nextLevel.name}
                    </span>
                    .
                  </p>
                  <div
                    className={styles.nextLevelCard}
                    style={{ borderColor: `${nextLevel.color}40` }}
                  >
                    <div
                      className={styles.nextLevelNum}
                      style={{ color: nextLevel.color }}
                    >
                      Lv {nextLevel.level}
                    </div>
                    <div
                      className={styles.nextLevelName}
                      style={{ color: nextLevel.color }}
                    >
                      {nextLevel.name}
                    </div>
                    <p className={styles.nextLevelDesc}>{nextLevel.desc}</p>
                    <div className={styles.nextLevelXP}>
                      <span className={styles.xpNeeded}>
                        {nextLevel.xpRequired - xp} XP needed
                      </span>
                    </div>
                  </div>
                  <div className={styles.xpEarnTip}>
                    <div className={styles.xpEarnTitle}>How to earn XP</div>
                    {[
                      ["Complete all 6 goals in Money Snapshot", "+40 XP"],
                      ["Maintain budget for 3 consecutive months", "+35 XP"],
                      ["Max out TFSA contribution this year", "+50 XP"],
                      ["Reduce debt-to-income ratio by 5%", "+30 XP"],
                      ["Revisit and update your strategy tracker", "+25 XP"],
                    ].map(([action, reward]) => (
                      <div key={action} className={styles.xpEarnRow}>
                        <span>{action}</span>
                        <span
                          className={styles.xpReward}
                          style={{ color: nextLevel.color }}
                        >
                          {reward}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.maxLevelWrap}>
                  <div
                    className={styles.maxLevelBadge}
                    style={{
                      color: "#f8d299",
                      borderColor: "rgba(180, 100, 255, 0.325)",
                    }}
                  >
                    ◆ APEX ACHIEVED
                  </div>
                  <p className={styles.cardSub}>
                    You have reached the highest level. Your financial habits
                    are exemplary.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Retake */}
          <div className={styles.ctaWrap}>
            <button className={styles.retakeBtn} onClick={restart}>
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}