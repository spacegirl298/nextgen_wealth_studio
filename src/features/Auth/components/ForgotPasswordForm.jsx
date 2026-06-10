/*
  ForgotPasswordForm.jsx
  – Single email field
  – Submit shows generic success message (don't confirm if email exists)
  – Validation: valid email format
*/

import { useState } from "react";
import styles from "../Auth.module.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    if (!email.trim()) return "Please enter your email address.";
    if (!isValidEmail(email)) return "Enter a valid email address.";
    return "";
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    const err = validate();
    if (err) { setEmailError(err); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <CheckCircleIcon />
        </div>
        <h2 className={styles.successTitle}>Check your inbox</h2>
        <p className={styles.successMessage}>
          If an account exists for <strong>{email}</strong>, a password reset link is on its way. Check your spam folder if you don't see it.
        </p>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="forgot-email" className={styles.label}>Email address</label>
        <input
          id="forgot-email"
          type="email"
          className={`${styles.input} ${emailError ? styles.inputError : ""}`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
          autoComplete="email"
          autoFocus
        />
        {emailError && <p className={styles.fieldError}>{emailError}</p>}
        <p className={styles.fieldHint}>We'll send a reset link to this address.</p>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}