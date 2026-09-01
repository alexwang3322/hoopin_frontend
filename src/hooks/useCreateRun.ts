import { useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { apiClient } from "../services/apiClient";
import { draftToWireRun } from "../services/mappers";
import type { CreateRunDraft } from "../models/CreateRunDraft";

export function useCreateRun() {
  const toast = useToast();

  const publish = useCallback(
    async (draft: CreateRunDraft, editingRunId: string | null) => {
      const body = draftToWireRun(draft, /* publish */ true);
      if (editingRunId) {
        await apiClient.updateRun(editingRunId, body);
      } else {
        await apiClient.createRun(body);
      }
      toast.show(`${draft.title.trim() || "Untitled run"} published.`);
    },
    [toast],
  );

  return { publish };
}
