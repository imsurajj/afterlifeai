"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Eye, EyeOff, Copy, Globe, CreditCard, Hotel, FileText, Lock, Check, Pencil, Trash2, ExternalLink, MoreHorizontal, X, Save, Loader2, Landmark, FileCheck, Building2 } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type Category = "all" | "credentials" | "bookings" | "banking" | "documents"

const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All Items", icon: Lock },
  { id: "credentials", label: "Credentials", icon: Globe },
  { id: "bookings", label: "Bookings", icon: Hotel },
  { id: "banking", label: "Banking", icon: CreditCard },
  { id: "documents", label: "Documents", icon: FileText },
]

export function OwnerVault() {
  const { user, vaultItems, refreshVault } = useDashboard()
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [search, setSearch] = useState("")
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Add Item Logic
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemUsername, setNewItemUsername] = useState("")
  const [newItemContent, setNewItemContent] = useState("")
  const [newItemCategory, setNewItemCategory] = useState<Category>("credentials")

  // Category counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: vaultItems.length }
    vaultItems.forEach(item => {
      c[item.category] = (c[item.category] || 0) + 1
    })
    return c
  }, [vaultItems])

  const filtered = vaultItems.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.username || "").toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleReveal(id: string) {
    setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItemTitle || !newItemContent) return
    setLoading(true)

    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newItemCategory,
          title: newItemTitle,
          username: newItemUsername,
          content: newItemContent,
          url: newItemTitle.toLowerCase().replace(/\s+/g, "") + ".com",
          icon: newItemCategory === "banking" ? "🏦" : newItemCategory === "documents" ? "📄" : newItemCategory === "bookings" ? "🏨" : "🔑",
        })
      })

      if (res.ok) {
        await refreshVault()
        setShowAddItem(false)
        setNewItemTitle("")
        setNewItemUsername("")
        setNewItemContent("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full gap-px bg-border overflow-hidden">

      {/* ── Left: category nav ── */}
      <div className="hidden w-48 shrink-0 flex-col gap-px bg-border lg:flex">
        <div className="flex flex-col gap-2 bg-background p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Vault Registry</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-40" />
            <input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/5 bg-white/[0.02] py-2 pl-8 pr-2 text-[11px] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/10 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 bg-background">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-all hover:bg-white/[0.02]",
                activeCategory === cat.id ? "bg-white/[0.04] border-r-2 border-primary" : "opacity-40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <cat.icon className={cn("h-3.5 w-3.5 shrink-0", activeCategory === cat.id ? "text-primary" : "text-slate-500")} />
                <span className="truncate text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
              </div>
              <span className="shrink-0 text-[9px] font-bold text-muted-foreground">{counts[cat.id] || 0}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowAddItem(true)}
          className="flex items-center gap-2 bg-background p-4 text-[11px] font-black uppercase tracking-widest text-primary hover:text-white transition-all border-t border-white/5"
        >
          <Plus className="h-3.5 w-3.5" /> Anchor Item
        </button>
      </div>

      {/* ── Right: items table ── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-black">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-4 border-b border-white/5 bg-white/[0.02] px-6 py-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Classification</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Identifer / Value</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Password</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 min-w-[32px]">Nodes</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Lock className="h-8 w-8 text-white/5 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Empty Cryptographic Layer</p>
            </div>
          )}
          {filtered.map((item) => {
            const isRevealed = revealed.has(item.id)
            return (
              <div
                key={item.id}
                className="group grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-white/[0.01] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg shrink-0 opacity-80 group-hover:scale-110 transition-transform duration-500">{item.icon || '🔑'}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-white italic">{item.title}</p>
                    <p className="truncate text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{item.url} · {formatDistanceToNow(new Date(item.createdAt))} ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate font-mono text-[11px] font-bold text-slate-500 italic selection:bg-primary/20">{item.username || '—'}</span>
                  {item.username && (
                    <button onClick={() => copyText(item.username, item.id + '_u')}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-white transition-all">
                      {copied === item.id + '_u' ? <Check className="h-3 w-3 text-primary animate-in zoom-in" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    "truncate font-mono text-[11px] font-bold transition-colors",
                    isRevealed ? "text-primary" : "text-slate-800"
                  )}>
                    {isRevealed ? item.content : "••••••••••••"}
                  </span>
                  <div className="flex shrink-0 items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => toggleReveal(item.id)} className="text-slate-600 hover:text-white">
                      {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                    <button onClick={() => copyText(item.content, item.id)} className="text-slate-600 hover:text-white">
                      {copied === item.id ? <Check className="h-3 w-3 text-primary animate-in zoom-in" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center justify-end" onMouseLeave={() => setActiveMenu(null)}>
                  <button onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-white/5 hover:text-white transition-all">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {activeMenu === item.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        className="absolute right-0 top-9 z-50 min-w-[140px] rounded-xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl overflow-hidden">
                        <div className="flex flex-col p-1">
                          <button className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
                            <Pencil className="h-3 w-3" /> Edit details
                          </button>
                          <button className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all text-left">
                            <Trash2 className="h-3 w-3" /> Purge archive
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.01] px-6 py-2.5 shrink-0">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">{filtered.length} Clusters Indexed</p>
          <div className="flex items-center gap-4 opacity-10 grayscale">
             <Landmark size={12} />
             <FileCheck size={12} />
             <Building2 size={12} />
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Anchor to Vault</h3>
                <button onClick={() => setShowAddItem(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddItem} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Security Cluster</label>
                  <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value as Category)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-primary focus:ring-0 focus:outline-none cursor-pointer"
                  >
                    <option value="credentials" className="bg-[#0b0b0b]">Credentials & Keys</option>
                    <option value="banking" className="bg-[#0b0b0b]">Financial Artifacts</option>
                    <option value="documents" className="bg-[#0b0b0b]">Legal Documents</option>
                    <option value="bookings" className="bg-[#0b0b0b]">Travel Bookings</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Label</label>
                  <input type="text" required autoFocus value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-primary focus:ring-0 focus:outline-none" placeholder="e.g. BTC Private Key" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Identifier (Optional)</label>
                  <input type="text" value={newItemUsername} onChange={(e) => setNewItemUsername(e.target.value)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-[13px] font-bold text-white focus:border-primary focus:ring-0 focus:outline-none" placeholder="e.g. user@vault.lock" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Password</label>
                  <textarea required value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-bold text-white focus:border-primary focus:ring-0 focus:outline-none" rows={3} placeholder="Enter high-value data..." 
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="flex w-full items-center justify-center gap-3 h-11 rounded-lg bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><Save className="h-3.5 w-3.5" /> Secure & Serialize</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
