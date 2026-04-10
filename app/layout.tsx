import type { Metadata } from "next"
import { Geist_Mono, Poppins } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Afterlife AI — Ship faster",
    template: "%s — Afterlife AI",
  },
  description:
    "Production-ready Next.js foundation: auth, payments, and UI patterns so you can focus on your product.",
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        poppins.variable,
        geistMono.variable,
        "antialiased"
      )}
    >
      <body className="font-sans">
        <ThemeProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
          <div
            className="pointer-events-none fixed inset-0 -z-10 h-screen w-full bg-[url('/grain.jpg')] opacity-5"
            aria-hidden
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
