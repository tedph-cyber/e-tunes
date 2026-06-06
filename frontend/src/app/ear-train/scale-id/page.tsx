"use client"
import { useState, useCallback } from "react"
import ScaleVisualizer from "@/components/ScaleVisualizer"
import { useExercises } from "@/hooks/useExercises"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import type { ScaleIdChallenge, ScaleIdResult } from "@/types"

export default function ScaleIdPage() {
  const { loading, fetchScaleChallenge, submitScaleAnswer } = useExercises()
  const { playAudioUrl } = useAudioEngine()
  const [challenge, setChallenge] = useState<ScaleIdChallenge | null>(null)
  const [result, setResult] = useState<ScaleIdResult | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [questionNum, setQuestionNum] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const loadChallenge = useCallback(async (tier: number = 1) => {
    setResult(null)
    setSelected(null)
    setError(null)
    const c = await fetchScaleChallenge(tier)
    if (c) {
      setChallenge(c)
      setQuestionNum((n) => n + 1)
    } else {
      setError("Failed to load challenge")
    }
  }, [fetchScaleChallenge])

  const handleSubmit = useCallback(async () => {
    if (!challenge || !selected) return
    const res = await submitScaleAnswer(challenge.challenge_id, selected)
    if (res) setResult(res)
  }, [challenge, selected, submitScaleAnswer])

  const handlePlay = useCallback(() => {
    if (!challenge) return
    playAudioUrl(challenge.audio_url)
  }, [challenge, playAudioUrl])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {!challenge && !result && (
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-2">Scale Identification</h1>
          <p className="text-muted text-sm mb-8">Hear a scale and identify it</p>
          <button onClick={() => loadChallenge(1)} className="btn-primary">
            Start Practice
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 mb-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">warning</span>
          <div className="flex-1">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => loadChallenge(1)} className="text-sm text-red-300 hover:underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {challenge && !result && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider">Scale Identification • Tier 1</p>
              <h1 className="text-xl font-bold mt-1">Scale Identification</h1>
            </div>
            <p className="text-sm text-muted">Question {questionNum} of 10</p>
          </div>

          <p className="text-center text-sm text-muted mb-6">Which scale do you hear?</p>

          <div className="flex justify-center mb-8">
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-20 h-20 rounded-full bg-sonic-blue/10 border-2 border-sonic-blue/30 hover:bg-sonic-blue/20 hover:border-sonic-blue/50 
                         flex items-center justify-center transition-all duration-200"
            >
              <span className="material-symbols-outlined text-3xl text-sonic-blue">play_arrow</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {challenge.choices.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`py-3 px-4 rounded font-semibold text-sm transition-all border ${
                  selected === c.id
                    ? "bg-sonic-blue/20 border-sonic-blue/50 text-sonic-blue"
                    : "surface-elevation-1 border-white/5 text-muted hover:border-white/20 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {selected && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-40"
              >
                {loading ? "Checking..." : "Submit Answer"}
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}

      {result && (
        <div className="surface-elevation-2 rounded p-8">
          <div className="text-center mb-6">
            <span className={`material-symbols-outlined text-5xl mb-3 ${
              result.correct ? "text-theory-green" : "text-red-400"
            }`}>
              {result.correct ? "check_circle" : "cancel"}
            </span>
            <h2 className={`text-2xl font-bold ${result.correct ? "text-theory-green" : "text-red-400"}`}>
              {result.correct ? "Correct!" : "Incorrect"}
            </h2>
            <p className="text-muted mt-1">You heard: <span className="font-mono text-white font-bold">{result.scale.name}</span></p>
          </div>

          {/* Visualization */}
          <div className="mb-6">
            <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">visibility</span>
              Visualization
            </p>
            <p className="text-xs text-muted mb-2">{result.scale.name}</p>
            <ScaleVisualizer pitchClasses={result.scale.pitch_classes} label="" />
          </div>

          {/* Theory breakdown */}
          <div className="surface-elevation-1 rounded p-4 mb-6">
            <p className="text-sm font-medium text-white flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Theory Breakdown
            </p>
            <p className="text-sm text-muted">{result.explanation}</p>
          </div>

          <p className="text-xs text-muted text-center mb-4">Difficulty: Intermediate • +25 XP</p>

          <button
            onClick={() => loadChallenge(1)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Next Challenge
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}
