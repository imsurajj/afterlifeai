"use client"

import { Shield, Users, Clock, FileText, Activity, AlertTriangle, ChevronRight, Plus, TrendingUp, Lock, Bell, X, Save } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

import data from "@/data.json"

export function OwnerOverview() {
  const { user, nominees, refreshNominees, activities, refreshActivities, refreshVault, setActiveView, setIsAddingNominee } = useDashboard()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    name: "",
    email: "",
    relation: ""
  })

  async function handleAddNominee() {
    if (!formData.name || !formData.email) return
    setLoading(true)
    try {
      const res = await fetch("/api/nominees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          relation: formData.relation,
          access: ["documents"]
        })
      })
      if (res.ok) {
        await refreshNominees()
        await refreshActivities()
        setActiveModal(null)
        setFormData({ title: "", content: "", name: "", email: "", relation: "" })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddItem() {
    if (!formData.title || !formData.content) return
    setLoading(true)
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "credentials",
          title: formData.title,
          content: formData.content,
          url: formData.title.toLowerCase().replace(/\s+/g, "") + ".com",
          icon: "🔑"
        })
      })
      if (res.ok) {
        await refreshVault()
        await refreshActivities()
        setActiveModal(null)
        setFormData({ title: "", content: "", name: "", email: "", relation: "" })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const ASSETS = [
    { cat: "Credentials", count: 6, icon: "🔑", color: "bg-white/10 text-white" },
    { cat: "Banking", count: 2, icon: "🏦", color: "bg-white/5 text-slate-300" },
    { cat: "Insurance", count: 2, icon: "🛡️", color: "bg-white/5 text-slate-400" },
    { cat: "Documents", count: (user.kycVerified ? 3 : 2), icon: "📄", color: "bg-white/5 text-slate-500" },
  ]

  const totalAssets = ASSETS.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="flex z-0 h-full flex-col gap-px overflow-y-auto bg-border hide-scrollbar">

      {/* ── Row 0: 72h hold notice ── */}
      <div className="flex items-center gap-3 bg-red-500/5 px-5 py-3 border-b border-red-500/10">
        <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
        <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
          <span className="font-bold uppercase tracking-wider">Security Protocol:</span> In the event of a death registration, a 72-hour mandatory cooling period is initiated before nominee access is granted.
        </p>
      </div>

      {/* ── Row 1: 4 stat cells ── */}
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {/* Vault */}
        <div className="flex flex-col gap-4 bg-background p-5 hover:bg-muted/5 transition-colors">
          <div className="flex items-center justify-between">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${user.kycVerified ? "bg-white/10" : "bg-red-500/10"}`}>
              <Shield className={`h-4 w-4 ${user.kycVerified ? "text-white" : "text-red-500"}`} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${user.kycVerified ? "bg-white" : "bg-red-500"}`} />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{user.kycVerified ? "Secure" : "At Risk"}</span>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{user.kycVerified ? "Active" : "Pending"}</p>
            <p className="text-xs text-muted-foreground">Vault Defense Status</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium italic opacity-60">AES-256 Multi-layer Encryption</p>
        </div>

        {/* Nominees */}
        <button 
          onClick={() => { if (user.kycVerified) setActiveView("nominees") }} 
          className={cn(
            "group flex flex-col gap-4 bg-background p-5 text-left transition-colors",
            user.kycVerified ? "hover:bg-muted/20" : "opacity-40 cursor-not-allowed"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{nominees.length}</p>
            <p className="text-xs text-muted-foreground">Registered Nominees</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{nominees.length}/2 Active Bindings</p>
        </button>
 
        {/* Assets */}
        <button 
          onClick={() => { if (user.kycVerified) setActiveView("vault") }} 
          className={cn(
            "group flex flex-col gap-4 bg-background p-5 text-left transition-colors",
            user.kycVerified ? "hover:bg-muted/20" : "opacity-40 cursor-not-allowed"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <FileText className="h-4 w-4 text-amber-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{totalAssets}</p>
            <p className="text-xs text-muted-foreground">Digital Assets Encrypted</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium italic opacity-60">Docs • Fin • Cred • Soc</p>
        </button>
 
        {/* Trigger */}
        <button 
          onClick={() => { if (user.kycVerified) setActiveView("triggers") }} 
          className={cn(
            "group flex flex-col gap-4 bg-background p-5 text-left transition-colors",
            user.kycVerified ? "hover:bg-muted/20" : "opacity-40 cursor-not-allowed"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">90d</p>
            <p className="text-xs text-muted-foreground">Liveness Pulse Window</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-white">Pulse Active</p>
        </button>
      </div>

      {/* ── Row 2: Main content area ── */}
      <div className="grid flex-1 grid-cols-1 gap-px lg:grid-cols-3">

        {/* Activity feed — left 2/3 */}
        <div className="flex flex-col bg-background p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Security Audit Log</span>
            </div>
            <button onClick={() => setActiveView("audit")} className="text-[10px] font-bold text-white hover:text-white/80 uppercase tracking-widest">Full Ledger</button>
          </div>
          <div className="overflow-y-auto max-h-[350px] space-y-0 hide-scrollbar scroll-smooth pr-2">
            {activities.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-8 w-8 text-muted/20 mb-2" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No recent transactions</p>
               </div>
            ) : (
               activities.map((a, i) => (
                  <div key={a.id} 
                    onClick={() => { if (user.kycVerified) setActiveView("audit") }}
                    className={cn(
                    "flex items-center gap-4 py-4 transition-all rounded-lg px-2 group cursor-pointer",
                    i < activities.length - 1 ? "border-b border-border/20" : "",
                    user.kycVerified ? "hover:bg-muted/5" : "opacity-40 cursor-not-allowed"
                  )}>
                    <div className={cn(
                       "h-2 w-2 shrink-0 rounded-full transition-shadow duration-500",
                       a.type === 'signup' ? "bg-white/20" :
                       a.type === 'kyc_success' ? "bg-white shadow-[0_0_8px_white]" :
                       a.type === 'nominee_add' ? "bg-white/40" : "bg-white/10"
                    )} />
                    <div className="flex-1 min-w-0">
                       <p className="text-[12px] font-bold text-foreground transition-colors truncate">{a.description}</p>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{a.type.replace('_',' ')} • {formatDistanceToNow(new Date(a.createdAt))} ago</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                  </div>
               ))
            )}

            {/* Injected historic data if activities are low */}
            {activities.length < 3 && activities.length > 0 && (
                <div className="flex items-center gap-4 py-4 opacity-10 grayscale pointer-events-none border-b border-border/10">
                   <div className="h-2 w-2 shrink-0 rounded-full bg-white/20" />
                   <div className="flex-1">
                      <p className="text-[12px] font-bold text-foreground">System successfully initialized for {user.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Core OS • 2w ago</p>
                   </div>
                </div>
            )}
          </div>
          
          {/* Asset breakdown */}
          <div className="mt-8 border-t border-border/20 pt-6">
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Cryptographic Asset Clusters</p>
            <div className="grid grid-cols-4 gap-3">
              {ASSETS.map((a) => (
                <button key={a.cat} 
                  onClick={() => { if (user.kycVerified) setActiveView("vault") }}
                  className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all duration-300 group",
                  user.kycVerified ? "hover:bg-white/[0.05] hover:border-white/10" : "opacity-40 cursor-not-allowed"
                )}>
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110 duration-500", a.color)}>
                    <span className="text-sm">{a.icon}</span>
                  </div>
                  <div className="text-center">
                     <p className="text-sm font-bold text-white transition-colors">{a.count}</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70 group-hover:opacity-100">{a.cat}</p>
                  </div>
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
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Beneficiaries</span>
              </div>
              <button onClick={() => setActiveView("nominees")} className="text-[10px] font-bold text-white hover:text-white/80 uppercase tracking-widest">Manage All</button>
            </div>
            <div className="space-y-3">
              {nominees.length === 0 ? (
                 <div className="py-4 border border-dashed border-white/5 rounded-xl text-center">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">No nominees assigned</p>
                 </div>
              ) : (
                 nominees.map((n) => (
                    <div key={n.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-3 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-black text-white border border-white/10 group-hover:scale-105 transition-transform">
                        {n.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold text-foreground italic">{n.name}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{n.relation}</p>
                      </div>
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_white]" />
                    </div>
                 ))
              )}
              
              <button onClick={() => setActiveView("nominees")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-white/20 hover:text-slate-300 transition-all active:scale-[0.98]">
                <Plus className="h-3.5 w-3.5" /> Bind New Recipient
              </button>
            </div>
          </div>

          {/* Security metrics */}
          <div className="flex flex-1 flex-col bg-background p-5">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Security Metrics</span>
              </div>
              <Activity className="h-3 w-3 text-white animate-pulse" />
            </div>
            <div className="space-y-4">
              {[
                { label: "AES-256 Vault Encryption", ok: true },
                { label: "MFA Authentication (OTP)", ok: true },
                { label: "Biometric KYC Binding", ok: user.kycVerified },
                { label: "Inactivity Pulse Monitor", ok: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between group">
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-white transition-colors">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                     <span className={cn(
                       "text-[8px] font-black uppercase tracking-widest",
                       s.ok ? "text-white italic" : "text-red-500/80 animate-pulse"
                     )}>
                       {s.ok ? "Active" : "Critical"}
                     </span>
                     <div className={cn("h-1 w-1 rounded-full", s.ok ? "bg-white shadow-[0_0_8px_white]" : "bg-red-500")} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
               <div className="rounded-xl bg-white/[0.03] p-4 border border-white/5 space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Government Node Sync</p>
                  <div className="flex items-center gap-2">
                     <div className="h-1 rounded-full bg-white/10 flex-1 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} className="h-full bg-white" />
                     </div>
                     <span className="text-[9px] font-black text-white">88%</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium">Parallel syncing with NSDL, UIDAI and IRDAI registries in progress.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px sm:grid-cols-4 shrink-0 border-t border-border/50">
        {[
          { label: "Enroll Nominee", icon: "👤", color: "bg-white/5 text-white", sub: "Bind access rights", view: "nominees" as const },
          { label: "Vault Credential", icon: "🔑", color: "bg-white/5 text-white", sub: "Secure high-value key", view: "vault" as const },
          { label: "Digital Document", icon: "📄", color: "bg-white/5 text-white", sub: "Passport, Will, DL", view: "vault" as const },
          { label: "Pulse Configuration", icon: "⏱", color: "bg-white/5 text-white", sub: "Set inactivity window", view: "triggers" as const },
        ].map((a) => (
          <button key={a.label} 
            onClick={() => { 
              if (user.kycVerified) {
                if (a.label === "Enroll Nominee") {
                  setActiveView("nominees");
                  setIsAddingNominee(true);
                } else {
                  setActiveModal(a.view)
                }
              }
            }}
            className={cn(
               "group flex flex-col items-start gap-2 bg-background px-6 py-5 text-left transition-all duration-300",
               user.kycVerified ? "hover:bg-muted/50 cursor-pointer" : "opacity-40 cursor-not-allowed"
            )}
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all group-hover:scale-110", a.color)}>
              <span className="text-sm">{a.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase tracking-widest text-foreground transition-colors">{a.label}</p>
              <p className="truncate text-[10px] text-muted-foreground italic font-medium opacity-60">{a.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {activeModal === "vault" ? "Anchor to Vault" : 
                   activeModal === "nominees" ? "Beneficiary Enrollment" : 
                   "Protocol Configuration"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {activeModal === "vault" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Label</label>
                        <input 
                          type="text" 
                          autoFocus 
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                          placeholder="BTC Private Key" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                        <select 
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                           <option>Credentials</option>
                           <option>Banking</option>
                           <option>Documents</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Payload (Value)</label>
                      <textarea 
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                        rows={4} 
                        placeholder="Input high-value data for encryption..." 
                      />
                    </div>
                  </>
                )}
                {activeModal === "nominees" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Name</label>
                        <input 
                          type="text" 
                          autoFocus 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNominee()}
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                          placeholder="Rahul Verma" 
                        />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Relationship</label>
                        <input 
                          type="text" 
                          value={formData.relation}
                          onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNominee()}
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                          placeholder="Brother" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNominee()}
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                          placeholder="rahul@gateway.auth" 
                        />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Number</label>
                        <input 
                          type="tel" 
                          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-white/30 focus:ring-0 focus:outline-none transition-all" 
                          placeholder="+91 XXXXX XXXXX" 
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (activeModal === "vault") handleAddItem()
                      if (activeModal === "nominees") handleAddNominee()
                    }}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 h-12 rounded-xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Activity className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Anchor & Encrypt
                      </>
                    )}
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
