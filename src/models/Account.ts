import type { UserSummary } from "./User";

export type Gender = "Prefer not to say" | "Woman" | "Man" | "Non-binary";

export type PlayerPosition =
  | "Flexible"
  | "Point guard"
  | "Shooting guard"
  | "Forward"
  | "Center";

export type AccountLocation = "San Francisco" | "Oakland";

/**
 * The account screen edits four fields (location, gender, position, plus
 * name/bio already on UserSummary) that aren't part of API_CONTRACT.md's
 * UserSummary — they're app-local profile fields layered on top of the
 * shared public profile.
 */
export interface AccountProfile extends UserSummary {
  location: AccountLocation;
  gender: Gender;
  position: PlayerPosition;
}
