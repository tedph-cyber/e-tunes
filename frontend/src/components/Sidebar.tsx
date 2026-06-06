"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/", icon: "grid_view", label: "Hub" },
  { href: "/transcribe", icon: "waves", label: "Transcribe" },
  { href: "/ear-train", icon: "hearing", label: "Ear Training" },
  { href: "/scales", icon: "music_note", label: "Scales" },
  { href: "/progress", icon: "equalizer", label: "Progress" },
]

const BOTTOM_ITEMS = [
  { icon: "settings", label: "Settings" },
  { icon: "help", label: "Support" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-surface-2 p-4 z-50">
      <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-8">
        <span className="material-symbols-outlined text-sonic-blue text-2xl">
          music_note
        </span>
        <div>
          <p className="font-semibold text-white">E-Tunes</p>
          <p className="text-xs text-muted">Technical Studio</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 ${
                isActive
                  ? "bg-sonic-blue/10 text-sonic-blue border border-sonic-blue/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-surface-2">
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-muted hover:text-white hover:bg-white/5 transition-all duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
