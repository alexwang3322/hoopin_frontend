import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../services/apiClient";
import { toJoinRequestWithRun } from "../services/mappers";
import type { JoinRequestWithRun } from "../models/JoinRequest";

/** GET /me/requests requires auth — skip it entirely when signed out
 *  rather than firing a request guaranteed to 401. */
export function useMyRequests() {
  const [requests, setRequests] = useState<JoinRequestWithRun[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setRequests([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiClient
      .getMyRequests()
      .then((page) => {
        if (cancelled) return;
        setRequests(page.items.map(toJoinRequestWithRun));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  return { requests, loading };
}
