
import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./userLocalStorage";

/**
 * @param {Array}  nudgeDefs  — array of { id, condition(metrics, ctx), message, severity }
 * @param {object} metrics    — live financial state
 * @param {object} context    — arbitrary extra context passed to condition
 * @param {string} storageKey — unique key to persist dismissed IDs per track
 */
export function useNudges(nudgeDefs = [], metrics = {}, context = {}, storageKey = "nudges_dismissed") {
  const [dismissed, setDismissed] = useLocalStorage(storageKey, []);

  const activeNudges = useMemo(
    () =>
      nudgeDefs.filter(
        (n) =>
          !dismissed.includes(n.id) &&
          n.condition(metrics, context),
      ),
    [nudgeDefs, metrics, context, dismissed],
  );

  const dismissNudge = useCallback(
    (id) => {
      setDismissed((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setDismissed],
  );

  return { activeNudges, dismissNudge };
}