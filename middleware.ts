import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE_NAME } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hasSession = request.cookies.get(SESSION_COOKIE_NAME)?.value != null

  // Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      url.searchParams.set("next", `${pathname}${search}`)
      return NextResponse.redirect(url)
    }
  }

  // If logged in, keep user out of /auth
  if (pathname === "/auth") {
    if (hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
}

