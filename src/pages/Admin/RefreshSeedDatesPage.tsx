import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { API_BASE_URL } from "../../constants";
import styles from "./RefreshSeedDatesPage.module.css";

export function RefreshSeedDatesPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setBusy(true);
    setResult(null);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in before refreshing demo dates.");
      const apiOrigin = API_BASE_URL.replace(/\/v1\/?$/, "");
      const response = await fetch(`${apiOrigin}/admin/refresh-seed-dates`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message ?? `Refresh failed (${response.status}).`);
      setResult(`${body.updated} demo run${body.updated === 1 ? "" : "s"} updated.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Refresh failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.panel}>
      <h1>Refresh demo run dates</h1>
      <p>Move past demo runs forward by whole weeks. Real users’ runs are left alone.</p>
      {!isLoaded ? (
        <p>Checking your session…</p>
      ) : !isSignedIn ? (
        <SignInButton mode="modal">
          <button className={styles.button} type="button">Sign in</button>
        </SignInButton>
      ) : (
        <button className={styles.button} type="button" disabled={busy} onClick={refresh}>
          {busy ? "Refreshing…" : "Refresh now"}
        </button>
      )}
      {result && <p className={styles.success} role="status">{result}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
