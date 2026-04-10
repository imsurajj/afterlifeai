"use client"

import { DashboardProvider, useDashboard } from "@/components/dashboard/dashboard-context"
import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { Topbar } from "@/components/dashboard/layout/topbar"
import { Chatbot } from "@/components/dashboard/chatbot"

// Owner views
import { OwnerOverview } from "@/components/dashboard/views/owner/overview"
import { OwnerVault } from "@/components/dashboard/views/owner/my-vault"
import { OwnerNominees } from "@/components/dashboard/views/owner/nominees"
import { OwnerTriggers } from "@/components/dashboard/views/owner/triggers"
import { OwnerAuditLog } from "@/components/dashboard/views/owner/audit-log"

// Nominee views
import { NomineeAccessFlow } from "@/components/dashboard/nominee-access-flow"
import { NomineeHistory } from "@/components/dashboard/views/nominee/history"

function DashboardContent() {
  const { role, activeView } = useDashboard()

  const view = () => {
    if (role === "owner") {
      switch (activeView) {
        case "overview": return <OwnerOverview />
        case "vault": return <OwnerVault />
        case "nominees": return <OwnerNominees />
        case "triggers": return <OwnerTriggers />
        case "documents": return (
          <div className="flex h-full flex-col p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground">Encrypted Documents</h2>
            <p className="mb-6 text-sm text-muted-foreground">Store high-priority files, wills, and identification.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Last Will & Testament.pdf", size: "2.4 MB", date: "Oct 12, 2024" },
                { name: "Life Insurance Policy.pdf", size: "1.1 MB", date: "Sep 03, 2024" },
                { name: "Property Deed - NY.docx", size: "542 KB", date: "Aug 15, 2023" },
                { name: "Crypto Seed Backup.txt.enc", size: "4 KB", date: "Jan 10, 2024" },
              ].map((doc, i) => (
                <div key={i} className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-4 transition-all hover:bg-muted/40 cursor-pointer">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">📄</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3 text-[10px] uppercase text-muted-foreground">
                    <span>Uploaded {doc.date}</span>
                    <span className="font-bold text-primary">AES-256</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        case "audit": return <OwnerAuditLog />
        default: return <OwnerOverview />
      }
    } else {
      switch (activeView) {
        case "access": return <NomineeAccessFlow />
        case "sessions": return (
          <div className="flex h-full flex-col p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground">Active Retrieval Sessions</h2>
            <p className="mb-6 text-sm text-muted-foreground">Monitor ongoing secure connections and retrievals to your vault.</p>
            <div className="space-y-3">
              {[
                { nominee: "Sarah Jenkins", status: "Face Match Initializing...", ip: "192.168.1.144", time: "2 min ago" },
                { nominee: "Alex Chen", status: "OTP Verified, Waiting Bio...", ip: "10.0.0.52", time: "14 min ago" },
              ].map((sess, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{sess.nominee}</p>
                      <p className="text-xs text-primary font-medium">{sess.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground">{sess.ip}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{sess.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        case "history": return <NomineeHistory />
        default: return <NomineeAccessFlow />
      }
    }
  }

  const isFullPage = true // all pages now use full-height attached-grid layout

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4 sm:p-5">
            {view()}
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  )
}

export default function DashboardShell() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
