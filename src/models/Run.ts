import type { UserSummary } from "./User";
import type { JoinRequest } from "./JoinRequest";

export type RunFormat = "5v5_full_court" | "3v3_half_court";

export const RUN_FORMAT_LABEL: Record<RunFormat, string> = {
  "5v5_full_court": "5v5 · Full court",
  "3v3_half_court": "3v3 · Half court",
};

export type RunVisibility = "public" | "private";

export type City = "SF" | "OAK";

/** The 7-branch action-panel state machine from API_CONTRACT.md §2, computed
 *  server-side and carried straight through by services/mappers.ts — never
 *  re-derived from raw status + capacity on the client. Only present on a
 *  full run-detail fetch (`Run.viewerAction`); list rows only get
 *  `viewerStatus` (see `cardViewerAction` below). */
export type ViewerAction = "signed_out" | "can_request" | "host" | "pending" | "approved" | "declined" | "full";

/** Per-viewer relationship badge shown on cards / My Runs / Hosting. */
export type ViewerRunStatus = "host" | "pending" | "approved" | "declined" | "withdrawn" | null;

/**
 * One run/event, as the viewer sees it — mirrors API_CONTRACT.md's
 * RunSummary, extended with RunDetail's viewer-scoped fields when a full
 * detail fetch (`GET /runs/{id}`) backs it. The backend computes
 * `viewerStatus`/`goingCount`/`isFull` and gates `exactAddress` /
 * `pendingRequests` / `viewerRequest` per viewer — services/mappers.ts
 * carries the server's presence/absence of those keys straight through
 * (an `"exactAddress" in run` check is meaningful, same as the contract's
 * own note about `RunDetail`), never re-derives them client-side.
 */
export interface Run {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO 8601 with offset
  endsAt: string;
  timezone: string;
  format: RunFormat;
  venueName: string;
  city: City;
  host: UserSummary;
  capacity: number | null;
  goingCount: number;
  isFull: boolean;
  isDraft: boolean;
  visibility: RunVisibility;
  viewerStatus: ViewerRunStatus;
  /** Gradient CSS, computed client-side from the server's `cover_seed` (=
   *  run id) via utils/hash.ts — never stored/sent by the server. */
  coverGradient: string;

  // ---- Detail-only fields (present iff this Run came from GET /runs/{id}) ----
  autoApprove?: boolean;
  createdAt?: string;
  /** Present only if viewer is host, or viewer's own request is approved. */
  exactAddress?: string;
  addressLockedReason?: "not_approved" | "signed_out";
  attendees?: UserSummary[];
  viewerAction?: ViewerAction;
  /** Viewer's own join-request against this run, if any. */
  viewerRequest?: JoinRequest;
  /** Present only if viewer is host. */
  pendingRequests?: { items: JoinRequest[]; pendingCount: number };
}

/** List rows (RunSummary) only carry `viewerStatus` + `isFull`, not the
 *  full `viewerAction` state machine (that's detail-only per the
 *  contract) — this reconstructs the same value from what a card actually
 *  has, for the StatusBadge on Discover/Hosting cards. */
export function cardViewerAction(run: Run): ViewerAction {
  if (run.viewerStatus === "host") return "host";
  if (run.viewerStatus === "pending") return "pending";
  if (run.viewerStatus === "approved") return "approved";
  if (run.viewerStatus === "declined") return "declined";
  if (run.isFull) return "full";
  return "can_request";
}
