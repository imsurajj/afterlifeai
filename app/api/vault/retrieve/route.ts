import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vaultItems, kycRecords, users } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const aadhaar = searchParams.get("aadhaar") 
  const categories = searchParams.get("categories")?.split(",") || []

  if (!aadhaar) return NextResponse.json({ ok: false, message: "Missing identification" }, { status: 400 })

  try {
    const rawAadhaar = aadhaar.replace(/\s/g, "")
    const masked = `XXXX-XXXX-${rawAadhaar.slice(-4)}`

    const [kyc] = await db.select().from(kycRecords).where(eq(kycRecords.maskedAadhaar, masked)).limit(1)

    if (!kyc) return NextResponse.json({ ok: true, data: {} })

    const items = await db.select().from(vaultItems).where(
      and(
        eq(vaultItems.userId, kyc.userId),
        categories.length > 0 ? inArray(vaultItems.category, categories) : undefined
      )
    )

    // Group items with separate identifier and secret fields
    const grouped = items.reduce((acc: any, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push({
        title: item.title,
        identifier: item.username,
        secret: item.content
      })
      return acc
    }, {})

    return NextResponse.json({ ok: true, data: grouped })
  } catch (err) {
    console.error("Retrieval error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
