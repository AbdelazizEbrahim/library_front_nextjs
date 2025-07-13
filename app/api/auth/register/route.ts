import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Mock registration - in real app, save to database
    console.log("Registering user:", userData)

    // Simulate successful registration
    return NextResponse.json({
      message: "User registered successfully",
      userId: Date.now().toString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
