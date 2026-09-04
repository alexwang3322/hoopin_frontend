import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useMyRequests } from "../../hooks/useMyRequests";
import { formatRelativeAgo } from "../../utils/time";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import styles from "./MyRunsPage.module.css";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Playing",
  declined: "Declined",
  withdrawn: "Withdrawn",
};
const STATUS_CLASS: Record<string, string> = {
  pending: styles.pending,
  approved: styles.playing,
  declined: styles.declined,
  withdrawn: styles.withdrawn,
};

export function MyRunsPage() {
  const { requests, loading } = useMyRequests();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>My Runs</h1>
        <p>Games you've asked to join. No notifications yet — this page is the only way to find out you got in.</p>
      </div>

      {!loading && !isSignedIn && (
        <EmptyState message="Sign in to see the games you've asked to join." signIn />
      )}
      {!loading && isSignedIn && requests.length === 0 && <EmptyState />}

      <div className={styles.list}>
        {requests.map((req) => (
          <button key={req.id} type="button" className={styles.row} onClick={() => navigate(`/runs/${req.runId}`)}>
            <div className={styles.thumb} style={{ background: req.runCoverGradient }} />
            <div className={styles.text}>
              <span className={styles.title}>{req.runTitle}</span>
              <span className={styles.when}>{req.runWhen}</span>
              <span className={styles.ago}>Requested {formatRelativeAgo(req.createdAt)}</span>
              {req.status === "declined" && req.declineReason && (
                <div className={styles.declineReason}>Host said: {req.declineReason}</div>
              )}
            </div>
            <span className={`${styles.badge} ${STATUS_CLASS[req.status]}`}>{STATUS_LABEL[req.status]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
