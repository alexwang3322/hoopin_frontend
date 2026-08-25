import { useCallback } from "react";
import { useAppDispatch, useAppState } from "../context/AppStoreContext";
import { useToast } from "../context/ToastContext";
import { CURRENT_USER_ID } from "../constants";
import { delay, isAddressUnlocked, pendingCountFor, viewerActionOf } from "../services/runService";

export function useRunDetail(runId: string | undefined) {
  const { runs, account } = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const run = runId ? runs.find((r) => r.id === runId) : undefined;

  const approve = useCallback(
    async (requestId: string) => {
      if (!run) return;
      const req = run.requests.find((r) => r.id === requestId);
      await delay(200);
      dispatch({ type: "APPROVE", runId: run.id, requestId });
      if (req) toast.show(`${req.requester.name} approved to play`);
    },
    [run, dispatch, toast],
  );

  const decline = useCallback(
    async (requestId: string) => {
      if (!run) return;
      const req = run.requests.find((r) => r.id === requestId);
      await delay(200);
      dispatch({ type: "DECLINE", runId: run.id, requestId, reason: null });
      if (req) toast.show(`${req.requester.name}’s request declined`);
    },
    [run, dispatch, toast],
  );

  const requestToJoin = useCallback(
    async (message: string | null) => {
      if (!run) return;
      await delay(200);
      dispatch({ type: "REQUEST_TO_JOIN", runId: run.id, message });
      toast.show(run.autoApprove ? "You’re in 🎉" : "Request sent.");
    },
    [run, dispatch, toast],
  );

  const withdraw = useCallback(
    async (requestId: string) => {
      if (!run) return;
      await delay(200);
      dispatch({ type: "WITHDRAW", runId: run.id, requestId });
      toast.show("Request withdrawn.");
    },
    [run, dispatch, toast],
  );

  const viewerAction = run ? viewerActionOf(run, CURRENT_USER_ID) : undefined;
  const addressUnlocked = run ? isAddressUnlocked(run, CURRENT_USER_ID) : false;
  const pendingCount = run ? pendingCountFor(run) : 0;
  const myRequest = run?.requests.find(
    (r) => r.requester.id === CURRENT_USER_ID && (r.status === "pending" || r.status === "approved"),
  );

  return { run, account, viewerAction, addressUnlocked, pendingCount, myRequest, approve, decline, requestToJoin, withdraw };
}
