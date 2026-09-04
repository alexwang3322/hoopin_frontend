/**
 * Snake_case wire shapes exactly as API_CONTRACT.md §2 / backend/src/contract-types.ts
 * define them — this is what actually comes over the network. `services/mappers.ts`
 * converts these into the app's camelCase models (`models/*.ts`); nothing outside
 * `services/` should import from this file.
 */

export type WireRunFormat = "5v5_full_court" | "3v3_half_court";
export type WireCity = "SF" | "OAK" | "SJ" | "SD" | "NYC";
export type WireVisibility = "public" | "private";
export type WireViewerRunStatus = "host" | "pending" | "approved" | "declined" | "withdrawn" | null;
export type WireViewerAction = "signed_out" | "can_request" | "host" | "pending" | "approved" | "declined" | "full";
export type WireJoinRequestStatus = "pending" | "approved" | "declined" | "withdrawn";

export interface WireUserSummary {
  id: string;
  name: string;
  initials: string;
  bio: string | null;
}

export interface WireRunSummary {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  format: WireRunFormat;
  venue_name: string;
  city: WireCity;
  host: WireUserSummary;
  capacity: number | null;
  going_count: number;
  is_full: boolean;
  is_draft: boolean;
  is_cancelled: boolean;
  cancelled_at: string | null;
  visibility: WireVisibility;
  viewer_status: WireViewerRunStatus;
  cover_seed: string;
}

export interface WireJoinRequest {
  id: string;
  run_id: string;
  requester: WireUserSummary;
  message: string | null;
  status: WireJoinRequestStatus;
  created_at: string;
  decided_at: string | null;
  decline_reason?: string | null;
}

export interface WireRunDetail extends WireRunSummary {
  description: string;
  auto_approve: boolean;
  created_at: string;
  exact_address?: string;
  address_locked_reason?: "not_approved" | "signed_out";
  attendees: WireUserSummary[];
  viewer_action: WireViewerAction;
  viewer_request?: WireJoinRequest;
  pending_requests?: {
    items: WireJoinRequest[];
    pending_count: number;
  };
}

export interface WireCreateRunRequest {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  format: WireRunFormat;
  venue_name: string;
  exact_address: string;
  city: WireCity;
  capacity: number | null;
  visibility: WireVisibility;
  auto_approve: boolean;
  publish: boolean;
}

export type WireUpdateRunRequest = Partial<WireCreateRunRequest>;

export interface WireCursorPage<T> {
  items: T[];
  next_cursor: string | null;
}

export interface WireJoinRequestWithRun extends WireJoinRequest {
  run: WireRunSummary;
}

export interface WireHeaderCounts {
  my_pending_requests: number;
  hosting_pending_requests: number;
}

export interface WireApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
}
