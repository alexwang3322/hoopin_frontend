import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useAppState, useSetAccount } from "../context/AppStoreContext";
import { useToast } from "../context/ToastContext";
import { delay } from "../services/delay";
import type { AccountProfile } from "../models/Account";

/** Account/profile editing has no backend counterpart (see mock/account.ts)
 *  — stays local-only, with a fake delay to preserve the original's "Saving…"
 *  UX beat now that `delay` isn't already being awaited by a real fetch.
 *  signOut() IS real, though — it ends the actual Clerk session. */
export function useAccount() {
  const { account } = useAppState();
  const setAccount = useSetAccount();
  const toast = useToast();
  const navigate = useNavigate();
  const { signOut: clerkSignOut } = useClerk();

  const saveAccount = useCallback(
    async (profile: AccountProfile) => {
      await delay(200);
      setAccount(profile);
      toast.show("Profile updated.");
    },
    [setAccount, toast],
  );

  const signOut = useCallback(async () => {
    await clerkSignOut();
    toast.show("Signed out.");
    navigate("/");
  }, [clerkSignOut, toast, navigate]);

  return { account, saveAccount, signOut };
}
