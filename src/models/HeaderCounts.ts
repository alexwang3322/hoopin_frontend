export interface HeaderCounts {
  /** "My Runs" nav badge — the viewer's own pending outgoing requests. */
  myPendingRequests: number;
  /** "Hosting" nav badge — summed pending requests across all hosted runs. */
  hostingPendingRequests: number;
}
