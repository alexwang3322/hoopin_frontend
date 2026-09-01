import { useEffect, useState } from "react";
import { apiClient, ApiRequestError } from "../services/apiClient";
import { toUserSummary } from "../services/mappers";
import type { UserSummary } from "../models/User";

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserSummary | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    apiClient
      .getUser(userId)
      .then((wire) => {
        if (!cancelled) setProfile(toUserSummary(wire));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiRequestError && err.status === 404) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, loading, notFound };
}
