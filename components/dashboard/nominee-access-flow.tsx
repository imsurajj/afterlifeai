"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, ShieldCheck, KeyRound, Users, FileCheck, Database, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FaceVerification } from "@/components/dashboard/face-verification"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4

const DEPTS = [
  { id: "bank", label: "Bank & EPFO", desc: "Savings, FD, provident fund", icon: "₹" },
  { id: "land", label: "Land & Property", desc: "Revenue dept records", icon: "🏠" },
  { id: "pension", label: "Pension & Schemes", desc: "NPS, PM schemes", icon: "📊" },
  { id: "insurance", label: "Insurance", desc: "LIC, IRDA records", icon: "🛡️" },
  { id: "civil", label: "Civil & Legal", desc: "Voter, PAN, DL records", icon: "📄" },
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
    if (!deathCert) { setError("Enter the death certificate number"); return }
    setError(null); setOtpSent(true); showToast("OTP sent to registered mobile ••••72")
  }

  function handleVerifyOtp() {
    if (otp.length < 6) { setError("Enter the 6-digit OTP"); return }
    setError(null); setOtpVerified(true); showToast("OTP verified successfully")
  }

  function handleVerifySecret() {
    if (!secretAns.trim()) { setError("Enter your answer"); return }
    setError(null); setSecretVerified(true); showToast("Secret question verified")
    setTimeout(() => { setStep(2); showToast("Binding check initiated") }, 600)
  }

  function toggleDept(id: string) {
    setSelectedDepts((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function handleFetch() {
    setFetching(true)
    showToast("Parallel API calls to: " + selectedDepts.join(", "))
    setTimeout(() => { setFetching(false); setRecordsFetched(true); showToast("Records retrieved & encrypted") }, 2200)
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden relative">

      {/* ── Top: horizontal step navigator ── */}
      <div className="flex items-center border-b border-border/40 px-2 sm:px-6 overflow-x-auto hide-scrollbar bg-muted/10 shrink-0">
        {STEP_CONFIG.map(({ step: s, label }) => {
          const done = s < step
          const active = s === step
          return (
            <div
              key={s}
              className={cn(
                "flex items-center gap-2 px-4 py-4 border-b-2 transition-all whitespace-nowrap",
                active ? "border-primary opacity-100" : "border-transparent opacity-50"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                done ? "bg-primary text-primary-foreground" : active ? "font-bold bg-foreground text-background" : "font-medium bg-muted border border-border text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
              </div>
              <p className={cn("text-xs", active ? "font-bold text-foreground" : "font-medium text-foreground")}>{label}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Step title bar */}
        <div className="border-b border-border/40 px-6 py-4">
          <p className="text-sm font-semibold text-foreground">{STEP_CONFIG[step - 1].label}</p>
          <p className="text-[11px] text-muted-foreground">{STEP_CONFIG[step - 1].sub}</p>
        </div>

        {/* Step content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>

              {/* ── Step 1 ── */}
              {step === 1 && (
                <div className="max-w-lg space-y-0">
                  {error && (
                    <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</div>
                  )}

                  {/* ── Section 1: Aadhaar + Death Cert ── */}
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="border-b border-border/40 bg-muted/20 px-4 py-2.5">
                      <p className="text-xs font-semibold text-foreground">1 — Identify the Deceased</p>
                    </div>
                    <div className="grid gap-3 p-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Your Aadhaar Number</Label>
                        <Input placeholder="XXXX XXXX XXXX" value={aadhaar}
                          onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
                          onKeyDown={(e) => e.key === 'Enter' && !otpSent && handleSendOtp()}
                          className="h-9 font-mono tracking-wider text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">Death Certificate No.</Label>
                        <Input placeholder="DC/2024/XXXX/XXXXX" value={deathCert}
                          onChange={(e) => setDeathCert(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !otpSent && handleSendOtp()}
                          className="h-9 text-sm" />
                      </div>
                    </div>
                    <div className="border-t border-border/40 px-4 py-3">
                      {!otpSent ? (
                        <Button onClick={handleSendOtp} size="sm" variant="outline" className="h-8 text-xs">
                          Send OTP to Registered Mobile
                        </Button>
                      ) : !otpVerified ? (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-muted-foreground">OTP sent to mobile ending <strong className="text-foreground">••••72</strong></p>
                          <div className="flex items-center gap-3 w-full max-w-sm">
                            <Input
                              placeholder="XXXXXX"
                              value={otp}
                              maxLength={6}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                              onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                              className="h-9 flex-1 font-mono tracking-widest text-sm"
                            />
                            <Button onClick={handleVerifyOtp} size="sm" className="h-9 px-4 text-xs">Verify OTP</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="flex items-center gap-1.5 text-xs text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" /> OTP verified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Section 2: Face Verification ── */}
                  {otpVerified && !faceVerified && (
                    <div className="mt-3 rounded-xl border border-border/50 overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/20 px-4 py-2.5">
                        <p className="text-xs font-semibold text-foreground">2 — Live Face Verification</p>
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Required</span>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <p className="text-xs text-muted-foreground">This step requires you to look into the camera for a liveness check.</p>
                        <Button onClick={() => setShowFacePopup(true)} size="sm" className="w-fit h-9 text-xs">
                          Start Camera Verification
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Face done */}
                  {faceVerified && (
                    <div className="mt-1.5 flex flex-col gap-2.5 px-3 py-2 border-l-2 border-primary bg-primary/5 rounded-r-xl">
                      <div className="flex items-center gap-1.5 text-xs text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Face match confirmed
                      </div>
                      {capturedFaceData && (
                        <div className="flex items-center gap-3">
                          <img src={capturedFaceData} alt="Captured preview" className="h-10 w-10 rounded-md border border-border/50 object-cover" />
                          <p className="text-[10px] text-muted-foreground leading-tight">Live scan secure.<br/>Data will be wiped on close.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Section 3: Secret Question ── */}
                  {faceVerified && !secretVerified && (
                    <div className="mt-3 rounded-xl border border-border/50 overflow-hidden">
                      <div className="border-b border-border/40 bg-muted/20 px-4 py-2.5">
                        <p className="text-xs font-semibold text-foreground">3 — Secret Question</p>
                      </div>
                      <div className="p-4 space-y-2.5">
                        <p className="text-xs text-muted-foreground">What is the name of the hospital where the deceased was last admitted?</p>
                        <div className="flex items-center gap-2.5">
                          <Input placeholder="Type your answer" value={secretAns}
                            onChange={(e) => setSecretAns(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerifySecret()}
                            className="h-9 flex-1 max-w-xs text-sm" />
                          <Button onClick={handleVerifySecret} size="sm" className="h-9 text-xs">Confirm</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* All verified summary */}
                  {otpVerified && faceVerified && secretVerified && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["OTP", "Face", "Secret"].map((l) => (
                        <div key={l} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <CheckCircle2 className="h-3 w-3" />{l}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <div className="space-y-4 max-w-xl">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-primary">Binding Confirmed</p>
                    </div>
                    <p className="text-xs text-foreground/70">You are registered as <strong>Nominee (Spouse)</strong> for this record.</p>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border/50">
                    <table className="w-full">
                      <tbody className="divide-y divide-border/40">
                        {[["Deceased", "Ramesh Kumar Sharma"], ["Death Certificate", "DC/2024/DL/00471"], ["Date Registered", "14 Feb 2024"], ["Registrar Office", "DL-NW-042"], ["Access Window", "87 days remaining"]].map(([k, v]) => (
                          <tr key={k} className="hover:bg-muted/20">
                            <td className="px-4 py-2.5 text-xs text-muted-foreground w-40">{k}</td>
                            <td className="px-4 py-2.5 text-xs font-semibold text-foreground">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button onClick={() => { setStep(3); showToast("Moved to consent step") }} className="h-10">
                    Continue to Consent →
                  </Button>
                </div>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Select departments to query</p>
                    <button onClick={() => setSelectedDepts(selectedDepts.length === DEPTS.length ? [] : DEPTS.map(d => d.id))}
                      className="text-xs text-primary hover:underline">
                      {selectedDepts.length === DEPTS.length ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border/50">
                    {DEPTS.map((d, i) => {
                      const sel = selectedDepts.includes(d.id)
                      return (
                        <button key={d.id} onClick={() => toggleDept(d.id)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                            i < DEPTS.length - 1 && "border-b border-border/40",
                            sel ? "bg-primary/5" : "hover:bg-muted/20"
                          )}>
                          <span className="text-lg shrink-0">{d.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs", sel ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>{d.label}</p>
                            <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                          </div>
                          <div className={cn("shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-colors", sel ? "border-primary bg-primary" : "border-border/50")}>
                            {sel && <svg viewBox="0 0 8 8" fill="none" className="h-2.5 w-2.5"><path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                    <input type="checkbox" checked={consent} onChange={() => { setConsent(!consent); if (!consent) showToast("Consent given — " + selectedDepts.length + " depts selected") }} className="mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I confirm I am the registered nominee and consent to this system querying the selected departments on my behalf. I understand this access is permanently logged.
                    </span>
                  </label>

                  <Button onClick={() => { setStep(4); showToast("Moved to records step") }}
                    disabled={!consent || selectedDepts.length === 0} className="h-10">
                    Proceed to Retrieve Records →
                  </Button>
                </div>
              )}

              {/* ── Step 4 ── */}
              {step === 4 && (
                <div className="space-y-4 w-full pb-8">
                  {/* Department queue */}
                  {!recordsFetched && (
                    <div className="max-w-xl space-y-4">
                      <div className="overflow-hidden rounded-xl border border-border/50">
                        {selectedDepts.map((id, i) => {
                          const d = DEPTS.find(x => x.id === id)!
                          return (
                            <div key={id} className={cn("flex items-center justify-between px-4 py-3", i < selectedDepts.length - 1 && "border-b border-border/40")}>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{d.icon}</span>
                                <span className="text-xs font-medium">{d.label}</span>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                {fetching && <Loader2 className="h-3 w-3 animate-spin" />}
                                {fetching ? "Fetching…" : "Queued"}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      {!fetching
                        ? <Button onClick={handleFetch} className="h-10">Fetch All Records Now</Button>
                        : <div className="flex items-center gap-2 text-sm text-muted-foreground py-2"><Loader2 className="h-4 w-4 animate-spin" /> Querying departments…</div>}
                    </div>
                  )}

                  {/* Results */}
                  {recordsFetched && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 w-fit">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-primary">{selectedDepts.length} departments retrieved successfully</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {selectedDepts.map((id) => {
                          const d = DEPTS.find(x => x.id === id)!
                          const data = MOCK_RECORDS[id]
                          return (
                            <div key={id} className="overflow-hidden rounded-xl border border-border/50 bg-background flex flex-col hover:border-primary/30 transition-colors">
                              <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-3">
                                <div className="flex items-center gap-2"><span>{d.icon}</span><span className="text-sm font-semibold">{d.label}</span></div>
                                <span className="text-[10px] text-primary font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Retrieved</span>
                              </div>
                              <table className="w-full flex-1">
                                <tbody className="divide-y divide-border/30">
                                  {Object.entries(data).map(([k, v]) => (
                                    <tr key={k} className="hover:bg-muted/10">
                                      <td className="px-4 py-3 text-xs text-muted-foreground w-1/2 align-top">{k}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-foreground text-right">{v}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="h-9">↓ Download Bundle (PDF)</Button>
                        <Button size="sm" variant="outline" className="h-9">🖨 CSC Printout</Button>
                        <Button size="sm" variant="outline" className="h-9">📮 Request Speed Post</Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Session expires in 15 min · Data wiped on close · Audit log saved securely</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Face Verification Popup Overlay ── */}
      <AnimatePresence>
        {showFacePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[360px] rounded-2xl border border-border/40 bg-background overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
                <p className="text-sm font-semibold">Live Face Capture</p>
                <button onClick={() => setShowFacePopup(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 bg-background">
                <FaceVerification
                  onVerified={(img) => {
                    setCapturedFaceData(img || null)
                    setFaceVerified(true)
                    setShowFacePopup(false)
                    showToast("Face match passed — liveness confirmed")
                  }}
                  onSkip={() => {
                    setFaceVerified(true)
                    setShowFacePopup(false)
                    showToast("Face verification skipped")
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center justify-center rounded-full bg-primary/20 p-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
