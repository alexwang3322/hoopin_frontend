import { useCallback } from "react";
import { useAppState, useSetAccount } from "../context/AppStoreContext";
import { useToast } from "../context/ToastContext";
import { delay } from "../services/delay";
import type { AccountProfile } from "../models/Account";

/** Account/profile editing has no backend counterpart (see mock/account.ts)
 *  — stays local-only, with a fake delay to preserve the original's "Saving…"
 *  UX beat now that `delay` isn't already being awaited by a real fetch. */
export function useAccount() {
  const { account } = useAppState();
  const setAccount = useSetAccount();
  const toast = useToast();

  const saveAccount = useCallback(
    async (profile: AccountProfile) => {
      await delay(200);
      setAccount(profile);
      toast.show("Profile updated.");
    },
    [setAccount, toast],
  );

  const signOut = useCallback(() => {
    // Matches the original: no real auth session exists, this is a mock toast only.
    toast.show("Signed out.");
  }, [toast]);

  return { account, saveAccount, signOut };
}
