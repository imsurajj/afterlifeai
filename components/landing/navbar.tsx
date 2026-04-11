"use client"

import Link from "next/link"
import { Menu, Moon, Sun, X, Globe, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getGitHubStars } from "@/lib/github"

import { GITHUB_REPO, SITE_NAME } from "./branding"
import { PrimaryCtaButton } from "./primary-cta-button"

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
  { code: 'ru', label: 'Русский' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' }
]

export default function Navbar() {
  const [stars, setStars] = useState<number | null>(null)
  const [isLoadingStars, setIsLoadingStars] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    getGitHubStars(GITHUB_REPO)
      .then((starsCount) => {
        setStars(starsCount)
      })
      .catch(() => {
        setStars(null)
      })
      .finally(() => {
        setIsLoadingStars(false)
      })
      
    // Inject Google Translate script dynamically if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)

      // @ts-ignore
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        new window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element')
      }
    }
  }, [])

  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Detect current google translate cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
    if (match && match[1]) {
      setCurrentLang(match[1])
    }
    
    // Hide native google translate top bar aggressively
    const style = document.createElement("style")
    style.innerHTML = `
      .skiptranslate.goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; }
      #google_translate_element { display: none !important; }
    `
    document.head.appendChild(style)
  }, [])

  const changeLanguage = (code: string) => {
    setCurrentLang(code)
    setLangOpen(false)
    document.cookie = `googtrans=/en/${code}; path=/;`
    window.location.reload()
  }

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight

    // Lock scroll, preserve layout when scrollbar disappears
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }

    const closeOnNav = () => setIsMenuOpen(false)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("hashchange", closeOnNav)
    window.addEventListener("popstate", closeOnNav)

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("hashchange", closeOnNav)
      window.removeEventListener("popstate", closeOnNav)
    }
  }, [isMenuOpen])

  return (
    <nav className="bg-background fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6.5 3-1 5.5-3.5 5.5-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground cursor-pointer"
            >
              Features
            </button>
            {/* <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => document.getElementById("wall-of-love")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground cursor-pointer"
            >
              Wall of love
            </button> */}
            <button
              onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground cursor-pointer"
            >
              FAQ
            </button>
          </div>

          <div className="hidden h-6 w-px bg-black/30 md:block" />

          {/* <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md md:flex"
            aria-label="GitHub"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-5 w-5 text-[#38383A]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {isLoadingStars ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              stars !== null &&
              stars > 0 && (
                <span className="text-sm font-medium text-muted-foreground">
                  {formatStars(stars)}
                </span>
              )
            )}
          </a> */}

          {/* Mobile GitHub icon (keep outside menu) */}
          {/* <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            aria-label="GitHub"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a> */}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : mounted ? (
              <Moon className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>

          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Change language"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-4 w-4" />
            </Button>

            <AnimatePresence>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl z-50"
                  >
                    <div className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {lang.label}
                          {currentLang === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <div id="google_translate_element" />

          <div className="hidden md:block">
            <PrimaryCtaButton />
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 top-14 z-40 md:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Panel (expands from navbar bottom) */}
            <motion.div
              className="absolute inset-x-0 top-0 h-full overflow-y-auto"
              initial={shouldReduceMotion ? false : { y: -8 }}
              animate={shouldReduceMotion ? undefined : { y: 0 }}
              exit={shouldReduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mx-auto max-w-6xl space-y-1 px-4 pt-4 pb-6 sm:px-6">
                <Link
                  href="#features"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  Pricing
                </Link>
                <button
                  onClick={() => {
                    document.getElementById("wall-of-love")?.scrollIntoView({ behavior: "smooth" })
                    toggleMenu()
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground"
                >
                  Wall of love
                </button>
                <Link
                  href="#faq"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  FAQ
                </Link>

                <div className="pt-3">
                  <PrimaryCtaButton className="w-full justify-center" />
                </div>

                {/* iOS safe area */}
                <div className="h-[env(safe-area-inset-bottom)]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
