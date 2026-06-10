/**
 * Profile.jsx
 * ─────────────────────────────────────────────────────────────
 * User profile page — wired to useSnapshotStore for live metrics.
 * Sections:
 *   · Hero + avatar card with edit modal
 *   · Money Snapshot summary (6 key metrics, read-only)
 *   · Financial Health Score gauge
 *   · Banking DNA badge (derived from health profile)
 *   · Settings — clear all data with confirmation modal
 * ─────────────────────────────────────────────────────────────
 */
import React, { useState } from "react";
import styles from "./Profile.module.css";
import { useSnapshotStore } from "../../hooks/usesSnapshotStore";
import { useLocalStorage } from "../../hooks/userLocalStorage";

/* ── Icons ─────────────────────────────────────────────────── */
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

/* ── Banking DNA: prefer saved quiz result, fall back to metric-derived ── */
const QUIZ_PERSONAS = {
  spender: {
    name: "The Spender",
    badge: "◈",
    color: "#c84bff",
    description: "You have strong earning potential but tend to prioritise immediate lifestyle gratification. Savings and investments are inconsistent — making habits more intentional is the key unlock.",
  },
  builder: {
    name: "The Future Builder",
    badge: "◆",
    color: "#ff4bba",
    description: "Focused on long-term milestones. You save aggressively and delay lifestyle upgrades to reach goals sooner. Every rand saved today is a brick in tomorrow's foundation.",
  },
  maximiser: {
    name: "The Lifestyle Maximiser",
    badge: "◉",
    color: "#4bbdff",
    description: "You use income for the enjoyment of life — travel, dining, experiences. Finding a sustainable balance between spending and saving is your key lever.",
  },
  balancer: {
    name: "The Strategic Balancer",
    badge: "◇",
    color: "#4bffab",
    description: "You maintain a middle ground between saving, investing, and living well. Progress feels steady and manageable. You're the rarest profile — the one most likely to win over time.",
  },
};

function getBankingDNA(metrics, healthScore, quizResult) {
  // If the user has completed the Banking DNA quiz, use that result
  if (quizResult?.answers?.length) {
    const counts = { spender: 0, builder: 0, maximiser: 0, balancer: 0 };
    quizResult.answers.forEach(a => { if (a?.type) counts[a.type]++; });
    const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return QUIZ_PERSONAS[topType];
  }
  // Fall back to metric-derived archetype if quiz not yet taken
  if (healthScore >= 75 && metrics.savingsRate >= 15) {
    return {
      name: "Wealth Builder",
      badge: "🏆",
      color: "#4ade80",
      description: "You consistently save above the 15% benchmark and keep debt under control. You're compounding wealth, not just managing it.",
    };
  }
  if (metrics.dti > 50) {
    return {
      name: "Debt Climber",
      badge: "⚡",
      color: "#f87171",
      description: "More than half your income services debt. Your priority is aggressive repayment — every extra rand clears the path faster.",
    };
  }
  if (metrics.emergencyMonths < 1) {
    return {
      name: "Exposed Earner",
      badge: "🛡️",
      color: "#f59e0b",
      description: "You're earning, but one unexpected bill could tip the balance. Building even a small emergency fund is your most urgent move.",
    };
  }
  if (metrics.savingsRate >= 5 && metrics.dti < 36) {
    return {
      name: "Steady Climber",
      badge: "📈",
      color: "#c84bff",
      description: "Your fundamentals are solid — debt is manageable and you're saving. Pushing your savings rate above 15% is the next unlock.",
    };
  }
  return {
    name: "Finding Footing",
    badge: "🔍",
    color: "#f8d299",
    description: "You're getting a clear picture of your finances. Use the Insights tab to identify your highest-leverage improvement.",
  };
}

