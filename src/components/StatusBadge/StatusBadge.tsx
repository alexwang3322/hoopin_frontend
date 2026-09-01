import type { ViewerAction } from "../../models/Run";
import styles from "./StatusBadge.module.css";

const LABEL: Partial<Record<ViewerAction, string>> = {
  host: "Host",
  pending: "Pending",
  approved: "Playing",
  declined: "Declined",
  full: "Full",
};

const TONE: Partial<Record<ViewerAction, string>> = {
  host: styles.host,
  pending: styles.pending,
  approved: styles.playing,
  declined: styles.declined,
  full: styles.declined,
};

interface StatusBadgeProps {
  action: ViewerAction;
  /** Highest priority — a cancelled run always shows "Cancelled", regardless
   *  of the viewer's own relationship to it or whether it's also finished. */
  cancelled?: boolean;
  /** Second priority — client-computed from `endsAt` vs. wall-clock time
   *  (see utils/time.ts's `isRunFinished`), never server-sent. Overrides the
   *  viewer's own pending/approved/etc. label once the run is in the past. */
  finished?: boolean;
}

/** Renders nothing for "can_request" — the original never shows a badge when
 *  the viewer has no relationship to a run and it isn't full. */
export function StatusBadge({ action, cancelled, finished }: StatusBadgeProps) {
  if (cancelled) return <span className={`${styles.badge} ${styles.declined}`}>Cancelled</span>;
  if (finished) return <span className={`${styles.badge} ${styles.finished}`}>Finished</span>;
  const label = LABEL[action];
  if (!label) return null;
  return <span className={`${styles.badge} ${TONE[action]}`}>{label}</span>;
}
