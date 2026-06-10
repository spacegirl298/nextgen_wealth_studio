/*
  LoginForm.jsx
  – Shows a success banner when arriving from signup (justRegistered state)
  – Pre-fills email if passed via navigation state
  – Dark theme via Auth.module.css
  – No inline styles
*/

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { getUsers } from "../../../utils/authStorage";
import styles from "../Auth.module.css";

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.alertIcon}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.alertIcon}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm({ onForgotPassword }) {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.justRegistered ?? false;
  const prefillEmail = location.state?.email ?? "";

  const [fields, setFields] = useState({ email: prefillEmail, password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  function validate() {
    const errs = {};
    if (!fields.email.trim()) errs.email = "Email is required.";
    else if (!isValidEmail(fields.email)) errs.email = "Enter a valid email address.";
    if (!fields.password) errs.password = "Password is required.";
    return errs;
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    setFormError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    try {
      const users = getUsers();
      const emailKey = fields.email.toLowerCase();
      const stored = users[emailKey];

      if (!stored) {
        setFormError("No account found for this email. Check for typos or create an account.");
        setLoading(false);
        return;
      }

      const expectedHash = btoa(fields.password);
      if (stored.passwordHash !== expectedHash) {
        setErrors({ password: "Wrong password. Try again or reset it below." });
        setLoading(false);
        return;
      }

      users[emailKey].lastLogin = new Date().toISOString();
      localStorage.setItem("auth_users", JSON.stringify(users));

      login({
        userId: stored.userId,
        displayName: stored.displayName,
        email: emailKey,
        joinedDate: stored.joinedDate,
        lastLogin: new Date().toISOString(),
      });

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {justRegistered && (
        <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
          <SuccessIcon />
          Account created! Sign in to get started.
        </div>
      )}

      {formError && (
        <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
          <AlertIcon />
          {formError}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>Email address</label>
        <input
          id="login-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          placeholder="you@example.com"
          value={fields.email}
          onChange={set("email")}
          autoComplete="email"
        />
        {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>Password</label>
        <div className={styles.inputWrap}>
          <input
            id="login-password"
            type={showPw ? "text" : "password"}
            className={`${styles.input} ${styles.inputWithEye} ${errors.password ? styles.inputError : ""}`}
            placeholder="Your password"
            value={fields.password}
            onChange={set("password")}
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPw} />
          </button>
        </div>
        {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
      </div>

      <div className={styles.forgotRow}>
        <button type="button" className={styles.forgotLink} onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}