import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useHeaderCounts } from "../../hooks/useHeaderCounts";
import { useAppState, useSetCity } from "../../context/AppStoreContext";
import { CITY_LABEL, type City } from "../../models/Run";
import { Avatar } from "../Avatar/Avatar";
import { ToastHost } from "../ToastHost/ToastHost";
import styles from "./RootLayout.module.css";

export function RootLayout() {
  const navigate = useNavigate();
  const { account, city } = useAppState();
  const setCity = useSetCity();
  const counts = useHeaderCounts();

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <button type="button" className={styles.brand} onClick={() => navigate("/")} aria-label="Hoopin home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="var(--accent)" />
              <path
                d="M12 1V23M1 12H23M4.2 4.2c3.6 3.9 3.6 11.7 0 15.6M19.8 4.2c-3.6 3.9-3.6 11.7 0 15.6"
                stroke="#1B1712"
                strokeWidth="1.1"
                fill="none"
                opacity=".82"
              />
            </svg>
            <span className={styles.wordmark}>Hoopin</span>
          </button>

          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => (isActive ? styles.navActive : styles.navItem)}>
              Discover
            </NavLink>
            <NavLink to="/my-runs" className={({ isActive }) => (isActive ? styles.navActive : styles.navItem)}>
              My Runs
              {counts.myPendingRequests > 0 && (
                <span className={`${styles.pillAmber} num`}>{counts.myPendingRequests}</span>
              )}
            </NavLink>
            <NavLink to="/hosting" className={({ isActive }) => (isActive ? styles.navActive : styles.navItem)}>
              Hosting
              {counts.hostingPendingRequests > 0 && (
                <span className={`${styles.pillDark} num`}>{counts.hostingPendingRequests}</span>
              )}
            </NavLink>
          </nav>

          <div className={styles.actions}>
            <select
              className={styles.cityPicker}
              aria-label="City"
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
            >
              {Object.entries(CITY_LABEL).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <button type="button" className={styles.btnPrimary} onClick={() => navigate("/create")}>
              Host a run
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <button type="button" className={styles.btnPrimary}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button type="button" className={styles.btnSecondary}>
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button type="button" className={styles.accountChip} onClick={() => navigate("/account")} aria-label="Account">
                <Avatar initials={account.initials} color={account.color} size="sm" />
                <span className={styles.chipName}>{account.name}</span>
              </button>
            </SignedIn>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.siteFooter}>
        <nav className={styles.footerLinks} aria-label="Legal">
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/about")}>
            About
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/terms")}>
            Terms
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/privacy")}>
            Privacy
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/security")}>
            Security
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/dmca")}>
            DMCA
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => navigate("/disclaimer")}>
            Disclaimer
          </button>
        </nav>
      </footer>

      <ToastHost />
    </div>
  );
}
