"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Mode = "login" | "signup"

const FEATURES = [
  "AES-256 zero-knowledge encryption",
  "Biometric face verification for nominees",
  "Automated legacy triggers & access control",
  "Full immutable audit log",
]

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") ?? "/dashboard"

  const [mode, setMode] = useState<Mode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignup = mode === "signup"
  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (!isSignup || name.trim().length > 0)

  const title = useMemo(() =>
    isSignup ? "Create your vault" : "Open your vault",
    [isSignup]
  )

  const subtitle = useMemo(() =>
    isSignup
      ? "Start securing your digital legacy today."
      : "Enter your credentials to access your Afterlife Vault.",
    [isSignup]
  )

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isSignup ? name : undefined,
          email,
          password,
        }),
      })

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null

      if (!res.ok || data?.ok !== true) {
        throw new Error(data?.message ?? "Something went wrong.")
      }

      setSuccess(true)
      // Small delay to show success state, then redirect
      setTimeout(() => {
        startTransition(() => {
          router.push(nextUrl)
          router.refresh()
        })
      }, 600)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function switchMode() {
    setError(null)
    setMode((m) => (m === "login" ? "signup" : "login"))
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full space-y-5"
    >
      <AnimatePresence mode="wait">
        {isSignup && (
          <motion.div
            key="name"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1.5 overflow-hidden"
          >
            <Label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="John Doe"
                className="h-9 pl-9 text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            className="h-9 pl-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Password</Label>
          {!isSignup && (
            <button type="button" className="text-[10px] text-foreground hover:text-primary underline decoration-primary/30 underline-offset-4 font-bold transition-colors">
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            className="h-9 pl-9 pr-9 text-sm font-mono tracking-wider"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {isSignup && password.length > 0 && (
          <div className="flex gap-1 pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                password.length >= 6 + i * 2 ? "bg-primary" : "bg-border"
              )} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
          >
            <span className="mt-0.5">⚠</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        className={cn(
          "relative h-10 mt-2 w-full gap-2 text-sm font-semibold transition-all",
          success && "bg-primary/80"
        )}
        disabled={!canSubmit || isSubmitting || isPending || success}
      >
        {success ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Redirecting…
          </>
        ) : isSubmitting || isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            {isSignup ? "Creating Vault…" : "Opening Vault…"}
          </>
        ) : (
          <>
            {isSignup ? "Create Vault" : "Open Vault"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {isSignup ? "Already have a vault?" : "Don't have a vault yet?"}{" "}
        <button type="button" onClick={switchMode} className="font-bold text-foreground hover:text-primary underline decoration-primary/30 underline-offset-4 transition-colors">
          {isSignup ? "Sign in" : "Create one"}
        </button>
      </p>
    </motion.form>
  )
}
