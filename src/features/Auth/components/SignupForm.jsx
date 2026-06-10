/*
  SignupForm.jsx
  – Creates user in localStorage, then redirects to /login (not auto-login)
  – Name, email, password, confirm-password fields
  – Password strength indicator
  – Dark theme via Auth.module.css
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../../../utils/authStorage";
import { clearAllAppData } from "../../../utils/appStorage";
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

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_MAP = {
  0: { label: "", color: "transparent", width: 0 },
  1: { label: "Weak — try adding numbers or symbols", color: "#f87171", width: 25 },
  2: { label: "Fair — add uppercase letters or symbols", color: "#f59e0b", width: 50 },
  3: { label: "Good — nearly there", color: "#4bffab", width: 75 },
  4: { label: "Strong password", color: "#c9a84c", width: 100 },
};

export default function SignupForm() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const strength = passwordStrength(fields.password);
  const si = STRENGTH_MAP[strength] || STRENGTH_MAP[0];
  const passwordsMatch = fields.confirm && fields.password === fields.confirm;
  const passwordsMismatch = fields.confirm && fields.password !== fields.confirm;

  function validate() {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Please enter your name.";
    if (!fields.email.trim()) errs.email = "Email is required.";
    else if (!isValidEmail(fields.email)) errs.email = "Enter a valid email address.";
    if (!fields.password) errs.password = "Password is required.";
    else if (fields.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!fields.confirm) errs.confirm = "Please confirm your password.";
    else if (fields.password !== fields.confirm) errs.confirm = "Passwords don't match.";
    return errs;
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    setFormError("");
    const errs = validate();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }

    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    try {
      const users = getUsers();
      const emailKey = fields.email.toLowerCase();

      // Check if user already exists
      if (users[emailKey]) {
        setFormError("An account already exists for this email. Sign in instead.");
        setLoading(false);
        return;
      }

      const userId = `user_${Date.now()}`;
      const joinedDate = new Date().toISOString();

      // Create new user
      users[emailKey] = {
        userId,
        displayName: fields.name.trim(),
        email: emailKey,
        passwordHash: btoa(fields.password),
        joinedDate,
        lastLogin: joinedDate,
      };

      // Save to localStorage
      const saveSuccess = saveUsers(users);
      
      if (!saveSuccess) {
        setFormError("Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Verify the user was actually saved
      const verifyUsers = getUsers();
      if (!verifyUsers[emailKey]) {
        setFormError("Account creation failed. Please try again.");
        setLoading(false);
        return;
      }

      // Clear only app data (preserves auth_users)
      clearAllAppData();

      // Redirect to login
      navigate("/login", { state: { justRegistered: true, email: emailKey } });
    } catch (error) {
      console.error("Signup error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {formError}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="signup-name" className={styles.label}>Full name</label>
        <input
          id="signup-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="Alex Johnson"
          value={fields.name}
          onChange={set("name")}
          autoComplete="name"
        />
        {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-email" className={styles.label}>Email address</label>
        <input
          id="signup-email"
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
        <label htmlFor="signup-password" className={styles.label}>Password</label>
        <div className={styles.inputWrap}>
          <input
            id="signup-password"
            type={showPw ? "text" : "password"}
            className={`${styles.input} ${styles.inputWithEye} ${errors.password ? styles.inputError : ""}`}
            placeholder="At least 8 characters"
            value={fields.password}
            onChange={set("password")}
            autoComplete="new-password"
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}>
            <EyeIcon open={showPw} />
          </button>
        </div>
        {fields.password && (
          <>
            <div className={styles.strengthBar}>
              <div className={styles.strengthFill} style={{ width: `${si.width}%`, backgroundColor: si.color }} />
            </div>
            <p className={styles.strengthLabel} style={{ color: si.color }}>{si.label}</p>
          </>
        )}
        {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-confirm" className={styles.label}>Confirm password</label>
        <div className={styles.inputWrap}>
          <input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            className={`${styles.input} ${styles.inputWithEye} ${passwordsMismatch || errors.confirm ? styles.inputError : ""} ${passwordsMatch ? styles.inputSuccess : ""}`}
            placeholder="Repeat your password"
            value={fields.confirm}
            onChange={set("confirm")}
            autoComplete="new-password"
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Hide password" : "Show password"}>
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {passwordsMismatch && <p className={styles.fieldError}>Passwords don't match.</p>}
        {passwordsMatch && <p className={styles.fieldSuccess}><CheckIcon /> Passwords match</p>}
        {errors.confirm && !passwordsMismatch && <p className={styles.fieldError}>{errors.confirm}</p>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}