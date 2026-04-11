"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Fingerprint, Smartphone, CheckCircle2, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDashboard } from "./dashboard-context"
import { cn } from "@/lib/utils"

type Step = "intro" | "aadhaar" | "otp" | "success"

export function AadhaarKYC() {
  const { user, updateProfile } = useDashboard()
  const [step, setStep] = useState<Step>("intro")
  const [aadhaar, setAadhaar] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientId, setClientId] = useState("")

  // Formatting Aadhaar input: XXXX XXXX XXXX
  const formatAadhaar = (val: string) => {
    const raw = val.replace(/\s+/g, "").replace(/\D/g, "")
    const parts = raw.match(/.{1,4}/g) || []
    return parts.join(" ").slice(0, 14)
  }

  async function handleGenerateOTP() {
    const rawAadhaar = aadhaar.replace(/\s+/g, "")
    if (rawAadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number")
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
        setStep("otp")
      } else {
        setError(data.message || "Failed to send OTP. Try again.")
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
        updateProfile({
            kycVerified: true,
            kycData: {
                aadhaarName: data.data.full_name,
                maskedAadhaar: data.data.aadhaar_number,
                dob: data.data.dob,
                address: typeof data.data.address === 'string' ? data.data.address : "India",
            }
        })
        setStep("success")
      } else {
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (e) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (user.kycVerified && step !== "success") return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#001529]/40 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl dark:bg-slate-900"
      >
        {/* Gov Header Bar */}
        <div className="flex items-center justify-between border-b border-border/40 bg-[#f8faff] px-6 py-3.5 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded bg-white p-1 shadow-sm ring-1 ring-border/20">
                <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Aadhaar" className="h-full w-full object-contain" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-tight text-[#003366] dark:text-blue-400">Unique Identification Authority of India</p>
                <p className="text-[8px] font-medium text-muted-foreground uppercase">Government of India</p>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="h-8 w-12 bg-white p-1 rounded ring-1 ring-border/10">
                <img src="https://upload.wikimedia.org/wikipedia/en/c/c3/DigiLocker_logo.svg" alt="DigiLocker" className="h-full w-full object-contain" />
             </div>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-[#003366] dark:text-white">Authentication Service</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Afterlife AI uses <span className="font-bold text-[#003366] dark:text-blue-300">Aadhaar e-KYC</span> to securely verify your identity. This process is fully encrypted and powered by DigiLocker.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                   <h3 className="text-xs font-bold uppercase text-[#003366] dark:text-blue-400 flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-3.5 w-3.5" /> Consent Required
                   </h3>
                   <p className="text-[11px] leading-normal text-slate-600 dark:text-slate-400">
                      I hereby provide my consent to Afterlife AI to access my Aadhaar data from UIDAI for the purpose of identity verification and vault security management.
                   </p>
                </div>

                <Button onClick={() => setStep("aadhaar")} className="w-full gap-2 rounded-xl h-12 text-sm font-bold bg-[#003366] hover:bg-[#002244] text-white transition-all shadow-md">
                   Accept & Proceed <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground uppercase font-semibold">
                   <span>Paperless</span>
                   <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                   <span>Contactless</span>
                   <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                   <span>Secure</span>
                </div>
              </motion.div>
            )}

            {step === "aadhaar" && (
              <motion.div
                key="aadhaar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#003366] dark:text-white">Aadhaar Identification</h2>
                  <p className="text-xs text-muted-foreground italic">OTP will be sent to your registered mobile number.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#003366]/60 dark:text-blue-400/60">12-Digit Aadhaar Number</label>
                    <Input
                      placeholder="0000 0000 0000"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                      className="h-14 rounded-xl border border-border/60 bg-muted/20 text-center text-xl font-bold tracking-[0.1em] focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition-all dark:bg-slate-800"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button 
                    disabled={loading || aadhaar.replace(/\s+/g, "").length !== 12} 
                    onClick={handleGenerateOTP} 
                    className="w-full h-12 rounded-xl font-bold bg-[#003366] hover:bg-[#002244] text-white"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Identity"}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                     <ShieldCheck className="h-3 w-3 text-green-600" />
                     <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">End-to-End Encrypted via UIDAI Hub</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#003366] dark:bg-blue-900/30">
                     <Smartphone className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-[#003366] dark:text-white">Enter OTP</h2>
                  <p className="text-xs text-muted-foreground">Please enter the verification code sent to the mobile ending in ••{aadhaar.slice(-2)}</p>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-14 rounded-xl border border-border/60 bg-muted/20 text-center text-2xl font-bold tracking-[0.6em] focus:border-[#003366] transition-all dark:bg-slate-800"
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button 
                    disabled={loading || otp.length !== 6} 
                    onClick={handleVerifyOTP}
                    className="w-full h-12 rounded-xl font-bold bg-[#003366] hover:bg-[#002244] text-white"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Validate OTP"}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground font-medium">
                    Resend code available in <span className="text-[#003366] font-bold">59s</span>
                  </p>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/20">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Verification Successful</h2>
                  <p className="text-sm text-muted-foreground">Your identity has been authenticated via UIDAI.</p>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-green-50/50 p-5 text-left dark:border-green-900/20 dark:bg-green-900/10">
                   <div className="absolute right-[-10px] top-[-10px] opacity-[0.05] grayscale">
                      <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="watermark" className="h-24 w-24" />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-green-700/60 dark:text-green-400">Identity Details</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{user.kycData?.aadhaarName}</p>
                      <p className="text-xs font-medium text-slate-500">{user.kycData?.address}</p>
                      <div className="mt-4 flex items-center gap-2">
                         <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30">Verified UIDAI Profile</span>
                         <span className="text-[10px] font-mono text-slate-400">#E-KYC:{clientId.slice(0, 8)}</span>
                      </div>
                   </div>
                </div>

                <Button onClick={() => window.location.reload()} className="w-full h-12 rounded-xl font-bold bg-[#003366] text-white">
                  Continue to Secured Vault
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Official Footer */}
        <div className="border-t border-border/40 bg-muted/10 px-6 py-4 dark:bg-slate-900/50">
           <div className="flex items-center justify-center gap-5 opacity-60">
              <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Auth" className="h-6 w-auto grayscale dark:invert" />
              <img src="https://upload.wikimedia.org/wikipedia/en/c/c3/DigiLocker_logo.svg" alt="DigiLocker" className="h-6 w-auto grayscale dark:invert" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ashoka_Chakra.svg/1024px-Ashoka_Chakra.svg.png" alt="Digital India" className="h-5 w-auto grayscale dark:invert" />
           </div>
        </div>
      </motion.div>
    </div>
  )
}
