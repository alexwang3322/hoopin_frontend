import { useCallback } from "react";
import { useAppDispatch } from "../context/AppStoreContext";
import { useToast } from "../context/ToastContext";
import { delay } from "../services/runService";
import type { CreateRunDraft } from "../models/CreateRunDraft";

export function useCreateRun() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const publish = useCallback(
    async (draft: CreateRunDraft, editingRunId: string | null) => {
      await delay(200);
      dispatch({ type: "PUBLISH", draft, editingRunId });
      toast.show(`${draft.title.trim() || "Untitled run"} published.`);
    },
    [dispatch, toast],
  );

  return { publish };
}
