import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users, sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  isValidEmail,
  normalizeProfileName,
  PROFILE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  serializeProfileCookie,
} from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string }
    | null

  const name = body?.name?.trim() ?? ""
  const email = body?.email?.toLowerCase().trim() ?? ""
  const password = body?.password ?? ""

  if (name.length === 0 || !isValidEmail(email) || password.length < 6) {
    return NextResponse.json(
      { ok: false, message: "Enter your name, a valid email, and password (min 6 chars)." },
      { status: 400 }
    )
  }

  try {
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, message: "An account with this email already exists." },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Insert user
    const [newUser] = await db.insert(users).values({
      name: normalizeProfileName(name, email),
      email,
      passwordHash,
      role: "admin", // Default all new signups to admin/owner
    }).returning()

    // Create session token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    // Save session to DB
    await db.insert(sessions).values({
      userId: newUser.id,
      token,
      expiresAt,
    })

    // Log activity
    await logActivity(newUser.id, "signup", "New account created")
    
    const response = NextResponse.json({ ok: true })
    const profile = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      kycVerified: false,
    }

    // Set cookies
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    response.cookies.set({
      name: PROFILE_COOKIE_NAME,
      value: serializeProfileCookie(profile),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { ok: false, message: "A database error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
