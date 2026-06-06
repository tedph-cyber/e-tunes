"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import * as api from "@/lib/api"
import type { Scale } from "@/types"

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "diatonic", label: "Diatonic" },
  { value: "diatonic_mode", label: "Modes" },
  { value: "pentatonic", label: "Pentatonic" },
  { value: "blues", label: "Blues" },
  { value: "minor", label: "Minor" },
]

const CATEGORY_MAP: Record<string, string> = {
  harmonic_minor: "minor",
  melodic_minor: "minor",
  symmetric: "Modes",
  exotic: "Modes",
  japanese: "Modes",
  gamelan: "Modes",
}

function displayCategory(cat: string): string {
  if (cat === "diatonic_mode") return "Modes"
  if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat]
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

export default function ScalesPage() {
  const [scales, setScales] = useState<Scale[]>([])
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { playAudioUrl } = useAudioEngine()

  useEffect(() => {
    setLoading(true)
    api
      .getScales(category || undefined)
      .then((data) => setScales(data.scales))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Scale Library</h1>
      </div>
      <p className="text-muted text-sm mb-6 max-w-2xl">
        Technical reference for melodic structures, harmonic intervals, and modal variations for professional transcription.
      </p>

      {/* Count + Categories */}
      <div className="flex items-center justify-between mb-6">
        {!loading && (
          <p className="text-xs text-muted flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            {scales.length} Scales Found
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              category === cat.value
                ? "bg-sonic-blue/20 text-sonic-blue border border-sonic-blue/30"
                : "text-muted border border-surface-2 hover:text-white hover:border-surface-bright"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 mb-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-muted py-12">Loading scales...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {scales.map((scale) => (
            <Link
              key={scale.id}
              href={`/scales/${scale.id}`}
              className="card group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted bg-white/5 px-2 py-0.5 rounded">
                      {displayCategory(scale.category)}
                    </span>
                    <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{scale.name}</h3>
                  <p className="text-xs text-muted mb-3">
                    {scale.cardinality} Notes • {scale.intervals.map((i) => i).join(", ")}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-sonic-blue group-hover:gap-2 transition-all">
                    Explore Intervals
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Add Custom Scale card */}
          <div className="card border-dashed border-white/10 flex items-center justify-center py-8 cursor-pointer hover:border-sonic-blue/30">
            <div className="text-center">
              <span className="material-symbols-outlined text-2xl text-muted mb-2">add</span>
              <p className="text-sm font-medium text-muted">Add Custom Scale</p>
              <p className="text-xs text-muted/60 mt-1">Define custom interval mappings</p>
            </div>
          </div>
        </div>
      )}

      {/* Pro Tip */}
      <div className="bg-surface border border-surface-2 rounded p-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-sonic-blue text-xl mt-1">lightbulb</span>
        <div>
          <p className="font-semibold text-white mb-1">Pro Tip: Ear Training Integration</p>
          <p className="text-sm text-muted mb-4">
            You can directly practice recognizing these scales in the Ear Training module. Click any scale card above 
            to generate a unique quiz focusing on that specific harmonic structure.
          </p>
          <div className="flex gap-3">
            <Link href="/ear-train/scale-id" className="btn-primary text-sm">
              Launch Training Module
            </Link>
            <button className="btn-ghost text-sm">Export Library (.MIDI)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
