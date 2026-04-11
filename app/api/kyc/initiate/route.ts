import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { aadhaarNumber } = await req.json()
    const apiKey = process.env.SUREPASS_API_KEY

    // FOR HACKATHON: Simulation Mode
    if (!apiKey) {
      const mockClientId = "mock_client_" + Math.random().toString(36).slice(2)
      console.log("\n--- AADHAAR KYC SIMULATION ---")
      console.log("OUTGOING TO: https://sandbox.surepass.io/api/v1/aadhaar-v2/generate-otp")
      console.log("PAYLOAD:", JSON.stringify({ id_number: aadhaarNumber }, null, 2))
      console.log("STATUS: Generating OTP via UIDAI...")
      console.log("OTP GENERATED: 123456")
      console.log("CLIENT_ID:", mockClientId)
      console.log("-------------------------------\n")
      
      return NextResponse.json({
        success: true,
        data: { client_id: mockClientId },
        message: "OTP sent successfully. Check console (OTP: 123456)"
      })
    }

    // REAL IMPLEMENTATION
    const response = await fetch("https://sandbox.surepass.io/api/v1/aadhaar-v2/generate-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ id_number: aadhaarNumber })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}
