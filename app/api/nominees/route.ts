import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { nominees, sessions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { SESSION_COOKIE_NAME } from "@/lib/auth"
import { logActivity } from "@/lib/activity"

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1)
  if (!session || session.expiresAt < new Date()) return null

  return session.userId
}

export async function GET() {
  const userId = await getAuthenticatedUser()
  if (!userId) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })

  try {
    const list = await db.select().from(nominees).where(eq(nominees.userId, userId)).orderBy(desc(nominees.createdAt))
    return NextResponse.json({ ok: true, data: list })
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUser()
  if (!userId) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })

  try {
    const { name, email, relation, phone, access } = await req.json()

    // Enforce 2 nominees limit
    const existing = await db.select().from(nominees).where(eq(nominees.userId, userId))
    if (existing.length >= 2) {
      return NextResponse.json({ ok: false, message: "Nominee limit reached (Max 2)" }, { status: 400 })
    }

    if (!name || !email) {
      return NextResponse.json({ ok: false, message: "Name and Email are required" }, { status: 400 })
    }

    const [newNominee] = await db.insert(nominees).values({
      userId,
      name,
      email: email.toLowerCase(),
      relation: relation || "Contact",
      phone: phone || "",
      access: access || ["documents"],
    }).returning()
    
    await logActivity(userId, "nominee_add", `Added new nominee: ${name}`)

    return NextResponse.json({ ok: true, data: newNominee })
  } catch (error) {
    console.error("Nominee add error:", error)
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 })
  }
}
