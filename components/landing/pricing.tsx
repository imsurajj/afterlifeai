"use client"

import Link from "next/link"
import { CheckCircle2, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { GITHUB_REPO } from "./branding"
import { PrimaryCtaButton } from "./primary-cta-button"

export default function Pricing() {
  const personalFeatures = [
    { text: "Secure Digital Vault", included: true },
    { text: "Up to 2 Nominees", included: true },
    { text: "Standard Email Verification", included: true },
    { text: "Basic Document Storage", included: true },
    { text: "Credential Manager", included: true },
    { text: "Personal Messages", included: true },
    { text: "Community Support", included: true },
  ]

  const legacyFeatures = [
    { text: "Everything in Personal", included: true },
    { text: "Unlimited Nominees", included: true },
    { text: "Face Biometric Verification", included: true },
    { text: "Government ID Verification", included: true },
    { text: "Hotel & Booking Concierge", included: true },
    { text: "Financial Account Access", included: true },
    { text: "Automated Access Triggers", included: true },
    { text: "Legacy Planning Tools", included: true },
    { text: "Priority Executive Support", included: true },
  ]

  return (
    <section id="pricing" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-muted-foreground mb-8 text-center text-sm font-medium"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pricing
          </h2>
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Plans for every legacy
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the level of protection that fits your needs.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-none border border-border bg-transparent md:grid-cols-2">
            <div className="flex flex-col border-border p-6 sm:p-8 md:border-r">
              <div className="mb-6">
                <h3 className="mb-4 text-2xl font-semibold">Personal</h3>
                <div className="mb-4">
                  <span className="font-mono text-4xl font-semibold">$0</span>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  Foundational protection for your most essential digital assets.
                </p>
                <p
                  className="text-foreground text-xs font-medium uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  INCLUDING
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {personalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button
                  className="h-12 w-full text-sm font-medium"
                  size="lg"
                  asChild
                >
                  <Link href="/dashboard">
                    Get started for free
                  </Link>
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                  No credit card required
                </p>
              </div>
            </div>

            <div className="relative flex flex-col border-t border-border p-6 sm:p-8 md:border-t-0">
              <div className="mb-6">
                <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
                  <h3 className="text-2xl font-semibold">Legacy</h3>
                  <Badge className="flex items-center gap-1.5 rounded-full border border-[#DBDAD6] bg-white px-3 py-3 font-medium text-[#878787]">
                    <Flame className="h-3.5 w-3.5" />
                    Most popular
                  </Badge>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground font-mono text-sm line-through">
                      $150
                    </span>
                    <span className="font-mono text-4xl font-semibold">$90</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  Complete peace of mind with advanced biometric security and concierge access.
                </p>
                <p
                  className="text-foreground text-xs font-medium uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  INCLUDING
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {legacyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <PrimaryCtaButton />
                <p className="text-muted-foreground text-center text-sm">
                  Pay once. Build unlimited projects!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
