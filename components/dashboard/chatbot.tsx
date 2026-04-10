"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, ChevronRight, ArrowLeft, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type CollectStep = "idle" | "name" | "email" | "ready"

interface Message {
  id: number
  role: "bot" | "user"
  text: string
  options?: string[]
  timestamp: Date
}

const FAQ = [
  {
    q: "How do I add a nominee?",
    a: "Go to **Nominees** in the sidebar → click 'Add Nominee' → enter their name, email, and relation. They receive an invite to verify their identity. Once verified, they can access your vault after multi-factor verification.",
  },
  {
    q: "What is the 72-hour hold?",
    a: "After death registration, a mandatory **72-hour hold** activates before nominees can access the vault. This prevents fraudulent access. Nominees receive an SMS alert when the window opens. This cannot be disabled.",
  },
  {
    q: "How does face verification work?",
    a: "Nominees complete **live face verification** via their device camera with liveness detection (blink test). Your face data is never stored — only a real-time match score is processed during the session.",
  },
  {
    q: "How do nominees access records?",
    a: "Nominees switch to **Nominee mode** (top role switcher) → 'Access Request' → enter Aadhaar + death cert number → verify OTP + face + secret question → select departments → fetch records.",
  },
  {
    q: "Is my data encrypted?",
    a: "Yes. All data is **AES-256 encrypted** in a zero-knowledge vault — even our servers cannot read your data. Your encryption key is derived from your credentials and never stored on our servers.",
  },
  {
    q: "What data can I store?",
    a: "You can store: login credentials, bank account details, insurance policies, hotel/travel bookings, government IDs, property documents, and any sensitive notes — all encrypted and accessible only to you and verified nominees.",
  },
]

const INITIAL_OPTIONS = FAQ.slice(0, 3).map((f) => f.q)
let msgId = 0

function nextId() {
  return ++msgId
}

function botMsg(text: string, options?: string[]): Message {
  return { id: nextId(), role: "bot", text, options, timestamp: new Date() }
}

function userMsg(text: string): Message {
  return { id: nextId(), role: "user", text, timestamp: new Date() }
}

