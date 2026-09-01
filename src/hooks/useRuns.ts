import { useEffect, useState } from "react";
import { useAppState } from "../context/AppStoreContext";
import { apiClient } from "../services/apiClient";
import { toRun } from "../services/mappers";
import { todayISODate } from "../utils/time";
import type { Run, RunFormat } from "../models/Run";

export interface DiscoverFilters {
  fromDate: string;
  format: RunFormat | "";
}

export const DEFAULT_FILTERS: DiscoverFilters = { fromDate: todayISODate(), format: "" };

/** Discover's run list. `city` comes from the header's shared toggle
 *  (AppStoreContext) and is sent to `GET /runs` as a real filter param
 *  (API_CONTRACT.md §3.1) — previously this toggle was purely cosmetic
 *  (frontend/CONTRACT_ALIGNMENT.md). `format` is also sent server-side;
 *  `fromDate` stays a client-side filter since the contract has no date
 *  range param. */
export function useRuns() {
  const { city } = useAppState();
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient
      .listRuns({ city, format: filters.format || undefined })
      .then((page) => {
        if (cancelled) return;
        setRuns(page.items.map(toRun));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load runs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city, filters.format]);

  const filteredRuns = runs.filter((run) => !filters.fromDate || run.startsAt.slice(0, 10) >= filters.fromDate);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return { runs: filteredRuns, loading, error, filters, setFilters, clearFilters };
}
