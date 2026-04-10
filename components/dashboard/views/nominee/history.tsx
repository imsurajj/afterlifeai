"use client"

import { Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ACCESSES = [
  {
    id: 1,
    deceased: "Ramesh Kumar Sharma",
    certNo: "DC/2024/DL/00471",
    accessed: "4 days ago",
    depts: ["Bank & EPFO", "Insurance", "Pension"],
    status: "completed",
    window: "87 days remaining",
  },
]

export function NomineeHistory() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">My Accesses</h2>
        <p className="text-xs text-muted-foreground">History of all deceased persons whose vaults you have accessed.</p>
      </div>

      {ACCESSES.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 py-16 text-center">
          <Clock className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No access records yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Your verified accesses will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ACCESSES.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{a.deceased}</p>
                    <Badge variant={a.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                      {a.status === "completed"
                        ? <><CheckCircle2 className="h-2.5 w-2.5 mr-1" />Completed</>
                        : a.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Death Cert: {a.certNo}</p>
                  <p className="text-xs text-muted-foreground">Accessed: {a.accessed} · {a.window}</p>
                </div>
                <button className="flex items-center gap-1.5 rounded-xl border border-border/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> View Records
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.depts.map((d) => (
                  <span key={d} className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          All access attempts are permanently logged and cannot be modified. Dispute any unauthorized access by contacting support.
        </p>
      </div>
    </div>
  )
}
