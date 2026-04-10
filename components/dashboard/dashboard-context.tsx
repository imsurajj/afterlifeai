"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface DashboardUser {
  name: string
  email: string
}

export type Role = "owner" | "nominee"

export type OwnerView = "overview" | "vault" | "nominees" | "triggers" | "documents" | "audit"
export type NomineeView = "access" | "sessions" | "history"
export type ActiveView = OwnerView | NomineeView

interface DashboardContextType {
  user: DashboardUser
  role: Role
  setRole: (r: Role) => void
  activeView: ActiveView
  setActiveView: (v: ActiveView) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  profileOpen: boolean
  setProfileOpen: (v: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: DashboardUser
}) {
  const [user] = useState<DashboardUser>(initialUser)
  const [role, setRoleState] = useState<Role>("owner")
  const [activeView, setActiveView] = useState<ActiveView>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function setRole(r: Role) {
    setRoleState(r)
    setActiveView(r === "owner" ? "overview" : "access")
    setProfileOpen(false)
  }

  return (
    <DashboardContext.Provider value={{
      user,
      role, setRole,
      activeView, setActiveView,
      sidebarOpen, setSidebarOpen,
      profileOpen, setProfileOpen,
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
