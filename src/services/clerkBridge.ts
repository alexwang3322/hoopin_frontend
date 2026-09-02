/**
 * apiClient.ts is a plain module (not a component), so it can't call
 * useAuth() directly. ClerkTokenBridge (mounted once inside <ClerkProvider>
 * in App.tsx) hands its getToken() here on every render; request() below
 * reads it per-call so it's always the current session's token.
 */
type GetToken = () => Promise<string | null>;

let getTokenRef: GetToken | null = null;

export function setClerkGetToken(fn: GetToken | null): void {
  getTokenRef = fn;
}

export async function getClerkToken(): Promise<string | null> {
  if (!getTokenRef) return null;
  return getTokenRef();
}
