import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * AuthGuard - Route protection component
 * Redirects unauthenticated users to login
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AuthGuard
