import type { Run, ViewerAction } from "../models/Run";
import { viewerActionFor } from "../models/Run";
import type { JoinRequest, JoinRequestWithRun } from "../models/JoinRequest";
import type { HeaderCounts } from "../models/HeaderCounts";
import type { UserSummary } from "../models/User";
import type { CreateRunDraft } from "../models/CreateRunDraft";
import { formatRunWhen } from "../utils/time";
import { RUN_FORMAT_LABEL } from "../models/Run";
import { delay } from "./delay";

// ---------------------------------------------------------------------------
// Pure business logic (framework-agnostic — this is the layer a real backend
// would eventually replace; everything above it keeps working unchanged).
// ---------------------------------------------------------------------------

function recomputeGoing(run: Run): Run {
  const attendees = run.requests.filter((r) => r.status === "approved").map((r) => r.requester);
  const goingCount = run.baseGoingCount + attendees.length;
  const isFull = run.capacity !== null && goingCount >= run.capacity;
  return { ...run, attendees, goingCount, isFull };
}

/** Exact address is only ever visible to the host, or to a requester whose
 *  own request on this run is approved — never a client-side-only hide, this
 *  is the same computation a server would gate the field with. */
export function isAddressUnlocked(run: Run, viewerId: string): boolean {
  const action = viewerActionFor(run, viewerId);
  return action === "host" || action === "approved";
}

export function viewerActionOf(run: Run, viewerId: string): ViewerAction {
  return viewerActionFor(run, viewerId);
}

export function applyApprove(run: Run, requestId: string): Run {
  const requests = run.requests.map((r): JoinRequest =>
    r.id === requestId && r.status === "pending"
      ? { ...r, status: "approved", decidedAt: new Date().toISOString() }
      : r,
  );
  return recomputeGoing({ ...run, requests });
}

export function applyDecline(run: Run, requestId: string, reason: string | null): Run {
  const requests = run.requests.map((r): JoinRequest =>
    r.id === requestId && r.status === "pending"
      ? { ...r, status: "declined", decidedAt: new Date().toISOString(), declineReason: reason }
      : r,
  );
  return recomputeGoing({ ...run, requests });
}

/** The original html/index.html renders a "Request to play" button with no
 *  click handler at all — implemented here as a real action: creates a
 *  pending request, or an already-approved one when the run has
 *  auto-approve on, matching API_CONTRACT.md §3.2's auto-approve rule. */
export function applyRequestToJoin(run: Run, viewer: UserSummary, message: string | null): Run {
  const status: JoinRequest["status"] = run.autoApprove ? "approved" : "pending";
  const newRequest: JoinRequest = {
    id: `req_${viewer.id}_${run.id}_${Date.now()}`,
    runId: run.id,
    requester: viewer,
    message,
    status,
    createdAt: new Date().toISOString(),
    decidedAt: status === "approved" ? new Date().toISOString() : null,
  };
  return recomputeGoing({ ...run, requests: [...run.requests, newRequest] });
}

/** Also unimplemented in the original ("Withdraw request" / "Can't make it"
 *  have no click handler there). Withdraws a pending request, or backs the
 *  viewer out of an approved one — both land on `withdrawn`, freeing a
 *  capacity slot in the approved case. */
export function applyWithdraw(run: Run, requestId: string): Run {
  const requests = run.requests.map((r): JoinRequest =>
    r.id === requestId && (r.status === "pending" || r.status === "approved")
      ? { ...r, status: "withdrawn", decidedAt: new Date().toISOString() }
      : r,
  );
  return recomputeGoing({ ...run, requests });
}

function draftToRunFields(draft: CreateRunDraft) {
  const cap = draft.capacity.trim();
  const startsAt = `${draft.date}T${draft.startTime || "00:00"}:00-07:00`;
  const endsAt = `${draft.date}T${draft.endTime || draft.startTime || "00:00"}:00-07:00`;
  return {
    title: draft.title.trim() || "Untitled run",
    description: draft.description.trim(),
    startsAt,
    endsAt,
    timezone: draft.timezone.trim() || "America/Los_Angeles",
    format: draft.format,
    venueName: draft.venueName.trim() || "Venue TBD",
    exactAddress: draft.exactAddress.trim(),
    capacity: cap === "" ? null : Math.max(1, parseInt(cap, 10) || 1),
    visibility: draft.visibility,
    autoApprove: draft.autoApprove,
  };
}

/**
 * Publishing a run the viewer is already editing (a draft) updates that same
 * run in place. The original prototype always prepends a brand-new Hosting
 * row, even when the form was opened by tapping an existing draft — a rough
 * edge fixed here rather than reproduced.
 */
export function applyPublish(
  runs: Run[],
  draft: CreateRunDraft,
  host: UserSummary,
  editingRunId: string | null,
): Run[] {
  const fields = draftToRunFields(draft);

  if (editingRunId) {
    return runs.map((r) =>
      r.id === editingRunId
        ? recomputeGoing({ ...r, ...fields, isDraft: false })
        : r,
    );
  }

  const newRun: Run = recomputeGoing({
    id: `ev_${Date.now()}`,
    ...fields,
    city: "SF",
    host,
    baseGoingCount: 0,
    goingCount: 0,
    isFull: false,
    isDraft: false,
    createdAt: new Date().toISOString(),
    distanceMiles: 0,
    coverGradient: "linear-gradient(118deg,#E0954B,#5C3A17)",
    attendees: [],
    requests: [],
  });
  return [newRun, ...runs];
}

export function computeHeaderCounts(runs: Run[], viewerId: string): HeaderCounts {
  let myPendingRequests = 0;
  let hostingPendingRequests = 0;
  for (const run of runs) {
    for (const req of run.requests) {
      if (req.status !== "pending") continue;
      if (req.requester.id === viewerId) myPendingRequests += 1;
      if (run.host.id === viewerId) hostingPendingRequests += 1;
    }
  }
  return { myPendingRequests, hostingPendingRequests };
}

export function pendingCountFor(run: Run): number {
  return run.requests.filter((r) => r.status === "pending").length;
}

export function getDiscoverRuns(runs: Run[]): Run[] {
  return runs
    .filter((r) => !r.isDraft)
    .slice()
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getHostingRuns(runs: Run[], viewerId: string): Run[] {
  return runs.filter((r) => r.host.id === viewerId);
}

export function getMyRequests(runs: Run[], viewerId: string): JoinRequestWithRun[] {
  const rows: JoinRequestWithRun[] = [];
  for (const run of runs) {
    for (const req of run.requests) {
      if (req.requester.id !== viewerId) continue;
      rows.push({
        ...req,
        runTitle: run.title,
        runWhen: formatRunWhen(run.startsAt, run.endsAt, RUN_FORMAT_LABEL[run.format]),
        runCoverGradient: run.coverGradient,
      });
    }
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export { delay };
