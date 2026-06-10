/**
 * StrategyTrack.jsx
 * Strategy Track selection page with Banking DNA assessment.
 *
 * – Intro + collapsible "What are Strategy Tracks?" explainer
 * – Banking DNA mini-quiz to determine recommended track
 * – TrackCard per track with: pill, title, tagline, description, stats, progress, CTA
 * – Recommended track highlighted based on assessment answers and moved to top
 * – Progress reads from localStorage (same keys the individual track pages write to)
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/SelectionLayout.module.css";
import BuildImg from "../../assets/Track/BuildImg.jpg";
import BalanceImg from "../../assets/Track/BalanceImg.jpg";
import GlobalImg from "../../assets/Track/GlobalImg.jpg";

// ─── Progress helpers — reads the same localStorage keys the track pages write ──
function useTrackProgress(completedKey, totalStages) {
  const raw = localStorage.getItem(completedKey);
  if (!raw) return { started: false, completed: 0, total: totalStages, pct: 0 };
  try {
    const obj = JSON.parse(raw);
    const completed = Object.keys(obj).length;
    return {
      started: completed > 0,
      completed,
      total: totalStages,
      pct: Math.round((completed / totalStages) * 100),
    };
  } catch {
    return { started: false, completed: 0, total: totalStages, pct: 0 };
  }
}

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

// ─── Progress mini-bar ────────────────────────────────────────────────
function ProgressBar({ started, completed, total, pct }) {
  if (!started) {
    return <span className={styles.progressNotStarted}>Not started</span>;
  }
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressLabel}>
        <span>Progress</span>
        <span className={styles.progressLabelCount}>{completed}/{total} stages</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Banking DNA Assessment Component ─────────────────────────────────
const ASSESSMENT_QUESTIONS = [
  {
    id: "primaryGoal",
    question: "What's your primary financial goal right now?",
    options: [
      { value: "home", label: "Buy my first home", trackScores: { property: 35, balance: 5, aggressive: 0 } },
      { value: "balance", label: "Enjoy life now while building wealth", trackScores: { property: 5, balance: 35, aggressive: 5 } },
      { value: "wealth", label: "Build wealth as fast as possible", trackScores: { property: 0, balance: 5, aggressive: 35 } },
    ],
  },
  {
    id: "riskTolerance",
    question: "How comfortable are you with investment risk?",
    options: [
      { value: "low", label: "Very cautious — I prefer safety over returns", trackScores: { property: 30, balance: 10, aggressive: 0 } },
      { value: "medium", label: "Moderate — some risk is okay for good returns", trackScores: { property: 10, balance: 30, aggressive: 10 } },
      { value: "high", label: "Aggressive — higher risk for higher potential returns", trackScores: { property: 0, balance: 10, aggressive: 35 } },
    ],
  },
  {
    id: "timeHorizon",
    question: "What's your investment time horizon?",
    options: [
      { value: "short", label: "Less than 2 years", trackScores: { property: 25, balance: 5, aggressive: 0 } },
      { value: "medium", label: "2-5 years", trackScores: { property: 20, balance: 15, aggressive: 5 } },
      { value: "long", label: "5-10 years", trackScores: { property: 5, balance: 25, aggressive: 15 } },
      { value: "veryLong", label: "10+ years", trackScores: { property: 0, balance: 10, aggressive: 30 } },
    ],
  },
  {
    id: "incomeLevel",
    question: "How would you describe your household income?",
    options: [
      { value: "low", label: "Building / Entry level", trackScores: { property: 15, balance: 5, aggressive: 0 } },
      { value: "medium", label: "Stable middle income", trackScores: { property: 10, balance: 15, aggressive: 5 } },
      { value: "high", label: "High income earner", trackScores: { property: 5, balance: 10, aggressive: 20 } },
    ],
  },
  {
    id: "savingsRate",
    question: "What percentage of your income can you save monthly?",
    options: [
      { value: "low", label: "Less than 10%", trackScores: { property: 10, balance: 5, aggressive: 0 } },
      { value: "medium", label: "10-20%", trackScores: { property: 10, balance: 15, aggressive: 5 } },
      { value: "high", label: "20-30%", trackScores: { property: 5, balance: 10, aggressive: 15 } },
      { value: "veryHigh", label: "30%+", trackScores: { property: 0, balance: 5, aggressive: 20 } },
    ],
  },
];

function BankingDNAAssessment({ onComplete, initialAnswers }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [isOpen, setIsOpen] = useState(!initialAnswers?.complete);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];
  const isComplete = Object.keys(answers).length === ASSESSMENT_QUESTIONS.length;

  const handleAnswer = (questionId, value, trackScores) => {
    const newAnswers = { ...answers, [questionId]: { value, trackScores } };
    setAnswers(newAnswers);

    if (currentStep + 1 < ASSESSMENT_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final recommendations
      const totals = { property: 0, balance: 0, aggressive: 0 };
      Object.values(newAnswers).forEach((answer) => {
        totals.property += answer.trackScores.property;
        totals.balance += answer.trackScores.balance;
        totals.aggressive += answer.trackScores.aggressive;
      });

      const maxScore = Math.max(totals.property, totals.balance, totals.aggressive);
      let recommended = "balance";
      if (totals.property === maxScore) recommended = "property";
      if (totals.aggressive === maxScore) recommended = "aggressive";

      const result = {
        ...newAnswers,
        scores: totals,
        recommended,
        complete: true,
      };

      // Save to localStorage
      localStorage.setItem("bankingDNA", JSON.stringify(result));
      onComplete(result);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen && isComplete) {
    return (
      <div className={styles.assessmentBanner}>
        <div className={styles.assessmentBannerContent}>
          <span>Your Banking DNA is set</span>
          <button onClick={() => setIsOpen(true)} className={styles.assessmentRetakeBtn}>
            Retake assessment
          </button>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className={styles.assessmentPrompt}>
        <button onClick={() => setIsOpen(true)} className={styles.assessmentStartBtn}>
          Take the Banking DNA assessment
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className={styles.assessmentComplete}>
        <h3>Your Banking DNA Profile</h3>
        <div className={styles.assessmentSummary}>
          {Object.entries(answers).map(([key, answer]) => {
            const question = ASSESSMENT_QUESTIONS.find(q => q.id === key);
            const option = question?.options.find(o => o.value === answer.value);
            return (
              <div key={key} className={styles.assessmentSummaryItem}>
                <span className={styles.summaryQuestion}>{question?.question}</span>
                <span className={styles.summaryAnswer}>{option?.label}</span>
              </div>
            );
          })}
        </div>
        <button onClick={resetAssessment} className={styles.assessmentRetakeFullBtn}>
          Retake assessment
        </button>
      </div>
    );
  }

  return (
    <div className={styles.assessmentCard}>
      <div className={styles.assessmentHeader}>
        <span className={styles.assessmentStep}>Step {currentStep + 1} of {ASSESSMENT_QUESTIONS.length}</span>
        <button onClick={() => setIsOpen(false)} className={styles.assessmentCloseBtn}>✕</button>
      </div>
      <h3 className={styles.assessmentQuestion}>{currentQuestion.question}</h3>
      <div className={styles.assessmentOptions}>
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            className={styles.assessmentOption}
            onClick={() => handleAnswer(currentQuestion.id, option.value, option.trackScores)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Track Card ───────────────────────────────────────────────────────
function TrackCard({ 
  pill, 
  title, 
  tagline, 
  description, 
  stats, 
  imageSrc, 
  completedKey, 
  totalStages, 
  onStart, 
  isRecommended,
  matchScore 
}) {
  const progress = useTrackProgress(completedKey, totalStages);
  const ctaLabel = progress.started && progress.completed < progress.total
    ? "Continue Track"
    : progress.completed === progress.total && progress.started
    ? "Review Track"
    : "Start Track";

  return (
    <div className={`${styles.card} ${isRecommended ? styles.recommended : ""}`}>
      {isRecommended && <div className={styles.recommendedBadge}>Recommended for you</div>}
      {matchScore !== undefined && matchScore > 0 && !isRecommended && (
        <div className={styles.matchBadge}>{matchScore}% Match</div>
      )}
      
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

        <ProgressBar {...progress} />

        <div className={styles.cardFooter}>
          <button className={styles.ctaBtn} onClick={onStart}>
            {ctaLabel} <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Explainer items ──────────────────────────────────────────────────
const EXPLAINER_ITEMS = [
  {
    title: "Structured milestones",
    body: "Each track breaks a complex financial goal into 5–6 clear stages — with action items, tradeoffs, and real examples at every step.",
  },
  {
    title: "Live simulation",
    body: "Sliders update every calculation in real time. Adjust your income, savings rate, or target and see your timeline shift instantly.",
  },
  {
    title: "Contextual nudges",
    body: "Smart alerts fire when your inputs reveal a risk or opportunity — and stay dismissed once you've read them.",
  },
  {
    title: "Persistent progress",
    body: "Your inputs and completed stages are saved automatically. Pick up exactly where you left off, on any device.",
  },
];

// ─── Track definitions ────────────────────────────────────────────────
const TRACKS = [
  {
    id: "property",
    pill: "Track · Property",
    title: "First Property Builder",
    tagline: "From renting to owning — your first home, step by step.",
    description: "Designed for young professionals who are working toward the milestone of home ownership. It focuses on helping you build a solid financial foundation through disciplined saving for a deposit, maintaining a strong credit profile, and ensuring that your future home remains affordable in the long term. This track encourages stability and consistency, guiding you away from high-risk investments and frequent job changes, so you can confidently move toward owning your first property.",
    imageSrc: BuildImg,
    completedKey: "fpb_completed_v1",
    totalStages: 6,
    stats: [
      { val: "6", label: "Stages" },
      { val: "18–36", label: "Months" },
      { val: "SA", label: "Focused" },
    ],
    route: "/track/property",
  },
  {
    id: "balance",
    pill: "Track · Lifestyle",
    title: "Balanced Lifestyle & Investing",
    tagline: "Enjoy your money today while building lasting wealth.",
    description: "Designed for professionals who want to enjoy their money now while still building long-term financial security. This track helps you develop sustainable habits such as investing consistently, staying flexible with your finances, and intentionally budgeting for lifestyle experiences. It encourages a healthy balance, guiding you away from financial burnout and helping you avoid making decisions driven purely by fear — so you can build wealth while still enjoying the present.",
    imageSrc: BalanceImg,
    completedKey: "bl_completed_v1",
    totalStages: 5,
    stats: [
      { val: "5", label: "Stages" },
      { val: "12–24", label: "Months" },
      { val: "All", label: "Income levels" },
    ],
    route: "/track/lifestyle",
  },
  {
    id: "aggressive",
    pill: "Track · Investing",
    title: "Aggressive Global Investor",
    tagline: "High risk, high reward — build wealth across global markets.",
    description: "Designed for ambitious high earners who are comfortable taking on higher levels of risk in pursuit of faster wealth growth. It focuses on helping you maintain a high savings and investment rate, expand your exposure to global markets, and actively engage with emerging financial opportunities. This track encourages a proactive and growth-driven mindset, guiding you toward building significant wealth through strategic, globally diversified investing.",
    imageSrc: GlobalImg,
    completedKey: "ag_completed_v1",
    totalStages: 6,
    stats: [
      { val: "6", label: "Stages" },
      { val: "36–60", label: "Months" },
      { val: "High", label: "Income" },
    ],
    route: "/track/aggressive",
  },
];

// Helper to calculate match percentage for a track
function calculateMatchPercentage(trackId, scores) {
  if (!scores) return null;
  
  const maxScore = Math.max(scores.property, scores.balance, scores.aggressive);
  if (maxScore === 0) return null;
  
  const trackScore = scores[trackId];
  const percentage = Math.round((trackScore / maxScore) * 100);
  return percentage > 30 ? percentage : null;
}

// ─── Main Page Component ──────────────────────────────────────────────
export default function StrategyTrack() {
  const navigate = useNavigate();
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [dnaProfile, setDnaProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("bankingDNA");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed?.complete ? parsed : null;
    } catch (error) {
      console.error("Failed to load DNA profile", error);
      return null;
    }
  });

  const handleAssessmentComplete = (profile) => {
    setDnaProfile(profile);
  };

  // Get recommended track ID from actual assessment results
  const recommendedTrackId = dnaProfile?.recommended || null;
  
  const getMatchScore = (trackId) => {
    if (!dnaProfile?.scores) return null;
    return calculateMatchPercentage(trackId, dnaProfile.scores);
  };

  // Sort tracks: recommended track first, then others by match score (highest to lowest)
  const getSortedTracks = () => {
    const tracksWithScores = TRACKS.map(track => ({
      ...track,
      matchPercentage: getMatchScore(track.id)
    }));

    if (!recommendedTrackId) {
      // No recommendation yet, show in original order
      return TRACKS;
    }

    // Sort: recommended first, then others by match percentage (descending)
    return tracksWithScores.sort((a, b) => {
      // Recommended track always comes first
      if (a.id === recommendedTrackId) return -1;
      if (b.id === recommendedTrackId) return 1;
      
      // For remaining tracks, sort by match percentage (higher first)
      const aScore = a.matchPercentage || 0;
      const bScore = b.matchPercentage || 0;
      return bScore - aScore;
    });
  };

  const sortedTracks = getSortedTracks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Strategy Tracks</h1>
          <p className={styles.heroSub}>
            Pick the financial journey that matches your goal. Each track gives you a structured path, 
            a live simulator, and stage-by-stage milestones — so you always know exactly what to do next.
          </p>
        </div>

        {/* Banking DNA Assessment */}
        <BankingDNAAssessment 
          onComplete={handleAssessmentComplete}
          initialAnswers={dnaProfile}
        />

        {/* Collapsible explainer */}
        <div className={styles.learnCard}>
          <button
            className={`${styles.learnToggle} ${explainerOpen ? styles.open : ""}`}
            onClick={() => setExplainerOpen(!explainerOpen)}
          >
            <span>What are Strategy Tracks?</span>
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

        {/* Track cards - sorted with recommended at the top */}
        <div className={styles.cardsContainer}>
          {sortedTracks.map((track) => (
            <TrackCard
              key={track.route}
              {...track}
              isRecommended={track.id === recommendedTrackId}
              matchScore={getMatchScore(track.id)}
              onStart={() => { window.scrollTo(0, 0); navigate(track.route); }}
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