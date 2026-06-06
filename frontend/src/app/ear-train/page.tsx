"use client"
import Link from "next/link"

const EXERCISES = [
  {
    href: "/ear-train/note-id",
    icon: "music_note",
    level: "Level 1",
    label: "Note Identification",
    desc: "Master absolute pitch. Identify individual notes across the full keyboard range with precision.",
    action: "Start Training",
  },
  {
    href: "/ear-train/interval-id",
    icon: "waves",
    level: "Daily Goal: 80%",
    label: "Interval Identification",
    desc: "The foundation of relative pitch. Recognize the distance between two notes played sequentially or simultaneously.",
    action: "Begin Drill",
  },
  {
    href: "/ear-train/scale-id",
    icon: "hearing",
    level: "300+ Modes",
    label: "Scale Identification",
    desc: "Contextual listening. Identify major, minor, and exotic modes within a harmonic framework.",
    action: "Explore Scales",
  },
  {
    href: "/ear-train/chord-id",
    icon: "music_video",
    level: "Advanced",
    label: "Chord Identification",
    desc: "Harmonic analysis. Recognize triads, seventh chords, and complex extensions in real-time.",
    action: "Start Session",
  },
]

const RECENT = [
  { name: "Interval Drill #42", key: "C Major / Dorian", accuracy: "94%", date: "Oct 24, 2023", correct: true },
  { name: "Live Transcribe", key: "Eb Minor Pentatonic", accuracy: "88%", date: "Oct 23, 2023", correct: true },
  { name: "Scale Identification", key: "G Mixolydian #11", accuracy: "62%", date: "Oct 22, 2023", correct: false },
]

export default function EarTrainHub() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Ear Training</h1>
      <p className="text-muted text-sm mb-8">
        Precision audio transcription and interval training for the modern musician.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {EXERCISES.map((ex) => (
          <Link
            key={ex.href}
            href={ex.href}
            className="card group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-sonic-blue mt-1">{ex.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">{ex.level}</p>
                <h3 className="font-semibold text-white mb-1.5">{ex.label}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{ex.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-sonic-blue group-hover:gap-2 transition-all">
                  {ex.action}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Analysis</h3>
          <button className="text-sm text-sonic-blue hover:underline">View All</button>
        </div>
        <div className="card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-2 text-muted text-xs uppercase tracking-wider">
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
                  <td className="px-5 py-3.5 text-muted hidden sm:table-cell">{s.key}</td>
                  <td className={`px-5 py-3.5 font-mono ${
                    s.correct ? "text-theory-green" : "text-red-400"
                  }`}>{s.accuracy}</td>
                  <td className="px-5 py-3.5 text-muted hidden sm:table-cell">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
