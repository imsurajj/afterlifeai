"use client"

import { useDashboard } from "@/components/dashboard/dashboard-context"
import { FileText, Download, Shield, Clock, Search, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function OwnerDocuments() {
  const { vaultItems } = useDashboard()
  
  const documents = vaultItems.filter(item => item.category === "documents")

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">Secure Repository</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-1">
            End-to-end encrypted storage for high-priority legal assets
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
           <span className="text-[9px] font-black uppercase tracking-widest text-primary">Node Status: Distributed</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-full py-32 text-center rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
            <FileText className="h-10 w-10 text-white/5 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No documents indexed in vault</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b0b0b] p-5 transition-all hover:bg-white/[0.03] hover:border-white/20 shadow-xl cursor-pointer">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-white italic group-hover:text-primary transition-colors">{doc.title}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-1 truncate">{doc.username || "SECURE_REF"}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                    <div className="flex items-center gap-1.5">
                       <Shield className="h-3 w-3" />
                       <span>AES-256 E2EE</span>
                    </div>
                    <span>{formatDistanceToNow(new Date(doc.createdAt))} ago</span>
                 </div>
                 
                 <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                       <ExternalLink className="h-3 w-3" /> View
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all">
                       <Download className="h-3.5 w-3.5" />
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
        
        {/* Placeholder for "Add" */}
        <button className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-transparent p-5 transition-all hover:border-white/20 hover:bg-white/[0.02] group min-h-[160px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-600 group-hover:text-white transition-colors mb-3">
             <Plus className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400">Anchor New Document</p>
        </button>
      </div>
      
      {/* Footer System Status */}
      <div className="mt-auto pt-8">
         <div className="flex items-center gap-6 opacity-20 grayscale transition-opacity hover:opacity-100 duration-500">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">UIDAI Vault Sync</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">NSDL Repository</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">Global Legacy Node</span>
            </div>
         </div>
      </div>
    </div>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
