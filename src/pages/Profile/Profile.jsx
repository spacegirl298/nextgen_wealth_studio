/*User profile and summary page.
–	User info: name, email, edit button
–	Banking DNA profile: profile name, description, Badge
–	Money Snapshot summary (read-only): key metrics from FinancialContext
–	Strategy Track progress: active track, stages completed, 'Continue' link
–	Settings section: clear all data (with confirmation modal), logout
–	Links back to each feature to update data

*/
import React, { useState } from "react";
import styles from "./Profile.module.css";
import { useFinancial } from "../../components/FinancialContext";

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

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* component  */
export default function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Name",
    lastName: "Surname",
    username: "Name_Surname",
    email: "NameSurname@gmail.com",
  });
  const [draft, setDraft] = useState({ ...profile });

  const { grossMonthly, fixedCosts, variableSpending, totalDebt, healthScore } =
    useFinancial();

  const openModal = () => {
    setDraft({ ...profile });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setDraft((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setProfile({ ...draft });
    setModalOpen(false);
  };

  // Format currency
  const formatCurrency = (value) => {
    return `R${Math.round(value).toLocaleString()}`;
  };

  //  total monthly expenses
  const totalExpenses = fixedCosts + variableSpending;

  // Stats data
  const stats = [
    { label: "Total Income", value: formatCurrency(grossMonthly) },
    { label: "Total Expenses", value: formatCurrency(totalExpenses) },
    { label: "Debt Balance", value: formatCurrency(totalDebt) },
  ];

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
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className={styles.profileMeta}>
            <strong>Username:</strong> <span>{profile.username}</span>
            <br />
            <strong>Email Address:</strong> <span>{profile.email}</span>
          </p>
        </div>

        <button className={styles.editBtn} onClick={openModal}>
          <EditIcon /> Edit Profile
        </button>
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

      {/* Goal Progress / Health Score */}
      <div className={styles.goalSection}>
        <h2 className={styles.sectionTitle}>Financial Health Score</h2>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${healthScore}%` }}
            role="progressbar"
            aria-valuenow={healthScore}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className={styles.progressLabel}>{healthScore}%</div>
        <p className={styles.healthDescription}>
          {healthScore >= 75
            ? "Excellent — you're on track!"
            : healthScore >= 50
              ? "Good — a few areas to improve"
              : "Needs attention — review your budget"}
        </p>
      </div>

      {/* Edit Profile  */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Edit Profile</span>
              <button className={styles.modalClose} onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name</label>
                  <input
                    className={styles.formInput}
                    name="firstName"
                    value={draft.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input
                    className={styles.formInput}
                    name="lastName"
                    value={draft.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Username</label>
                <input
                  className={styles.formInput}
                  name="username"
                  value={draft.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  className={styles.formInput}
                  name="email"
                  type="email"
                  value={draft.email}
                  onChange={handleChange}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
