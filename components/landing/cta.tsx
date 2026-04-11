"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PrimaryCtaButton } from "./primary-cta-button"

export default function CTA() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <h2
          className="text-muted-foreground mb-8 text-center text-sm font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          GET STARTED
        </h2>

        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Start securing your legacy today.
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands who trust Afterlife AI to protect their digital future.
          </p>
        </div>

        <div className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center">
          <Button
            asChild
            className="h-12 w-full sm:w-auto px-8 text-base font-bold bg-white text-black hover:bg-slate-200 rounded-xl shadow-lg shadow-white/5 order-2 sm:order-1"
            size="lg"
          >
            <Link href="/api/auth/demo">
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full sm:w-auto px-8 text-base font-bold border-white/20 hover:bg-white/10 rounded-xl order-1 sm:order-2"
            size="lg"
          >
            <Link href="/auth">
              My Vault
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
