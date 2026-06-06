"use client"
import Link from "next/link"
import { useSessionStore } from "@/store/sessionStore"

const CARDS = [
  {
    href: "/transcribe",
    icon: "mic",
    sub: "",
    label: "Transcribe",
    desc: "Instant Recognition. Identify notes and chords from live audio with millisecond latency.",
    action: "Start Live Session",
  },
  {
    href: "/ear-train",
    icon: "hearing",
    sub: "Daily Goal: 80%",
    label: "Ear Training",
    desc: "Structured Practice. Drill intervals and scales to build permanent relative pitch recognition.",
    action: "Begin Drill",
  },
  {
    href: "/scales",
    icon: "music_note",
    sub: "300+ Modules",
    label: "Scale Library",
    desc: "Musical Reference. Explore over 300 scales, modes, and chords with interactive piano rolls.",
    action: "Browse Modes",
  },
  {
    href: "/progress",
    icon: "insights",
    sub: "14 Day Streak",
    label: "Progress",
    desc: "Performance Stats. Track your accuracy and streaks across all technical tiers.",
    action: "View Dashboard",
  },
]

const RECENT = [
  { name: "Interval Drill #42", key: "C Major / Dorian", accuracy: "94%", date: "Oct 24, 2023", correct: true },
  { name: "Live Transcribe", key: "Eb Minor Pentatonic", accuracy: "88%", date: "Oct 23, 2023", correct: true },
  { name: "Scale Identification", key: "G Mixolydian #11", accuracy: "62%", date: "Oct 22, 2023", correct: false },
]

export default function HubPage() {
  const { currentStreak } = useSessionStore()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sonic-blue text-2xl">music_note</span>
          <div>
            <h1 className="text-lg font-semibold">E-Tunes</h1>
            <p className="text-xs text-muted/60">Technical Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-surface rounded px-3 py-1.5 text-sm text-muted/60">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Session Active</span>
          </div>
          <span className="material-symbols-outlined text-muted/60 text-xl">account_circle</span>
        </div>
      </div>

      {/* Hero */}
      <section className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Master Your Ear</h2>
        <p className="text-muted/60 max-w-2xl text-sm sm:text-base leading-relaxed">
          Precision audio transcription and interval training for the modern musician.
          Refine your relative pitch with professional-grade analysis tools.
        </p>
      </section>

      {/* Nav Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card group cursor-pointer block"
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-sonic-blue mt-1">
                {card.icon}
              </span>
              <div className="flex-1 min-w-0">
                {card.sub && (
                  <p className="text-xs text-muted/60 mb-0.5">{card.sub}</p>
                )}
                <h3 className="font-semibold text-white mb-1.5">{card.label}</h3>
                <p className="text-sm text-muted/60 leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-sonic-blue group-hover:gap-2 transition-all">
                  {card.action}
                  <span className="material-symbols-outlined text-base">
                    {card.href === "/ear-train" ? "play_circle" : "arrow_forward"}
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Analysis */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Analysis</h3>
          <button className="text-sm text-sonic-blue hover:underline">View All</button>
        </div>
        <div className="card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-2 text-muted/60 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Session</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Key/Mode</th>
                <th className="text-left px-5 py-3 font-medium">Accuracy</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map((s, i) => (
                <tr key={i} className="border-b border-surface-2 last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${
                        s.correct ? "text-theory-green" : "text-red-400"
                      }`}>
                        {s.correct ? "check_circle" : "error_outline"}
                      </span>
                      <span className="font-medium text-white">{s.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted/60 hidden sm:table-cell">{s.key}</td>
                  <td className={`px-5 py-3.5 font-mono ${
                    s.correct ? "text-theory-green" : "text-red-400"
                  }`}>{s.accuracy}</td>
                  <td className="px-5 py-3.5 text-muted/60 hidden sm:table-cell">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-surface-2 text-xs text-muted/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>E-Tunes &copy; 2024 E-Tunes Technical Audio Systems</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">API Docs</span>
            <span className="hover:text-white cursor-pointer">Hardware Sync</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
