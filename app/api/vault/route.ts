import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { vaultItems, sessions } from "@/lib/db/schema"
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
    const list = await db.select().from(vaultItems).where(eq(vaultItems.userId, userId)).orderBy(desc(vaultItems.createdAt))
    return NextResponse.json({ ok: true, data: list })
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUser()
  if (!userId) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })

  try {
    const { category, title, username, content, url, icon } = await req.json()

    if (!category || !title || !content) {
      return NextResponse.json({ ok: false, message: "Category, Title and Content are required" }, { status: 400 })
    }

    const [newItem] = await db.insert(vaultItems).values({
      userId,
      category,
      type: "credential",
      title,
      content,
      username: username || "",
      url: url || "",
      icon: icon || "🔑",
    }).returning()

    await logActivity(userId, "vault_add", `Secured new item: ${title}`)

    return NextResponse.json({ ok: true, data: newItem })
  } catch (error) {
    console.error("Vault add error:", error)
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 })
  }
}
