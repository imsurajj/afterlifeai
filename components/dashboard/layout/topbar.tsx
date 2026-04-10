"use client"

import { Menu, Globe, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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

const VIEW_LABELS: Record<string, string> = {
  overview: "Overview",
  vault: "My Vault",
  nominees: "Nominees",
  triggers: "Triggers",
  documents: "Documents",
  audit: "Audit Log",
  access: "Access Request",
  sessions: "Active Sessions",
  history: "My Accesses",
}

export function Topbar() {
  const { role, setRole, activeView, setSidebarOpen } = useDashboard()
  
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
    if (match && match[1]) {
      setCurrentLang(match[1])
    }

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

  return (
    <>
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden text-muted-foreground sm:block">Dashboard</span>
        <span className="hidden text-muted-foreground sm:block">/</span>
        <span className="font-medium text-foreground">{VIEW_LABELS[activeView] ?? activeView}</span>
      </div>

      {/* Mobile: page title only */}
      <span className="font-medium text-foreground sm:hidden">{VIEW_LABELS[activeView] ?? activeView}</span>

      <div className="ml-auto flex items-center gap-3">
        {/* Language Switcher */}
        <div className="relative z-50">
          <button
            aria-label="Change language"
            onClick={() => setLangOpen(!langOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <Globe className="h-[18px] w-[18px]" />
          </button>

          <AnimatePresence>
            {langOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl"
                >
                  <div className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
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

        {/* Role switcher */}
        <div className="relative flex items-center rounded-xl border border-border/60 bg-muted/30 p-1 gap-1">
          {(["owner", "nominee"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                role === r ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {role === r && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">
                {r === "owner" ? "🏛 My Vault" : "👤 Nominee"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
    <div id="google_translate_element" className="hidden" />
    </>
  )
}
