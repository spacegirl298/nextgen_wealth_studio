
import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../../../hooks/userLocalStorage";

const SimContext = createContext(null);

const DEFAULT_PROFILE = {
  monthlyIncome: 35000,
  housingBudget: 10000,
  savings: 200000,
};

export function SimProvider({ children }) {
  const [profile, setProfileRaw] = useLocalStorage("sim_profile_v1", DEFAULT_PROFILE);

  const setProfile = useCallback(
    (key, value) => setProfileRaw((prev) => ({ ...prev, [key]: value })),
    [setProfileRaw],
  );

  return (
    <SimContext.Provider value={{ profile, setProfile }}>
      {children}
    </SimContext.Provider>
  );
}

export function useSimProfile() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSimProfile must be used inside <SimProvider>");
  return ctx;
}