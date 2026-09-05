import type { UserSummary } from "./User";
import type { City } from "./Run";

export type Gender = "Prefer not to say" | "Woman" | "Man" | "Non-binary";

export type PlayerPosition =
  | "Flexible"
  | "Point guard"
  | "Shooting guard"
  | "Forward"
  | "Center";

/**
 * The account screen edits four fields (location, gender, position, plus
 * name/bio already on UserSummary) that aren't part of API_CONTRACT.md's
 * UserSummary — they're app-local profile fields layered on top of the
 * shared public profile. `location` reuses the same `City` type (and
 * `CITY_LABEL` display map/order) as a run's city, rather than its own
 * separate, narrower list — so it always covers whatever cities Discover
 * and Host-a-run do.
 */
export interface AccountProfile extends UserSummary {
  location: City;
  gender: Gender;
  position: PlayerPosition;
}
