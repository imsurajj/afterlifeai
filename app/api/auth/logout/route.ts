import { NextResponse } from "next/server"

import { PROFILE_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  response.cookies.set({
    name: PROFILE_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}

