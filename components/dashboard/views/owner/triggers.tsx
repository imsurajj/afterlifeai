"use client"

import { useState } from "react"
import { Clock, Bell, Activity, CheckCircle2, AlertTriangle, ChevronRight, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/components/dashboard/dashboard-context"

const WINDOW_OPTIONS = [
  { label: "30 Days", val: 30 },
  { label: "60 Days", val: 60 },
  { label: "90 Days", val: 90 },
  { label: "180 Days", val: 180 },
  { label: "1 Year", val: 365 },
]

type TriggerStatus = "active" | "inactive"

export function OwnerTriggers() {
  const { user } = useDashboard()
  const [window_, setWindow_] = useState(90)
  
  const [triggers, setTriggers] = useState([
    { id: 1, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Inactivity Monitor", desc: "Initiate transfer if account access is not detected within the window.", config: "90 Days", status: "active" as TriggerStatus, lastCheck: "2d ago" },
    { id: 2, icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10", label: "Legal Document Trigger", desc: "Direct upload of verified death registration by primary nominee.", config: "Enabled", status: "active" as TriggerStatus, lastCheck: "Idle" },
    { id: 3, icon: Activity, color: "text-slate-500", bg: "bg-slate-500/10", label: "Lawyer Consensus", desc: "Authorization through signed cryptographic lawyer bypass.", config: "Not Set", status: "inactive" as TriggerStatus, lastCheck: "Disabled" },
  ])

  function toggleTrigger(id: number) {
    setTriggers(p => p.map(t => t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t))
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">Relinquishment Protocols</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-1">
            Deterministic triggers for autonomous vault transfer
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
           <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Node Monitoring: Enabled</span>
        </div>
      </div>

      {/* Main Window Config */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-xl">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Primary Liveness Window</p>
         
         <div className="flex flex-wrap gap-2 mb-8">
            {WINDOW_OPTIONS.map((opt) => (
               <button
                  key={opt.val}
                  onClick={() => setWindow_(opt.val)}
                  className={cn(
                    "px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    window_ === opt.val 
                      ? "bg-white text-black shadow-lg shadow-white/5" 
                      : "bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-300"
                  )}
               >
                  {opt.label}
               </button>
            ))}
         </div>

         <div className="flex items-start gap-4 rounded-xl bg-amber-500/5 border border-amber-500/10 p-5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
               <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Protocol Warning</p>
               <p className="text-[11px] font-medium text-amber-500/70 leading-relaxed italic">
                 Failure to authenticate for {WINDOW_OPTIONS.find(o => o.val === window_)?.label} will initiate an SMS/Email alert to all nominees. A 72-hour override window will be provided before final decryption is unlocked.
               </p>
            </div>
         </div>
      </div>

      {/* Trigger Ledger */}
      <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
         <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
               <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-16"></th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Transfer Trigger Condition</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-32">Configuration</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-32">Status</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-32 text-right text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
               {triggers.map((t) => (
                  <tr key={t.id} className="group transition-all hover:bg-white/[0.02]">
                     <td className="px-6 py-5">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", t.status === "active" ? "bg-white/5 border-white/10" : "bg-black opacity-20")}>
                           <t.icon className={cn("h-4 w-4", t.status === "active" ? t.color : "text-slate-700")} />
                        </div>
                     </td>
                     <td className="px-6 py-5">
                        <p className={cn("text-[12px] font-bold italic", t.status === "active" ? "text-white" : "text-slate-600")}>{t.label}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-1 max-w-sm">{t.desc}</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.id === 1 ? WINDOW_OPTIONS.find(o => o.val === window_)?.label : t.config}</span>
                     </td>
                     <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                           <div className={cn("h-1 w-1 rounded-full", t.status === "active" ? "bg-primary shadow-[0_0_6px_rgba(255,255,255,0.4)]" : "bg-slate-700")} />
                           <span className={cn("text-[9px] font-black uppercase tracking-widest", t.status === "active" ? "text-primary italic" : "text-slate-700")}>
                              {t.status === "active" ? "Enabled" : "Disabled"}
                           </span>
                        </div>
                     </td>
                     <td className="px-6 py-5 text-right">
                        <button 
                           onClick={() => toggleTrigger(t.id)}
                           className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all active:scale-95",
                             t.status === "active" 
                               ? "border-red-500/20 text-red-500 hover:bg-red-500/10" 
                               : "border-white/10 text-slate-500 hover:text-white hover:bg-white/5"
                           )}
                        >
                           {t.status === "active" ? "Disable" : "Enable"}
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Footer Support */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-slate-700" />
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global Watchdog Latency: 42ms</p>
         </div>
         <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            Request Manual Review Bypass
         </button>
      </div>
    </div>
  )
}
