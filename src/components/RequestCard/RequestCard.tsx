import { useState } from "react";
import type { JoinRequest } from "../../models/JoinRequest";
import { PersonLink } from "../PersonLink/PersonLink";
import { formatRelativeAgo } from "../../utils/time";
import styles from "./RequestCard.module.css";

interface RequestCardProps {
  request: JoinRequest;
  onApprove: (requestId: string) => Promise<void>;
  onDecline: (requestId: string) => Promise<void>;
}

export function RequestCard({ request, onApprove, onDecline }: RequestCardProps) {
  const [busy, setBusy] = useState<"approve" | "decline" | null>(null);

  const handle = async (action: "approve" | "decline") => {
    setBusy(action);
    try {
      await (action === "approve" ? onApprove(request.id) : onDecline(request.id));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <PersonLink user={request.requester} subtitle={request.requester.bio ?? undefined} size="md" />
        <span className={styles.ago}>{formatRelativeAgo(request.createdAt)}</span>
      </div>
      {request.message && <p className={styles.quote}>{request.message}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.approve} disabled={busy !== null} onClick={() => handle("approve")}>
          {busy === "approve" ? "Approving…" : "Approve"}
        </button>
        <button type="button" className={styles.decline} disabled={busy !== null} onClick={() => handle("decline")}>
          {busy === "decline" ? "Declining…" : "Decline"}
        </button>
      </div>
    </div>
  );
}
