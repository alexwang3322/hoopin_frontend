import { useCallback } from "react";
import { useAppDispatch, useAppState } from "../context/AppStoreContext";
import { useToast } from "../context/ToastContext";
import { delay } from "../services/runService";
import type { AccountProfile } from "../models/Account";

export function useAccount() {
  const { account } = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const saveAccount = useCallback(
    async (profile: AccountProfile) => {
      await delay(200);
      dispatch({ type: "UPDATE_ACCOUNT", profile });
      toast.show("Profile updated.");
    },
    [dispatch, toast],
  );

  const signOut = useCallback(() => {
    // Matches the original: no real auth session exists, this is a mock toast only.
    toast.show("Signed out.");
  }, [toast]);

  return { account, saveAccount, signOut };
}
