import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { toHeaderCounts } from "../services/mappers";
import type { HeaderCounts } from "../models/HeaderCounts";

const ZERO_COUNTS: HeaderCounts = { myPendingRequests: 0, hostingPendingRequests: 0 };

/** Refetches on every route change — cheap, and the simplest way to keep
 *  the nav badges from going stale after an approve/decline/withdraw
 *  happens on another screen (this hook lives once, in RootLayout). */
export function useHeaderCounts() {
  const [counts, setCounts] = useState<HeaderCounts>(ZERO_COUNTS);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    apiClient.getHeaderCounts().then((wire) => {
      if (!cancelled) setCounts(toHeaderCounts(wire));
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return counts;
}
