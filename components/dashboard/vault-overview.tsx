"use client"

import { ShieldCheck, Users, Clock, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Vault Status", value: "Active", icon: ShieldCheck, status: "success" },
  { label: "Nominees Added", value: "2", icon: Users, status: "info" },
  { label: "Triggers Set", value: "1", icon: Clock, status: "info" },
  { label: "Stored Assets", value: "12", icon: FileText, status: "info" },
]

const assets = [
  { category: "Login Credentials", count: 6, icon: "🔑", description: "Email, banking, social accounts" },
  { category: "Hotel Bookings", count: 2, icon: "🏨", description: "Marriott, Taj — confirmed reservations" },
  { category: "Insurance Policies", count: 2, icon: "📋", description: "LIC, HDFC Life policies" },
  { category: "Bank Details", count: 2, icon: "🏦", description: "SBI, HDFC account info" },
]

const nominees = [
  { name: "Priya Sharma", relation: "Spouse", access: "Full Access", status: "verified", added: "14 Feb 2024" },
  { name: "Rahul Sharma", relation: "Son", access: "Partial Access", status: "pending", added: "20 Mar 2024" },
]

export function VaultOverview() {
  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-primary/5 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm text-foreground/80">
          Your vault is <span className="font-semibold text-primary">active and encrypted</span>. Last updated: 2 days ago.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stored assets */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Stored Assets</h3>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-border/30">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
            {assets.map((a) => (
              <div key={a.category} className="flex items-start gap-3 bg-card p-4 hover:bg-muted/40 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{a.category}</p>
                    <Badge variant="secondary" className="shrink-0 text-xs">{a.count}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nominees */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">My Nominees</h3>
        <div className="space-y-2">
          {nominees.map((n) => (
            <div key={n.name} className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {n.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.relation} · Added {n.added}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={n.status === "verified" ? "default" : "secondary"} className="text-xs">
                  {n.status === "verified" ? "Verified" : "Pending"}
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:block">{n.access}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 72-hour hold notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">72-hour hold active after registration</p>
          <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
            After death registration, nominees must wait 72 hours before the access window opens. This prevents race-condition fraud.
          </p>
        </div>
      </div>
    </div>
  )
}
