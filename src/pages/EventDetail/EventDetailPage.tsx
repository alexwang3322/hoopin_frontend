import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRunDetail } from "../../hooks/useRunDetail";
import { RUN_FORMAT_LABEL, type ViewerAction } from "../../models/Run";
import { formatRunWhen } from "../../utils/time";
import { PersonLink } from "../../components/PersonLink/PersonLink";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { CapacityMeter } from "../../components/CapacityMeter/CapacityMeter";
import { RequestCard } from "../../components/RequestCard/RequestCard";
import styles from "./EventDetailPage.module.css";

export function EventDetailPage() {
  const { runId } = useParams<{ runId: string }>();
  const {
    run,
    loading,
    notFound,
    viewerAction,
    addressUnlocked,
    pendingCount,
    myRequest,
    approve,
    decline,
    requestToJoin,
    withdraw,
  } = useRunDetail(runId);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading && !run) return null;

  if (!run || !viewerAction || notFound) {
    return (
      <div>
        <p>This run doesn't exist.</p>
      </div>
    );
  }

  const pendingRequests = run.pendingRequests?.items ?? [];
  const attendees = run.attendees ?? [];

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={styles.columns}>
        <div className={styles.mainCol}>
          <div className={styles.hero} style={{ background: run.coverGradient }} />

          <div className={styles.titleBlock}>
            <h2>{run.title}</h2>
            <span className={styles.when}>{formatRunWhen(run.startsAt, run.endsAt, RUN_FORMAT_LABEL[run.format])}</span>
          </div>

          <div className={styles.hostRow}>
            <PersonLink user={run.host} subtitle={run.host.bio ?? undefined} size="lg" />
          </div>

          {run.description && <p className={styles.desc}>{run.description}</p>}

          {viewerAction === "host" && (
            <div>
              <div className={styles.reqHeading}>
                <h3>Requests to play</h3>
                {pendingCount > 0 && <span className={`${styles.pendingPill} num`}>{pendingCount} pending</span>}
              </div>
              {pendingRequests.length === 0 ? (
                <p className={styles.noPending}>No pending requests.</p>
              ) : (
                <div className={styles.reqList}>
                  {pendingRequests.map((req) => (
                    <RequestCard key={req.id} request={req} onApprove={approve} onDecline={decline} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.panel}>
            <div className={styles.capRow}>
              <CapacityMeter going={run.goingCount} capacity={run.capacity} />
              <StatusBadge action={viewerAction} />
            </div>
            <ActionContent
              viewerAction={viewerAction}
              busy={busy}
              message={message}
              onMessageChange={setMessage}
              onRequest={() => runAction(async () => { await requestToJoin(message.trim() || null); setMessage(""); })}
              onWithdraw={() => myRequest && runAction(() => withdraw(myRequest.id))}
              declineReason={myRequest?.declineReason ?? null}
            />
          </div>

          <div className={styles.panel}>
            <h4>Court</h4>
            <div className={styles.venue}>{run.venueName}</div>
            {addressUnlocked ? (
              <div className={styles.address}>{run.exactAddress}</div>
            ) : (
              <div className={styles.lockedNote}>
                <span>🔒</span>
                <span>The exact address is shared once the host approves you.</span>
              </div>
            )}
          </div>

          {attendees.length > 0 && (
            <div className={styles.panel}>
              <h4>Who's playing</h4>
              <div className={styles.whoList}>
                {attendees.map((a) => (
                  <PersonLink key={a.id} user={a} subtitle={a.bio ?? undefined} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className={styles.footnote}>Approve or decline above to see the roster update.</p>
    </div>
  );
}

interface ActionContentProps {
  viewerAction: ViewerAction;
  busy: boolean;
  message: string;
  onMessageChange: (v: string) => void;
  onRequest: () => void;
  onWithdraw: () => void;
  declineReason: string | null;
}

function ActionContent({ viewerAction, busy, message, onMessageChange, onRequest, onWithdraw, declineReason }: ActionContentProps) {
  if (viewerAction === "host") {
    return <p className={styles.hostNote}>This is your run. You can't request to join your own game.</p>;
  }
  if (viewerAction === "approved") {
    return (
      <div>
        <p className={styles.inNote}>You're in 🎉</p>
        <button type="button" className={styles.secondaryBtn} disabled={busy} onClick={onWithdraw}>
          Can't make it
        </button>
      </div>
    );
  }
  if (viewerAction === "pending") {
    return (
      <div>
        <p className={styles.hostNote}>Your request is waiting on the host.</p>
        <button type="button" className={styles.secondaryBtn} disabled={busy} onClick={onWithdraw}>
          Withdraw request
        </button>
      </div>
    );
  }
  if (viewerAction === "declined") {
    return (
      <div>
        <p className={styles.hostNote}>The host declined this request.</p>
        {declineReason && <div className={styles.declineReason}>Host said: {declineReason}</div>}
      </div>
    );
  }
  if (viewerAction === "full") {
    return <p className={styles.hostNote}>This run is full.</p>;
  }
  if (viewerAction === "signed_out") {
    return <p className={styles.hostNote}>Sign in to request to play.</p>;
  }
  // can_request
  return (
    <div>
      <label className={styles.messageField}>
        Tell the host a bit about your game (optional)
        <textarea value={message} onChange={(e) => onMessageChange(e.target.value)} rows={2} />
      </label>
      <button type="button" className={styles.primaryBtn} disabled={busy} onClick={onRequest}>
        Request to play
      </button>
    </div>
  );
}
