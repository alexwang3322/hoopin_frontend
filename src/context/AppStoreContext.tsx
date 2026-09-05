import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { AccountProfile } from "../models/Account";
import type { City } from "../models/Run";
import { DEFAULT_ACCOUNT } from "../mock/account";
import { apiClient } from "../services/apiClient";
import { toUserSummary } from "../services/mappers";

/**
 * What's left here after wiring to the live backend: `account` (profile
 * editing has no API_CONTRACT.md counterpart at all — stays local/mock, see
 * models/Account.ts) and `city` (the header's SF/OAK toggle, shared so
 * useRuns can filter Discover by it — GET /runs's `city` param).
 * Run/request data itself now lives in each hook's own fetch state
 * (hooks/useRuns.ts etc.), not here — the server is the source of truth.
 *
 * `account`'s id/name/initials/bio come from a real GET /me fetch once
 * signed in (below) — location/gender/position have nowhere real to come
 * from, so those stay whatever DEFAULT_ACCOUNT/the user's own in-app edits
 * set them to; editing them isn't persisted server-side (no such endpoint
 * exists yet), so it resets on reload like it always has.
 */
export interface AppState {
  account: AccountProfile;
  city: City;
}

const AccountContext = createContext<AccountProfile | null>(null);
const SetAccountContext = createContext<Dispatch<SetStateAction<AccountProfile>> | null>(null);
const CityContext = createContext<City | null>(null);
const SetCityContext = createContext<Dispatch<SetStateAction<City>> | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountProfile>(DEFAULT_ACCOUNT);
  // Defaults to San Diego for a first-time/signed-out visitor — a stand-in
  // until a real "detect my location" feature exists, not a claim that SD
  // is where most users actually are.
  const [city, setCity] = useState<City>("SD");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setAccount(DEFAULT_ACCOUNT);
      return;
    }
    let cancelled = false;
    apiClient
      .getMe()
      .then((wire) => {
        if (cancelled) return;
        const summary = toUserSummary(wire);
        setAccount((prev) => ({ ...prev, ...summary }));
      })
      .catch(() => {
        // Swallow — DEFAULT_ACCOUNT already covers "not loaded yet"/"signed
        // out", and the header/account page just keep showing that until a
        // retry (e.g. route change) succeeds.
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  return (
    <AccountContext.Provider value={account}>
      <SetAccountContext.Provider value={setAccount}>
        <CityContext.Provider value={city}>
          <SetCityContext.Provider value={setCity}>{children}</SetCityContext.Provider>
        </CityContext.Provider>
      </SetAccountContext.Provider>
    </AccountContext.Provider>
  );
}

export function useAppState(): AppState {
  const account = useContext(AccountContext);
  const city = useContext(CityContext);
  if (!account || !city) throw new Error("useAppState must be used within an AppStoreProvider");
  return useMemo(() => ({ account, city }), [account, city]);
}

export function useSetAccount(): Dispatch<SetStateAction<AccountProfile>> {
  const ctx = useContext(SetAccountContext);
  if (!ctx) throw new Error("useSetAccount must be used within an AppStoreProvider");
  return ctx;
}

export function useSetCity(): Dispatch<SetStateAction<City>> {
  const ctx = useContext(SetCityContext);
  if (!ctx) throw new Error("useSetCity must be used within an AppStoreProvider");
  return ctx;
}
