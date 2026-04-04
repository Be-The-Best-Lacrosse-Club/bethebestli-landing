import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User } from "@/types"
import * as authLib from "@/lib/auth"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  requestPasswordRecovery: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, check for an existing session
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // First try synchronous recovery (fast, from localStorage)
        const syncUser = authLib.getCurrentUser()
        if (syncUser && !cancelled) {
          setUser(syncUser)
        }
        // Then validate the session is still good (checks token expiry)
        const validUser = await authLib.validateSession()
        if (!cancelled) {
          setUser(validUser)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const u = await authLib.login(email, password)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    await authLib.logout()
    setUser(null)
  }, [])

  const requestPasswordRecovery = useCallback(async (email: string) => {
    await authLib.requestPasswordRecovery(email)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        requestPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
