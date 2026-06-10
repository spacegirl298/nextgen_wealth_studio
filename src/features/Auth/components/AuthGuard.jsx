import { Navigate, useLocation } from "react-router-dom"
import { useUser } from "../../../context/UserContext"

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useUser()
  const location = useLocation()


  if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true") {
    return children
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}