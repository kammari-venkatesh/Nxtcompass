import { createContext, useContext, useState } from "react"

const UserContext = createContext(null)

/**
 * Provider wraps the app
 */
export const UserContextProvider = ({ children }) => {
  const [context, setContext] = useState({
    rank: null,
    category: null,
    homeState: null,
    branches: [],
  })

  const updateContext = (updates) => {
    setContext((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const resetContext = () => {
    setContext({
      rank: null,
      category: null,
      homeState: null,
      branches: [],
    })
  }

  return (
    <UserContext.Provider
      value={{ context, updateContext, resetContext }}
    >
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook to consume context
 */
export const useUserContext = () => {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error(
      "useUserContext must be used inside UserContextProvider"
    )
  }
  return ctx
}
