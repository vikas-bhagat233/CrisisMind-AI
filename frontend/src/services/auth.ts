/**
 * Minimal client-side auth stub matching backend/api/auth.py. Replace with
 * real Supabase Auth session handling when wiring up user accounts.
 */
export function getDemoAuthHeader(): Record<string, string> {
  return { Authorization: "Bearer demo-token" };
}
