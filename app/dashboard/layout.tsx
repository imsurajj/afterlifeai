import { cookies } from "next/headers"
import { parseProfileCookie, PROFILE_COOKIE_NAME } from "@/lib/auth"
import { DashboardProvider } from "@/components/dashboard/dashboard-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const profile = parseProfileCookie(cookieStore.get(PROFILE_COOKIE_NAME)?.value) ?? {
    name: "Vault User",
    email: "vault@example.com",
    kycVerified: false,
  }

  return (
    <DashboardProvider initialUser={profile}>
      {children}
    </DashboardProvider>
  )
}
