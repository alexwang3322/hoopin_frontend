import { useState } from "react";
import type { JoinRequest } from "../../models/JoinRequest";
import { PersonLink } from "../PersonLink/PersonLink";
import { formatRelativeAgo } from "../../utils/time";
import styles from "./RequestCard.module.css";

interface RequestCardProps {
  request: JoinRequest;
  onApprove: (requestId: string) => Promise<void>;
  onDecline: (requestId: string, reason: string | null) => Promise<void>;
}

export function RequestCard({ request, onApprove, onDecline }: RequestCardProps) {
  const [busy, setBusy] = useState<"approve" | "decline" | null>(null);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    setBusy("approve");
    try {
      await onApprove(request.id);
    } finally {
      setBusy(null);
    }
  };

  const confirmDecline = async () => {
    setBusy("decline");
    try {
      await onDecline(request.id, reason.trim() || null);
    } finally {
      setBusy(null);
      setDeclining(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <PersonLink user={request.requester} subtitle={request.requester.bio ?? undefined} size="md" />
        <span className={styles.ago}>{formatRelativeAgo(request.createdAt)}</span>
      </div>
      {request.message && <p className={styles.quote}>{request.message}</p>}

      {declining ? (
        <div className={styles.declineForm}>
          <textarea
            className={styles.declineInput}
            placeholder="Reason (optional) — shared with the requester"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            autoFocus
          />
          <div className={styles.actions}>
            <button type="button" className={styles.decline} disabled={busy !== null} onClick={confirmDecline}>
              {busy === "decline" ? "Declining…" : "Confirm decline"}
            </button>
            <button
              type="button"
              className={styles.approve}
              disabled={busy !== null}
              onClick={() => {
                setDeclining(false);
                setReason("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.actions}>
          <button type="button" className={styles.approve} disabled={busy !== null} onClick={handleApprove}>
            {busy === "approve" ? "Approving…" : "Approve"}
          </button>
          <button type="button" className={styles.decline} disabled={busy !== null} onClick={() => setDeclining(true)}>
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
