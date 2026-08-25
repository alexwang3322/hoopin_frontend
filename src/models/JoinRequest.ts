import type { UserSummary } from "./User";

export type JoinRequestStatus = "pending" | "approved" | "declined" | "withdrawn";

export interface JoinRequest {
  id: string;
  runId: string;
  requester: UserSummary;
  message: string | null;
  status: JoinRequestStatus;
  createdAt: string; // ISO datetime
  decidedAt: string | null;
  declineReason?: string | null;
}

/** My Runs row shape — a join request joined with a summary of its run. */
export interface JoinRequestWithRun extends JoinRequest {
  runTitle: string;
  runWhen: string;
  runCoverGradient: string;
}
