import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../services/apiClient";
import { toHeaderCounts } from "../services/mappers";
import type { HeaderCounts } from "../models/HeaderCounts";

const ZERO_COUNTS: HeaderCounts = { myPendingRequests: 0, hostingPendingRequests: 0 };

/** Refetches on every route change — cheap, and the simplest way to keep
 *  the nav badges from going stale after an approve/decline/withdraw
 *  happens on another screen (this hook lives once, in RootLayout).
 *  GET /me/counts requires auth (API_CONTRACT.md §5) — skip it entirely
 *  when signed out rather than firing a request guaranteed to 401. */
export function useHeaderCounts() {
  const [counts, setCounts] = useState<HeaderCounts>(ZERO_COUNTS);
  const location = useLocation();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setCounts(ZERO_COUNTS);
      return;
    }
    let cancelled = false;
    apiClient.getHeaderCounts().then((wire) => {
      if (!cancelled) setCounts(toHeaderCounts(wire));
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, isSignedIn]);

  return counts;
}
