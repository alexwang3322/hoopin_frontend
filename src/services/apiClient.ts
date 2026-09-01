import { API_BASE_URL, CURRENT_USER_ID } from "../constants";
import type {
  WireCursorPage,
  WireRunSummary,
  WireRunDetail,
  WireJoinRequest,
  WireJoinRequestWithRun,
  WireHeaderCounts,
  WireUserSummary,
  WireCreateRunRequest,
  WireUpdateRunRequest,
  WireApiError,
} from "./wireTypes";

/** Thrown for any non-2xx response — carries the contract's §4 error `code`
 *  (e.g. "RUN_FULL", "ALREADY_REQUESTED") so callers can branch on it
 *  instead of parsing the message string. */
export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Local-dev-only auth stub (backend/src/lib/auth.ts) — replace with a
      // real issued token once Clerk (or another issuer) is wired in here.
      Authorization: `Bearer dev:${CURRENT_USER_ID}`,
      ...init.headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = body as WireApiError | null;
    throw new ApiRequestError(res.status, err?.error.code ?? "UNKNOWN_ERROR", err?.error.message ?? res.statusText);
  }
  return body as T;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export interface ListRunsParams {
  city?: string;
  format?: string;
  cursor?: string;
  limit?: number;
  [key: string]: string | number | undefined;
}

/** One function per API_CONTRACT.md §3 endpoint actually used by the app
 *  (GET /runs/{id}/requests — host-only list — isn't; the app reads pending
 *  requests off `GET /runs/{id}`'s `pending_requests` instead). */
export const apiClient = {
  listRuns: (params: ListRunsParams = {}) => request<WireCursorPage<WireRunSummary>>(`/runs${toQuery(params)}`),

  getRun: (runId: string) => request<WireRunDetail>(`/runs/${runId}`),

  createRun: (body: WireCreateRunRequest) =>
    request<WireRunDetail>(`/runs`, { method: "POST", body: JSON.stringify(body) }),

  updateRun: (runId: string, body: WireUpdateRunRequest) =>
    request<WireRunDetail>(`/runs/${runId}`, { method: "PATCH", body: JSON.stringify(body) }),

  requestToJoin: (runId: string, message: string | null) =>
    request<WireJoinRequest>(`/runs/${runId}/requests`, {
      method: "POST",
      body: JSON.stringify(message ? { message } : {}),
    }),

  approveRequest: (runId: string, reqId: string) =>
    request<WireJoinRequest>(`/runs/${runId}/requests/${reqId}/approve`, { method: "POST" }),

  declineRequest: (runId: string, reqId: string, declineReason: string | null) =>
    request<WireJoinRequest>(`/runs/${runId}/requests/${reqId}/decline`, {
      method: "POST",
      body: JSON.stringify(declineReason ? { decline_reason: declineReason } : {}),
    }),

  withdrawRequest: (runId: string, reqId: string) =>
    request<WireJoinRequest>(`/runs/${runId}/requests/${reqId}/withdraw`, { method: "POST" }),

  getMe: () => request<WireUserSummary>(`/me`),

  getMyRequests: () => request<WireCursorPage<WireJoinRequestWithRun>>(`/me/requests`),

  getHosting: () => request<WireCursorPage<WireRunSummary>>(`/me/hosting`),

  getHeaderCounts: () => request<WireHeaderCounts>(`/me/counts`),

  getUser: (userId: string) => request<WireUserSummary>(`/users/${userId}`),
};
