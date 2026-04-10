"use client"

import { useState } from "react"
import { ShieldCheck, KeyRound, User, Activity, AlertTriangle, Clock, Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type LogType = "access" | "auth" | "change" | "system"

const ALL_LOGS = [
  { id: 1, type: "auth" as LogType, action: "Vault unlocked — successful login", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "Today, 9:14 AM", flag: null },
  { id: 2, type: "change" as LogType, action: "Password credential added — Gmail (google.com)", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "2 days ago, 4:22 PM", flag: null },
  { id: 3, type: "change" as LogType, action: "Nominee added — Priya Sharma (Spouse)", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "3 days ago, 11:08 AM", flag: null },
  { id: 4, type: "access" as LogType, action: "Nominee access attempt — Priya Sharma requested access", by: "Priya Sharma", role: "Nominee", ip: "49.34.12.8", time: "4 days ago, 2:30 PM", flag: null },
  { id: 5, type: "auth" as LogType, action: "OTP sent to registered mobile ••••72", by: "System", role: "System", ip: "—", time: "4 days ago, 2:29 PM", flag: null },
  { id: 6, type: "change" as LogType, action: "HDFC bank account details stored", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "5 days ago, 6:00 PM", flag: null },
  { id: 7, type: "change" as LogType, action: "LIC insurance policy details added", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "5 days ago, 5:30 PM", flag: null },
  { id: 8, type: "system" as LogType, action: "Inactivity trigger configured — 90 day window", by: "Arjun Mehta", role: "Owner", ip: "182.65.4.22", time: "1 week ago, 6:00 PM", flag: null },
  { id: 9, type: "auth" as LogType, action: "Failed login attempt — unrecognized device", by: "Unknown", role: "—", ip: "141.92.4.11", time: "1 week ago, 3:47 AM", flag: "suspicious" },
  { id: 10, type: "auth" as LogType, action: "Failed login — wrong password (2/3 attempts)", by: "Unknown", role: "—", ip: "141.92.4.11", time: "1 week ago, 3:44 AM", flag: "suspicious" },
  { id: 11, type: "access" as LogType, action: "Face verification completed — liveness confirmed", by: "Priya Sharma", role: "Nominee", ip: "49.34.12.8", time: "10 days ago, 4:00 PM", flag: null },
  { id: 12, type: "system" as LogType, action: "Vault created and AES-256 encryption applied", by: "System", role: "System", ip: "—", time: "2 weeks ago, 10:00 AM", flag: null },
]

const TYPE_CONFIG: Record<LogType, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  access: { label: "Access", icon: KeyRound, bg: "bg-blue-500/10", text: "text-blue-500" },
  auth: { label: "Auth", icon: ShieldCheck, bg: "bg-primary/10", text: "text-primary" },
  change: { label: "Change", icon: User, bg: "bg-amber-500/10", text: "text-amber-500" },
  system: { label: "System", icon: Activity, bg: "bg-muted", text: "text-muted-foreground" },
}

const FILTERS = ["All", "Access", "Auth", "Change", "System", "Suspicious"] as const
type Filter = typeof FILTERS[number]

export function OwnerAuditLog() {
  const [filter, setFilter] = useState<Filter>("All")
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = ALL_LOGS.filter((e) => {
    if (filter === "All") return true
    if (filter === "Suspicious") return e.flag === "suspicious"
    return e.type === filter.toLowerCase()
  })

  const counts = {
    All: ALL_LOGS.length,
    Access: ALL_LOGS.filter(e => e.type === "access").length,
    Auth: ALL_LOGS.filter(e => e.type === "auth").length,
    Change: ALL_LOGS.filter(e => e.type === "change").length,
    System: ALL_LOGS.filter(e => e.type === "system").length,
    Suspicious: ALL_LOGS.filter(e => e.flag === "suspicious").length,
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Audit Log</h2>
          <p className="text-xs text-muted-foreground">Immutable record of all vault activity — cannot be modified or deleted.</p>
        </div>
        <button className="flex items-center gap-1.5 self-start rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              f === "Suspicious" && filter !== f && "border-destructive/30 text-destructive/70 hover:text-destructive"
            )}
          >
            {f === "Suspicious" && <AlertTriangle className="h-3 w-3" />}
            {f}
            <span className="ml-0.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-2xl border border-border/60">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-24">Type</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-32">By</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-24">Role</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-28">IP Address</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-36 cursor-pointer hover:text-foreground" onClick={() => setSortAsc(!sortAsc)}>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Timestamp
                </div>
              </th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((entry, i) => {
              const cfg = TYPE_CONFIG[entry.type]
              return (
                <tr
                  key={entry.id}
                  className={cn(
                    "group transition-colors hover:bg-muted/20",
                    entry.flag === "suspicious" && "bg-destructive/3 hover:bg-destructive/5"
                  )}
                >
                  {/* Type badge */}
                  <td className="px-4 py-3">
                    <div className={cn("flex w-fit items-center gap-1.5 rounded-lg px-2 py-1", cfg.bg)}>
                      <cfg.icon className={cn("h-3 w-3", cfg.text)} />
                      <span className={cn("text-[10px] font-semibold", cfg.text)}>{cfg.label}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {entry.flag === "suspicious" && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />}
                      <span className={cn("text-xs leading-relaxed", entry.flag === "suspicious" ? "text-destructive" : "text-foreground/80")}>
                        {entry.action}
                      </span>
                    </div>
                  </td>

                  {/* By */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-foreground">{entry.by}</span>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={entry.role === "Owner" ? "default" : entry.role === "Nominee" ? "secondary" : "outline"}
                      className="text-[10px]"
                    >
                      {entry.role}
                    </Badge>
                  </td>

                  {/* IP */}
                  <td className="px-4 py-3">
                    <span className={cn("font-mono text-[11px]", entry.flag === "suspicious" ? "text-destructive" : "text-muted-foreground")}>
                      {entry.ip}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-muted-foreground">{entry.time}</span>
                  </td>

                  {/* Flag */}
                  <td className="px-4 py-3 text-right">
                    {entry.flag === "suspicious" && (
                      <Badge variant="destructive" className="text-[10px]">⚠ Flagged</Badge>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Showing {filtered.length} of {ALL_LOGS.length} events · Read-only · Logs cannot be modified
      </p>
    </div>
  )
}
