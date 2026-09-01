import { useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { apiClient, ApiRequestError } from "../services/apiClient";
import { draftToWireRun } from "../services/mappers";
import type { CreateRunDraft } from "../models/CreateRunDraft";

const FIELD_LABEL: Record<string, string> = {
  title: "Title",
  description: "Description",
  date: "Date",
  start_time: "Start time",
  end_time: "End time",
  timezone: "Timezone",
  format: "Format",
  venue_name: "Court name",
  exact_address: "Exact address",
  city: "City",
  capacity: "Capacity",
  visibility: "Visibility",
};

export function useCreateRun() {
  const toast = useToast();

  const publish = useCallback(
    async (draft: CreateRunDraft, editingRunId: string | null): Promise<boolean> => {
      const body = draftToWireRun(draft, /* publish */ true);
      try {
        if (editingRunId) {
          await apiClient.updateRun(editingRunId, body);
        } else {
          await apiClient.createRun(body);
        }
        toast.show(`${draft.title.trim() || "Untitled run"} published.`);
        return true;
      } catch (err) {
        if (err instanceof ApiRequestError && err.field) {
          const label = FIELD_LABEL[err.field] ?? err.field;
          toast.show(`${label}: ${err.message}`);
        } else {
          toast.show(err instanceof Error ? err.message : "Couldn't publish this run.");
        }
        return false;
      }
    },
    [toast],
  );

  return { publish };
}
