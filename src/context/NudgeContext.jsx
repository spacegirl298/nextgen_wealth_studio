/**
 * NudgeContext.jsx
 * Global nudge state: exposes activeNudges and dismissNudge to the tree.
 * Listens to FinancialContext / useSnapshotStore and surfaces rule-based nudges.
 *
 * Wrap your app (or the tracks section) with <NudgeProvider nudgeDefs={...} metrics={...} context={...} storageKey="...">
 * and consume with useNudgeContext() anywhere below.
 */

import { createContext, useContext } from "react";
import { useNudges } from "../hooks/useNudges";

const NudgeContext = createContext(null);

export function NudgeProvider({ children, nudgeDefs = [], metrics = {}, context = {}, storageKey = "nudges_dismissed" }) {
  const { activeNudges, dismissNudge } = useNudges(nudgeDefs, metrics, context, storageKey);

  return (
    <NudgeContext.Provider value={{ activeNudges, dismissNudge }}>
      {children}
    </NudgeContext.Provider>
  );
}

export function useNudgeContext() {
  const ctx = useContext(NudgeContext);
  if (!ctx) throw new Error("useNudgeContext must be used within a NudgeProvider");
  return ctx;
}

export default NudgeProvider;