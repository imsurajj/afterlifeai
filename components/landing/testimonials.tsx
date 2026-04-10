"use client"

import Image from "next/image"
import Link from "next/link"
import { FaXTwitter } from "react-icons/fa6"
import { SiThreads } from "react-icons/si"

import { SITE_NAME } from "./branding"

export default function Testimonials() {
  const testimonials = [
    {
      quote: `¡Awesome project! Create products or startups faster. ¡This open-source template has everything you need!\n\n$ git clone ${SITE_NAME.toLowerCase().replace(/\s/g, "")}`,
      name: "Miguel Ángel Durán",
      title: "@midudev",
      avatar: "/testimonial-image1.jpg",
      avatarType: "image" as const,
      twitterLink: "https://x.com/midudev/status/1889327503207960690",
    },
    {
      quote: `${SITE_NAME} helps you simplify and optimize your shipping process with a solid Next.js foundation.`,
      name: "developer.joy",
      title: "@developer.joy",
      avatar: "/testimonial-image2.png",
      avatarType: "image" as const,
      threadsLink:
        "https://www.threads.com/@developer.joy/post/DGisRsoIAuE/shipfree-is-a-free-alternative-to-shipfast-designed-to-simplify-and-optimize-you?hl=en",
    },
    {
      quote:
        "I'm not even exaggerating - this saved me weeks of work.\nInstead of fighting errors and configs, I actually built features.\nIt's the first time I've felt in control of the entire launch process.",
      name: "Bong",
      title: "Indie Builder",
      avatar: "/testimonial-image3.png",
      avatarType: "image" as const,
    },
    {
      quote:
        "I've used other Next.js starters but this one feels built by someone who's actually shipped.\nThe little details - onboarding, SEO, dashboard flow - make it production-grade out of the box.",
      name: "David Alejandro",
      title: "Full-Stack Developer",
      avatar: "/testimonial-image4.png",
      avatarType: "image" as const,
    },
    {
      quote:
        "Bought it on a Friday night, had a live SaaS by Sunday.\nEverything just clicked - no roadblocks, no setup headaches.",
      name: "Finn Sheng",
      title: "SaaS Founder",
      avatar: "/testimonial-image5.png",
      avatarType: "image" as const,
    },
    {
      quote:
        "I was burned out from endless setup and half-working templates.\nThis made me fall in love with building again.\nI opened my laptop, ran one command, and started designing instead of debugging.",
      name: "Fabian Andres Parra Sanchez",
      title: "Product Builder",
      avatar: "/testimonial-image6.png",
      avatarType: "image" as const,
    },
  ]

  return (
    <section id="wall-of-love" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-muted-foreground mb-8 text-center text-sm font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          TESTIMONIALS
        </h2>
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by developers
          </h2>
          <p className="text-muted-foreground text-lg">
            See what builders are saying about {SITE_NAME}
          </p>
        </div>

        <div className="overflow-hidden rounded-none border border-border bg-border sm:rounded-sm">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col bg-background p-6">
                <div className="flex-auto">
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed whitespace-pre-line">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 mt-auto">
                  <div className="flex min-w-0 items-center gap-3">
                    {testimonial.avatarType === "image" ? (
                      <Image
                        src={testimonial.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                        {testimonial.avatar}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{testimonial.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {"twitterLink" in testimonial && testimonial.twitterLink && (
                      <Link
                        href={testimonial.twitterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/60 hover:text-foreground transition-colors"
                        aria-label="Twitter"
                      >
                        <FaXTwitter className="h-4 w-4" />
                      </Link>
                    )}
                    {"threadsLink" in testimonial && testimonial.threadsLink && (
                      <Link
                        href={testimonial.threadsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/60 hover:text-foreground transition-colors"
                        aria-label="Threads"
                      >
                        <SiThreads className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
