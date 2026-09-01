import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { apiClient, ApiRequestError } from "../services/apiClient";
import { toRun } from "../services/mappers";
import type { Run } from "../models/Run";

export function useRunDetail(runId: string | undefined) {
  const toast = useToast();
  const [run, setRun] = useState<Run | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const refetch = useCallback(async () => {
    if (!runId) return;
    setLoading(true);
    try {
      const wire = await apiClient.getRun(runId);
      setRun(toRun(wire));
      setNotFound(false);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 404) {
        setNotFound(true);
      } else {
        toast.show(err instanceof Error ? err.message : "Failed to load this run.");
      }
    } finally {
      setLoading(false);
    }
  }, [runId, toast]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const approve = useCallback(
    async (requestId: string) => {
      if (!run) return;
      const req = run.pendingRequests?.items.find((r) => r.id === requestId);
      try {
        await apiClient.approveRequest(run.id, requestId);
        toast.show(req ? `${req.requester.name} approved to play` : "Approved.");
        await refetch();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Couldn't approve that request.");
      }
    },
    [run, refetch, toast],
  );

  const decline = useCallback(
    async (requestId: string, reason: string | null) => {
      if (!run) return;
      const req = run.pendingRequests?.items.find((r) => r.id === requestId);
      try {
        await apiClient.declineRequest(run.id, requestId, reason);
        toast.show(req ? `${req.requester.name}’s request declined` : "Declined.");
        await refetch();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Couldn't decline that request.");
      }
    },
    [run, refetch, toast],
  );

  const requestToJoin = useCallback(
    async (message: string | null) => {
      if (!run) return;
      try {
        const wire = await apiClient.requestToJoin(run.id, message);
        toast.show(wire.status === "approved" ? "You’re in 🎉" : "Request sent.");
        await refetch();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Couldn't send that request.");
      }
    },
    [run, refetch, toast],
  );

  const withdraw = useCallback(
    async (requestId: string) => {
      if (!run) return;
      try {
        await apiClient.withdrawRequest(run.id, requestId);
        toast.show("Request withdrawn.");
        await refetch();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Couldn't withdraw that request.");
      }
    },
    [run, refetch, toast],
  );

  const cancel = useCallback(async () => {
    if (!run) return;
    try {
      await apiClient.cancelRun(run.id);
      toast.show("Run cancelled.");
      await refetch();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't cancel this run.");
    }
  }, [run, refetch, toast]);

  const addressUnlocked = run?.exactAddress !== undefined;
  const pendingCount = run?.pendingRequests?.pendingCount ?? 0;
  const myRequest = run?.viewerRequest;

  return {
    run,
    loading,
    notFound,
    viewerAction: run?.viewerAction,
    addressUnlocked,
    pendingCount,
    myRequest,
    approve,
    decline,
    requestToJoin,
    withdraw,
    cancel,
  };
}
