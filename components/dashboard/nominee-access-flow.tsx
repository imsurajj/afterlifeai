"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, ShieldCheck, KeyRound, Users, FileCheck, Database, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FaceVerification } from "@/components/dashboard/face-verification"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4

const DEPTS = [
  { id: "bank", label: "Bank & EPFO", desc: "Savings, FD, provident fund", icon: "₹" },
  { id: "stocks", label: "Stocks & Equity", desc: "Demat accounts, Mutual funds", icon: "📈" },
  { id: "land", label: "Land & Property", desc: "Revenue dept records", icon: "🏠" },
  { id: "insurance", label: "Insurance", desc: "LIC, IRDA records", icon: "🛡️" },
  { id: "civil", label: "Civil & Documents", desc: "Passport, PAN, Voter ID", icon: "📄" },
  { id: "credentials", label: "Social & Personal", desc: "Facebook, Instagram, Cloud Access", icon: "🔐" },
]

const MOCK_RECORDS: Record<string, Record<string, string>> = {
  bank: { "Account Balance": "₹4,82,310", "Provident Fund": "₹1,23,450", "FD Count": "2 deposits" },
  land: { "Properties": "2 found", "Location": "Delhi / Haryana", "Status": "Verified" },
  pension: { "NPS Corpus": "₹8,91,200", "PM Scheme": "Active", "Last Updated": "Jan 2024" },
  insurance: { "LIC Policies": "₹25,00,000 (2)", "IRDA Status": "Verified", "Nominee": "Linked" },
  civil: { "PAN": "XXXXX1234X", "Voter ID": "DL/24/111/XX", "DL": "Active" },
}

const STEP_CONFIG = [
  { step: 1, icon: KeyRound, label: "Verify Identity", sub: "OTP + Face + Secret" },
  { step: 2, icon: Users, label: "Confirm Binding", sub: "Nominee registry check" },
  { step: 3, icon: FileCheck, label: "Give Consent", sub: "Select departments" },
  { step: 4, icon: Database, label: "Retrieve Records", sub: "Parallel API fetch" },
] as const

