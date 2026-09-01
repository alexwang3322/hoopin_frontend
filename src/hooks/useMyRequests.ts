import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import { toJoinRequestWithRun } from "../services/mappers";
import type { JoinRequestWithRun } from "../models/JoinRequest";

export function useMyRequests() {
  const [requests, setRequests] = useState<JoinRequestWithRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return { requests, loading };
}
