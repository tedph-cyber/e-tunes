"use client"
import ScaleVisualizer from "@/components/ScaleVisualizer"
import { useScale } from "@/hooks/useScales"
import { useAudioEngine } from "@/hooks/useAudioEngine"

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const ROMAN = ["I", "ii", "iii", "IV", "V", "vi", "vii"]
const STEP_LABELS: Record<number, string> = { 1: "HALF", 2: "WHOLE" }

export default function ScaleDetailPage({ params }: { params: { id: string } }) {
  const { scale, loading, error } = useScale(params.id)
  const { playAudioUrl } = useAudioEngine()

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  if (error || !scale) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-sm text-red-400">
          {error || "Scale not found"}
        </div>
      </div>
    )
  }

  const intervals = scale.intervals
  const steps = intervals.map((interval, i) => i === 0 ? interval : interval - intervals[i - 1])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <span>Library</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span>Scales</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-white">{scale.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">
            {scale.category} • Mode {scale.category === "diatonic" ? "I" : ""}
          </p>
          <h1 className="text-2xl font-bold">{scale.name}</h1>
          <div className="flex gap-4 mt-2 text-xs text-muted">
            <span>CATEGORY: {scale.category}</span>
            <span>DIFFICULTY: Level {scale.difficulty}</span>
            <span>LENGTH: {scale.cardinality} Notes</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => playAudioUrl(`/api/audio/scale?id=${params.id}&root=C`)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          Play Scale
        </button>
        <button className="btn-ghost flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">save</span>
          Pin to Hub
        </button>
      </div>

      {/* Octave Visualization */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">music_note</span>
          Octave Visualization
        </p>
        <p className="text-xs text-muted mb-2">Reference: Middle C (C4)</p>
        <ScaleVisualizer pitchClasses={scale.pitch_classes} label="" />
      </div>

      {/* Scale Intervals */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">analytics</span>
          Scale Intervals
        </p>
        <div className="surface-elevation-1 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-lg font-bold font-mono text-sonic-blue">{step}</span>
                <span className="text-[10px] text-muted uppercase">{STEP_LABELS[step] || step}</span>
                {i < steps.length - 1 && (
                  <span className="material-symbols-outlined text-sm text-muted">arrow_forward</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted leading-relaxed">
            The {scale.name} follows this pattern of whole and half steps, defining its characteristic tonality.
          </p>
        </div>
      </div>

      {/* Pitch Classes */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">label</span>
          Pitch Classes
        </p>
        <div className="surface-elevation-1 rounded p-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {scale.pitch_classes.map((pc) => (
              <span
                key={pc}
                className="px-3 py-1 bg-sonic-blue/10 text-sonic-blue rounded text-xs font-mono border border-sonic-blue/20"
              >
                {NOTE_NAMES[pc]}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted">
            Scientific Pitch (C4) • {NOTE_NAMES[scale.pitch_classes[0]]}4 = 261.63 Hz
          </p>
        </div>
      </div>

      {/* Diatonic Chords */}
      {scale.diatonic_chords && scale.diatonic_chords.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">layers</span>
            Diatonic Chords (Triads)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scale.diatonic_chords.map((chord, i) => (
              <div key={i} className="surface-elevation-1 rounded p-3 text-center">
                <p className="text-xs text-muted">{ROMAN[i] || chord.degree}</p>
                <p className="text-sm font-semibold text-white mt-1">
                  {chord.chord_type || chord.quality}
                </p>
                <p className="text-xs text-muted mt-1">
                  {chord.intervals?.map((n: number) => NOTE_NAMES[(scale.pitch_classes[0] + n) % 12]).join(" - ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modes */}
      {scale.modes && scale.modes.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-white mb-3">Modes</p>
          <div className="flex flex-wrap gap-2">
            {scale.modes.map((mode) => (
              <span
                key={mode.id}
                className="px-3 py-1 bg-white/5 text-muted rounded text-sm border border-white/5"
              >
                {mode.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
