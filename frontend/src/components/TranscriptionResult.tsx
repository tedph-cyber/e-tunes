"use client"
import type { TranscribeNoteResult, TranscribeChordResult } from "@/types"

interface Props {
  loading: boolean
  noteResult?: TranscribeNoteResult | null
  chordResult?: TranscribeChordResult | null
  mode: "note" | "chord"
}

export default function TranscriptionResult({ loading, noteResult, chordResult, mode }: Props) {
  if (loading) {
    return (
      <div className="surface-elevation-2 rounded p-8 text-center">
        <span className="material-symbols-outlined text-3xl text-sonic-blue animate-pulse">graphic_eq</span>
        <p className="text-sm text-muted mt-2">DSP processing in progress...</p>
      </div>
    )
  }

  if (mode === "note" && noteResult) {
    return (
      <div className="surface-elevation-2 rounded p-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="material-symbols-outlined text-2xl text-sonic-blue">graphic_eq</span>
          <span className="text-3xl font-bold font-mono text-white">{noteResult.note || "—"}</span>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-muted">Frequency</p>
            <p className="font-mono text-white">{noteResult.hz.toFixed(1)} Hz</p>
          </div>
          <div className="text-center">
            <p className="text-muted">MIDI</p>
            <p className="font-mono text-white">{noteResult.midi ?? "—"}</p>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "chord" && chordResult) {
    return (
      <div className="surface-elevation-2 rounded p-6 text-center">
        <span className="material-symbols-outlined text-2xl text-sonic-blue">graphic_eq</span>
        <p className="text-3xl font-bold font-mono text-white mt-2">{chordResult.chord || "—"}</p>
        {chordResult.root && chordResult.quality && (
          <p className="text-sm text-muted mt-1">{chordResult.root} {chordResult.quality}</p>
        )}
      </div>
    )
  }

  return (
    <div className="surface-elevation-2 rounded p-6 text-center">
      <span className="material-symbols-outlined text-3xl text-muted">graphic_eq</span>
      <p className="text-sm text-muted mt-2">Awaiting signal input</p>
    </div>
  )
}
