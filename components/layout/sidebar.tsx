"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, FileText, Calendar, BarChart3, LogOut, Home, Settings, UserCog } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "librarian", "member"] },
  { name: "Books", href: "/books", icon: BookOpen, roles: ["admin", "librarian", "member"] },
  { name: "Members", href: "/members", icon: Users, roles: ["admin", "librarian"] },
  { name: "Loans", href: "/loans", icon: FileText, roles: ["admin", "librarian"] },
  { name: "Reservations", href: "/reservations", icon: Calendar, roles: ["admin", "librarian", "member"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "librarian"] },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role))

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-xl font-bold">Library System</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>

        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
