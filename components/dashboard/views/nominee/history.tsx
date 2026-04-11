"use client"

import { Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ACCESSES = [
  {
    id: 1,
    deceased: "Rahul Yadav",
    certNo: "DC-2077-BGLR-001",
    accessed: "2 hours ago",
    depts: ["Bank & EPFO", "Stocks & Equity", "Social & Personal"],
    status: "completed",
    window: "89 days remaining",
    logs: [
      { time: "11:15 AM", action: "Aadhaar e-KYC Verification", status: "success" },
      { time: "11:17 AM", action: "Death Certificate Validation", status: "success" },
      { time: "11:18 AM", action: "Biometric Face Match", status: "success" },
      { time: "11:20 AM", action: "Unlocked 'Bank & EPFO' cluster", status: "unlocked" },
      { time: "11:22 AM", action: "Retrieved ICICI Savings details", status: "retrieved" },
      { time: "11:25 AM", action: "Unlocked 'Social & Personal' cluster", status: "unlocked" },
      { time: "11:26 AM", action: "Retrieved Primary Gmail password", status: "retrieved" },
    ]
  },
]

export function NomineeHistory() {
  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">Access Ledger</h2>
          <p className="text-[9px] text-muted-foreground uppercase mt-1 tracking-widest font-bold opacity-40">Cryptographic audit trail • Session RY-2077</p>
        </div>
        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[8px] font-black py-0.5 px-3 tracking-[0.2em]">LIVE</Badge>
      </div>

      <div className="space-y-1">
        {ACCESSES[0].logs.map((L, i) => (
          <div key={i} className="flex items-center gap-6 py-3 px-4 rounded-lg hover:bg-muted/10 transition-colors group relative overflow-hidden">
            <div className="font-mono text-[9px] text-muted-foreground w-14 opacity-30 group-hover:opacity-100 transition-opacity tabular-nums">{L.time}</div>
            <div className="h-1 w-1 rounded-full bg-border group-hover:bg-primary transition-colors flex-shrink-0" />
            <div className="flex-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-all">
              {L.action}
            </div>
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {L.status}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-border/40 flex items-center justify-between opacity-30">
        <div className="flex items-center gap-3">
          <Clock className="h-3 w-3" />
          <p className="text-[8px] font-black uppercase tracking-[0.2em]">Purge local cache on disconnect</p>
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.2em]">0 errors • 7 verified nodes</p>
      </div>
    </div>
  )
}
