import { useNavigate } from "react-router-dom";
import { useHosting } from "../../hooks/useHosting";
import { pendingCountFor } from "../../services/runService";
import { RUN_FORMAT_LABEL } from "../../models/Run";
import { formatRunWhen } from "../../utils/time";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import styles from "./HostingPage.module.css";

export function HostingPage() {
  const runs = useHosting();
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Hosting</h1>
        <p>Runs you organize, including drafts. Pending requests need your call.</p>
      </div>

      {runs.length === 0 && <EmptyState />}

      <div className={styles.list}>
        {runs.map((run) => {
          const pending = pendingCountFor(run);
          const goto = run.isDraft ? `/create?draft=${run.id}` : `/runs/${run.id}`;
          return (
            <button key={run.id} type="button" className={styles.row} onClick={() => navigate(goto)}>
              <div className={styles.thumb} style={{ background: run.coverGradient }} />
              <div className={styles.text}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{run.title}</span>
                  {run.isDraft && <span className={styles.draftTag}>DRAFT</span>}
                </div>
                <span className={`${styles.meta} num`}>
                  {run.venueName ? formatRunWhen(run.startsAt, run.endsAt, RUN_FORMAT_LABEL[run.format]) : "Draft"}
                  {" · "}
                  {run.capacity === null ? `${run.goingCount} going` : `${run.goingCount} going of ${run.capacity}`}
                </span>
              </div>
              {pending > 0 && <span className={`${styles.pendingPill} num`}>{pending} pending</span>}
              <span className={styles.chevron}>&rsaquo;</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
