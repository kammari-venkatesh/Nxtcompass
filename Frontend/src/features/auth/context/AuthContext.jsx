import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    restoreSession()
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)

    localStorage.setItem("nxt_user", JSON.stringify(userData))
    localStorage.setItem("nxt_token", jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem("nxt_user")
    localStorage.removeItem("nxt_token")
  }

  const restoreSession = () => {
    try {
      const storedUser = localStorage.getItem("nxt_user")
      const storedToken = localStorage.getItem("nxt_token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error("Failed to restore session:", error)
      localStorage.removeItem("nxt_user")
      localStorage.removeItem("nxt_token")
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("nxt_user", JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        restoreSession,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export default AuthContext
