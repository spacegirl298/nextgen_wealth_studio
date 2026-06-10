/*
  ForgotPassword.jsx
  – Forgot password page container
  – Renders ForgotPasswordForm
  – Shows confirmation message after submission (handled inside ForgotPasswordForm)
  – Link back to Login
*/

import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import styles from "./Auth.module.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>F</div>
          <span className={styles.brandName}>Finpath</span>
        </div>

        <h1 className={styles.heading}>Reset your password</h1>
        <p className={styles.subtitle}>Enter the email linked to your account and we'll send a reset link.</p>

        <ForgotPasswordForm onBack={() => navigate("/login")} />

        <p className={styles.footerText}>
          Remember it?{" "}
          <Link to="/login" className={styles.footerLink}>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}