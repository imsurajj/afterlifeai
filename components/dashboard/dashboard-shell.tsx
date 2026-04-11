"use client"

import { DashboardProvider, type DashboardUser, useDashboard } from "@/components/dashboard/dashboard-context"
import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { Topbar } from "@/components/dashboard/layout/topbar"
import { Chatbot } from "@/components/dashboard/chatbot"
import { ShieldCheck } from "lucide-react"
import { AadhaarKYC } from "@/components/dashboard/aadhaar-kyc"

// Owner views
import { OwnerOverview } from "@/components/dashboard/views/owner/overview"
import { OwnerVault } from "@/components/dashboard/views/owner/my-vault"
import { OwnerNominees } from "@/components/dashboard/views/owner/nominees"
import { OwnerTriggers } from "@/components/dashboard/views/owner/triggers"
import { OwnerAuditLog } from "@/components/dashboard/views/owner/audit-log"
import { OwnerDocuments } from "@/components/dashboard/views/owner/documents"

// Nominee views
import { NomineeAccessFlow } from "@/components/dashboard/nominee-access-flow"
import { NomineeHistory } from "@/components/dashboard/views/nominee/history"

function DashboardContent() {
  const { role, activeView, user } = useDashboard()

  const view = () => {
    if (role === "owner") {
      switch (activeView) {
        case "overview": return <OwnerOverview />
        case "vault": return <OwnerVault />
        case "nominees": return <OwnerNominees />
        case "triggers": return <OwnerTriggers />
        case "documents": return <OwnerDocuments />
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
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        
        {/* Verification Banner */}
        {!user.kycVerified && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/20 p-1.5 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs font-bold text-destructive">Identity Verification Required</p>
                <p className="text-[10px] text-muted-foreground">Complete your e-KYC to fully secure your assets and enable nominee access.</p>
              </div>
            </div>
            <button 
              onClick={() => window.open("/dashboard/verify", "_blank")}
              className="px-4 py-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-lg hover:bg-destructive/90 transition-all shadow-sm shadow-destructive/10"
            >
              Verify Now
            </button>
          </div>
        )}

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
  return <DashboardContent />
}
