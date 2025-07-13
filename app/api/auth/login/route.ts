import { type NextRequest, NextResponse } from "next/server"

// Mock users database
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user by email and password (in real app, hash passwords)
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token: "mock-jwt-token",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
