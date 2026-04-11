import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { SESSION_COOKIE_NAME, PROFILE_COOKIE_NAME, serializeProfileCookie } from "@/lib/auth"
// Use built-in crypto instead of uuid package

export async function GET() {
  const cookieStore = await cookies()

  try {
    // 1. Find a demo user (Rahul Yadav is the main one, but we can log in as anyone)
    // For "Nominee Mode", let's ensure we have a user with role 'nominee'
    let [demoUser] = await db.select().from(users).where(eq(users.email, "rahulyadav2077@outlook.com")).limit(1)

    if (!demoUser) {
        // Fallback or create if totally empty
        return NextResponse.json({ ok: false, message: "Run 'Initialize Demo' first from profile menu." }, { status: 400 })
    }

    // 2. Create session
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    await db.insert(sessions).values({
      userId: demoUser.id,
      token,
      expiresAt,
    })

    // 3. Set cookies
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // Set profile cookie (Force role to 'nominee' for this redirect demo)
    const profile = {
      name: demoUser.name,
      email: demoUser.email,
      role: "nominee", // Redirecting to nominee page
      kycVerified: true,
    }

    cookieStore.set(PROFILE_COOKIE_NAME, serializeProfileCookie(profile), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // 4. Redirect to dashboard
    const url = new URL("/dashboard", "http://localhost:3000") // URL base will be ignored by redirect
    return NextResponse.redirect(new URL("/dashboard", "http://localhost:3000")) 
  } catch (err) {
    console.error("Demo login error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
