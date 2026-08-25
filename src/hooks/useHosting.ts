import { useAppState } from "../context/AppStoreContext";
import { CURRENT_USER_ID } from "../constants";
import { getHostingRuns } from "../services/runService";

export function useHosting() {
  const { runs } = useAppState();
  return getHostingRuns(runs, CURRENT_USER_ID);
}
