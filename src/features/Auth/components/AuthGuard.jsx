import { Navigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../../context/UserContext"

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useContext(UserContext)
  const location = useLocation()

  // DEV BYPASS — remove before production
  if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true") {
    return children
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}