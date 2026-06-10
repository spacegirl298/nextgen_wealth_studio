/*Top navigation bar rendered on all pages.
–	Logo / app name on the left
–	Nav links: Home, Snapshot, Tracks, Simulation, Profile
–	Active link highlighting based on current route
–	Login/Signup buttons when unauthenticated
–	User avatar/name + logout when authenticated
–	Hamburger menu for mobile
–	Reads from UserContext for auth state
*/
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import NavLinkList from "./NavLinkList";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Money Snapshot", to: "/money" },
  { label: "Strategy Tracker", to: "/track" },
  { label: "Simulation Lab", to: "/simulation" },
  { label: "Banking DNA", to: "/dna" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <span>absa</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <NavLinkList
            links={NAV_LINKS}
            getLinkClassName={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          />
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Profile button */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.profileBtn} ${isActive ? styles.active : ""}`
            }
            aria-label="Profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </NavLink>

          {/* Mobile hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <NavLinkList
          links={NAV_LINKS}
          getLinkClassName={({ isActive }) =>
            `${styles.mobileLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setMenuOpen(false)}
        />
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.mobileLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Profile
        </NavLink>
      </div>
    </header>
  );
}
