import { cookies } from "next/headers"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { parseProfileCookie, PROFILE_COOKIE_NAME } from "@/lib/auth"

// The middleware in middleware.ts already redirects unauthenticated users
// to /auth before this page ever renders, so no client-side cookie check needed.
export default async function DashboardPage() {
  return <DashboardShell />
}
