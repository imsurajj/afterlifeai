"use client"

import { useState } from "react"
import { ShieldCheck, KeyRound, User, Activity, AlertTriangle, Clock, Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { formatDistanceToNow } from "date-fns"

type LogType = "access" | "auth" | "change" | "system" | "signup" | "kyc_success" | "nominee_add" | "vault_add" | "login"

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  login: { label: "Security", icon: ShieldCheck, bg: "bg-primary/10", text: "text-primary" },
  auth: { label: "Auth", icon: ShieldCheck, bg: "bg-primary/10", text: "text-primary" },
  signup: { label: "System", icon: Activity, bg: "bg-muted", text: "text-muted-foreground" },
  kyc_success: { label: "Identity", icon: User, bg: "bg-blue-500/10", text: "text-blue-500" },
  nominee_add: { label: "Trust", icon: User, bg: "bg-amber-500/10", text: "text-amber-500" },
  vault_add: { label: "Assets", icon: KeyRound, bg: "bg-emerald-500/10", text: "text-emerald-500" },
  system: { label: "System", icon: Activity, bg: "bg-muted", text: "text-muted-foreground" },
}

const FILTERS = ["All", "Privacy", "Assets", "Access", "System"] as const
type Filter = typeof FILTERS[number]

export function OwnerAuditLog() {
  const { activities, user } = useDashboard()
  const [filter, setFilter] = useState<Filter>("All")

  const filtered = activities.filter((a) => {
    if (filter === "All") return true
    if (filter === "Assets") return a.type === "vault_add"
    if (filter === "Access") return a.type === "nominee_add"
    if (filter === "Privacy") return a.type === "kyc_success" || a.type === "login"
    return true
  })

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">Immutable Ledger</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-1">
            Cryptographic record of all vault transactions for {user.name}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all shadow-xl active:scale-[0.98]">
          <Download className="h-3.5 w-3.5" /> Export SHA-256
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
              filter === f
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "border-white/5 bg-white/[0.02] text-slate-500 hover:text-slate-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-2xl border border-white/5 bg-black/50 backdrop-blur-sm">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-32">Classification</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Security Transaction Event</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-36">Timestamp (Relative)</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-24">Nodes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filtered.length === 0 ? (
               <tr>
                  <td colSpan={4} className="py-24 text-center">
                     <Activity className="h-8 w-8 text-white/5 mx-auto mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No ledger entries found</p>
                  </td>
               </tr>
            ) : (
                filtered.map((a) => {
                  const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.system
                  return (
                    <tr key={a.id} className="group transition-all hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className={cn("flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1", cfg.bg)}>
                          <cfg.icon className={cn("h-3 w-3", cfg.text)} />
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", cfg.text)}>{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-bold text-foreground italic group-hover:text-primary transition-colors">{a.description}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-1">Transaction ID: {a.id.slice(0,8)}...{a.id.slice(-4)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(a.createdAt))} ago
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center gap-1.5 justify-end">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <div className="h-1 w-1 rounded-full bg-primary opacity-40" />
                            <div className="h-1 w-1 rounded-full bg-primary opacity-10" />
                         </div>
                      </td>
                    </tr>
                  )
                })
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
         <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
               <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
               <p className="text-[11px] font-black uppercase tracking-widest text-white italic">Continuous Auditing Protocol Active</p>
               <p className="text-[10px] font-medium text-slate-500 mt-0.5 leading-relaxed">
                  Every interaction within the Afterlife AI ecosystem is serialized and added to our immutable ledger. To maintain zero-knowledge integrity, these records cannot be purged except through total account termination.
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}
