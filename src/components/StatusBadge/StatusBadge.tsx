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
}

/** Renders nothing for "can_request" — the original never shows a badge when
 *  the viewer has no relationship to a run and it isn't full. */
export function StatusBadge({ action }: StatusBadgeProps) {
  const label = LABEL[action];
  if (!label) return null;
  return <span className={`${styles.badge} ${TONE[action]}`}>{label}</span>;
}
