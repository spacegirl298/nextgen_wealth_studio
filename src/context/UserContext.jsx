/*Global user session and profile state.
–	Stores: userId, displayName, email, isAuthenticated
–	Stores: bankingDNAProfile (set after Banking DNA completion)
–	Stores: preferredTrack
–	Exposes: login(user), logout(), updateProfile(data)
–	Persists auth state to localStorage so session survives refresh
*/
import React, { createContext, useState, useContext, useMemo } from "react";

// Create the UserContext
export const UserContext = createContext(null);

// Custom hook for using the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage on initial render
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    return savedAuth === "true";
  });

  const [bankingDNAProfile, setBankingDNAProfile] = useState(() => {
    const savedProfile = localStorage.getItem("bankingDNAProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [preferredTrack, setPreferredTrack] = useState(() => {
    const savedTrack = localStorage.getItem("preferredTrack");
    return savedTrack || null;
  });

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setBankingDNAProfile(null);
    setPreferredTrack(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("bankingDNAProfile");
    localStorage.removeItem("preferredTrack");
  };

  const updateProfile = (data) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateBankingDNAProfile = (profile) => {
    setBankingDNAProfile(profile);
    localStorage.setItem("bankingDNAProfile", JSON.stringify(profile));
  };

  const updatePreferredTrack = (track) => {
    setPreferredTrack(track);
    localStorage.setItem("preferredTrack", track);
  };

  const value = useMemo(() => ({
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
  }), [user, isAuthenticated, bankingDNAProfile, preferredTrack]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Default export for backward compatibility
export default UserProvider;