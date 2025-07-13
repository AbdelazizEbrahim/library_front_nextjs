"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "librarian" | "member"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  membershipId?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database - update in the login route as well
const mockUsers = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@library.com",
    password: "admin123",
    role: "admin" as const,
    permissions: ["system_config", "user_management", "all_reports", "backup_restore"],
  },
  {
    id: "2",
    name: "Head Librarian",
    email: "librarian@library.com",
    password: "lib123",
    role: "librarian" as const,
    membershipId: "LIB001",
    permissions: ["book_management", "member_management", "loan_management", "basic_reports"],
  },
  {
    id: "3",
    name: "John Member",
    email: "member@library.com",
    password: "mem123",
    role: "member" as const,
    membershipId: "MEM001",
    phone: "+1-555-0123",
    permissions: ["browse_books", "reserve_books", "view_own_loans"],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock API call - replace with real API
      const foundUser = mockUsers.find((user) => user.email === email && user.password === password)

      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("user", JSON.stringify(foundUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Mock API call - replace with real API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      return response.ok
    } catch (error) {
      console.error("Register error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
