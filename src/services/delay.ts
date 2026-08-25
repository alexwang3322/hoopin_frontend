/** Simulates network latency for the mock service layer. */
export function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
