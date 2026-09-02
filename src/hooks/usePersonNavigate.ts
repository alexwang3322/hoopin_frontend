import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

/** Every avatar+name mention anywhere in the app routes through this —
 *  tapping yourself goes to Account, tapping anyone else goes to their
 *  Profile. "Yourself" is the real signed-in Clerk user id (the same id
 *  backend/src/routes/webhooks.ts uses as users.id), not a hardcoded demo
 *  user, so this is accurate regardless of who's logged in. Signed-out
 *  viewers have no `userId`, so every tap goes to Profile. */
export function usePersonNavigate() {
  const navigate = useNavigate();
  const { userId: viewerId } = useAuth();
  return useCallback(
    (userId: string) => {
      if (viewerId && userId === viewerId) navigate("/account");
      else navigate(`/profile/${userId}`);
    },
    [navigate, viewerId],
  );
}
