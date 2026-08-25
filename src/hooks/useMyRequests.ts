import { useAppState } from "../context/AppStoreContext";
import { CURRENT_USER_ID } from "../constants";
import { getMyRequests } from "../services/runService";

export function useMyRequests() {
  const { runs } = useAppState();
  return getMyRequests(runs, CURRENT_USER_ID);
}
