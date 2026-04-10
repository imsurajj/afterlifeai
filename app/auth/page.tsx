import { Suspense } from "react"
import Link from "next/link"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"

const FEATURES = [
  "AES-256 zero-knowledge encryption",
  "Biometric face verification for nominees",
  "Automated legacy triggers & access control",
  "Full immutable audit log",
]

export default function AuthPage() {
  return (
    <div className="flex min-h-svh bg-background">
      {/* Left panel — branding */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-muted/30 p-12 lg:flex border-r border-border/40">
        {/* subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-[120px]" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">Afterlife AI</span>
        </Link>

        {/* Middle content */}
        <div className="relative z-10 space-y-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              ✦ Why Afterlife AI
            </div>
            <h2 className="text-4xl font-bold leading-[1.15] text-foreground tracking-tight">
              Your digital legacy,<br />secured for the future.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-[85%]">
              Store credentials, hotel bookings, and sensitive data. Designate nominees. Trigger secure access after verification.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-t border-border/60 pt-8 mt-auto">
          <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
            &ldquo;The most thoughtful gift I could leave for my family was making sure they wouldn&apos;t struggle with my digital footprint.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-border" />
            <div>
              <p className="text-xs font-bold text-foreground">Sarah Jenkins</p>
              <p className="text-[10px] font-medium text-muted-foreground">Afterlife AI user since 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-10 relative">
        
        {/* Mobile logo */}
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold text-foreground">Afterlife AI</span>
        </Link>

        <div className="w-full max-w-sm relative z-10">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your secure digital legacy vault.
            </p>
          </div>

          <Suspense>
            <AuthForm />
          </Suspense>

          <p className="mt-10 text-center text-xs text-muted-foreground font-medium">
            Protected by AES-256 encryption · Zero-knowledge vault
          </p>
        </div>
      </div>
    </div>
  )
}
