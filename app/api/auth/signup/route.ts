import { NextResponse } from "next/server"

import { createSessionToken, isValidEmail, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string }
    | null

  const email = body?.email?.trim() ?? ""
  const password = body?.password ?? ""

  if (!isValidEmail(email) || password.length < 6) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email and password (min 6 chars)." },
      { status: 400 }
    )
  }

  // Prototype auth: accept any signup details, issue a session cookie.
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}

