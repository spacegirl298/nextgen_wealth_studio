/*
  UserContext.jsx
  – Stores: userId, displayName, email, isAuthenticated
  – Stores: bankingDNAProfile (set after Banking DNA completion)
  – Stores: preferredTrack
  – Exposes: login(user), logout(), updateProfile(data)
  – Persists auth state to localStorage so session survives refresh
*/

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useMemo, useCallback } from "react";

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
      const saved = localStorage.getItem("bankingDNAProfile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [preferredTrack, setPreferredTrack] = useState(() => {
    return localStorage.getItem("preferredTrack") || null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("auth_session", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setBankingDNAProfile(null);
    setPreferredTrack(null);
    localStorage.removeItem("auth_session");
    localStorage.removeItem("bankingDNAProfile");
    localStorage.removeItem("preferredTrack");
  }, []);

  const updateProfile = useCallback((data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("auth_session", JSON.stringify(updated));

    // Also update the persisted user record so it's reflected on next login
    try {
      const users = JSON.parse(localStorage.getItem("auth_users") || "{}");
      if (users[user.email]) {
        users[user.email] = { ...users[user.email], ...data };
        localStorage.setItem("auth_users", JSON.stringify(users));
      }
    } catch { /* silent */ }
  }, [user]);

  const updateBankingDNAProfile = useCallback((profile) => {
    setBankingDNAProfile(profile);
    localStorage.setItem("bankingDNAProfile", JSON.stringify(profile));
  }, []);

  const updatePreferredTrack = useCallback((track) => {
    setPreferredTrack(track);
    localStorage.setItem("preferredTrack", track);
  }, []);

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
    }),
    [user, isAuthenticated, bankingDNAProfile, preferredTrack, login, logout, updateProfile, updateBankingDNAProfile, updatePreferredTrack]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;