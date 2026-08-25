import { useNavigate, useParams } from "react-router-dom";
import { PROFILES } from "../../mock/profiles";
import { Avatar } from "../../components/Avatar/Avatar";
import styles from "./ProfilePage.module.css";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const profile = userId ? PROFILES[userId] : undefined;

  if (!profile) {
    return (
      <div>
        <p>This player couldn't be found.</p>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Player</h1>
      </div>

      <div className={styles.header}>
        <Avatar initials={profile.initials} color={profile.color} size="lg" />
        <div>
          <div className={styles.name}>{profile.name}</div>
          {profile.bio && <div className={styles.bio}>{profile.bio}</div>}
        </div>
      </div>

      <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </div>
  );
}
