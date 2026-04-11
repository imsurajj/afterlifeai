"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export interface DashboardUser {
  name: string
  email: string
}

export type Role = "owner" | "nominee"

export type OwnerView = "overview" | "vault" | "nominees" | "triggers" | "documents" | "audit"
export type NomineeView = "access" | "sessions" | "history"
export type ActiveView = OwnerView | NomineeView

interface DashboardContextType {
  user: DashboardUser & { kycVerified?: boolean; kycData?: any }
  nominees: any[]
  refreshNominees: () => Promise<void>
  activities: any[]
  refreshActivities: () => Promise<void>
  vaultItems: any[]
  refreshVault: () => Promise<void>
  role: Role
  setRole: (r: Role) => void
  activeView: ActiveView
  setActiveView: (v: ActiveView) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  profileOpen: boolean
  setProfileOpen: (v: boolean) => void
  isAddingNominee: boolean
  setIsAddingNominee: (v: boolean) => void
  updateProfile: (updates: Partial<DashboardUser & { kycVerified?: boolean; kycData?: any }>) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: DashboardUser & { kycVerified?: boolean; kycData?: any }
}) {
  const [user, setUser] = useState<DashboardUser & { kycVerified?: boolean; kycData?: any; role?: Role }>(initialUser)
  const [nominees, setNominees] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [vaultItems, setVaultItems] = useState<any[]>([])
  const [role, setRoleState] = useState<Role>((initialUser as any).role || "owner")
  const [activeView, setActiveView] = useState<ActiveView>((initialUser as any).role === "nominee" ? "access" : "overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isAddingNominee, setIsAddingNominee] = useState(false)

  const refreshNominees = async () => {
     try {
        const res = await fetch("/api/nominees")
        const data = await res.json()
        if (data.ok) setNominees(data.data)
     } catch (err) {
        console.error("Nominee fetch failed", err)
     }
  }

  const refreshActivities = async () => {
    try {
       const res = await fetch("/api/activities")
       const data = await res.json()
       if (data.ok) setActivities(data.data)
    } catch (err) {
       console.error("Activities fetch failed", err)
    }
 }

 const refreshVault = async () => {
    try {
       const res = await fetch("/api/vault")
       const data = await res.json()
       if (data.ok) setVaultItems(data.data)
    } catch (err) {
       console.error("Vault fetch failed", err)
    }
 }

  useEffect(() => {
    if (user) {
        refreshNominees()
        refreshActivities()
        refreshVault()
    }
  }, [])

  function updateProfile(updates: Partial<DashboardUser & { kycVerified?: boolean; kycData?: any }>) {
    setUser(prev => ({ ...prev, ...updates }))
  }

  function setRole(r: Role) {
    setRoleState(r)
    setActiveView(r === "owner" ? "overview" : "access")
    setProfileOpen(false)
  }

  return (
    <DashboardContext.Provider value={{
      user,
      nominees, refreshNominees,
      activities, refreshActivities,
      vaultItems, refreshVault,
      role, setRole,
      activeView, setActiveView,
      sidebarOpen, setSidebarOpen,
      profileOpen, setProfileOpen,
      isAddingNominee, setIsAddingNominee,
      updateProfile,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
