/** The hardcoded demo viewer — html/index.html has no sign-in flow, so the
 *  app always runs as this user, exactly like the original prototype. This
 *  also doubles as the dev-auth bearer token's userId (backend/src/lib/auth.ts)
 *  until a real issuer (Clerk) is wired in on both ends. */
export const CURRENT_USER_ID = "u_jamie";

export const HOST_RUN_ID = "ev_kezar_lunch";

/** Falls back to the local backend dev server so `npm run dev` works with
 *  zero setup; override via `frontend/.env.local` (see `.env.example`) for
 *  a deployed backend. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787/v1";
