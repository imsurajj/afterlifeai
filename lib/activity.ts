import { db } from "./db"
import { activities } from "./db/schema"

export async function logActivity(userId: string, type: string, description: string, metadata?: any) {
  try {
    await db.insert(activities).values({
      userId,
      type,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null,
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
  }
}
