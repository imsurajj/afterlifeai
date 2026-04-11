import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users, sessions, kycRecords } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  isValidEmail,
  PROFILE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  serializeProfileCookie,
} from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null

  const email = body?.email?.toLowerCase().trim() ?? ""
  const password = body?.password ?? ""

  if (!isValidEmail(email) || password.length < 6) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email and password." },
      { status: 400 }
    )
  }

  try {
    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password." },
        { status: 401 }
      )
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password." },
        { status: 401 }
      )
    }

    // Check KYC status
    const [kyc] = await db.select().from(kycRecords).where(eq(kycRecords.userId, user.id)).limit(1)

    // Create session
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    await db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
    })

    // Log activity
    await logActivity(user.id, "login", "Successful secure login")

    const response = NextResponse.json({ ok: true })
    const profile = {
      name: user.name,
      email: user.email,
      role: user.role,
      kycVerified: !!kyc?.verified,
      kycData: kyc?.verified ? {
        aadhaarName: kyc.aadhaarName || "",
        maskedAadhaar: kyc.maskedAadhaar || "",
        dob: kyc.dob || "",
        address: kyc.address || "",
      } : undefined
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
    console.error("Login error:", error)
    return NextResponse.json(
      { ok: false, message: "An error occurred during login." },
      { status: 500 }
    )
  }
}
