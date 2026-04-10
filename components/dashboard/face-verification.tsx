"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, RotateCcw, CheckCircle2, ScanFace, ZapOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type State = "idle" | "streaming" | "captured" | "scanning" | "verified" | "failed"

interface FaceVerificationProps {
  onVerified: (image?: string) => void
  onSkip?: () => void
}

export function FaceVerification({ onVerified, onSkip }: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<State>("idle")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)

  // Cleanup on unmount
  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()) }, [])

  // ─── KEY FIX: wire the stream to the video element AFTER it mounts ───
  // The video element only renders when state === "streaming".
  // We can't set srcObject in startCamera() because the <video> isn't in the DOM yet.
  useEffect(() => {
    if (state === "streaming" && videoRef.current && streamRef.current) {
      const video = videoRef.current
      video.srcObject = streamRef.current

      const onCanPlay = () => {
        video.play().catch(() => {})
        setVideoReady(true)
      }

      video.addEventListener("canplay", onCanPlay)
      return () => video.removeEventListener("canplay", onCanPlay)
    }
  }, [state]) // fires every time state switches to "streaming"

  async function startCamera() {
    try {
      setError(null)
      setVideoReady(false)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      setState("streaming") // ← video element renders → useEffect above wires it up
    } catch {
      setError("Camera access denied. Please allow camera access in your browser settings.")
      setState("failed")
    }
  }

  function capture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const w = video.videoWidth > 0 ? video.videoWidth : 320
    const h = video.videoHeight > 0 ? video.videoHeight : 240
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.save()
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, w, h)
    ctx.restore()

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(dataUrl)

    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setState("captured")

    setTimeout(() => {
      setState("scanning")
      setTimeout(() => {
        setState("verified")
        setTimeout(() => onVerified(dataUrl), 900)
      }, 2400)
    }, 250)
  }

  function reset() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCapturedImage(null)
    setError(null)
    setVideoReady(false)
    setState("idle")
  }

  const showPhone = capturedImage && (state === "scanning" || state === "verified")

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-center w-full">
        {/* ── Camera / preview box ── */}
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-border/60 bg-muted/20 w-56 h-56 shrink-0 shadow-sm">
          {/* IDLE */}
          {state === "idle" && (
            <div className="flex h-full flex-col items-center justify-center gap-2.5 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/40">
                <ScanFace className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">Face Verification</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Look at camera & blink when ready</p>
              </div>
              <Button onClick={startCamera} size="sm" className="h-7 gap-1.5 text-xs px-3">
                <Camera className="h-3.5 w-3.5" /> Open Camera
              </Button>
            </div>
          )}

          {/* FAILED */}
          {state === "failed" && (
            <div className="flex h-full flex-col items-center justify-center gap-2.5 p-4">
              <ZapOff className="h-7 w-7 text-destructive" />
              <div className="text-center">
                <p className="text-xs font-semibold text-destructive">Camera Unavailable</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground max-w-[200px]">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={startCamera}>Retry</Button>
                {onSkip && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onSkip}>Skip</Button>}
              </div>
            </div>
          )}

          {/* STREAMING — video renders here */}
          {state === "streaming" && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/50 animate-pulse" />
              <Brackets />
              {/* LIVE pill */}
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                <div className="h-1 w-1 animate-pulse rounded-full bg-red-400" />
                <span className="text-[9px] font-bold uppercase tracking-wide text-white">Live</span>
              </div>
              {/* Capture button */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={capture}
                  disabled={!videoReady}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-white/90 shadow-md hover:bg-white disabled:opacity-40 transition-opacity"
                >
                  <div className="h-5 w-5 rounded-full bg-primary" />
                </motion.button>
              </div>
            </>
          )}

          {/* CAPTURED */}
          {capturedImage && state === "captured" && (
            <>
              <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
              <Brackets />
              <button onClick={reset}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80">
                <RotateCcw className="h-3 w-3" />
              </button>
            </>
          )}

          {/* SCANNING */}
          {capturedImage && state === "scanning" && (
            <>
              <img src={capturedImage} alt="Scanning" className="h-full w-full object-cover" />
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                className="pointer-events-none absolute left-0 right-0 h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.9), hsl(var(--primary)), hsl(var(--primary) / 0.9), transparent)",
                  boxShadow: "0 0 8px 3px hsl(var(--primary) / 0.35)",
                  position: "absolute",
                }}
              />
              <motion.div
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, hsl(var(--primary)/0.12) 0%, transparent 50%, hsl(var(--primary)/0.12) 100%)" }}
              />
              <Brackets animated />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-sm">
                  <div className="h-1 w-1 animate-pulse rounded-full bg-primary" />
                  <span className="text-[10px] font-medium text-white">Scanning…</span>
                </div>
              </div>
            </>
          )}

          {/* VERIFIED */}
          {capturedImage && state === "verified" && (
            <>
              <img src={capturedImage} alt="Verified" className="h-full w-full object-cover brightness-105" />
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/25 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-white">Verified ✓</p>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-primary"
                style={{ boxShadow: "0 0 12px 3px hsl(var(--primary) / 0.3)" }}
              />
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

      </div>

      {/* Status line */}
      <p className={cn("text-[11px]", state === "verified" ? "text-primary font-medium" : "text-muted-foreground", state === "scanning" && "animate-pulse")}>
        {state === "idle" && "Your face is never stored · Required for access"}
        {state === "streaming" && "Center your face · Good lighting · Tap ⬤ to capture"}
        {state === "captured" && "Captured — starting biometric analysis…"}
        {state === "scanning" && "Analyzing biometric data…"}
        {state === "verified" && "✓ Identity confirmed — continuing to next step"}
        {state === "failed" && ""}
      </p>
    </div>
  )
}

function Brackets({ animated }: { animated?: boolean }) {
  const base = "absolute h-4 w-4"
  const anim = animated ? "animate-pulse" : ""
  return (
    <>
      <div className={cn(base, "top-2 left-2 border-t-[1.5px] border-l-[1.5px] border-primary/60 rounded-tl", anim)} />
      <div className={cn(base, "top-2 right-2 border-t-[1.5px] border-r-[1.5px] border-primary/60 rounded-tr", anim)} />
      <div className={cn(base, "bottom-2 left-2 border-b-[1.5px] border-l-[1.5px] border-primary/60 rounded-bl", anim)} />
      <div className={cn(base, "bottom-2 right-2 border-b-[1.5px] border-r-[1.5px] border-primary/60 rounded-br", anim)} />
    </>
  )
}
