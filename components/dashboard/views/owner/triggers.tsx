"use client"

import { useState } from "react"
import { Clock, Bell, Activity, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const WINDOW_OPTIONS = [
  { label: "30 days", val: 30 },
  { label: "60 days", val: 60 },
  { label: "90 days", val: 90 },
  { label: "180 days", val: 180 },
  { label: "1 year", val: 365 },
]

type TriggerStatus = "active" | "inactive"

const INIT_TRIGGERS = [
  { id: 1, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Inactivity Trigger", desc: "Notify nominees if I don't log in within the configured window.", config: "90 days", status: "active" as TriggerStatus, lastCheck: "Checked 2 days ago" },
  { id: 2, icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10", label: "Death Certificate Upload", desc: "Allow a nominee to upload a death registration document to initiate access.", config: "Enabled", status: "active" as TriggerStatus, lastCheck: "Never triggered" },
  { id: 3, icon: Activity, color: "text-muted-foreground", bg: "bg-muted/40", label: "Lawyer Authorization", desc: "A trusted lawyer can authorize access using a signed one-time code.", config: "Not configured", status: "inactive" as TriggerStatus, lastCheck: "Not set up" },
]

export function OwnerTriggers() {
  const [window_, setWindow_] = useState(90)
  const [triggers, setTriggers] = useState(INIT_TRIGGERS)

  function toggleTrigger(id: number) {
    setTriggers(p => p.map(t => t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t))
  }

  return (
    <div className="flex h-full flex-col gap-px bg-border overflow-hidden">

      {/* ── Inactivity window header ── */}
      <div className="flex flex-col gap-4 bg-background px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Access Triggers</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Configure when and how nominees can access your vault after your passing</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">2 Active</span>
          </div>
        </div>

        {/* Inactivity window picker — horizontal strip */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inactivity Window</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {WINDOW_OPTIONS.map((opt) => (
              <button
                key={opt.val}
                onClick={() => setWindow_(opt.val)}
                className={cn(
                  "shrink-0 rounded-xl border px-4 py-2 text-xs font-medium transition-colors",
                  window_ === opt.val
                    ? "border-primary/40 bg-primary text-primary-foreground shadow-sm"
                    : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              If you don't log in for <strong>{WINDOW_OPTIONS.find(o => o.val === window_)?.label}</strong>, nominees will be notified and a 72-hour hold will activate before access is granted.
            </p>
          </div>
        </div>
      </div>

      {/* ── Trigger rows table header ── */}
      <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] items-center gap-4 bg-muted/20 px-5 py-2.5">
        {["", "Trigger", "Config", "Last Event", "Status"].map((h) => (
          <p key={h} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</p>
        ))}
      </div>

      {/* ── Trigger rows ── */}
      <div className="flex-1 divide-y divide-border/40 overflow-y-auto bg-background">
        {triggers.map((t) => (
          <div key={t.id} className="grid grid-cols-[auto_2fr_1fr_1fr_auto] items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
            {/* Icon */}
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.bg)}>
              <t.icon className={cn("h-4 w-4", t.color)} />
            </div>

            {/* Label + desc */}
            <div>
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">{t.desc}</p>
            </div>

            {/* Config */}
            <p className="text-xs text-foreground/70">{t.config}</p>

            {/* Last event */}
            <p className="text-xs text-muted-foreground">{t.lastCheck}</p>

            {/* Toggle */}
            <button
              onClick={() => toggleTrigger(t.id)}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                t.status === "active"
                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {t.status === "active" ? "Active" : "Disabled"}
            </button>
          </div>
        ))}
      </div>

      {/* ── Coming soon row ── */}
      <div className="flex items-center gap-4 bg-background px-5 py-4 border-t border-border/40">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/40">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">More coming soon</p>
          <p className="text-[10px] text-muted-foreground/70">Hospital admission · Family consensus vote · Court order upload</p>
        </div>
      </div>
    </div>
  )
}
