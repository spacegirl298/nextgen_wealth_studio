/**
 * useLocalStorage.js
 * Generic hook for reading/writing to localStorage with JSON serialisation.
 * Returns [value, setValue] — same API as useState but persistent.
 */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { getScopedStorageKey, isUserScopedStorageKey } from "../utils/userStorage";

export function useLocalStorage(key, initialValue) {
  const { user, getUserStorageKey } = useUser();

  const storageKey = useMemo(() => {
    if (isUserScopedStorageKey(key)) return key;

    if (user?.userId) {
      return getUserStorageKey ? getUserStorageKey(key) : getScopedStorageKey(key, user.userId);
    }

    return key;
  }, [key, user?.userId, getUserStorageKey]);

  const readValue = useCallback(() => {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [storageKey, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      } catch {
        // silently fail — storage full or blocked
      }
    },
    [storageKey, storedValue],
  );

  return [storedValue, setValue];
}