import { useAppState } from "../context/AppStoreContext";
import { CURRENT_USER_ID } from "../constants";
import { computeHeaderCounts } from "../services/runService";

export function useHeaderCounts() {
  const { runs } = useAppState();
  return computeHeaderCounts(runs, CURRENT_USER_ID);
}
