import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import type { Run } from "../models/Run";
import type { AccountProfile } from "../models/Account";
import type { CreateRunDraft } from "../models/CreateRunDraft";
import { INITIAL_RUNS } from "../mock/runs";
import { INITIAL_ACCOUNT } from "../mock/account";
import { applyApprove, applyDecline, applyPublish, applyRequestToJoin, applyWithdraw } from "../services/runService";

export interface AppState {
  runs: Run[];
  account: AccountProfile;
}

type Action =
  | { type: "APPROVE"; runId: string; requestId: string }
  | { type: "DECLINE"; runId: string; requestId: string; reason: string | null }
  | { type: "REQUEST_TO_JOIN"; runId: string; message: string | null }
  | { type: "WITHDRAW"; runId: string; requestId: string }
  | { type: "PUBLISH"; draft: CreateRunDraft; editingRunId: string | null }
  | { type: "UPDATE_ACCOUNT"; profile: AccountProfile };

function mapRun(state: AppState, runId: string, fn: (run: Run) => Run): AppState {
  return { ...state, runs: state.runs.map((r) => (r.id === runId ? fn(r) : r)) };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "APPROVE":
      return mapRun(state, action.runId, (r) => applyApprove(r, action.requestId));
    case "DECLINE":
      return mapRun(state, action.runId, (r) => applyDecline(r, action.requestId, action.reason));
    case "REQUEST_TO_JOIN":
      return mapRun(state, action.runId, (r) => applyRequestToJoin(r, state.account, action.message));
    case "WITHDRAW":
      return mapRun(state, action.runId, (r) => applyWithdraw(r, action.requestId));
    case "PUBLISH":
      return { ...state, runs: applyPublish(state.runs, action.draft, state.account, action.editingRunId) };
    case "UPDATE_ACCOUNT": {
      // Keep the shared profile directory (host rows, roster rows, etc. all
      // embed a snapshot of UserSummary) in sync with the edited account.
      const nextRuns = state.runs.map((r) => ({
        ...r,
        host: r.host.id === action.profile.id ? action.profile : r.host,
        attendees: r.attendees.map((a) => (a.id === action.profile.id ? action.profile : a)),
        requests: r.requests.map((req) =>
          req.requester.id === action.profile.id ? { ...req, requester: action.profile } : req,
        ),
      }));
      return { runs: nextRuns, account: action.profile };
    }
    default:
      return state;
  }
}

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { runs: INITIAL_RUNS, account: INITIAL_ACCOUNT });
  const stateValue = useMemo(() => state, [state]);
  return (
    <StateContext.Provider value={stateValue}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used within an AppStoreProvider");
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used within an AppStoreProvider");
  return ctx;
}