export function NomineeAccessFlow() {
  const [step, setStep] = useState<Step>(1)
  const [aadhaar, setAadhaar] = useState("")
  const [deathCert, setDeathCert] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [faceVerified, setFaceVerified] = useState(false)
  const [showFacePopup, setShowFacePopup] = useState(false)
  const [capturedFaceData, setCapturedFaceData] = useState<string | null>(null)
  const [secretAns, setSecretAns] = useState("")
  const [secretVerified, setSecretVerified] = useState(false)
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [selectedReportView, setSelectedReportView] = useState<string>("bank")
  const [consent, setConsent] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [recordsFetched, setRecordsFetched] = useState(false)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast({ id: Date.now(), msg })
    setTimeout(() => {
      setToast(prev => prev?.msg === msg ? null : prev)
    }, 3000)
  }

  function fmtAadhaar(val: string) {
    return val.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  function handleSendOtp() {
    if (aadhaar.replace(/\s/g, "").length < 12) { setError("Enter a valid 12-digit Aadhaar number"); return }
    if (!deathCert) { setError("Death certificate identification required."); return }
    
    const rawAadhaar = aadhaar.replace(/\s/g, "")
    const validEnds = ["7738", "5328", "4581", "8004"]
    if (!validEnds.some(end => rawAadhaar.endsWith(end))) {
       setError("No legacy protocol found for this identity.")
       return
    }

    setError(null); setOtpSent(true); showToast("OTP code dispatched.")
  }

  function handleVerifyOtp() {
    if (otp !== "123456") { setError("Invalid verification code."); return }
    setError(null); setOtpVerified(true); showToast("OTP verified successfully.")
  }

  const [realRecords, setRealRecords] = useState<any>({})

  async function fetchRealRecords() {
    try {
      const res = await fetch(`/api/vault/retrieve?aadhaar=${aadhaar.replace(/\s/g, "")}&categories=${selectedDepts.join(",")}`)
      const data = await res.json()
      if (data.ok) {
        setRealRecords(data.data)
        setRecordsFetched(true)
      }
    } catch (err) {
      console.error("Fetch failed", err)
    }
  }

  function handleVerifySecret() {
    if (!secretAns.trim()) { setError("Answer required for decryption."); return }
    setError(null); setSecretVerified(true); showToast("Security handshake complete.")
    // Auto-advance to Step 2
    setTimeout(() => { setStep(2); showToast("Registry binding confirmed.") }, 1000)
  }

  // Effect to trigger fetch when we hit Step 4
  useEffect(() => {
    if (step === 4 && !recordsFetched && !fetching) {
       setFetching(true)
       fetchRealRecords()
    }
  }, [step, recordsFetched, fetching])

  function toggleDept(id: string) {
    setSelectedDepts((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function handleFetch() {
    setFetching(true)
    showToast("Retrieving encrypted clusters...")
    setTimeout(() => { setFetching(false); setRecordsFetched(true); showToast("Records available.") }, 2200)
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden relative">

      {/* ── Navigator ── */}
      <div className="flex items-center border-b border-border/40 px-2 sm:px-6 overflow-x-auto hide-scrollbar bg-card shrink-0">
        {STEP_CONFIG.map(({ step: s, label, icon: Icon }) => {
          const done = s < step
          const active = s === step
          return (
            <div
              key={s}
              className={cn(
                "flex items-center gap-2.5 px-6 py-4 border-b-2 transition-all whitespace-nowrap",
                active ? "border-primary opacity-100" : "border-transparent opacity-40"
              )}
            >
              <div className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                done ? "bg-primary text-primary-foreground" : active ? "bg-foreground text-background" : "bg-muted text-muted-foreground border border-border"
              )}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
              </div>
              <p className={cn("text-xs font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border/40 px-8 py-5">
          <p className="text-sm font-bold text-foreground uppercase tracking-wider">{STEP_CONFIG[step - 1].label}</p>
          <p className="text-xs text-muted-foreground">{STEP_CONFIG[step - 1].sub}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {/* STEP 1: VERIFICATION */}
              {step === 1 && (
                <div className="max-w-2xl space-y-6">
                  {error && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4" /> {error}
                    </div>
                  )}

                  <div className="grid gap-6">
                    {/* Part 1: Identity */}
                    <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-6">
                       <div className="grid gap-6 sm:grid-cols-2">
                         <div className="space-y-2">
                           <Label className="text-xs font-bold text-muted-foreground uppercase">Deceased's Aadhaar</Label>
                           <Input placeholder="XXXX XXXX XXXX" value={aadhaar}
                             onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
                             onKeyDown={(e) => e.key === "Enter" && !otpSent && handleSendOtp()}
                             className="h-11 font-mono tracking-widest bg-muted/20" />
                         </div>
                         <div className="space-y-2">
                           <Label className="text-xs font-bold text-muted-foreground uppercase">Certificate ID</Label>
                           <Input placeholder="DC-REG-XXXX" 
                             onChange={(e) => setDeathCert(e.target.value)}
                             onKeyDown={(e) => e.key === "Enter" && !otpSent && handleSendOtp()}
                             className="h-11 bg-muted/20 font-bold" />
                         </div>
                       </div>
                       
                       {!otpSent ? (
                         <Button onClick={handleSendOtp} className="w-full h-11 font-bold">Initiate Verification</Button>
                       ) : !otpVerified ? (
                         <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between text-xs font-bold mb-1">
                               <p className="text-muted-foreground">Verification OTP sent to ••••72</p>
                               <p className="text-primary animate-pulse">DEMO: 123456</p>
                            </div>
                            <div className="flex gap-2">
                               <Input placeholder="6-digit code" maxLength={6} value={otp} 
                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                 onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                                 className="h-11 flex-1 text-center font-mono text-xl tracking-[0.5em] bg-muted/20" />
                               <Button onClick={handleVerifyOtp} className="h-11 px-8 font-bold">Verify</Button>
                            </div>
                         </div>
                       ) : (
                         <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-primary">
                            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" /><p className="text-sm font-bold">Aadhaar Handshake Successful</p></div>
                            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black">UIDAI PASS</Badge>
                         </div>
                       )}
                    </div>

                    {/* Part 2: Face Match (Only if OTP done) */}
                    {otpVerified && (
                      <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-4 animate-in fade-in zoom-in-95 duration-500">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <Camera className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold">Live Face Verification</p>
                                  <p className="text-[11px] text-muted-foreground">Mandatory liveness check required</p>
                               </div>
                            </div>
                            {faceVerified && <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" /> MATCHED</Badge>}
                         </div>

                         {!faceVerified ? (
                            <Button onClick={() => setShowFacePopup(true)} className="w-full h-11 font-bold bg-blue-600 hover:bg-blue-700">Start Face Capture</Button>
                         ) : (
                            <div className="flex items-center gap-4 p-2 bg-muted/10 rounded-xl border border-border/40">
                               <img src={capturedFaceData || ""} className="h-12 w-12 rounded-lg object-cover border border-border" />
                               <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase tracking-wider">Live Biometrics anchored.<br/>Session secure.</p>
                            </div>
                         )}
                      </div>
                    )}

                    {/* Part 3: Secret Question (Only if Face done) */}
                    {faceVerified && (
                       <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <ShieldCheck className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="text-sm font-bold">Security Question</p>
                                <p className="text-[11px] text-muted-foreground">Final decryption layer</p>
                             </div>
                          </div>
                          
                          {!secretVerified ? (
                             <div className="space-y-3 pt-2">
                                <Label className="text-xs font-bold text-foreground uppercase">Where was the deceased last admitted?</Label>
                                <div className="flex gap-2">
                                   <Input placeholder="Your answer" value={secretAns} 
                                     onChange={(e) => setSecretAns(e.target.value)}
                                     onKeyDown={(e) => e.key === "Enter" && handleVerifySecret()}
                                     className="h-11 bg-muted/20" />
                                   <Button onClick={handleVerifySecret} className="h-11 px-8 font-bold">Submit</Button>
                                </div>
                             </div>
                          ) : (
                             <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 text-primary">
                                <CheckCircle2 className="h-5 w-5" />
                                <p className="text-sm font-bold">Access Registry Unlocked</p>
                             </div>
                          )}
                       </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEPS 2, 3, 4 OMITTED FOR BREVITY — SAME AS PREVIOUS PERFECT UI */}
              {step === 2 && (
                <div className="max-w-xl space-y-6">
                   <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                      <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-primary" /><h3 className="text-sm font-black uppercase tracking-widest">Binding Confirmed</h3></div>
                      <div className="space-y-4">
                         {[["Deceased", "Rahul Yadav"], ["Certificate", "DC-2077-BGLR-001"], ["Nominee Status", "Registered (Sister)"]].map(([k,v]) => (
                            <div key={k} className="flex justify-between border-b border-border/40 pb-2"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{k}</span><span className="text-xs font-black text-foreground">{v}</span></div>
                         ))}
                      </div>
                   </div>
                   <Button onClick={() => setStep(3)} className="w-full h-12 font-black uppercase tracking-widest">Proceed to Consent</Button>
                </div>
              )}

              {step === 3 && (
                <div className="max-w-xl space-y-6">
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Target Clusters</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedDepts(DEPTS.map(d => d.id))}
                        className="text-[10px] font-black uppercase tracking-widest h-7 px-2 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                         Select All
                      </Button>
                   </div>
                   <div className="grid gap-3">
                      {DEPTS.map(d => (
                         <button key={d.id} onClick={() => toggleDept(d.id)} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-all text-left", selectedDepts.includes(d.id) ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border/60 hover:bg-muted/40")}>
                            <span className="text-xl">{d.icon}</span><div className="flex-1"><p className="text-sm font-bold">{d.label}</p><p className="text-xs text-muted-foreground">{d.desc}</p></div>
                            <div className={cn("h-5 w-5 rounded-full border flex items-center justify-center transition-all", selectedDepts.includes(d.id) ? "bg-primary border-primary scale-110 shadow-lg shadow-primary/20" : "border-border/60")}>
                               {selectedDepts.includes(d.id) && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                            </div>
                         </button>
                      ))}
                   </div>
                   <Button onClick={() => { 
                      setSelectedReportView(selectedDepts[0]); 
                      setStep(4); 
                   }} disabled={selectedDepts.length === 0} className="w-full h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/10">Authorize Retrieval</Button>
                </div>
              )}

              {step === 4 && (
                <div className="flex h-[calc(100vh-18rem)] -mx-8 -my-6 overflow-hidden animate-in fade-in duration-500">
                   {/* Inner Sidebar - Minimalist */}
                   <div className="w-56 border-r border-border/40 bg-background/50 overflow-y-auto px-3 py-8">
                      <div className="px-2 mb-6">
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Vault Registry</p>
                      </div>
                      <div className="space-y-0.5">
                         {selectedDepts.map(id => {
                            const d = DEPTS.find(x => x.id === id)!
                            const isActive = selectedReportView === id
                            return (
                               <button
                                  key={id}
                                  onClick={() => setSelectedReportView(id)}
                                  className={cn(
                                     "w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left relative",
                                     isActive ? "text-primary bg-primary/5 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                  )}
                               >
                                  {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r" />}
                                  <span className="text-base opacity-70">{d.icon}</span>
                                  <span className={cn("text-[11px] font-bold uppercase tracking-wider", isActive ? "text-foreground" : "text-muted-foreground")}>{d.label}</span>
                               </button>
                            )
                         })}
                      </div>
                   </div>

                   {/* Main Content Area - Table Focus */}
                   <div className="flex-1 overflow-y-auto bg-background/80">
                      <div className="px-10 py-8">
                        <div className="flex items-center justify-between mb-10 border-b border-border/40 pb-6">
                           <div>
                              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">
                                 {DEPTS.find(x => x.id === selectedReportView)?.label || "Select Category"}
                              </h2>
                              <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest font-bold opacity-60">
                                 Symmetrically decrypted cluster node
                              </p>
                           </div>
                           <Badge variant="outline" className="border-border/40 text-foreground bg-muted/20 text-[9px] font-black py-1 px-4 tracking-[0.2em]">SECURE</Badge>
                        </div>

                        <div className="w-full">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-border/40 text-muted-foreground pb-4">
                                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] pb-4">Classification</th>
                                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] pb-4">
                                       {selectedReportView === "credentials" ? "Identifier / ID" : "Identifier / Value"}
                                    </th>
                                    {selectedReportView === "credentials" && (
                                       <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] pb-4">Password</th>
                                    )}
                                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] pb-4 text-right">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                 {selectedReportView && realRecords[selectedReportView] && realRecords[selectedReportView].length > 0 ? (
                                    realRecords[selectedReportView].map((item: any) => (
                                       <tr key={item.title} className="hover:bg-muted/10 transition-colors group">
                                          <td className="px-4 py-6">
                                             <div className="flex items-center gap-4">
                                                <div className="h-4 w-4 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                                   {DEPTS.find(x => x.id === selectedReportView)?.icon}
                                                </div>
                                                <div>
                                                   <p className="text-xs font-black text-foreground uppercase tracking-wider">{item.title}</p>
                                                   <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">AES-256 E2EE</p>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-4 py-6">
                                             <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                                                {item.identifier}
                                             </p>
                                          </td>
                                          {selectedReportView === "credentials" && (
                                             <td className="px-4 py-6">
                                                <p className="font-mono text-xs font-bold text-foreground lowercase tracking-tight">
                                                   {item.secret}
                                                </p>
                                             </td>
                                          )}
                                          <td className="px-4 py-6 text-right">
                                             <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-green-500/60">
                                                <div className="h-1 w-1 rounded-full bg-green-500" />
                                                Unlocked
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr>
                                       <td colSpan={selectedReportView === "credentials" ? 4 : 3} className="px-4 py-24 text-center">
                                          <div className="flex flex-col items-center gap-4 opacity-10">
                                             <Database className="h-10 w-10" />
                                             <p className="text-[10px] font-black uppercase tracking-[0.3em]">No synced segments</p>
                                          </div>
                                       </td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>

                        <div className="mt-12 p-6 border-t border-border/40 flex items-center justify-between opacity-50">
                           <div className="flex items-center gap-4">
                              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                 End-to-end encrypted storage for high-priority legal assets
                              </p>
                           </div>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                              UIDAI VAULT SYNC • GLOBAL LEGACY NODE
                           </p>
                        </div>
                      </div>
                   </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showFacePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                   <p className="text-sm font-bold uppercase tracking-widest">Biometric Capture</p>
                   <button onClick={() => setShowFacePopup(false)}><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6">
                   <FaceVerification 
                      onVerified={(img) => { setCapturedFaceData(img || null); setFaceVerified(true); setShowFacePopup(false); showToast("Face match confirmed.") }}
                      onSkip={() => { setFaceVerified(true); setShowFacePopup(false); showToast("Face verification skipped (DEMO).") }}
                   />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 right-10 z-[100] bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
             <CheckCircle2 className="h-4 w-4" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
