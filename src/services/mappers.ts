import type { UserSummary } from "../models/User";
import type { Run } from "../models/Run";
import { RUN_FORMAT_LABEL } from "../models/Run";
import type { JoinRequest, JoinRequestWithRun } from "../models/JoinRequest";
import type { HeaderCounts } from "../models/HeaderCounts";
import type { CreateRunDraft } from "../models/CreateRunDraft";
import { coverGradientFor, avatarColorFor } from "../utils/hash";
import { formatRunWhen } from "../utils/time";
import type {
  WireUserSummary,
  WireRunSummary,
  WireRunDetail,
  WireJoinRequest,
  WireJoinRequestWithRun,
  WireHeaderCounts,
  WireCreateRunRequest,
} from "./wireTypes";

// ---------------------------------------------------------------------------
// Wire (snake_case, API_CONTRACT.md §2) -> app models (camelCase)
// ---------------------------------------------------------------------------

export function toUserSummary(w: WireUserSummary): UserSummary {
  return { id: w.id, name: w.name, initials: w.initials, bio: w.bio, color: avatarColorFor(w.id) };
}

function isWireDetail(w: WireRunSummary | WireRunDetail): w is WireRunDetail {
  return "auto_approve" in w;
}

export function toRun(w: WireRunSummary | WireRunDetail): Run {
  const run: Run = {
    id: w.id,
    title: w.title,
    description: isWireDetail(w) ? w.description : "",
    startsAt: w.starts_at,
    endsAt: w.ends_at,
    timezone: w.timezone,
    format: w.format,
    venueName: w.venue_name,
    city: w.city,
    host: toUserSummary(w.host),
    capacity: w.capacity,
    goingCount: w.going_count,
    isFull: w.is_full,
    isDraft: w.is_draft,
    isCancelled: w.is_cancelled,
    cancelledAt: w.cancelled_at,
    visibility: w.visibility,
    viewerStatus: w.viewer_status,
    coverGradient: coverGradientFor(w.cover_seed),
  };

  if (isWireDetail(w)) {
    run.autoApprove = w.auto_approve;
    run.createdAt = w.created_at;
    run.attendees = w.attendees.map(toUserSummary);
    run.viewerAction = w.viewer_action;
    if (w.exact_address !== undefined) run.exactAddress = w.exact_address;
    if (w.address_locked_reason !== undefined) run.addressLockedReason = w.address_locked_reason;
    if (w.viewer_request) run.viewerRequest = toJoinRequest(w.viewer_request);
    if (w.pending_requests) {
      run.pendingRequests = {
        items: w.pending_requests.items.map(toJoinRequest),
        pendingCount: w.pending_requests.pending_count,
      };
    }
  }

  return run;
}

export function toJoinRequest(w: WireJoinRequest): JoinRequest {
  return {
    id: w.id,
    runId: w.run_id,
    requester: toUserSummary(w.requester),
    message: w.message,
    status: w.status,
    createdAt: w.created_at,
    decidedAt: w.decided_at,
    declineReason: w.decline_reason ?? null,
  };
}

export function toJoinRequestWithRun(w: WireJoinRequestWithRun): JoinRequestWithRun {
  return {
    ...toJoinRequest(w),
    runTitle: w.run.title,
    runWhen: formatRunWhen(w.run.starts_at, w.run.ends_at, RUN_FORMAT_LABEL[w.run.format]),
    runCoverGradient: coverGradientFor(w.run.cover_seed),
  };
}

export function toHeaderCounts(w: WireHeaderCounts): HeaderCounts {
  return { myPendingRequests: w.my_pending_requests, hostingPendingRequests: w.hosting_pending_requests };
}

// ---------------------------------------------------------------------------
// App models -> wire request bodies
// ---------------------------------------------------------------------------

/** Shared by create (POST /runs) and edit (PATCH /runs/{id}) — the PATCH
 *  wire type is just `Partial<CreateRunRequest>`, and this always sends
 *  every field, which PATCH accepts as a full replacement of the editable
 *  fields. */
export function draftToWireRun(draft: CreateRunDraft, publish: boolean): WireCreateRunRequest {
  const cap = draft.capacity.trim();
  return {
    title: draft.title.trim() || "Untitled run",
    description: draft.description.trim(),
    date: draft.date,
    start_time: draft.startTime,
    end_time: draft.endTime || draft.startTime,
    timezone: draft.timezone.trim() || "America/Los_Angeles",
    format: draft.format,
    venue_name: draft.venueName.trim() || "Venue TBD",
    exact_address: draft.exactAddress.trim(),
    city: draft.city,
    capacity: cap === "" ? null : Math.max(1, parseInt(cap, 10) || 1),
    visibility: draft.visibility,
    auto_approve: draft.autoApprove,
    publish,
  };
}
