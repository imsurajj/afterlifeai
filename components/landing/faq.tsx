"use client"

import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the nominee access my data?",
    answer:
      "A nominee can request access through our verification portal. They will need to provide proof of identity, login credentials you've pre-authorized, and pass a biometric face verification check.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use zero-knowledge encryption, meaning only you and your authorized nominees can access your data. We never store your master decryption keys.",
  },
  {
    question: "What kind of details can I store?",
    answer:
      "You can store login credentials, hotel and travel bookings, bank details, social media access, and personalized messages for your loved ones.",
  },
  {
    question: "Can I update nominee details later?",
    answer:
      "Absolutely. You can add, remove, or change permissions for your nominees at any time from your dashboard.",
  },
  {
    question: "How does face verification work?",
    answer:
      "When a nominee requests access, they must perform a live face scan which is matched against the reference data you provided or government ID verification.",
  },
  {
    question: "Can I log in and change things before I die?",
    answer:
      "Yes, the platform is designed for you to manage your legacy actively. You can update your stored information as often as you like.",
  },
  {
    question: "What happens if a nominee loses their access?",
    answer:
      "We recommend appointing at least two nominees. If a nominee cannot verify themselves, our secondary verification process via legal documentation may be required.",
  },
]

export default function FAQ() {
  return (
    <section
      id="faq"
      className="border-y border-border bg-background py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-muted-foreground mb-8 text-center text-sm font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FAQ
        </h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Have another question?{" "}
              <Link
                href="mailto:support@afterlife.ai"
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Contact us by email
              </Link>
              .
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
