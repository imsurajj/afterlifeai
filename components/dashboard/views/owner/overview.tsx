"use client"

import { Shield, Users, Clock, FileText, Activity, AlertTriangle, ChevronRight, Plus, TrendingUp, Lock, Bell, X, Save } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NOMINEES = [
  { name: "Priya Sharma", initials: "PS", relation: "Spouse", status: "verified" },
  { name: "Rahul Mehta", initials: "RM", relation: "Son", status: "pending" },
]

const ACTIVITY = [
  { dot: true, text: "Nominee added — Priya Sharma (Spouse)", time: "2d ago", type: "success" },
  { dot: false, text: "Gmail credential updated", time: "5d ago", type: "info" },
  { dot: false, text: "Inactivity trigger set — 90 days", time: "1w ago", type: "info" },
  { dot: true, text: "HDFC bank account stored", time: "1w ago", type: "success" },
  { dot: false, text: "LIC policy details added", time: "2w ago", type: "info" },
  { dot: true, text: "Vault created and encrypted", time: "2w ago", type: "success" },
]

const ASSETS = [
  { cat: "Credentials", count: 6, icon: "🔑", color: "bg-primary/10 text-primary" },
  { cat: "Banking", count: 2, icon: "🏦", color: "bg-blue-500/10 text-blue-500" },
  { cat: "Insurance", count: 2, icon: "🛡️", color: "bg-amber-500/10 text-amber-500" },
  { cat: "Documents", count: 2, icon: "📄", color: "bg-purple-500/10 text-purple-500" },
]

