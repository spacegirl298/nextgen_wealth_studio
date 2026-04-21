// ProfilePage.jsx
import React from "react";
import styles from "./Profile.module.css";

/* ── tiny inline SVG icons (no external dep needed) ── */
const ImagePlaceholderIcon = () => (
  <svg
    className={styles.avatarIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
    <line x1="19" y1="5" x2="23" y2="1" />
    <line x1="23" y1="5" x2="19" y2="1" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className={styles.statArrow}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="7" x2="17" y2="17" />
    <polyline points="17 7 17 17 7 17" />
  </svg>
);

/* ── data ── */
const stats = [
  { label: "Total Income",  value: "R46 000" },
  { label: "Fixed Costs",   value: "R41 150" },
  { label: "Debt Balance",  value: "R160 000" },
];

const GOAL_PERCENT = 68;

/* ── component ── */
export default function ProfilePage() {
  return (
    <div className={styles.pageWrapper}>

      {/* Hero heading */}
      <div className={styles.hero}>
        <h1>Your Profile</h1>
        <p>From renter to home-owner – a realistic 5-year wealth shift</p>
      </div>

      {/* Profile card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          <ImagePlaceholderIcon />
        </div>

        <div className={styles.profileInfo}>
          <h2>Name Surname</h2>
          <p className={styles.profileMeta}>
            <strong>Username:</strong> <span>Name_Surname</span><br />
            <strong>Email Address:</strong> <span>NameSurname@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Statistics</h2>
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue}>{s.value}</div>
              <ArrowIcon />
            </div>
          ))}
        </div>
      </div>

      {/* Goal Progress */}
      <div className={styles.goalSection}>
        <h2 className={styles.sectionTitle}>Goal Progress</h2>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${GOAL_PERCENT}%` }}
            role="progressbar"
            aria-valuenow={GOAL_PERCENT}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className={styles.progressLabel}>{GOAL_PERCENT}%</div>
      </div>

    </div>
  );
}
