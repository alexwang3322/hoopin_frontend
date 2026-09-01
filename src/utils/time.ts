/** Renders an ISO timestamp as a relative "Xh ago" / "Xd ago" string,
 *  matching html/index.html's hardcoded request-age labels ("4h ago", "1d
 *  ago", "2d ago", ...) but computed live instead of hand-written. */
export function formatRelativeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(0, Math.round(diffMs / (60 * 60 * 1000)));
  if (hours < 24) return `${Math.max(hours, 1)}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function todayISODate(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface IsoParts {
  year: number;
  month: number; // 0-indexed
  day: number;
  hour: number;
  minute: number;
  weekday: number;
}

/**
 * Every run's `startsAt`/`endsAt` carries an explicit offset (e.g.
 * "2026-09-06T08:00:00-07:00") and, per API_CONTRACT.md, must always render
 * in the *run's* zone, never re-converted to the viewer's local time.
 * `new Date(iso).getUTCHours()` would silently do exactly that unwanted
 * conversion (it resolves the offset into a true UTC instant first), so the
 * wall-clock digits are parsed directly out of the string instead.
 */
function parseIsoParts(iso: string): IsoParts {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) throw new Error(`Invalid ISO datetime: ${iso}`);
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const hour = Number(m[4]);
  const minute = Number(m[5]);
  // Date.UTC here is only used to derive which weekday this calendar date
  // falls on — it never touches the already-parsed wall-clock hour/minute.
  const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
  return { year, month, day, hour, minute, weekday };
}

function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if (h === 0) h = 12;
  return `${h}:${String(minute).padStart(2, "0")} ${ampm}`;
}

/** "Wed, Sep 9 · 12:00 PM–1:00 PM · 5v5 full court" — matches the original
 *  hand-authored `when` strings' shape. */
export function formatRunWhen(startsAt: string, endsAt: string, formatLabel: string): string {
  const start = parseIsoParts(startsAt);
  const end = parseIsoParts(endsAt);
  const weekday = WEEKDAY[start.weekday];
  const month = MONTH[start.month];
  return `${weekday}, ${month} ${start.day} · ${formatTime(start.hour, start.minute)}–${formatTime(end.hour, end.minute)} · ${formatLabel}`;
}

export function formatDateChip(startsAt: string): { mon: string; day: string } {
  const parts = parseIsoParts(startsAt);
  return { mon: MONTH[parts.month].toUpperCase(), day: String(parts.day) };
}

/** Splits a "YYYY-MM-DDTHH:MM:SS±HH:MM" string back into the separate
 *  date/time-of-day fields the Host-a-run form edits, without any timezone
 *  re-interpretation — a straight substring split, since the stored offset
 *  is always the run's own and must round-trip unchanged. */
export function splitIsoDateTime(iso: string): { date: string; time: string } {
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

/**
 * "Finished" is deliberately never a stored/server field (see
 * API_CONTRACT.md §6's note on it) — it's the viewer's own wall-clock time
 * compared against `endsAt`, which already carries an explicit UTC offset,
 * so `new Date(endsAt)` resolves to the correct absolute instant regardless
 * of the client's local zone. Computed at call time, not cached, so it
 * flips the instant a run's end time passes without needing a refetch.
 */
export function isRunFinished(endsAt: string): boolean {
  return new Date(endsAt).getTime() <= Date.now();
}
