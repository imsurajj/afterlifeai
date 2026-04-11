import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, sessions, kycRecords, nominees, vaultItems, activities, triggers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { SESSION_COOKIE_NAME, PROFILE_COOKIE_NAME, serializeProfileCookie } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ ok: false, message: "No session found" }, { status: 401 })

  const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1)
  if (!session) return NextResponse.json({ ok: false, message: "Invalid session" }, { status: 401 })

  const userId = session.userId

  try {
    // 1. Wipe current data for this user to avoid duplicates
    await db.delete(kycRecords).where(eq(kycRecords.userId, userId))
    await db.delete(nominees).where(eq(nominees.userId, userId))
    await db.delete(vaultItems).where(eq(vaultItems.userId, userId))
    await db.delete(activities).where(eq(activities.userId, userId))
    await db.delete(triggers).where(eq(triggers.userId, userId))

    const DEMO_USERS = [
      {
        name: "Rahul Yadav",
        email: "rahulyadav2077@outlook.com",
        age: 51,
        address: "House 68, Street 31, Bangalore, India",
        aadhaar: "4031 8120 7738",
        dob: "04-05-1973",
        nominee: "Rahul Verma",
        items: [
          { cat: "banking", title: "HDFC Savings", content: "833285362328", username: "Acc: ••••3280", icon: "🏦" },
          { cat: "documents", title: "PAN Card", content: "UFSCF1956B", username: "UFSCF1956B", icon: "📄" },
          { cat: "credentials", title: "Instagram", content: "rahul_secure_2024", username: "@rahulyadav503", icon: "📸" },
        ]
      },
      {
        name: "Anjali Sharma",
        email: "anjalisharma9106@outlook.com",
        age: 54,
        address: "House 137, Street 11, Pune, India",
        aadhaar: "8696 6087 5328",
        dob: "10-02-1970",
        nominee: "Pooja Sharma",
        items: [
          { cat: "banking", title: "Acc: ••••7697", content: "904257257697", username: "FJIG0030140", icon: "🏦" },
          { cat: "documents", title: "Voter ID", content: "GZK7425092", username: "GZK7425092", icon: "🪪" },
        ]
      },
      {
        name: "Priya Verma",
        email: "priyaverma1404@outlook.com",
        age: 63,
        address: "House 323, Street 25, Mumbai, India",
        aadhaar: "3724 4596 4581",
        dob: "14-04-1961",
        nominee: "Arjun Singh",
        items: [
          { cat: "banking", title: "Acc: ••••2756", content: "115991192756", username: "ARRU0878686", icon: "🏦" },
          { cat: "documents", title: "PAN Card", content: "AFKZR5766P", username: "AFKZR5766P", icon: "📄" },
        ]
      },
      {
        name: "Pooja Agarwal",
        email: "poojaagarwal1148@yahoo.com",
        age: 19,
        address: "House 850, Street 36, Delhi, India",
        aadhaar: "8902 5916 8004",
        dob: "11-08-2005",
        nominee: null,
        items: [
          { cat: "documents", title: "Aadhar", content: "8902 5916 8004", username: "UIDAI", icon: "🪪" },
          { cat: "documents", title: "PAN Card", content: "CFPKD3864Q", username: "CFPKD3864Q", icon: "📄" },
        ]
      }
    ]

    // Use the first user as the current session user
    const mainUser = DEMO_USERS[0]

    // 2. Insert Main User KYC
    await db.insert(kycRecords).values({
      userId,
      verified: true,
      aadhaarName: mainUser.name,
      maskedAadhaar: "XXXX-XXXX-" + mainUser.aadhaar.slice(-4),
      dob: mainUser.dob,
      address: mainUser.address,
      verifiedAt: new Date(),
    })

    // 3. Insert Nominees for Main User
    for (const user of DEMO_USERS) {
       if (user.nominee) {
          await db.insert(nominees).values({
            userId,
            name: user.nominee,
            email: user.nominee.toLowerCase().replace(" ", ".") + "@demo.com",
            relation: "Family",
            phone: "9988776655",
            status: "verified",
            access: ["banking", "credentials", "documents"],
          })
       }
    }

    // 4. Insert Vault Items for Main User (Merging all items for a rich demo experience)
    const allItems = DEMO_USERS.flatMap(u => u.items)
    for (const item of allItems) {
      await db.insert(vaultItems).values({
        userId,
        category: item.cat,
        type: "credential",
        title: item.title,
        content: item.content,
        username: item.username,
        url: "https://secure.vault",
        icon: item.icon,
      })
    }

    // 5. Insert Activities
    await db.insert(activities).values({
        userId,
        type: "signup",
        description: `Legacy Protocol Initialized for ${mainUser.name}`,
    })
    await db.insert(activities).values({
        userId,
        type: "kyc_success",
        description: "Standard biometric e-KYC completed successfully",
    })

    // 6. Insert Trigger
    await db.insert(triggers).values({
        userId,
        daysThreshold: "60",
        status: "active",
    })

    // UPDATE PROFILE COOKIE
    const profile = {
        name: mainUser.name,
        email: mainUser.email,
        kycVerified: true,
        kycData: {
            aadhaarName: mainUser.name,
            maskedAadhaar: "XXXX-XXXX-" + mainUser.aadhaar.slice(-4),
            dob: mainUser.dob,
            address: mainUser.address,
        }
    }
    cookieStore.set(PROFILE_COOKIE_NAME, serializeProfileCookie(profile), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({ ok: true, message: "Dashboard seeded with rich 4-person dataset" })
  } catch (err) {
    console.error("Seeding error:", err)
    return NextResponse.json({ ok: false, message: "Seeding failed" }, { status: 500 })
  }
}
