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

        <div className="mx-auto mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <PrimaryCtaButton className="text-primary-foreground" />
          <Button
            variant="outline"
            className="h-12 px-8 text-base font-semibold has-[>svg]:px-8"
            size="lg"
            asChild
          >
            <Link href="#features">
              Try demo
              <ArrowUpRight className="h-8 w-8" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
