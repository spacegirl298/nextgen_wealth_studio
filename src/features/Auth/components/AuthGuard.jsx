/*Redirects unauthenticated users to login, and if authenticated renders the children*/
import { Navigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../../context/UserContext" // This will now work

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useContext(UserContext)
  const location = useLocation()

  if (!isAuthenticated) {
    // saves the page user is on, to redirect them back to their page once they have logged in
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}