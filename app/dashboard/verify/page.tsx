"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, Loader2, Shield, Landmark, 
  Building2, ArrowLeft, Fingerprint, FileCheck,
  Smartphone, ShieldCheck, ChevronDown, ChevronRight, 
  Hash, CreditCard, User, MoreHorizontal, IdCard,
  Activity, Database, Lock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4

const STEP_CONFIG = [
  { id: 1, label: "Official Consent", sub: "Legal Declaration" },
  { id: 2, label: "Identity Input", sub: "Document Registration" },
  { id: 3, label: "Security Verification", sub: "Protocol Handshake" },
  { id: 4, label: "Final Validation", sub: "Verifying Clusters" },
]

const ID_TYPES = [
  { id: "aadhaar", label: "National ID (Aadhaar)", icon: IdCard },
  { id: "pan", label: "Tax ID (PAN)", icon: CreditCard },
  { id: "passport", label: "Indian Passport", icon: Landmark },
  { id: "voter", label: "Election Registry", icon: User },
]

const VALIDATION_PHASES = [
  { label: "Establishing SSL/TLS Peer Connection", icon: Activity },
  { label: "Handshaking with Central UIDAI Registry", icon: Landmark },
  { label: "Validating Biometric Identity Hash", icon: Fingerprint },
  { label: "Anchoring Assets to National ID", icon: Database },
  { label: "Finalizing Vault Access Elevation", icon: Lock },
]

