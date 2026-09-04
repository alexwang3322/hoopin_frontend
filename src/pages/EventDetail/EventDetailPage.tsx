import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";
import { useRunDetail } from "../../hooks/useRunDetail";
import { RUN_FORMAT_LABEL, type ViewerAction } from "../../models/Run";
import { formatRunWhen, isRunFinished } from "../../utils/time";
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
    cancel,
  } = useRunDetail(runId);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  // `busy` alone doesn't stop a second click that fires before React
  // re-renders the disabled button (setState is async) — this ref is
  // checked synchronously, in the same tick as the click, so a rapid
  // repeat click is dropped outright instead of firing a second request
  // that the backend then has to reject.
  const inFlight = useRef(false);

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
  // Client-computed from endsAt vs. wall-clock time — never server-sent, so
  // this flips the instant a run's end time passes even if the backend
  // never marks it (see utils/time.ts's isRunFinished).
  const finished = isRunFinished(run.endsAt);

  const runAction = async (fn: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      await fn();
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={styles.columns}>
        <div className={styles.mainCol}>
          <div className={styles.hero} style={{ background: run.coverGradient }} />

          {run.isCancelled && (
            <div className={styles.cancelledBanner}>This run has been cancelled.</div>
          )}
          {!run.isCancelled && finished && (
            <div className={styles.finishedBanner}>This run has finished.</div>
          )}

          <div className={styles.titleBlock}>
            <h2>{run.title}</h2>
            <span className={styles.when}>{formatRunWhen(run.startsAt, run.endsAt, RUN_FORMAT_LABEL[run.format])}</span>
          </div>

          <div className={styles.hostRow}>
            <PersonLink user={run.host} subtitle={run.host.bio ?? undefined} size="lg" />
          </div>

          {run.description && <p className={styles.desc}>{run.description}</p>}

          {viewerAction === "host" && !run.isCancelled && !finished && (
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
              <StatusBadge action={viewerAction} cancelled={run.isCancelled} finished={finished} />
            </div>
            <ActionContent
              viewerAction={viewerAction}
              isCancelled={run.isCancelled}
              isFinished={finished}
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

          {viewerAction === "host" && !run.isCancelled && !finished && (
            <div className={styles.panel}>
              {confirmingCancel ? (
                <div className={styles.cancelConfirm}>
                  <p className={styles.hostNote}>Cancel this run? Players who requested or were approved will still see the run marked cancelled.</p>
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      disabled={busy}
                      onClick={() => runAction(async () => { await cancel(); setConfirmingCancel(false); })}
                    >
                      {busy ? "Cancelling…" : "Confirm cancel"}
                    </button>
                    <button type="button" className={styles.secondaryBtn} disabled={busy} onClick={() => setConfirmingCancel(false)}>
                      Never mind
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" className={styles.dangerBtn} onClick={() => setConfirmingCancel(true)}>
                  Cancel game
                </button>
              )}
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
  isCancelled: boolean;
  isFinished: boolean;
  busy: boolean;
  message: string;
  onMessageChange: (v: string) => void;
  onRequest: () => void;
  onWithdraw: () => void;
  declineReason: string | null;
}

function ActionContent({
  viewerAction,
  isCancelled,
  isFinished,
  busy,
  message,
  onMessageChange,
  onRequest,
  onWithdraw,
  declineReason,
}: ActionContentProps) {
  if (isCancelled) {
    return <p className={styles.hostNote}>This run has been cancelled — no further requests can be made.</p>;
  }
  if (isFinished) {
    return <p className={styles.hostNote}>This run has finished — no further requests can be made.</p>;
  }
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
    return (
      <div>
        <p className={styles.hostNote}>Sign in to request to play.</p>
        <SignInButton mode="modal">
          <button type="button" className={styles.primaryBtn}>
            Sign in
          </button>
        </SignInButton>
      </div>
    );
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
