"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Shield, Users, Clock, FileText,
  Activity, Settings, KeyRound, Monitor, History,
  ChevronRight, LogOut, User, Moon, Sun, X
} from "lucide-react"
import { useTheme } from "next-themes"
import { useDashboard, type ActiveView, type Role } from "@/components/dashboard/dashboard-context"
import { cn } from "@/lib/utils"

const OWNER_NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "vault", label: "My Vault", icon: Shield },
  { id: "nominees", label: "Nominees", icon: Users },
  { id: "triggers", label: "Triggers", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "audit", label: "Audit Log", icon: Activity },
] as const

const NOMINEE_NAV = [
  { id: "access", label: "Access Request", icon: KeyRound },
  { id: "sessions", label: "Active Sessions", icon: Monitor },
  { id: "history", label: "My Accesses", icon: History },
] as const

const USER = { name: "Arjun Mehta", email: "arjun@example.com" }

export function Sidebar() {
  const router = useRouter()
  const { role, activeView, setActiveView, sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen } = useDashboard()
  const { resolvedTheme, setTheme } = useTheme()
  const [loggingOut, setLoggingOut] = useState(false)
  const nav = role === "owner" ? OWNER_NAV : NOMINEE_NAV

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  function NavItem({ id, label, icon: Icon }: { id: ActiveView; label: string; icon: React.ElementType }) {
    const active = activeView === id
    return (
      <button
        onClick={() => { setActiveView(id); setSidebarOpen(false) }}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
          active
            ? "bg-primary text-primary-foreground font-medium shadow-sm"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
        {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
      </button>
    )
  }

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border/60 px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6.5 3-1 5.5-3.5 5.5-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-foreground">Afterlife AI</span>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto rounded-lg p-1 text-muted-foreground hover:text-foreground lg:hidden">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Role label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {role === "owner" ? "Vault Owner" : "Nominee"}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-2">
        {nav.map((item) => (
          <NavItem key={item.id} id={item.id as ActiveView} label={item.label} icon={item.icon} />
        ))}
      </nav>

      {/* Profile block */}
      <div 
        className="border-t border-border/60 p-3 relative z-50"
        onMouseEnter={() => setProfileOpen(true)}
        onMouseLeave={() => setProfileOpen(false)}
      >
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-sm transition-colors hover:bg-muted/60"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {USER.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-foreground">{USER.name}</p>
              <p className="truncate text-xs text-muted-foreground">{USER.email}</p>
            </div>
            <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", profileOpen && "rotate-90")} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-0 left-full ml-3 w-56 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl"
              >
                <div className="border-b border-border/40 px-3 py-2.5">
                  <p className="text-xs font-semibold text-foreground">{USER.name}</p>
                  <p className="text-xs text-muted-foreground">{USER.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs hover:bg-muted/60 text-foreground/80 hover:text-foreground">
                    <User className="h-3.5 w-3.5" /> Profile Settings
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs hover:bg-muted/60 text-foreground/80 hover:text-foreground">
                    <Settings className="h-3.5 w-3.5" /> Security
                  </button>
                  <button
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                  >
                    {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                  <div className="border-t border-border/40 pt-1" />
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-destructive hover:bg-destructive/5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {loggingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-background lg:flex lg:flex-col">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-border/60 bg-background lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
