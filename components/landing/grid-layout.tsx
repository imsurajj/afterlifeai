"use client"

interface GridLayoutProps {
  children: React.ReactNode
  className?: string
}

export function GridLayout({ children, className = "" }: GridLayoutProps) {
  return (
    <>
      <div className={`relative z-10 overflow-x-clip ${className}`}>{children}</div>
    </>
  )
}

export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-px w-full bg-border" />
    </div>
  )
}
