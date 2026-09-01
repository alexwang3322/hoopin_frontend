import type { AccountProfile } from "../models/Account";
import { avatarColorFor } from "../utils/hash";
import { CURRENT_USER_ID } from "../constants";

/**
 * Account/profile editing (location, gender, position) has no
 * API_CONTRACT.md counterpart at all — it's an app-local layer on top of
 * the shared UserSummary (see models/Account.ts), so it stays local/mock
 * even after the rest of the app is wired to the live backend. Name/bio
 * here match the backend's seed data (backend/src/db/seedData.ts) for
 * Jamie Tran, so the two don't visibly disagree.
 */
export const INITIAL_ACCOUNT: AccountProfile = {
  id: CURRENT_USER_ID,
  name: "Jamie Tran",
  initials: "JT",
  bio: "Runs the Wednesday lunch crew · plays out of Kezar most weeks",
  color: avatarColorFor(CURRENT_USER_ID),
  location: "San Francisco",
  gender: "Prefer not to say",
  position: "Flexible",
};
