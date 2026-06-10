import { isUserScopedStorageKey } from "./userStorage";

const APP_STORAGE_PREFIXES = [
  "moneySnapshot",
  "bankingDNA",
  "userProfile",
  "preferredTrack",
  "sim_profile",
  "track_",
  "strategy",
  "snapshot",
  "financial",
  "nudge",
];

export function clearAllAppData() {
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (!key) continue;

    const isReservedKey = key === "auth_session" || key === "auth_users";
    const shouldClear = APP_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
    const isUserScopedKey = isUserScopedStorageKey(key);

    if (!isReservedKey && shouldClear && !isUserScopedKey) {
      localStorage.removeItem(key);
    }
  }
}
