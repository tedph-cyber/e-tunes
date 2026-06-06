"use client"
import { useState } from "react"

interface Choice {
  id: string
  label: string
}

interface ExercisePanelProps {
  instruction: string
  choices: Choice[]
  onSubmit: (answerId: string) => void
  onPlay?: () => void
  loading?: boolean
  disabled?: boolean
}

export default function ExercisePanel({
  instruction,
  choices,
  onSubmit,
  onPlay,
  loading,
  disabled,
}: ExercisePanelProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!selected) return
    onSubmit(selected)
    setSelected(null)
  }

  return (
    <div className="max-w-lg w-full mx-auto">
      <p className="text-center text-sm text-muted mb-6">{instruction}</p>

      {onPlay && (
        <div className="flex justify-center mb-8">
          <button
            onClick={onPlay}
            disabled={loading}
            className="w-20 h-20 rounded-full bg-sonic-blue/10 border-2 border-sonic-blue/30 hover:bg-sonic-blue/20 hover:border-sonic-blue/50 
                       flex items-center justify-center transition-all duration-200"
          >
            <span className="material-symbols-outlined text-3xl text-sonic-blue">
              {loading ? "hourglass" : "play_arrow"}
            </span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => setSelected(choice.id)}
            disabled={disabled}
            className={`py-3 px-4 rounded font-semibold text-sm transition-all border ${
              selected === choice.id
                ? "bg-sonic-blue/20 border-sonic-blue/50 text-sonic-blue"
                : "surface-elevation-1 border-white/5 text-muted hover:border-white/20 hover:text-white"
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selected || disabled || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-40"
          >
            {loading ? "Checking..." : "Submit Answer"}
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}
