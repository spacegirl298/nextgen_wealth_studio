/*
  ForgotPasswordForm.jsx
  – Step 1: Enter email → checks if account exists in localStorage
  – Step 2: If found, show new password + confirm fields to reset directly
  – No fake email — works fully offline with localStorage auth
  – No inline styles
*/

import { useState } from "react";
import { getUsers, saveUsers } from "../../../utils/authStorage";
import styles from "../Auth.module.css";

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
  0: { label: "",                                       fillClass: "",                    width: 0   },
  1: { label: "Weak — try adding numbers or symbols",   fillClass: styles.strengthWeak,   width: 25  },
  2: { label: "Fair — add uppercase letters or symbols",fillClass: styles.strengthFair,   width: 50  },
  3: { label: "Good — nearly there",                    fillClass: styles.strengthGood,   width: 75  },
  4: { label: "Strong password",                        fillClass: styles.strengthStrong, width: 100 },
};

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

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.successCheckIcon}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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


function EmailStep({ onFound }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!email.trim()) { setEmailError("Please enter your email address."); return; }
    if (!isValidEmail(email)) { setEmailError("Enter a valid email address."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const users = getUsers();
    const emailKey = email.toLowerCase();

    if (!users[emailKey]) {
      setEmailError("No account found for this email address.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onFound(emailKey);
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
        <p className={styles.fieldHint}>We'll look up your account by email.</p>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {loading ? "Looking up…" : "Continue"}
      </button>
    </form>
  );
}

function ResetStep({ email, onSuccess }) {
  const [fields, setFields] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

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
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      const users = getUsers();
      if (!users[email]) {
        setFormError("Account not found. Please start over.");
        setLoading(false);
        return;
      }

      users[email].passwordHash = btoa(fields.password);
      const saved = saveUsers(users);

      if (!saved) {
        setFormError("Failed to save new password. Please try again.");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Reset error:", err);
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <p className={styles.resetEmailLabel}>
        Setting a new password for{" "}
        <span className={styles.resetEmailHighlight}>{email}</span>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
            <AlertIcon />
            {formError}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="reset-password" className={styles.label}>New password</label>
          <div className={styles.inputWrap}>
            <input
              id="reset-password"
              type={showPw ? "text" : "password"}
              className={`${styles.input} ${styles.inputWithEye} ${errors.password ? styles.inputError : ""}`}
              placeholder="At least 8 characters"
              value={fields.password}
              onChange={set("password")}
              autoComplete="new-password"
              autoFocus
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
          {fields.password && (
            <>
              <div className={styles.strengthBar}>
                <div
                  className={`${styles.strengthFill} ${si.fillClass}`}
                  style={{ width: `${si.width}%` }}
                />
              </div>
              <p className={`${styles.strengthLabel} ${si.fillClass}`}>{si.label}</p>
            </>
          )}
          {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="reset-confirm" className={styles.label}>Confirm new password</label>
          <div className={styles.inputWrap}>
            <input
              id="reset-confirm"
              type={showConfirm ? "text" : "password"}
              className={`${styles.input} ${styles.inputWithEye} ${passwordsMismatch || errors.confirm ? styles.inputError : ""} ${passwordsMatch ? styles.inputSuccess : ""}`}
              placeholder="Repeat your new password"
              value={fields.confirm}
              onChange={set("confirm")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {passwordsMismatch && <p className={styles.fieldError}>Passwords don't match.</p>}
          {passwordsMatch && <p className={styles.fieldSuccess}><CheckIcon /> Passwords match</p>}
          {errors.confirm && !passwordsMismatch && <p className={styles.fieldError}>{errors.confirm}</p>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading && <span className={styles.spinner} aria-hidden="true" />}
          {loading ? "Saving…" : "Reset password"}
        </button>
      </form>
    </>
  );
}


function SuccessStep({ onBack }) {
  return (
    <div className={styles.successState}>
      <div className={styles.successIcon}>
        <CheckCircleIcon />
      </div>
      <h2 className={styles.successTitle}>Password updated</h2>
      <p className={styles.successMessage}>
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        Back to sign in
      </button>
    </div>
  );
}


export default function ForgotPasswordForm({ onBack }) {
  const [step, setStep] = useState("email"); 
  const [resolvedEmail, setResolvedEmail] = useState("");

  if (step === "done") return <SuccessStep onBack={onBack} />;
  if (step === "reset") return <ResetStep email={resolvedEmail} onSuccess={() => setStep("done")} />;

  return (
    <EmailStep
      onFound={(email) => {
        setResolvedEmail(email);
        setStep("reset");
      }}
    />
  );
}