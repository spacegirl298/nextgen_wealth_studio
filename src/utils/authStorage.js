/**
 * authStorage.js
 * Helpers for reading and writing the auth_users store in localStorage.
 * Keeps the user-account store separate from the active session (auth_session).
 *
 * Schema of each entry in auth_users:
 *   {
 *     userId:       string   — unique ID generated at signup
 *     displayName:  string   — full name entered at signup
 *     email:        string   — lower-cased email (also the key)
 *     passwordHash: string   — btoa(password) — swap for bcrypt on a real backend
 *     joinedDate:   string   — ISO timestamp
 *     lastLogin:    string   — ISO timestamp, updated on each sign-in
 *   }
 */

const USERS_KEY = "auth_users";

/** Returns the full users object keyed by lower-cased email. */
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Persists the full users object back to localStorage. */
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}