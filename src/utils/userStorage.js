export function isUserScopedStorageKey(key) {
  return typeof key === 'string' && /(_user_[A-Za-z0-9_-]+)$/.test(key);
}

export function getScopedStorageKey(key, userId) {
  if (!key || typeof key !== 'string') return key;
  if (!userId || isUserScopedStorageKey(key)) return key;

  return `${key}_${userId}`;
}
