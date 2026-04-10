"use client"

import { useState } from "react"
import { Plus, Search, Eye, EyeOff, Copy, Globe, CreditCard, Hotel, FileText, Lock, Check, Pencil, Trash2, ExternalLink, MoreHorizontal } from "lucide-react"

type Category = "all" | "credentials" | "bookings" | "banking" | "documents"

const CATEGORIES: { id: Category; label: string; icon: React.ElementType; count: number }[] = [
  { id: "all", label: "All Items", icon: Lock, count: 12 },
  { id: "credentials", label: "Credentials", icon: Globe, count: 6 },
  { id: "bookings", label: "Bookings", icon: Hotel, count: 2 },
  { id: "banking", label: "Banking", icon: CreditCard, count: 2 },
  { id: "documents", label: "Documents", icon: FileText, count: 2 },
]

const ITEMS = [
  { id: 1, cat: "credentials", icon: "📧", title: "Gmail", username: "arjun@gmail.com", url: "gmail.com", updated: "2d ago" },
  { id: 2, cat: "credentials", icon: "🎬", title: "Netflix", username: "arjun@gmail.com", url: "netflix.com", updated: "1w ago" },
  { id: 3, cat: "credentials", icon: "💼", title: "LinkedIn", username: "arjun@example.com", url: "linkedin.com", updated: "5d ago" },
  { id: 4, cat: "credentials", icon: "𝕏", title: "Twitter / X", username: "@arjunmehta_in", url: "x.com", updated: "2w ago" },
  { id: 5, cat: "credentials", icon: "💻", title: "GitHub", username: "arjunmehta-dev", url: "github.com", updated: "1mo ago" },
  { id: 6, cat: "credentials", icon: "🛒", title: "Amazon India", username: "arjun@gmail.com", url: "amazon.in", updated: "3d ago" },
  { id: 7, cat: "bookings", icon: "🏨", title: "Marriott — New Delhi", username: "Booking #MBF-8823", url: "marriott.com", updated: "1mo ago" },
  { id: 8, cat: "bookings", icon: "✈️", title: "IndiGo Frequent Flyer", username: "6E-FF-991827", url: "goindigo.in", updated: "3mo ago" },
  { id: 9, cat: "banking", icon: "🏦", title: "SBI Net Banking", username: "Acc: ••••••4127", url: "onlinesbi.com", updated: "2d ago" },
  { id: 10, cat: "banking", icon: "💳", title: "HDFC Credit Card", username: "Card ••••4892", url: "hdfcbank.com", updated: "1w ago" },
  { id: 11, cat: "documents", icon: "🪪", title: "Aadhaar Card", username: "XXXX XXXX 8823", url: "uidai.gov.in", updated: "6mo ago" },
  { id: 12, cat: "documents", icon: "📄", title: "PAN Card", username: "XXXXX1234X", url: "incometax.gov.in", updated: "6mo ago" },
]

const MOCK_PASSWORD = "p@ssw0rd!23"

export function OwnerVault() {
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [search, setSearch] = useState("")
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState<number | null>(null)
  const [items, setItems] = useState(ITEMS)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  const filtered = items.filter((item) => {
    const matchCat = activeCategory === "all" || item.cat === activeCategory
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleReveal(id: number) {
    setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function copyText(text: string, id: number) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex h-full gap-px bg-border overflow-hidden">

      {/* ── Left: category nav ── */}
      <div className="hidden w-48 shrink-0 flex-col gap-px bg-border lg:flex">
        {/* Search header */}
        <div className="flex flex-col gap-2 bg-background p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Vault</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-muted/30 py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Category list */}
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center justify-between gap-2 bg-background px-3 py-3 text-left transition-colors hover:bg-muted/20
              ${activeCategory === cat.id ? "border-l-2 border-primary bg-primary/5" : "border-l-2 border-transparent"}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <cat.icon className={`h-3.5 w-3.5 shrink-0 ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`truncate text-xs ${activeCategory === cat.id ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cat.label}</span>
            </div>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{cat.count}</span>
          </button>
        ))}

        {/* Add item */}
        <button className="flex flex-1 items-end bg-background px-3 py-3">
          <span className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add Item
          </span>
        </button>
      </div>

      {/* ── Right: items table ── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Table header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-4 border-b border-border/50 bg-muted/20 px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Username / ID</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Password</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</p>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-muted-foreground">
              No items found
            </div>
          )}
          {filtered.map((item) => {
            const isRevealed = revealed.has(item.id)
            return (
              <div
                key={item.id}
                className="group grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                {/* Name + icon */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{item.url} · {item.updated}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate font-mono text-xs text-muted-foreground">{item.username}</span>
                  <button onClick={() => copyText(item.username, item.id * 10)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
                    {copied === item.id * 10 ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {isRevealed ? MOCK_PASSWORD : "•••••••••••"}
                  </span>
                  <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => toggleReveal(item.id)}
                      className="text-muted-foreground hover:text-foreground">
                      {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                    <button onClick={() => copyText(MOCK_PASSWORD, item.id)}
                      className="text-muted-foreground hover:text-foreground">
                      {copied === item.id ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative flex items-center justify-end" onMouseLeave={() => setActiveMenu(null)}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === item.id && (
                    <div className="absolute right-0 top-9 z-50 min-w-[140px] rounded-xl border border-border/60 bg-background/95 shadow-xl backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex flex-col py-1">
                        <button
                          onClick={() => { setActiveMenu(null) }}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-muted/40 text-foreground transition-colors text-left"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit details
                        </button>
                        <button
                          onClick={() => {
                            setItems(p => p.filter(x => x.id !== item.id))
                            setActiveMenu(null)
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-destructive/10 text-destructive transition-colors text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete item
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer status bar */}
        <div className="flex items-center justify-between border-t border-border/40 bg-muted/10 px-4 py-2">
          <p className="text-[10px] text-muted-foreground">{filtered.length} of {ITEMS.length} items</p>
          <button className="flex items-center gap-1.5 text-[10px] text-primary hover:underline">
            <Plus className="h-3 w-3" /> Add new item
          </button>
        </div>
      </div>
    </div>
  )
}
