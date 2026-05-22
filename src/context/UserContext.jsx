/*Global user session and profile state.
–	Stores: userId, displayName, email, isAuthenticated
–	Stores: bankingDNAProfile (set after Banking DNA completion)
–	Stores: preferredTrack
–	Exposes: login(user), logout(), updateProfile(data)
–	Persists auth state to localStorage so session survives refresh
*/