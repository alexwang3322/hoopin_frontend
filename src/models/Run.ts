import type { UserSummary } from "./User";
import type { JoinRequest } from "./JoinRequest";

export type RunFormat = "5v5_full_court" | "3v3_half_court";

export const RUN_FORMAT_LABEL: Record<RunFormat, string> = {
  "5v5_full_court": "5v5 · Full court",
  "3v3_half_court": "3v3 · Half court",
};

export type RunVisibility = "public" | "private";

export type City = "SF" | "OAK";

/** The 7-branch action-panel state machine from API_CONTRACT.md, trimmed to the
 *  6 states this app can actually reach — there's no sign-in flow, so
 *  "signed_out" is never produced. */
export type ViewerAction =
  | "can_request"
  | "host"
  | "pending"
  | "approved"
  | "declined"
  | "full";

/** Per-viewer relationship badge shown on cards / My Runs / Hosting. */
export type ViewerRunStatus =
  | "host"
  | "pending"
  | "approved"
  | "declined"
  | "withdrawn"
  | null;

/**
 * One run/event. html/index.html's mock data never crosses a real network
 * boundary, so RunSummary/RunDetail from API_CONTRACT.md are merged into a
 * single shape here — the server-side field-hiding those two types encode
 * (exact_address / pending_requests visibility) is instead computed at the
 * point of use (see services/runService.ts's `isAddressUnlocked`), not baked
 * into stored data.
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
  exactAddress: string;
  city: City;
  host: UserSummary;
  capacity: number | null;
  /** Attendees not tracked as an explicit JoinRequest — the host (who counts
   *  toward their own run's capacity, mirroring html/index.html's "the
   *  viewer/host counts as the 6th" note on Kezar) plus any other pre-seeded
   *  approved players this mock doesn't name individually. `goingCount` is
   *  always `baseGoingCount + attendees.length`, recomputed whenever
   *  requests change — see services/runService.ts's `recomputeGoing`. */
  baseGoingCount: number;
  goingCount: number;
  isFull: boolean;
  isDraft: boolean;
  visibility: RunVisibility;
  autoApprove: boolean;
  createdAt: string;
  distanceMiles: number;
  /** Cover gradient CSS (ported from html/index.html's hand-picked per-run banner gradients). */
  coverGradient: string;
  /** Approved requesters only, host excluded — a derived, read-only projection. */
  attendees: UserSummary[];
  /** All join-requests against this run, any status — My Runs / Hosting / the
   *  requests-to-play panel all derive their view from this single list. */
  requests: JoinRequest[];
}

export function viewerStatusFor(run: Run, viewerId: string): ViewerRunStatus {
  if (run.host.id === viewerId) return "host";
  const mine = run.requests.find((r) => r.requester.id === viewerId);
  if (!mine) return null;
  if (mine.status === "pending") return "pending";
  if (mine.status === "approved") return "approved";
  if (mine.status === "declined") return "declined";
  return "withdrawn";
}

export function viewerActionFor(run: Run, viewerId: string): ViewerAction {
  const status = viewerStatusFor(run, viewerId);
  if (status === "host") return "host";
  if (status === "pending") return "pending";
  if (status === "approved") return "approved";
  if (status === "declined") return "declined";
  // status is null or "withdrawn" — no active relationship
  if (run.capacity !== null && run.goingCount >= run.capacity) return "full";
  return "can_request";
}
