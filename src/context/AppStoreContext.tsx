import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { AccountProfile } from "../models/Account";
import type { City } from "../models/Run";
import { INITIAL_ACCOUNT } from "../mock/account";

/**
 * What's left here after wiring to the live backend: `account` (profile
 * editing has no API_CONTRACT.md counterpart at all — stays local/mock, see
 * models/Account.ts) and `city` (the header's SF/OAK toggle, shared so
 * useRuns can filter Discover by it — GET /runs's `city` param).
 * Run/request data itself now lives in each hook's own fetch state
 * (hooks/useRuns.ts etc.), not here — the server is the source of truth.
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
  const [account, setAccount] = useState<AccountProfile>(INITIAL_ACCOUNT);
  const [city, setCity] = useState<City>("SF");

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
