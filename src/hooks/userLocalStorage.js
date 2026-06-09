/**
 * useLocalStorage.js
 * Generic hook for reading/writing to localStorage with JSON serialisation.
 * Returns [value, setValue] — same API as useState but persistent.
 */
import { useState, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // silently fail — storage full or blocked
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}