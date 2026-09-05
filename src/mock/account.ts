import type { AccountProfile } from "../models/Account";
import { avatarColorFor } from "../utils/hash";

/**
 * Placeholder shown before the real signed-in user's profile has loaded
 * (or when signed out) — AppStoreContext.tsx replaces id/name/initials/bio
 * with the real GET /me response once one's available. Not a specific
 * person's identity: "Hooper" matches the backend's own default persona
 * for a Clerk account with no name at all (backend/src/routes/webhooks.ts).
 * location/gender/position have no API_CONTRACT.md counterpart — see
 * models/Account.ts — so they stay generic defaults, editable in-app.
 */
export const DEFAULT_ACCOUNT: AccountProfile = {
  id: "",
  name: "Hooper",
  initials: "H",
  bio: null,
  color: avatarColorFor("hooper"),
  location: "SF",
  gender: "Prefer not to say",
  position: "Flexible",
};
