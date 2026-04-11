"use client"

import { useState } from "react"
import { Plus, ShieldCheck, ShieldAlert, Mail, Phone, MoreHorizontal, Pencil, Trash2, ChevronDown, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import data from "@/data.json"

const ACCESS_LABELS: Record<string, string> = {
  vault: "Full Vault", banking: "Banking", documents: "Documents",
  credentials: "Credentials", bookings: "Bookings",
}
const ALL_ACCESS = Object.keys(ACCESS_LABELS)

// Derive demo nominees from data.json
// We'll take the nominee information from the first two records as our demo nominees
const INIT_NOMINEES = data.slice(0, 2).map((item, i) => {
  const name = item.Nominee_Name || `Nominee ${i + 1}`
  const email = item.Email ? item.Email.replace(/^[^@]*/, name.toLowerCase().replace(/\s+/g, '.')) : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
  
  return {
    id: i + 1,
    name: name,
    initials: name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    relation: item.Relation || (i === 0 ? "Spouse" : "Family"),
    email: email,
    phone: item.Nominee_Phone ? `+91 ${item.Nominee_Phone}` : "—",
    status: i === 0 ? "verified" : "pending",
    access: i === 0 ? ["vault", "banking", "documents"] : ["documents"],
    added: "14 Feb 2024",
    lastNotified: i === 0 ? "2 days ago" : "Never"
  }
}).filter(n => n.name) // Ensure we have a name

import { useDashboard } from "@/components/dashboard/dashboard-context"

export function OwnerNominees() {
  const { nominees, refreshNominees, isAddingNominee, setIsAddingNominee } = useDashboard()
  const [expanded, setExpanded] = useState<string | number | null>(null)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRelation, setNewRelation] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newAadhaar, setNewAadhaar] = useState("")
  const [loading, setLoading] = useState(false)

  const MAX_NOMINEES = 2
  const limitReached = nominees.length >= MAX_NOMINEES

  async function addNominee(e?: React.FormEvent) {
    if (e) e.preventDefault()
    
    if (limitReached) {
      alert("You have reached the maximum limit of 2 nominees.")
      setIsAddingNominee(false)
      return
    }

    if (!newName || !newEmail || !newPhone || !newAadhaar) {
      alert("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/nominees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          aadhaar: newAadhaar,
          relation: newRelation,
          access: ["documents"]
        })
      })
      
      const data = await res.json()
      if (data.ok) {
        refreshNominees()
        setNewName(""); setNewEmail(""); setNewRelation(""); setNewPhone(""); setNewAadhaar("");
        setIsAddingNominee(false)
      } else {
        alert(data.message || "Failed to add nominee")
      }
    } catch (err) {
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Display initials helper
  const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  if (isAddingNominee) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex items-center gap-4 border-b border-border/40 px-6 py-4">
          <button onClick={() => setIsAddingNominee(false)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
            <Plus className="h-4 w-4 rotate-45" />
          </button>
          <div>
            <h2 className="text-[14px] font-black uppercase tracking-widest text-foreground">Nominee Setup Protocol</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Registering a new beneficiary to the cryptographic inheritance layer</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="mx-auto max-w-2xl space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Legal Full Name</label>
                <input 
                  autoFocus
                  placeholder="Rahul Yadav"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Relationship</label>
                <input 
                  placeholder="Spouse / Sibling / Child"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Email</label>
                <input 
                  type="email"
                  placeholder="rahul@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Identification</label>
                <input 
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aadhaar Number (UIDAI)</label>
                <input 
                  placeholder="XXXX XXXX XXXX"
                  value={newAadhaar}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 12)
                    const parts = val.match(/.{1,4}/g) || []
                    setNewAadhaar(parts.join(" "))
                  }}
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date of Birth</label>
                <input 
                  type="date"
                  className="w-full h-12 rounded-xl border border-border/60 bg-muted/20 px-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Residential Identification (Address)</label>
              <textarea 
                placeholder="Full residential address for legal dispatch"
                className="w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                rows={3}
              />
            </div>

            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Security Protocol Declaration</h3>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-slate-400 italic">
                By enrolling this nominee, you authorize Afterlife AI to grant them access to your encrypted vault assets upon successful multi-factor verification (OTP + Biometrics + Secret Question) in the event of your registered passing.
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={addNominee}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-primary-foreground text-[12px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShieldCheck className="h-4 w-4" /> Finalize Enrollment & Dispatch Invite</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-border gap-px">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between bg-background px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-foreground">Nominees <span className="ml-1.5 text-xs font-normal text-muted-foreground">({nominees.length})</span></p>
          <p className="text-[11px] text-muted-foreground">People who can access your vault after multi-factor verification</p>
        </div>
        <button
          onClick={() => {
            if (limitReached) {
              alert("You have reached the maximum limit of 2 nominees.")
            } else {
              setIsAddingNominee(!isAddingNominee)
            }
          }}
          disabled={limitReached}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
            limitReached 
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Plus className="h-3.5 w-3.5" /> {limitReached ? "Limit Reached" : "Add Nominee"}
        </button>

      </div>

      {/* ── Add form ── */}
      <AnimatePresence>
        {isAddingNominee && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-background border-b border-border/40">
            <form onSubmit={addNominee}>
              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Full Name *", value: newName, setter: setNewName, placeholder: "Rahul Verma", type: "text", autoFocus: true },
                  { label: "Email *", value: newEmail, setter: setNewEmail, placeholder: "rahul@example.com", type: "email" },
                  { label: "Relationship", value: newRelation, setter: setNewRelation, placeholder: "Brother / Spouse", type: "text" },
                  { label: "Phone Number", value: "", setter: () => {}, placeholder: "+91 XXXXX XXXXX", type: "tel" },
                ].map(({ label, value, setter, placeholder, type, autoFocus }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{label}</label>
                    <input 
                      type={type}
                      value={value} 
                      onChange={(e) => setter(e.target.value)} 
                      placeholder={placeholder}
                      autoFocus={autoFocus}
                      required={label.includes("*")}
                      className="w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50" 
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]">
                  {loading ? "Processing..." : "Enroll & Notify"}
                </button>
                <button type="button" onClick={() => setIsAddingNominee(false)} className="rounded-xl border border-border/50 bg-muted/20 px-5 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table header ── */}
      <div className="grid grid-cols-[auto_2fr_1.5fr_1.5fr_1fr_auto] items-center gap-4 bg-muted/20 px-5 py-2.5">
        {["", "Name", "Contact", "Access", "Status", ""].map((h, i) => (
          <p key={i} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</p>
        ))}
      </div>

      {/* ── Rows ── */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40 bg-background">
        {nominees.map((n) => (
          <div key={n.id}>
            {/* Main row */}
            <div
              className="grid grid-cols-[auto_2fr_1.5fr_1.5fr_1fr_auto] items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => setExpanded(expanded === n.id ? null : n.id)}
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {getInitials(n.name)}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium text-foreground">{n.name}</p>
                <p className="text-[10px] text-muted-foreground">{n.relation} · Added {new Date(n.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</p>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs text-foreground/80 truncate">{n.email}</p>
                <p className="text-[10px] text-muted-foreground">{n.phone}</p>
              </div>

              {/* Access pills */}
              <div className="flex flex-wrap gap-1">
                {n.access.slice(0, 2).map((a: string) => (
                  <span key={a} className="rounded-md border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {ACCESS_LABELS[a]}
                  </span>
                ))}
                {n.access.length > 2 && (
                  <span className="rounded-md border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{n.access.length - 2}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className={`flex items-center gap-1.5 text-xs font-medium ${n.status === "verified" ? "text-primary" : "text-amber-500"}`}>
                {n.status === "verified"
                  ? <><ShieldCheck className="h-3.5 w-3.5" /> Verified</>
                  : <><ShieldAlert className="h-3.5 w-3.5" /> Pending</>}
              </div>

              {/* Expand chevron */}
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === n.id ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded detail row */}
            <AnimatePresence>
              {expanded === n.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/30 bg-muted/10">
                  <div className="grid gap-6 px-5 py-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contact Details</p>
                      <div className="flex items-center gap-2 text-xs text-foreground/70"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{n.email}</div>
                      <div className="flex items-center gap-2 text-xs text-foreground/70"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{n.phone}</div>
                      <p className="text-[10px] text-muted-foreground">Last notified: {n.lastNotified}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Access Permissions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_ACCESS.map((a: string) => (
                          <span key={a} className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium
                            ${n.access.includes(a) ? "border-primary/30 bg-primary/10 text-primary" : "border-border/40 bg-muted/20 text-muted-foreground"}`}>
                            {ACCESS_LABELS[a]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-border/30 px-5 py-3">
                    <button className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs text-foreground/70 hover:bg-muted/40 hover:text-foreground">
                      <Pencil className="h-3 w-3" /> Edit Permissions
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs text-foreground/70 hover:bg-muted/40 hover:text-foreground">
                      <Mail className="h-3 w-3" /> Resend Invite
                    </button>
                    <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/5">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between bg-background px-5 py-2.5 border-t border-border/40">
        <p className="text-[10px] text-muted-foreground">Nominees must complete OTP + face + secret question to access vault</p>
        <p className="text-[10px] text-muted-foreground">{nominees.filter(n => n.status === "verified").length} verified · {nominees.filter(n => n.status === "pending").length} pending</p>
      </div>
    </div>
  )
}