export function OwnerOverview() {
  const { setActiveView } = useDashboard()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div className="flex z-0 h-full flex-col gap-px overflow-y-auto bg-border hide-scrollbar">

      {/* ── Row 0: 72h hold notice ── */}
      <div className="flex items-center gap-3 bg-amber-500/5 px-5 py-3 border-b border-amber-500/10">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs text-amber-600 dark:text-amber-400">
          <span className="font-semibold">72-hour mandatory hold:</span> Nominees receive an SMS alert upon death registration, but access to the vault is delayed for 72 hours.
        </p>
      </div>

      {/* ── Row 1: 4 stat cells ── */}
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {/* Vault */}
        <div className="flex flex-col gap-4 bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">Active</p>
            <p className="text-xs text-muted-foreground">Vault Status</p>
          </div>
          <p className="text-[10px] text-muted-foreground">AES-256 · Zero-knowledge</p>
        </div>

        {/* Nominees */}
        <button onClick={() => setActiveView("nominees")} className="group flex flex-col gap-4 bg-background p-5 text-left hover:bg-muted/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground">Nominees</p>
          </div>
          <p className="text-[10px] text-muted-foreground">1 verified · 1 pending</p>
        </button>

        {/* Assets */}
        <button onClick={() => setActiveView("vault")} className="group flex flex-col gap-4 bg-background p-5 text-left hover:bg-muted/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <FileText className="h-4 w-4 text-amber-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Stored Assets</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Credentials · Banking · Docs</p>
        </button>

        {/* Trigger */}
        <button onClick={() => setActiveView("triggers")} className="group flex flex-col gap-4 bg-background p-5 text-left hover:bg-muted/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">90d</p>
            <p className="text-xs text-muted-foreground">Inactivity Trigger</p>
          </div>
          <p className="text-[10px] text-muted-foreground">1 trigger active</p>
        </button>
      </div>

      {/* ── Row 2: Main content area ── */}
      <div className="grid flex-1 grid-cols-1 gap-px lg:grid-cols-3">

        {/* Activity feed — left 2/3 */}
        <div className="flex flex-col bg-background p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Recent Activity</span>
            </div>
            <button onClick={() => setActiveView("audit")} className="text-xs text-primary hover:underline">View full log</button>
          </div>
          <div className="overflow-y-auto max-h-[280px] space-y-0 hide-scrollbar scroll-smooth">
            {ACTIVITY.map((a, i) => (
              <div key={i} className={`flex items-center gap-4 py-3 ${i < ACTIVITY.length - 1 ? "border-b border-border/30" : ""}`}>
                <div className={`h-2 w-2 shrink-0 rounded-full ${a.dot ? "bg-primary" : "bg-border"}`} />
                <p className="flex-1 text-xs text-foreground/80 truncate">{a.text}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
          {/* Asset breakdown */}
          <div className="mt-4 border-t border-border/40 pt-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Asset Breakdown</p>
            <div className="grid grid-cols-4 gap-2">
              {ASSETS.map((a) => (
                <button key={a.cat} onClick={() => setActiveView("vault")}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 p-2.5 hover:bg-muted/30 transition-colors">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${a.color}`}>
                    <span className="text-sm">{a.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{a.count}</p>
                  <p className="text-[10px] text-muted-foreground">{a.cat}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — nominees + security */}
        <div className="flex flex-col gap-px bg-border">
          {/* Nominees */}
          <div className="flex flex-col bg-background p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Nominees</span>
              </div>
              <button onClick={() => setActiveView("nominees")} className="text-xs text-primary hover:underline">Manage</button>
            </div>
            <div className="space-y-2.5">
              {NOMINEES.map((n) => (
                <div key={n.name} className="flex items-center gap-3 rounded-xl border border-border/40 px-3 py-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {n.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{n.name}</p>
                    <p className="text-[10px] text-muted-foreground">{n.relation}</p>
                  </div>
                  <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${n.status === "verified" ? "bg-primary" : "bg-border"}`} />
                </div>
              ))}
              <button onClick={() => setActiveView("nominees")}
                className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border/50 px-3 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add nominee
              </button>
            </div>
          </div>

          {/* Security status */}
          <div className="flex flex-1 flex-col bg-background p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Security Status</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Vault Encryption", ok: true },
                { label: "OTP Enabled", ok: true },
                { label: "Face Verification", ok: true },
                { label: "Biometric ID", ok: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className={`text-[10px] font-medium ${s.ok ? "text-primary" : "text-amber-500"}`}>
                    {s.ok ? "✓ Active" : "○ Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Quick actions ── */}
      <div className="grid grid-cols-2 gap-px sm:grid-cols-4 shrink-0">
        {[
          { label: "Add Credential", icon: "🔑", color: "bg-primary/10 text-primary", sub: "Store a password", view: "vault" as const },
          { label: "Add Nominee", icon: "👤", color: "bg-blue-500/10 text-blue-500", sub: "Grant vault access", view: "nominees" as const },
          { label: "Set Trigger", icon: "⏱", color: "bg-purple-500/10 text-purple-500", sub: "Inactivity window", view: "triggers" as const },
          { label: "Upload Doc", icon: "📄", color: "bg-amber-500/10 text-amber-500", sub: "ID, insurance, will", view: "vault" as const },
        ].map((a) => (
          <button key={a.label} onClick={() => setActiveModal(a.view)}
            className="group flex items-center gap-3.5 bg-background px-5 py-4 text-left hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${a.color}`}>
              <span className="text-lg">{a.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground transition-colors group-hover:text-foreground/80">{a.label}</p>
              <p className="truncate text-[10px] text-muted-foreground">{a.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Action Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                <h3 className="font-semibold text-foreground">
                  {activeModal === "vault" ? "Add to Vault" : 
                   activeModal === "nominees" ? "Add Nominee" : 
                   "Set Trigger Config"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {activeModal === "vault" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Item Name</label>
                      <input type="text" autoFocus className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" placeholder="e.g. Ledger Wallet Seed" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Secure Payload</label>
                      <textarea className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" rows={3} placeholder="Encrypted content here..." />
                    </div>
                  </>
                )}
                {activeModal === "nominees" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nominee Full Name</label>
                      <input type="text" autoFocus className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Details</label>
                      <input type="email" className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" placeholder="jane@example.com / +1 234 567 8900" />
                    </div>
                  </>
                )}
                {activeModal === "triggers" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inactivity Threshold (Days)</label>
                      <input type="number" autoFocus className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" placeholder="90" defaultValue="90" />
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted-foreground text-amber-500/80">Wait this many days without any user activity to automatically initiate vault transfer to nominees.</p>
                  </>
                )}
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setActiveModal(null)
                      // Optionally navigate or show toast
                      setActiveView(activeModal as "vault"|"nominees"|"triggers")
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    Save & Encrypt
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