export default function KYCPage() {
  const { user, updateProfile } = useDashboard()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [idType, setIdType] = useState("aadhaar")
  const [aadhaar, setAadhaar] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientId, setClientId] = useState("")
  const [countdown, setCountdown] = useState(3)
  const [showIdDropdown, setShowIdDropdown] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [validationComplete, setValidationComplete] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIdDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (user.kycVerified && step !== 4) {
       router.push("/dashboard")
    }
  }, [user.kycVerified, router, step])

  useEffect(() => {
    if (step === 4 && !validationComplete) {
       const timer = setInterval(() => {
          setCurrentPhase((prev) => {
             if (prev >= VALIDATION_PHASES.length - 1) {
                clearInterval(timer)
                setValidationComplete(true)
                return prev
             }
             return prev + 1
          })
       }, 800)
       return () => clearInterval(timer)
    }
  }, [step, validationComplete])

  useEffect(() => {
    if (validationComplete && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (validationComplete && countdown === 0) {
      router.push("/dashboard")
    }
  }, [validationComplete, countdown, router])

  const formatAadhaar = (val: string) => {
    const raw = val.replace(/\s+/g, "").replace(/\D/g, "")
    const parts = raw.match(/.{1,4}/g) || []
    return parts.join(" ").slice(0, 14)
  }

  async function handleGenerateOTP() {
    const rawAadhaar = aadhaar.replace(/\s+/g, "")
    if (rawAadhaar.length < 5) {
      setError("Please enter a valid document number")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/kyc/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber: rawAadhaar })
      })
      const data = await res.json()
      if (data.success || data.data?.client_id) {
        setClientId(data.data.client_id)
        setStep(3)
      } else {
        setError(data.message || "Failed to initiate verification. Try again.")
      }
    } catch (e) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/kyc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, otp })
      })
      const data = await res.json()
      if (data.success) {
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        updateProfile({
            kycVerified: true,
            kycData: {
                aadhaarName: data.data.full_name,
                maskedAadhaar: data.data.aadhaar_number,
                dob: data.data.dob,
                address: typeof data.data.address === 'string' ? data.data.address : "India",
            }
        })
        setStep(4)
      } else {
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (e) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const activeIdLabel = ID_TYPES.find(i => i.id === idType)?.label || "Select Document"

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-sans text-slate-200">
      {/* ── Top Header ── */}
      <header className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/40 px-6 py-2.5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="group flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10">
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-white" />
            <p className="text-[11px] font-bold tracking-tight text-white uppercase italic">Vault Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-5 opacity-20 grayscale scale-75">
          <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Aadhaar" className="h-4" />
          <img src="https://upload.wikimedia.org/wikipedia/en/c/c3/DigiLocker_logo.svg" alt="DigiLocker" className="h-3.5" />
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="flex shrink-0 items-center border-b border-white/5 bg-white/[0.01] px-6 overflow-x-auto hide-scrollbar">
        {STEP_CONFIG.map((s) => {
          const done = s.id < step
          const active = s.id === step
          return (
            <div key={s.id} className={cn(
              "flex items-center gap-2 px-5 py-3 border-b-2 transition-all whitespace-nowrap",
              active ? "border-blue-500 opacity-100" : "border-transparent opacity-40"
            )}>
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black",
                done ? "bg-blue-500 text-white" : active ? "bg-white text-black" : "bg-white/10 text-slate-500"
              )}>
                {done ? <CheckCircle2 className="h-3 w-3" /> : s.id}
              </div>
              <p className={cn("text-[11px] font-semibold tracking-tight uppercase", active ? "text-white" : "text-slate-400")}>{s.label}</p>
            </div>
          )
        })}
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="flex h-full flex-col px-10 py-10 max-w-4xl">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: -8 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 8 }}
              className="space-y-10"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Protocol Step 0{step}</p>
                <h2 className="text-[16px] font-bold tracking-tight text-white mb-1.5">{STEP_CONFIG[step-1].label}</h2>
                <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed">{STEP_CONFIG[step-1].sub}</p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-red-500 py-0.5">
                  <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                  {error.toUpperCase()}
                </div>
              )}

              {/* Step 1: Consent */}
              {step === 1 && (
                <div className="space-y-8">
                   <div className="max-w-2xl space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Legal Handshake Declaration</p>
                      <p className="text-[12px] leading-relaxed text-slate-400 font-medium italic border-l border-white/10 pl-5">
                         "I hereby state that I have no objection in authenticating myself with Aadhaar based authentication system and consent to providing my Aadhaar number, OTP and Biometrics for purposes of e-KYC. I understand that the data will be used only for my account verification at Afterlife AI."
                      </p>
                   </div>
                   <Button onClick={() => setStep(2)} className="h-9 px-6 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]">
                      Authorize Sync
                   </Button>
                </div>
              )}

              {/* Step 2: Custom Dropdown & Input */}
              {step === 2 && (
                <div className="space-y-10">
                   <div className="max-w-md space-y-10">
                      <div className="space-y-4" ref={dropdownRef}>
                         <div className="flex items-center justify-between">
                            <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">ID Document Model</Label>
                            <Badge variant="outline" className="text-[8px] h-3.5 px-1.5 bg-blue-500/5 border-blue-500/10 text-blue-500 tracking-widest">REAL-TIME</Badge>
                         </div>
                         <div className="relative">
                            <button 
                               onClick={() => setShowIdDropdown(!showIdDropdown)}
                               className={cn(
                                 "flex h-12 w-full items-center border-b border-white/10 bg-white/[0.01] transition-all hover:bg-white/[0.03]",
                                 showIdDropdown && "border-white/30 bg-white/[0.04]"
                               )}
                            >
                               <div className="flex h-12 w-12 shrink-0 items-center justify-center border-r border-white/5 opacity-40">
                                  <CreditCard className="h-4 w-4 text-white" />
                               </div>
                               <span className="flex-1 px-4 text-left text-[13px] font-bold text-white italic">{activeIdLabel}</span>
                               <div className="flex h-12 w-10 items-center justify-center opacity-30">
                                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", showIdDropdown && "rotate-180")} />
                               </div>
                            </button>

                            <AnimatePresence>
                               {showIdDropdown && (
                                  <motion.div 
                                     initial={{ opacity: 0, y: 4 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0, y: 4 }}
                                     transition={{ duration: 0.15 }}
                                     className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] shadow-2xl backdrop-blur-xl"
                                  >
                                     <div className="p-1.5">
                                        {ID_TYPES.map((type) => {
                                           const Icon = type.icon
                                           return (
                                              <button
                                                 key={type.id}
                                                 onClick={() => { setIdType(type.id); setShowIdDropdown(false); }}
                                                 className={cn(
                                                   "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                                                   idType === type.id ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                                 )}
                                              >
                                                 <Icon className="h-3.5 w-3.5 shrink-0" />
                                                 <span className="text-[11px] font-bold tracking-tight">{type.label}</span>
                                                 {idType === type.id && <CheckCircle2 className="ml-auto h-3 w-3 text-blue-500" />}
                                              </button>
                                           )
                                        })}
                                     </div>
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Cryptographic Identity ID</Label>
                         <div className="flex items-center border-b border-white/10 bg-white/[0.01] transition-all focus-within:border-white/30 focus-within:bg-white/[0.04]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-r border-white/5 opacity-40">
                               <Hash className="h-4 w-4 text-white" />
                            </div>
                            <Input 
                               placeholder={idType === "aadhaar" ? "XXXX XXXX XXXX" : "Input identification ID"}
                               value={aadhaar}
                               onChange={(e) => setAadhaar(idType === "aadhaar" ? formatAadhaar(e.target.value) : e.target.value.toUpperCase())}
                               onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerateOTP()}
                               className="h-12 w-full border-none bg-transparent px-4 text-[13px] font-bold tracking-[0.1em] text-white placeholder:text-slate-800 placeholder:font-black placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest focus-visible:ring-0"
                            />
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5 opacity-40">
                         <ShieldCheck className="h-3 w-3 text-white" />
                         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">End-to-end encrypted governmental gateway</p>
                      </div>
                   </div>

                   <Button disabled={loading} onClick={handleGenerateOTP} className="h-9 px-8 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]">
                      {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Verify & Anchor"}
                   </Button>
                </div>
              )}

              {/* Step 3: OTP */}
              {step === 3 && (
                <div className="space-y-10">
                   <div className="max-w-md space-y-8">
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Verification Token</Label>
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">AWAITING HANDSHAKE</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Input 
                               placeholder="------"
                               value={otp}
                               maxLength={6}
                               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                               onKeyDown={(e) => e.key === 'Enter' && !loading && handleVerifyOTP()}
                               className="h-14 w-full border-b border-white/10 border-t-0 border-x-0 bg-white/[0.01] px-0 text-center text-[24px] font-bold tracking-[0.6em] text-white focus-visible:ring-0 focus-visible:border-white/30 rounded-none shadow-none"
                            />
                         </div>
                         <p className="text-[10px] font-medium text-slate-500 italic opacity-80">Token dispatched to the mobile device indexed under your official {idType.toUpperCase()} file.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 mb-8">
                      <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]">Demo Auth Code: 123456</p>
                   </div>
                   <Button disabled={loading} onClick={handleVerifyOTP} className="h-9 px-8 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]">
                      {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Confirm Final Access"}
                   </Button>
                </div>
              )}

              {/* Step 4: Multi-Phase Validation */}
              {step === 4 && (
                <div className="space-y-12">
                   {!validationComplete ? (
                      <div className="space-y-8">
                         <div className="space-y-2">
                            <div className="flex items-center gap-3 text-white">
                               <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                               <span className="text-[14px] font-bold tracking-tight">Active Cryptographic Handshake</span>
                            </div>
                            <p className="text-[11px] text-slate-500">Validating multiple identity clusters across governmental nodes.</p>
                         </div>

                         <div className="space-y-4 max-w-sm">
                            {VALIDATION_PHASES.map((phase, i) => {
                               const isActive = i === currentPhase
                               const isDone = i < currentPhase
                               const Icon = phase.icon
                               return (
                                  <motion.div 
                                     key={i}
                                     initial={{ opacity: 0, x: -4 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     className={cn(
                                       "flex items-center gap-4 transition-all duration-300",
                                       isActive ? "translate-x-1 opacity-100" : isDone ? "opacity-40" : "opacity-20"
                                     )}
                                  >
                                     <div className={cn(
                                        "flex h-7 w-7 items-center justify-center rounded-lg border",
                                        isActive ? "border-blue-500/50 bg-blue-500/10 text-blue-400" : isDone ? "border-green-500/30 bg-green-500/5 text-green-500" : "border-white/5 bg-white/5 text-slate-600"
                                     )}>
                                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className={cn("h-3.5 w-3.5", isActive && "animate-pulse")} />}
                                     </div>
                                     <span className={cn(
                                        "text-[11px] font-bold tracking-tight",
                                        isActive ? "text-white" : isDone ? "text-slate-400" : "text-slate-700"
                                     )}>{phase.label}</span>
                                  </motion.div>
                               )
                            })}
                         </div>
                      </div>
                   ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                      >
                         <div className="space-y-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                               <CheckCircle2 size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight uppercase">Identity Hub Synced</h3>
                            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-medium">Cryptographic proof of identity established. Vault access elevation successful.</p>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 max-w-sm">
                            <div className="space-y-1">
                               <p className="text-[8px] font-black uppercase tracking-widest text-slate-700">Entity Principal</p>
                               <p className="text-[12px] font-bold text-white uppercase tracking-tight">{user.kycData?.aadhaarName || "Verified User"}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black uppercase tracking-widest text-slate-700">Access Key Status</p>
                               <p className="text-[11px] font-bold text-white tracking-tighter italic opacity-40">ACTIVE_LOCKED</p>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 pt-4">
                            <div className="h-0.5 w-24 bg-white/5 overflow-hidden rounded-full">
                              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-white/40" />
                            </div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Entry in {countdown}s</p>
                         </div>
                      </motion.div>
                   )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer Metadata */}
          <div className="mt-auto pt-16 flex items-center gap-10 opacity-[0.05]">
             <div className="flex items-center gap-2">
                <Fingerprint size={10} />
                <span className="text-[7px] font-black uppercase tracking-[0.2em]">FIPS-140-2</span>
             </div>
             <div className="flex items-center gap-2">
                <Landmark size={10} />
                <span className="text-[7px] font-black uppercase tracking-[0.2em]">GOV-VAULT</span>
             </div>
             <div className="flex items-center gap-2">
                <Building2 size={10} />
                <span className="text-[7px] font-black uppercase tracking-[0.2em]">AES-POL-256</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
