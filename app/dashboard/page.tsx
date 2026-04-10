"use client"

import DashboardShell from "@/components/dashboard/dashboard-shell"

// The middleware in middleware.ts already redirects unauthenticated users
// to /auth before this page ever renders, so no client-side cookie check needed.
export default function DashboardPage() {
  return <DashboardShell />
}
