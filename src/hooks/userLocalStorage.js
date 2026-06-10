/**
 * useLocalStorage.js
 * Generic hook for reading/writing to localStorage with JSON serialisation.
 * Returns [value, setValue] — same API as useState but persistent.
 */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useUser } from "../context/UserContext";
import { getScopedStorageKey, isUserScopedStorageKey } from "../utils/userStorage";

export function useLocalStorage(key, initialValue) {
  const { user, getUserStorageKey } = useUser();
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  const storageKey = useMemo(() => {
    if (isUserScopedStorageKey(key)) return key;

    if (user?.userId) {
      return getUserStorageKey ? getUserStorageKey(key) : getScopedStorageKey(key, user.userId);
    }

    return key;
  }, [key, user, getUserStorageKey]);

  const readValue = useCallback(() => {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  }, [storageKey]);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredValue(readValue());
  }, [storageKey, readValue]);

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