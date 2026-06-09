/**
 * useNudges.js
 * Evaluates contextual nudge rules against live financial metrics.
 * Nudge definitions live in tracksData — this hook is generic across tracks.
 *
 * Usage:
 *   const { activeNudges, dismissNudge } = useNudges(nudgeDefs, metrics, context, storageKey);
 */
import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./userLocalStorage";

/**
 * @param {Array}  nudgeDefs  — array of { id, condition(metrics, ctx), message, severity }
 * @param {object} metrics    — from useSnapshotStore derived.metrics
 * @param {object} context    — arbitrary extra context passed to condition (tfsa, housing, etc.)
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