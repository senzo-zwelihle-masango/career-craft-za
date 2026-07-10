"use client"

import { createContext, useContext } from "react"

export type AuthUser = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

const AuthContext = createContext<AuthUser | null>(null)

export function AuthProvider({
  user,
  children,
}: {
  user: AuthUser
  children: React.ReactNode
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuthUser() {
  return useContext(AuthContext)
}
