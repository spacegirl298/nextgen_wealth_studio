/*Route wrapper that blocks unauthenticated access.
–	Reads isAuthenticated from UserContext
–	If not authenticated: redirects to /login with current path saved in state
–	If authenticated: renders children (the protected page)
*/