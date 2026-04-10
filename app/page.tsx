import CTA from "@/components/landing/cta"
import FAQ from "@/components/landing/faq"
import Features from "@/components/landing/features"
import Footer from "@/components/landing/footer"
import { GridLayout, SectionDivider } from "@/components/landing/grid-layout"
import Hero from "@/components/landing/hero"
import Navbar from "@/components/landing/navbar"
// import Pricing from "@/components/landing/pricing"
import Testimonials from "@/components/landing/testimonials"

export default function Page() {
  return (
    <GridLayout className="min-h-svh bg-background">
      <Navbar />
      <Hero />
      <SectionDivider />
      <Features />
      <SectionDivider />
      {/* <Pricing /> */}
      <SectionDivider />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </GridLayout>
  )
}
