import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useHeaderCounts } from "../../hooks/useHeaderCounts";
import { useAppState } from "../../context/AppStoreContext";
import { Avatar } from "../Avatar/Avatar";
import { ToastHost } from "../ToastHost/ToastHost";
import type { City } from "../../models/Run";
import styles from "./RootLayout.module.css";

export function RootLayout() {
  const navigate = useNavigate();
  const { account } = useAppState();
  const counts = useHeaderCounts();
  // Cosmetic only — html/index.html's own SF/OAK toggle never filters
  // Discover, it just tracks which segment is selected.
  const [city, setCity] = useState<City>("SF");

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <button type="button" className={styles.brand} onClick={() => navigate("/")} aria-label="Pull Up home">
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
            <span className={styles.wordmark}>Pull Up</span>
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
            <div className={styles.cityToggle} role="group" aria-label="City">
              <button type="button" className={city === "SF" ? styles.cityOn : ""} onClick={() => setCity("SF")}>
                SF
              </button>
              <button type="button" className={city === "OAK" ? styles.cityOn : ""} onClick={() => setCity("OAK")}>
                OAK
              </button>
            </div>
            <button type="button" className={styles.btnPrimary} onClick={() => navigate("/create")}>
              Host a run
            </button>
            <button type="button" className={styles.accountChip} onClick={() => navigate("/account")} aria-label="Account">
              <span className={styles.mockTag}>DEMO</span>
              <Avatar initials={account.initials} color={account.color} size="sm" />
              <span className={styles.chipName}>{account.name}</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.siteFooter}>
        <button type="button" className={styles.linkBtn} onClick={() => navigate("/disclaimer")}>
          Disclaimer
        </button>
      </footer>

      <ToastHost />
    </div>
  );
}
