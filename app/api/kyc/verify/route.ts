import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, sessions, kycRecords } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PROFILE_COOKIE_NAME, SESSION_COOKIE_NAME, parseProfileCookie, serializeProfileCookie } from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(req: Request) {
  try {
    const { clientId, otp } = await req.json()
    const apiKey = process.env.SUREPASS_API_KEY
    
    let kycData: any

    if (!apiKey) {
      // Simulation Mode
      if (otp !== "123456") {
          return NextResponse.json({ success: false, message: "Invalid OTP. Use 123456 for demo." }, { status: 400 })
      }
      kycData = {
        full_name: "Rahul Yadav",
        dob: "12-05-1972",
        gender: "M",
        address: {
            house: "House 68",
            street: "Street 31",
            dist: "Bangalore",
            state: "Karnataka",
            pc: "560001"
        },
        aadhaar_number: "XXXX-XXXX-7738"
      }
    } else {
      // Real Surepass Verification
      const response = await fetch("https://sandbox.surepass.io/api/v1/aadhaar-v2/submit-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ client_id: clientId, otp: otp })
      })

      const resJson = await response.json()
      if (!resJson.success) {
          return NextResponse.json(resJson, { status: 400 })
      }
      kycData = resJson.data
    }

    const formattedAddress = typeof kycData.address === 'string' 
      ? kycData.address 
      : `${kycData.address.house}, ${kycData.address.street}, ${kycData.address.dist}, ${kycData.address.state}`

    // SAVE TO DATABASE
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (sessionToken) {
      // Find user via session
      const [session] = await db.select().from(sessions).where(eq(sessions.token, sessionToken)).limit(1)
      
      if (session) {
        // Upsert KYC Record
        const existingKyc = await db.select().from(kycRecords).where(eq(kycRecords.userId, session.userId)).limit(1)
        
        if (existingKyc.length > 0) {
          await db.update(kycRecords).set({
            verified: true,
            aadhaarName: kycData.full_name,
            maskedAadhaar: kycData.aadhaar_number || "XXXX-XXXX-1234",
            dob: kycData.dob,
            address: formattedAddress,
            verifiedAt: new Date(),
          }).where(eq(kycRecords.userId, session.userId))
        } else {
          await db.insert(kycRecords).values({
            userId: session.userId,
            verified: true,
            aadhaarName: kycData.full_name,
            maskedAadhaar: kycData.aadhaar_number || "XXXX-XXXX-1234",
            dob: kycData.dob,
            address: formattedAddress,
            verifiedAt: new Date(),
          })
        }
        
        await logActivity(session.userId, "kyc_success", "e-KYC verification completed successfully")
      }
    }

    // UPDATE THE SESSION COOKIE (for immediate UI update)
    const currentProfile = parseProfileCookie(cookieStore.get(PROFILE_COOKIE_NAME)?.value)
    
    if (currentProfile) {
        const updatedProfile = {
            ...currentProfile,
            kycVerified: true,
            kycData: {
                aadhaarName: kycData.full_name,
                maskedAadhaar: kycData.aadhaar_number || "XXXX-XXXX-1234",
                dob: kycData.dob,
                address: formattedAddress,
            }
        }
        
        cookieStore.set(PROFILE_COOKIE_NAME, serializeProfileCookie(updatedProfile), {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        })
    }

    return NextResponse.json({ success: true, data: kycData })
  } catch (error) {
    console.error("KYC Verify Error:", error)
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}
