import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { activities, sessions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { SESSION_COOKIE_NAME } from "@/lib/auth"

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
    const list = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(10)
      
    return NextResponse.json({ ok: true, data: list })
  } catch (error) {
    console.error("Activities fetch error:", error)
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 })
  }
}
