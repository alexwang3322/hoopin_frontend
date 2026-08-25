import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER_ID } from "../constants";

/** Every avatar+name mention anywhere in the app routes through this — tapping
 *  yourself goes to Account, tapping anyone else goes to their Profile,
 *  matching the original's single delegated `CURRENT_USER_ID` check. */
export function usePersonNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (userId: string) => {
      if (userId === CURRENT_USER_ID) navigate("/account");
      else navigate(`/profile/${userId}`);
    },
    [navigate],
  );
}
