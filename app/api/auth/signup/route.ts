import { NextResponse } from "next/server"

import {
  createSessionToken,
  isValidEmail,
  normalizeProfileName,
  PROFILE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  serializeProfileCookie,
} from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string }
    | null

  const name = body?.name?.trim() ?? ""
  const email = body?.email?.trim() ?? ""
  const password = body?.password ?? ""

  if (name.length === 0 || !isValidEmail(email) || password.length < 6) {
    return NextResponse.json(
      { ok: false, message: "Enter your name, a valid email, and password (min 6 chars)." },
      { status: 400 }
    )
  }

  // Prototype auth: accept any signup details, issue a session cookie.
  const response = NextResponse.json({ ok: true })
  const profile = {
    name: normalizeProfileName(name, email),
    email,
  }
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  response.cookies.set({
    name: PROFILE_COOKIE_NAME,
    value: serializeProfileCookie(profile),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}

