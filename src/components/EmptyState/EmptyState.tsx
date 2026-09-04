import { SignInButton } from "@clerk/clerk-react";
import styles from "./EmptyState.module.css";

/** `signIn` renders a "Sign in" CTA below the message — used on screens
 *  whose real data (My Runs, Hosting) is gated behind auth, so a
 *  signed-out visitor sees why the list is empty and how to fix it,
 *  instead of a plain "there's nothing here." */
export function EmptyState({
  message = "There are no events now.",
  signIn = false,
}: {
  message?: string;
  signIn?: boolean;
}) {
  return (
    <div className={styles.empty}>
      <p>{message}</p>
      {signIn && (
        <SignInButton mode="modal">
          <button type="button" className={styles.signInBtn}>
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}
