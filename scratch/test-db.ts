import "dotenv/config"
import { db } from "../lib/db"
import { users } from "../lib/db/schema"

async function testConnection() {
  try {
    console.log("Checking NeonDB connection...")
    const allUsers = await db.select().from(users)
    console.log("Connection successful!")
    console.log(`Current users in DB: ${allUsers.length}`)
  } catch (error) {
    console.error("Connection failed:", error)
  }
}

testConnection()