/* ── Main component ─────────────────────────────────────────── */
export default function ProfilePage() {
  const { derived, state } = useSnapshotStore();
  const { grossMonthly, takeHome, paye, totalExpenses, metrics, healthScore, fmt } = derived;

  // Persist profile info across sessions
  const [profile, setProfile] = useLocalStorage("userProfile_v1", {
    firstName: "Name",
    lastName: "Surname",
    username: "Name_Surname",
    email: "NameSurname@gmail.com",
  });

  // Read Banking DNA quiz result saved by BankingDNA.jsx
  const [quizResult] = useLocalStorage("bankingDNA_result_v1", null);

  const [modalOpen, setModalOpen]   = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [draft, setDraft] = useState({ ...profile });

  const dna = getBankingDNA(metrics, healthScore, quizResult);
  const scoreColor = healthScore >= 75 ? "#4ade80" : healthScore >= 50 ? "#f59e0b" : "#f87171";
  const circ = 2 * Math.PI * 44;

  const openModal  = () => { setDraft({ ...profile }); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);
  const handleChange = (e) => setDraft(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSave   = () => { setProfile({ ...draft }); setModalOpen(false); };

  const handleClearData = () => {
    [
      "moneySnapshot_v3",
      "moneySnapshot_history_v3",
      "moneySnapshot_dismissed_nudges_v3",
      "bankingDNA_result_v1",
      "userProfile_v1",
    ].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  /* Snapshot metric tiles */
  const snapshotMetrics = [
    { label: "Gross Monthly",    value: fmt(grossMonthly),                                      accent: "#c84bff" },
    { label: "Take-Home Pay",    value: fmt(takeHome),                                          accent: "#f8d299" },
    { label: "Monthly PAYE",     value: fmt(paye),                                              accent: "#f87171" },
    { label: "Total Expenses",   value: fmt(totalExpenses),                                     accent: "#f87171" },
    { label: "Savings Rate",     value: `${metrics.savingsRate.toFixed(0)}%`,                   accent: metrics.savingsRate >= 15 ? "#4ade80" : "#f59e0b" },
    { label: "Emergency Cover",  value: `${metrics.emergencyMonths.toFixed(1)} mo`,             accent: metrics.emergencyMonths >= 3 ? "#4ade80" : "#f59e0b" },
    { label: "Debt-to-Income",   value: `${metrics.dti.toFixed(0)}%`,                          accent: metrics.dti < 36 ? "#4ade80" : "#f87171" },
    { label: "Disposable",       value: fmt(metrics.disposable),                                accent: metrics.disposable >= 0 ? "#4ade80" : "#f87171" },
  ];

  return (
    <div className={styles.pageWrapper}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Financial Overview</p>
        <h1 className={styles.heroTitle}>
          {profile.firstName} {profile.lastName}
        </h1>
        <p className={styles.heroSub}>Your money, your picture — updated live from Money Snapshot</p>
      </div>

      {/* ── Profile card + DNA side by side ────────────────────── */}
      <div className={styles.topRow}>

        {/* Identity card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarRing} style={{ "--dna-color": dna.color }}>
            <div className={styles.avatarInner}><UserIcon /></div>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{profile.firstName} {profile.lastName}</h2>
            <p className={styles.profileHandle}>@{profile.username}</p>
            <p className={styles.profileEmail}>{profile.email}</p>
          </div>
          <button className={styles.editBtn} onClick={openModal}>
            <EditIcon /> Edit Profile
          </button>
        </div>

        {/* Banking DNA */}
        <div className={styles.dnaCard} style={{ "--dna-color": dna.color }}>
          <div className={styles.dnaHeader}>
            <span className={styles.dnaEyebrow}>
              Banking DNA{quizResult ? "" : " · Not yet assessed"}
            </span>
            <span className={styles.dnaBadgeIcon}>{dna.badge}</span>
          </div>
          <h3 className={styles.dnaName} style={{ color: dna.color }}>{dna.name}</h3>
          <p className={styles.dnaDesc}>{dna.description}</p>
          <div className={styles.dnaBar}>
            <div className={styles.dnaBarFill} style={{ width: `${Math.min(healthScore, 100)}%`, background: dna.color }} />
          </div>
          <div className={styles.dnaBarLabel}>
            <span>Financial Health</span>
            <span style={{ color: dna.color }}>{healthScore}%</span>
          </div>
        </div>

      </div>

      {/* ── Health Score gauge + label ─────────────────────────── */}
      <div className={styles.healthSection}>
        <div className={styles.healthGauge}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle cx="55" cy="55" r="44" fill="none"
              stroke={scoreColor} strokeWidth="10"
              strokeDasharray={`${(healthScore / 100) * circ} ${circ}`}
              strokeDashoffset={circ * 0.25} strokeLinecap="round" />
            <text x="55" y="60" textAnchor="middle" fill={scoreColor} fontSize="22" fontWeight="700">{healthScore}%</text>
          </svg>
          <div className={styles.gaugeLabel}>
            <span className={styles.gaugeLabelTitle}>Health Score</span>
            <span className={styles.gaugeLabelSub} style={{ color: scoreColor }}>
              {healthScore >= 75 ? "Excellent" : healthScore >= 50 ? "Good" : "Needs Work"}
            </span>
          </div>
        </div>

        {/* Score breakdown bars */}
        <div className={styles.scoreBreakdown}>
          {[
            { label: "Debt-to-Income",  score: metrics.dti < 36 ? 25 : metrics.dti < 50 ? 12 : 0,               max: 25 },
            { label: "Savings Rate",    score: metrics.savingsRate >= 15 ? 25 : metrics.savingsRate >= 5 ? 12 : 0, max: 25 },
            { label: "Emergency Fund",  score: metrics.emergencyMonths >= 3 ? 25 : metrics.emergencyMonths >= 1 ? 12 : 0, max: 25 },
            { label: "Cash Flow",       score: metrics.disposable > 0 ? 15 : 0,                                   max: 15 },
            { label: "TFSA",            score: state.tfsa > 0 ? 10 : 0,                                           max: 10 },
          ].map(row => {
            const c = row.score === row.max ? "#4ade80" : row.score > 0 ? "#f59e0b" : "#f87171";
            return (
              <div key={row.label} className={styles.scoreRow}>
                <span className={styles.scoreLabel}>{row.label}</span>
                <div className={styles.scoreTrack}>
                  <div className={styles.scoreFill} style={{ width: `${(row.score / row.max) * 100}%`, background: c }} />
                </div>
                <span className={styles.scoreVal} style={{ color: c }}>{row.score}/{row.max}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Money Snapshot metrics grid ────────────────────────── */}
      <div className={styles.snapshotSection}>
        <h2 className={styles.sectionTitle}>Money Snapshot</h2>
        <p className={styles.sectionSub}>Live read from your latest financial data — update values in the Snapshot tool.</p>
        <div className={styles.metricsGrid}>
          {snapshotMetrics.map(m => (
            <div key={m.label} className={styles.metricTile}>
              <div className={styles.metricDot} style={{ background: m.accent }} />
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue} style={{ color: m.accent }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Settings ───────────────────────────────────────────── */}
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Settings</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingLabel}>Clear all snapshot data</div>
              <div className={styles.settingDesc}>Permanently removes all saved inputs, snapshots, and history from this device.</div>
            </div>
            <button className={styles.dangerBtn} onClick={() => setClearModal(true)}>
              <TrashIcon /> Clear data
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit profile modal ──────────────────────────────────── */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Edit Profile</span>
              <button className={styles.modalClose} onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name</label>
                  <input className={styles.formInput} name="firstName" value={draft.firstName} onChange={handleChange} placeholder="First name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input className={styles.formInput} name="lastName" value={draft.lastName} onChange={handleChange} placeholder="Last name" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Username</label>
                <input className={styles.formInput} name="username" value={draft.username} onChange={handleChange} placeholder="Username" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input className={styles.formInput} name="email" type="email" value={draft.email} onChange={handleChange} placeholder="Email address" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Clear data confirmation modal ───────────────────────── */}
      {clearModal && (
        <div className={styles.modalOverlay} onClick={() => setClearModal(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Clear all data?</span>
              <button className={styles.modalClose} onClick={() => setClearModal(false)}><CloseIcon /></button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                This will permanently delete all your saved snapshot data, history, and settings from this device. This cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setClearModal(false)}>Cancel</button>
              <button className={styles.dangerConfirmBtn} onClick={handleClearData}>Yes, clear everything</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}