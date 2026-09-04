import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../services/apiClient";
import { toRun } from "../services/mappers";
import type { Run } from "../models/Run";

/**
 * `GET /me/hosting` returns `RunSummary[]` (API_CONTRACT.md §2), which has
 * no per-run pending-request count — only `HeaderCounts.hosting_pending_requests`
 * (a single sum across all hosted runs) exists at summary level. The
 * Hosting list UI needs one pending count per row, so this fetches each
 * hosted run's detail (which does carry `pending_requests.pending_count`,
 * since the viewer is always the host here) in parallel. Fine at this
 * project's scale (a handful of hosted runs); revisit if the contract ever
 * grows a dedicated field instead of relying on this N+1.
 *
 * `/me/*` requires auth — skip the fetch entirely when signed out rather
 * than firing a request guaranteed to 401.
 */
export function useHosting() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setRuns([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiClient
      .getHosting()
      .then(async (page) => {
        const detailed = await Promise.all(page.items.map((r) => apiClient.getRun(r.id)));
        if (cancelled) return;
        setRuns(detailed.map(toRun));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  return { runs, loading };
}
