// utils/userStorage.js
export function getScopedStorageKey(baseKey, userId) {
  return `${baseKey}_${userId}`;
}

export function isUserScopedStorageKey(key) {
  // Keys that contain a userId are already scoped
  return key.includes("_user_") || key.match(/_[a-zA-Z0-9]+$/);
}