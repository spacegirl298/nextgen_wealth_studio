/*
  Signup.jsx
  – Signup page container
  – Renders SignupForm component
  – Redirects to home if already logged in
  – Link back to Login
*/

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import SignupForm from "./components/SignupForm";
import styles from "./Auth.module.css";

export default function Signup() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.subtitle}>Get your full financial picture in one place.</p>

        <SignupForm />

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}