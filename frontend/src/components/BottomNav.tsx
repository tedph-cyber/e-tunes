"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  { href: "/", icon: "grid_view", label: "Hub" },
  { href: "/transcribe", icon: "waves", label: "Transcribe" },
  { href: "#", icon: "add", label: "", fab: true },
  { href: "/ear-train", icon: "hearing", label: "Practice" },
  { href: "/progress", icon: "equalizer", label: "Stats" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-2 z-50">
      <div className="flex items-center justify-around py-2">
        {ITEMS.map((item) => {
          const isActive = item.fab ? false : pathname === item.href
          if (item.fab) {
            return (
              <button
                key="fab"
                className="flex items-center justify-center w-11 h-11 bg-sonic-blue rounded-full -mt-5 
                           text-navy shadow-lg shadow-sonic-blue/20 hover:shadow-sonic-blue/40 transition-shadow"
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </button>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? "text-sonic-blue" : "text-muted"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
