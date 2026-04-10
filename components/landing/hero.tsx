"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"

import { PrimaryCtaButton } from "./primary-cta-button"

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <main
      id="hero"
      className="bg-background relative flex min-h-screen flex-col items-center justify-start overflow-hidden pt-32 pb-24 sm:pt-40 lg:pt-44"
    >
      {/* Dark-mode hero background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-[center_25%] opacity-15" />
        {/* Bottom-up radial shadow for readability */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0)_75%)]" />
        {/* Soft vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="text-foreground mx-auto max-w-3xl text-balance text-center text-4xl leading-tight font-semibold tracking-tighter sm:text-5xl md:max-w-4xl md:text-6xl lg:leading-[1.1]">
            Secure your digital legacy with {` `}
            <span className="inline">Afterlife AI</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-center md:max-w-2xl md:text-lg">
            Store your most important credentials, hotel bookings, and digital assets. Ensure your loved ones can access them when it matters most, protected by state-of-the-art biometric verification.
          </p>
          <motion.div
            className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <PrimaryCtaButton className="text-primary-foreground w-full max-w-sm sm:w-auto" />
            <Button
              variant="outline"
              className="h-12 w-full max-w-sm px-8 text-base font-semibold has-[>svg]:px-8 sm:w-auto"
              size="lg"
              asChild
            >
              <Link href="#features">
                Try demo
                <ArrowUpRight className="h-8 w-8" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Removed "Built with the best tools" section */}
      </div>
    </main>
  )
}
