/*
  UserContext.jsx
  – Stores: userId, displayName, email, isAuthenticated
  – Per-user data isolation: all app data is keyed by userId
  – Exposes: login(user), logout(), updateProfile(data)
  – getUserStorageKey(suffix) — helper for namespaced per-user keys
  – Persists auth state to localStorage so session survives refresh
*/

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useMemo, useCallback } from "react";
import { clearAllAppData } from "../utils/appStorage";

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("auth_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("auth_session");
  });

  const [bankingDNAProfile, setBankingDNAProfile] = useState(() => {
    try {
      const session = localStorage.getItem("auth_session");
      const u = session ? JSON.parse(session) : null;
      if (!u) return null;
      const saved = localStorage.getItem(`bankingDNAProfile_${u.userId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [preferredTrack, setPreferredTrack] = useState(() => {
    try {
      const session = localStorage.getItem("auth_session");
      const u = session ? JSON.parse(session) : null;
      if (!u) return null;
      return localStorage.getItem(`preferredTrack_${u.userId}`) || null;
    } catch {
      return null;
    }
  });


  const getUserStorageKey = useCallback(
    (suffix) => {
      if (!user?.userId) return suffix;
      return `${suffix}_${user.userId}`;
    },
    [user]
  );

  const login = useCallback((userData) => {
    clearAllAppData();
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("auth_session", JSON.stringify(userData));


    try {
      const dna = localStorage.getItem(`bankingDNAProfile_${userData.userId}`);
      setBankingDNAProfile(dna ? JSON.parse(dna) : null);
      const track = localStorage.getItem(`preferredTrack_${userData.userId}`);
      setPreferredTrack(track || null);
    } catch { /* silent */ }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setBankingDNAProfile(null);
    setPreferredTrack(null);
    localStorage.removeItem("auth_session");
    
  }, []);

  const updateProfile = useCallback((data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("auth_session", JSON.stringify(updated));

  
    try {
      const users = JSON.parse(localStorage.getItem("auth_users") || "{}");
      if (users[user.email]) {
        users[user.email] = { ...users[user.email], ...data };
        localStorage.setItem("auth_users", JSON.stringify(users));
      }
    } catch { /* silent */ }
  }, [user]);

  const updateBankingDNAProfile = useCallback((profile) => {
    if (!user) return;
    setBankingDNAProfile(profile);
    localStorage.setItem(`bankingDNAProfile_${user.userId}`, JSON.stringify(profile));
  }, [user]);

  const updatePreferredTrack = useCallback((track) => {
    if (!user) return;
    setPreferredTrack(track);
    localStorage.setItem(`preferredTrack_${user.userId}`, track);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      userId: user?.userId,
      displayName: user?.displayName,
      email: user?.email,
      isAuthenticated,
      bankingDNAProfile,
      preferredTrack,
      login,
      logout,
      updateProfile,
      updateBankingDNAProfile,
      updatePreferredTrack,
      getUserStorageKey,
    }),
    [user, isAuthenticated, bankingDNAProfile, preferredTrack, login, logout, updateProfile, updateBankingDNAProfile, updatePreferredTrack, getUserStorageKey]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;