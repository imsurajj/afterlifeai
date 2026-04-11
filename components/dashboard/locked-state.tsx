"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LockedState() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0f1d] p-6 flex items-center justify-center">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[40px] border border-white/5 bg-[#0f172a] p-12 text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]"
      >
        {/* Shield Icon with Gradient Backdrop */}
        <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-b from-blue-500/10 to-blue-500/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
           <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e293b] shadow-xl">
              <ShieldCheck className="h-8 w-8 text-blue-500" strokeWidth={2.5} />
           </div>
        </div>
        
        <div className="space-y-4">
           <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Vault Access Restricted
           </h2>
           <p className="text-[17px] leading-relaxed text-slate-400 font-medium px-4">
              Aadhaar e-KYC is required to access your sensitive data and manage your legal nominees.
           </p>
        </div>

        <div className="mt-12 space-y-8">
           <Button 
             onClick={() => window.open("/dashboard/verify", "_blank")}
             className="w-full h-16 rounded-[22px] bg-[#003875] hover:bg-[#004a99] text-white text-[17px] font-bold shadow-2xl transition-all active:scale-[0.97] hover:shadow-blue-500/20"
           >
              Complete e-KYC Now
           </Button>
           
           <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-900/60 dark:text-blue-500/30">
              Identity Authenticator
           </p>
        </div>
      </motion.div>
    </div>
  )
}
