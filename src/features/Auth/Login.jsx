
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import LoginForm from "./components/LoginForm";
import styles from "./Auth.module.css";

export default function Login() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to pick up where you left off.</p>

        <LoginForm onForgotPassword={() => navigate("/forgot-password")} />

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.footerLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}