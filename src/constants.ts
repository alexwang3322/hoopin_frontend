/** Seed id for the local-only Account profile mock (models/Account.ts,
 *  mock/account.ts) — that screen has no API_CONTRACT.md counterpart and
 *  stays mock regardless of who's actually signed in via Clerk. Not used
 *  for auth/API identity anymore — see services/clerkBridge.ts. */
export const CURRENT_USER_ID = "u_jamie";

export const HOST_RUN_ID = "ev_kezar_lunch";

/** Falls back to the local backend dev server so `npm run dev` works with
 *  zero setup; override via `frontend/.env.local` (see `.env.example`) for
 *  a deployed backend. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787/v1";

/** Safe to expose client-side by design (Clerk docs) — identifies the
 *  Clerk app, carries no secret. Set in frontend/.env.local; see
 *  .env.example. */
export const CLERK_PUBLISHABLE_KEY: string = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
