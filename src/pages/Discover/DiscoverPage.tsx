import { useRuns } from "../../hooks/useRuns";
import { RunCard } from "../../components/RunCard/RunCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import type { RunFormat } from "../../models/Run";
import styles from "./DiscoverPage.module.css";

export function DiscoverPage() {
  const { runs, loading, filters, setFilters, clearFilters } = useRuns();

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Discover</h1>
        <p>Runs near you this week. Sorted by start time.</p>
      </div>

      <div className={styles.filterBar}>
        <label className={styles.field}>
          <span>From date</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span>Game type</span>
          <select
            value={filters.format}
            onChange={(e) => setFilters({ ...filters, format: e.target.value as RunFormat | "" })}
          >
            <option value="">Any format</option>
            <option value="5v5_full_court">Full court</option>
            <option value="3v3_half_court">Half court</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Distance</span>
          <select
            value={filters.maxDistance}
            onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value as typeof filters.maxDistance })}
          >
            <option value="">Any distance</option>
            <option value="2">Within 2 mi</option>
            <option value="5">Within 5 mi</option>
            <option value="10">Within 10 mi</option>
          </select>
        </label>
        <button type="button" className={styles.clearBtn} onClick={clearFilters}>
          Clear
        </button>
      </div>

      {!loading && runs.length === 0 && <EmptyState />}

      <div className={styles.grid}>
        {runs.map((run) => (
          <RunCard key={run.id} run={run} />
        ))}
      </div>

      <p className={styles.footnote}>Spots update once requests are approved.</p>
    </div>
  );
}
