import type { AccountProfile } from "../models/Account";
import { PROFILES } from "./profiles";

export const INITIAL_ACCOUNT: AccountProfile = {
  ...PROFILES.u_jamie,
  location: "San Francisco",
  gender: "Prefer not to say",
  position: "Flexible",
};