function renderText(text: string) {
  // Bold markdown
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
      : part
  )
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    botMsg("Hi! I'm the Afterlife AI assistant. Ask me anything about your vault, nominees, or security.", INITIAL_OPTIONS),
  ])
  const [input, setInput] = useState("")
  const [collectStep, setCollectStep] = useState<CollectStep>("idle")
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [collected, setCollected] = useState(false)
  const [unread, setUnread] = useState(0)
  const [queryCount, setQueryCount] = useState(0)
  const [ticketCreated, setTicketCreated] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => inputRef.current?.focus(), 100)
      setUnread(0)
    }
  }, [messages, open])

  function addBotMsg(text: string, options?: string[]) {
    const msg = botMsg(text, options)
    setMessages((prev) => [...prev, msg])
    if (!open) setUnread((n) => n + 1)
  }

  function handleClear() {
    setMessages([botMsg("Hi! I'm the Afterlife AI assistant. Ask me anything about your vault, nominees, or security.", INITIAL_OPTIONS)])
    setInput("")
    setCollectStep("idle")
    setUserName(null)
    setUserEmail(null)
    setCollected(false)
    setUnread(0)
    setQueryCount(0)
    setTicketCreated(false)
  }

  function handleSend(text?: string) {
    const value = (text ?? input).trim()
    if (!value) return
    setInput("")

    setMessages((prev) => [...prev, userMsg(value)])

    // Collection flow — triggered on first message when not yet collected
    if (!collected) {
      if (collectStep === "idle") {
        // First message ever — start collecting
        setCollectStep("name")
        setTimeout(() => addBotMsg(`Got it! Before I help, may I know your name? 😊`), 400)
        return
      }
      if (collectStep === "name") {
        setUserName(value)
        setCollectStep("email")
        setTimeout(() => addBotMsg(`Nice to meet you, **${value}**! What's your email so I can follow up if needed?`), 400)
        return
      }
      if (collectStep === "email") {
        setUserEmail(value)
        setCollectStep("ready")
        setCollected(true)
        setTimeout(() => addBotMsg(
          `Perfect, **${userName}**! I've saved your details. Here's what I can help you with:`,
          INITIAL_OPTIONS
        ), 400)
        return
      }
    }

    // FAQ matching & Query limit
    if (collected && !ticketCreated) {
      const newCount = queryCount + 1
      setQueryCount(newCount)

      if (newCount === 3) {
        setTimeout(() => addBotMsg(
          `I notice you have several questions. Do you want me to create a support ticket for you so our team can help?`,
          ["Create support ticket", "No, thanks"]
        ), 500)
        return
      }
    }

    const match = FAQ.find((f) => f.q.toLowerCase() === value.toLowerCase() || value.toLowerCase().includes(f.q.toLowerCase().slice(0, 20)))
    if (match) {
      setTimeout(() => addBotMsg(match.a, ["Ask another question", "Back to main menu"]), 500)
    } else {
      setTimeout(() => addBotMsg(
        `I don't have a specific answer for that, but here are common topics I can help with:`,
        INITIAL_OPTIONS
      ), 500)
    }
  }

  function handleOption(opt: string) {
    if (opt === "Back to main menu" || opt === "Ask another question") {
      handleSend(opt === "Back to main menu" ? "Show me main menu options" : "I have another question")
      setTimeout(() => addBotMsg("Sure! What would you like to know?", INITIAL_OPTIONS), 600)
      return
    }
    if (opt === "Create support ticket") {
      handleSend(opt)
      setTicketCreated(true)
      setTimeout(() => addBotMsg(
        `I've created a support ticket **(TKT-8294)** for you. Our senior support team will email you at **${userEmail}** within 2 hours.`
      ), 500)
      return
    }
    if (opt === "No, thanks") {
      handleSend(opt)
      setQueryCount(0) // Reset to allow more queries
      setTimeout(() => addBotMsg("Okay! Here are common topics I can help with:", INITIAL_OPTIONS), 500)
      return
    }

    handleSend(opt)
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_32px_hsl(var(--primary)/0.5)] transition-all duration-300"
            >
              <MessageCircle className="h-6 w-6" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute bottom-16 right-0 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-[1.5rem] border-[1.5px] border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/10"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border/40 bg-muted/20 px-4 py-3.5 backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 shadow-sm">
                  <svg viewBox="0 0 16 16" fill="none" className="h-5 w-5 text-primary-foreground">
                    <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6.5 3-1 5.5-3.5 5.5-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Afterlife AI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] text-muted-foreground">
                      {userName ? `Chatting as ${userName}` : "Online · Ask me anything"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors mr-1"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
                    {/* Avatar */}
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      msg.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-3.5 w-3.5" />}
                    </div>

                    <div className={cn("max-w-[80%] space-y-2", msg.role === "user" && "items-end flex flex-col")}>
                      {/* Bubble */}
                      <div className={cn(
                        "px-4 py-3 text-[13px] leading-relaxed shadow-sm",
                        msg.role === "bot"
                          ? "rounded-2xl rounded-tl-sm bg-muted/80 text-foreground border border-border/30"
                          : "rounded-2xl rounded-tr-sm bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                      )}>
                        {renderText(msg.text)}
                      </div>

                      {/* Quick option buttons */}
                      {msg.options && msg.role === "bot" && (
                        <div className="space-y-1.5">
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOption(opt)}
                              className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-left text-[11px] font-semibold text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                            >
                              <span className="truncate">{opt}</span>
                              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                <div ref={endRef} />
              </div>

              {/* Input area */}
              {ticketCreated ? (
                <div className="border-t border-border/40 bg-primary/10 p-4 text-center backdrop-blur-lg">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary mb-2 shadow-lg shadow-primary/30">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary-foreground" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-foreground">Ticket Created</p>
                  <p className="text-[11px] text-muted-foreground mt-1 px-4">Chat closed. Our team will contact you securely via email.</p>
                </div>
              ) : (
                <div className="border-t border-border/40 bg-background/60 backdrop-blur-lg p-3">
                  {userName && !userEmail && (
                    <p className="mb-2 text-center text-[10px] text-muted-foreground">
                      Collecting your details — this is secure and private
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                      placeholder={
                        collectStep === "name" ? "Type your name…"
                        : collectStep === "email" ? "Type your email…"
                        : "Ask a question…"
                      }
                      className="flex-1 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    Afterlife AI · Secure · Encrypted
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
