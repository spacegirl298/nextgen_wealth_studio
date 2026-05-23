/*Global user session and profile state.
–	Stores: userId, displayName, email, isAuthenticated
–	Stores: bankingDNAProfile (set after Banking DNA completion)
–	Stores: preferredTrack
–	Exposes: login(user), logout(), updateProfile(data)
–	Persists auth state to localStorage so session survives refresh
*/
import React, { createContext, useState, useContext, useMemo } from "react";

export default function UserContext() {
  return <div>Patient Dashboard</div>
}