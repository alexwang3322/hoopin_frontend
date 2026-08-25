import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../context/AppStoreContext";
import { getDiscoverRuns, delay } from "../services/runService";
import { todayISODate } from "../utils/time";
import type { Run, RunFormat } from "../models/Run";

export interface DiscoverFilters {
  fromDate: string;
  format: RunFormat | "";
  maxDistance: "" | "2" | "5" | "10";
}

export const DEFAULT_FILTERS: DiscoverFilters = { fromDate: todayISODate(), format: "", maxDistance: "" };

/** Discover's run list + client-side filtering — mirrors html/index.html's
 *  `applyDiscoverFilters`: cards never leave sort order, filtering just
 *  narrows what's shown. */
export function useRuns() {
  const { runs } = useAppState();
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [allRuns, setAllRuns] = useState<Run[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    delay(150).then(() => {
      if (cancelled) return;
      setAllRuns(getDiscoverRuns(runs));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [runs]);

  const filteredRuns = useMemo(() => {
    return allRuns.filter((run) => {
      const matchesDate = !filters.fromDate || run.startsAt.slice(0, 10) >= filters.fromDate;
      const matchesFormat = !filters.format || run.format === filters.format;
      const matchesDistance = !filters.maxDistance || run.distanceMiles <= parseFloat(filters.maxDistance);
      return matchesDate && matchesFormat && matchesDistance;
    });
  }, [allRuns, filters]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return { runs: filteredRuns, loading, filters, setFilters, clearFilters };
}
