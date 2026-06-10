import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NavLinkList from "./NavLinkList";
import styles from "./Navbar.module.css";
import { useUser } from "../../context/UserContext";
import { useSnapshotStore } from "../../hooks/usesSnapshotStore";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Money Snapshot", to: "/money" },
  { label: "Strategy Tracker", to: "/track" },
  { label: "Simulation Lab", to: "/simulation" },
  { label: "Banking DNA", to: "/dna" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();
  const { user, displayName, email, logout } = useUser();
  const { derived } = useSnapshotStore();
  const { healthScore } = derived;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Get initial for avatar
  const getInitial = () => {
    if (displayName) return displayName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          {/* Logo - clickable to home */}
          <div className={styles.logo} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className={styles.logoMark}>
              <span>absa</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className={styles.desktopNav}>
            <NavLinkList
              links={NAV_LINKS}
              getLinkClassName={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            />
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Profile dropdown wrapper */}
            <div 
              className={styles.profileWrapper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={styles.profileBtn}
                aria-label="Profile"
                onClick={handleProfileClick}
              >
                <span className={styles.profileInitial}>{getInitial()}</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div 
                  className={styles.dropdown}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      <span>{getInitial()}</span>
                    </div>
                    <div className={styles.dropdownInfo}>
                      <p className={styles.dropdownName}>{displayName || "Guest User"}</p>
                      <p className={styles.dropdownEmail}>{email || "Not signed in"}</p>
                    </div>
                  </div>

                  <div className={styles.dropdownStats}>
                    <div className={styles.dropdownStat}>
                      <span className={styles.statLabel}>Health Score</span>
                      <span className={styles.statValue}>{healthScore || 0}%</span>
                    </div>
                    <div className={styles.dropdownStat}>
                      <span className={styles.statLabel}>Member since</span>
                      <span className={styles.statValue}>
                        {user?.joinedDate 
                          ? new Date(user.joinedDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <button 
                    className={styles.dropdownItem}
                    onClick={handleProfileClick}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                  </button>

                  <button 
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              ref={hamburgerRef}
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div 
        className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileOverlayOpen : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <div className={styles.mobileMenuInner}>
          <nav className={styles.mobileNav}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ""}`
                }
                onClick={handleNavLinkClick}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.active : ""}`
              }
              onClick={handleNavLinkClick}
            >
              Profile
            </NavLink>
          </nav>
          
          <div className={styles.mobileUserInfo}>
            <div className={styles.mobileAvatar}>
              <span>{getInitial()}</span>
            </div>
            <div className={styles.mobileUserDetails}>
              <p className={styles.mobileUserName}>{displayName || "Guest User"}</p>
              <p className={styles.mobileUserEmail}>{email || "Not signed in"}</p>
            </div>
          </div>

          <button 
            className={styles.mobileLogoutBtn}
            onClick={handleLogout}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}