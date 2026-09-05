import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../hooks/useAccount";
import { Avatar } from "../../components/Avatar/Avatar";
import type { Gender, PlayerPosition } from "../../models/Account";
import { CITY_LABEL, type City } from "../../models/Run";
import styles from "./AccountPage.module.css";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AccountPage() {
  const { account, saveAccount, signOut } = useAccount();
  const navigate = useNavigate();
  const [name, setName] = useState(account.name);
  const [bio, setBio] = useState(account.bio ?? "");
  const [location, setLocation] = useState<City>(account.location);
  const [gender, setGender] = useState<Gender>(account.gender);
  const [position, setPosition] = useState<PlayerPosition>(account.position);
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    try {
      const finalName = name.trim() || "Hooper";
      await saveAccount({
        ...account,
        name: finalName,
        initials: initialsFromName(finalName),
        bio: bio.trim() || null,
        location,
        gender,
        position,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Account</h1>
        <p>Update your profile below.</p>
      </div>

      <div className={styles.center}>
        <Avatar initials={account.initials} color={account.color} size="lg" />
      </div>

      <div className={styles.center}>
        <div className={styles.form}>
          <label className={styles.field}>
            <span>Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className={styles.field}>
            <span>
              Bio <em className={styles.hint}>shown on your public profile</em>
            </span>
            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span>Location</span>
              <select value={location} onChange={(e) => setLocation(e.target.value as City)}>
                {Object.entries(CITY_LABEL).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Gender</span>
              <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option>Prefer not to say</option>
                <option>Woman</option>
                <option>Man</option>
                <option>Non-binary</option>
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span>
              Position <em className={styles.hint}>helps hosts balance teams</em>
            </span>
            <select value={position} onChange={(e) => setPosition(e.target.value as PlayerPosition)}>
              <option>Flexible</option>
              <option>Point guard</option>
              <option>Shooting guard</option>
              <option>Forward</option>
              <option>Center</option>
            </select>
          </label>

          <div className={styles.formActions}>
            <button type="button" className={styles.primaryBtn} disabled={busy} onClick={handleSave}>
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <button type="button" className={styles.backLink} onClick={() => navigate("/")}>
        &larr; Back
      </button>

      <p className={styles.footnote}>
        <button type="button" className={styles.linkBtn} onClick={() => navigate("/disclaimer")}>
          Terms &amp; Disclaimer
        </button>
      </p>
    </div>
  );
}
