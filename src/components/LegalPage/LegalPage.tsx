import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LegalPage.module.css";

/** Shared layout for the footer's legal/info pages (Terms, Privacy,
 *  Security, DMCA, About — see DisclaimerPage, which predates this and
 *  isn't rebuilt on top of it to avoid touching already-shipped content). */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>

      <div className={styles.body}>{children}</div>

      <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </div>
  );
}
