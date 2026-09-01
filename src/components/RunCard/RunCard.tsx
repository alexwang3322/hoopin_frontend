import { useNavigate } from "react-router-dom";
import type { Run } from "../../models/Run";
import { RUN_FORMAT_LABEL, cardViewerAction } from "../../models/Run";
import { formatDateChip, formatRunWhen, isRunFinished } from "../../utils/time";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { PersonLink } from "../PersonLink/PersonLink";
import styles from "./RunCard.module.css";

export function RunCard({ run }: { run: Run }) {
  const navigate = useNavigate();
  const { mon, day } = formatDateChip(run.startsAt);
  const viewerAction = cardViewerAction(run);
  const openSpots = run.capacity !== null ? run.capacity - run.goingCount : null;
  const finished = isRunFinished(run.endsAt);

  return (
    <article className={styles.card}>
      <button type="button" className={styles.bannerButton} onClick={() => navigate(`/runs/${run.id}`)} aria-label={`View ${run.title}`}>
        <div className={styles.banner} style={{ background: run.coverGradient }}>
          <div className={styles.dateChip}>
            <span className={styles.mon}>{mon}</span>
            <span className={`${styles.day} num`}>{day}</span>
          </div>
          <div className={styles.badgeSlot}>
            <StatusBadge action={viewerAction} cancelled={run.isCancelled} finished={finished} />
          </div>
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.title}>{run.title}</h3>
          <div className={styles.meta}>
            <span className={styles.when}>{formatRunWhen(run.startsAt, run.endsAt, RUN_FORMAT_LABEL[run.format])}</span>
            <span className={styles.where}>{run.venueName}</span>
          </div>
        </div>
      </button>
      <div className={styles.cardFooter}>
        <PersonLink user={run.host} />
        <span className={`${styles.spots} num ${run.isFull ? styles.full : ""}`}>
          {run.isFull ? "Full" : run.capacity === null ? `${run.goingCount} going` : `${run.goingCount}/${run.capacity} · ${openSpots} open`}
        </span>
      </div>
    </article>
  );
}
