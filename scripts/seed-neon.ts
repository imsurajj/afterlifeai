import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "../lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import fs from "fs"
import path from "path"

// Manual .env loading to avoid dependency issues
const envPath = path.join(process.cwd(), ".env.local")
const envContent = fs.readFileSync(envPath, "utf-8")
const databaseUrl = envContent.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.trim()

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not found in .env.local")
  process.exit(1)
}

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  console.log("🚀 Starting direct Neon DB sync...")

  const dataPath = path.join(process.cwd(), "data.json")
  const rawData = fs.readFileSync(dataPath, "utf-8")
  const allRecords = JSON.parse(rawData)

  // We'll take the first 4 people as requested
  const demoPeople = allRecords.slice(0, 4)
  const emails = demoPeople.map((p: any) => p.Email)

  console.log(`📦 Processing ${demoPeople.length} profiles: ${emails.join(", ")}`)

  for (const person of demoPeople) {
    console.log(`👤 Syncing: ${person.Name}...`)

    // 1. Check if user exists or create them
    let [user] = await db.select().from(schema.users).where(eq(schema.users.email, person.Email)).limit(1)

    if (user) {
      // Clear existing records to start fresh
      await db.delete(schema.kycRecords).where(eq(schema.kycRecords.userId, user.id))
      await db.delete(schema.vaultItems).where(eq(schema.vaultItems.userId, user.id))
      await db.delete(schema.nominees).where(eq(schema.nominees.userId, user.id))
      await db.delete(schema.activities).where(eq(schema.activities.userId, user.id))
    } else {
      [user] = await db.insert(schema.users).values({
        name: person.Name,
        email: person.Email,
        passwordHash: "demo_hash", // Not used for demo login usually
        role: "admin",
      }).returning()
    }

    // 2. Insert KYC
    await db.insert(schema.kycRecords).values({
      userId: user.id,
      verified: true,
      aadhaarName: person.Name,
      maskedAadhaar: `XXXX-XXXX-${person.Aadhar.toString().slice(-4)}`,
      dob: person.DOB || person.Age.toString(), // Simplified
      address: person.Address,
      verifiedAt: new Date(),
    })

    // 3. Insert Nominee (if exists in data.json)
    if (person.Nominee_Name) {
      await db.insert(schema.nominees).values({
        userId: user.id,
        name: person.Nominee_Name,
        email: person.Nominee_Name.toLowerCase().replace(" ", ".") + "@demo.com",
        relation: person.Relation || "Family",
        phone: person.Nominee_Phone?.toString(),
        status: "verified",
        access: ["banking", "credentials", "documents"],
      })

      // Add a second mandatory test nominee for the first person only
      if (person.Name === "Rahul Yadav") {
         await db.insert(schema.nominees).values({
            userId: user.id,
            name: "Sunita Sharma",
            email: "sunita.sharma@demo.com",
            relation: "Spouse",
            phone: "9812003344",
            status: "verified",
            access: ["documents", "vault"],
         })
         console.log(`➕ Added second nominee (Sunita Sharma) for ${person.Name}`)
      }
    }

    // 4. Insert Vault Items based on person fields
    const items = []
    if (person.Bank_Account) items.push({ cat: "bank", title: "HDFC Savings Account", content: person.Bank_Account.toString(), username: `Acc: ••••${person.Bank_Account.toString().slice(-4)}`, icon: "🏦" })
    items.push({ cat: "bank", title: "ICICI Fixed Deposit", content: "₹12,40,000", username: "FD: ••••9912", icon: "💰" })
    items.push({ cat: "bank", title: "EPFO UAN", content: "100244192033", username: "UAN Login", icon: "🏛️" })
    
    // Add stocks portfolio
    items.push({ cat: "stocks", title: "Zerodha Holdings", content: "₹14,92,310", username: "ID: ZK29102", icon: "📈" })
    items.push({ cat: "stocks", title: "Groww Mutual Funds", content: "₹8,22,000", username: "Active (5 Funds)", icon: "📊" })

    if (person.PAN) items.push({ cat: "civil", title: "PAN Card", content: person.PAN, username: person.PAN, icon: "📄" })
    if (person.Passport) items.push({ cat: "civil", title: "Passport", content: person.Passport, username: person.Passport, icon: "🪪" })
    
    items.push({ cat: "land", title: "Ancestral Property Deed", content: "Reg: 501/2014/BGLR", username: "Survey No. 24", icon: "🏠" })
    items.push({ cat: "land", title: "DDA Flat Allotment", content: "FLT-9823-SEC10", username: "Sector 10, Rohini", icon: "🏢" })
    
    items.push({ cat: "insurance", title: "LIC Jeevan Anand", content: "Pol: 122849102", username: "Sum: ₹50,00,000", icon: "🛡️" })
    items.push({ cat: "insurance", title: "HDFC Health Care", content: "HH-982310-09", username: "Premium: Paid", icon: "❤️" })

    // Social & Personal Expansion
    if (person.Instagram) items.push({ cat: "credentials", title: "Instagram", content: "rahul_secure_2024", username: `@${person.Instagram}`, icon: "📸" })
    if (person.Facebook) items.push({ cat: "credentials", title: "Facebook", content: "yadav_fb_2024", username: person.Facebook, icon: "👥" })
    items.push({ cat: "credentials", title: "Primary Gmail", content: "RY_SECURE_CLOUD", username: person.Email, icon: "📧" })
    items.push({ cat: "credentials", title: "Mobile / SIM Access", content: "SIM PIN: 0098 | OTP Backup: ON", username: "+91 9120 XXXX 72", icon: "📱" })
    items.push({ cat: "credentials", title: "WhatsApp Business", content: "E2EE Key: RY-2910-W", username: "+91 9120 XXXX 72", icon: "💬" })
    items.push({ cat: "credentials", title: "Twitter / X", content: "x_access_rahul", username: `@${person.Name.toLowerCase().replace(" ", "_")}`, icon: "🐦" })
    items.push({ cat: "credentials", title: "LinkedIn Pro", content: "ln_pro_pass_2024", username: "linkedin.com/in/rahulyadav", icon: "💼" })

    if (person.UPI_ID) items.push({ cat: "bank", title: "UPI Handle", content: person.UPI_ID, username: person.UPI_ID, icon: "💳" })

    for (const item of items) {
      await db.insert(schema.vaultItems).values({
        userId: user.id,
        category: item.cat,
        type: "credential",
        title: item.title,
        content: item.content,
        username: item.username,
        url: "https://secure.vault",
        icon: item.icon,
      })
    }

    // 5. Activity log
    await db.insert(schema.activities).values({
      userId: user.id,
      type: "kyc_success",
      description: "Legacy protocol synchronized with direct cloud push",
    })
  }

  console.log("✅ Neon DB Sync Complete!")
  process.exit(0)
}

main().catch(err => {
  console.error("❌ Sync failed:", err)
  process.exit(1)
})
