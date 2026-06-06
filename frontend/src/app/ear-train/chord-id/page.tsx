"use client"
import { useState, useCallback } from "react"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import * as api from "@/lib/api"
import type { ChordIdChallenge, ChordIdResult } from "@/types"

const CHORD_QUALITIES = [
  "Major",
  "Minor",
  "Diminished",
  "Augmented",
  "Maj7",
  "Dominant 7",
]

export default function ChordIdPage() {
  const { playAudioUrl } = useAudioEngine()
  const [challenge, setChallenge] = useState<ChordIdChallenge | null>(null)
  const [result, setResult] = useState<ChordIdResult | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [correctCount, setCorrectCount] = useState(12)
  const [missedCount, setMissedCount] = useState(2)
  const [error, setError] = useState<string | null>(null)

  const loadChallenge = useCallback(async () => {
    setResult(null)
    setSelected(null)
    setError(null)
    setLoading(true)
    try {
      const c = await api.getChordIdChallenge(2)
      setChallenge(c)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load challenge")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!challenge || !selected) return
    setLoading(true)
    try {
      const res = await api.answerChordIdChallenge(challenge.challenge_id, selected)
      setResult(res)
      if (res.correct) {
        setCorrectCount((n) => n + 1)
      } else {
        setMissedCount((n) => n + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer")
    } finally {
      setLoading(false)
    }
  }, [challenge, selected])

  const handlePlay = useCallback(() => {
    if (!challenge) return
    playAudioUrl(challenge.audio_url)
  }, [challenge, playAudioUrl])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider">Chord Identification • Tier 2</p>
          <h1 className="text-xl font-bold mt-1">Chord Identification</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-theory-green">Correct: {correctCount}</span>
          <span className="text-red-400">Missed: {missedCount}</span>
        </div>
      </div>

      {!challenge && !result && (
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-2">Chord Identification</h1>
          <p className="text-muted text-sm mb-8">Hear a chord and identify its quality</p>
          <button onClick={loadChallenge} className="btn-primary">
            Start Practice
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 mb-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-400">warning</span>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {challenge && !result && (
        <>
          {/* Play button */}
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

          <p className="text-center text-sm text-muted mb-6">
            Which chord quality do you hear?<br />
            <span className="text-xs text-muted/60">Analyze the intervals carefully</span>
          </p>

          {/* Chord quality grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {CHORD_QUALITIES.map((quality) => (
              <button
                key={quality}
                onClick={() => setSelected(quality)}
                className={`py-3 px-4 rounded font-semibold text-sm transition-all border ${
                  selected === quality
                    ? "bg-sonic-blue/20 border-sonic-blue/50 text-sonic-blue"
                    : "surface-elevation-1 border-white/5 text-muted hover:border-white/20 hover:text-white"
                }`}
              >
                {String(quality).padStart(2, "0")}. {quality}
              </button>
            ))}
          </div>

          {/* Submit */}
          {selected && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-40"
              >
                {loading ? "Checking..." : "Submit Answer"}
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          )}
        </>
      )}

      {result && (
        <div className="surface-elevation-2 rounded p-8 text-center">
          <span className={`material-symbols-outlined text-5xl mb-3 ${
            result.correct ? "text-theory-green" : "text-red-400"
          }`}>
            {result.correct ? "check_circle" : "cancel"}
          </span>
          <h2 className={`text-2xl font-bold mb-2 ${result.correct ? "text-theory-green" : "text-red-400"}`}>
            {result.correct ? "Correct!" : "Incorrect"}
          </h2>
          {!result.correct && (
            <p className="text-muted mb-4">
              That was a <span className="font-mono text-white font-bold">{result.chord}</span> chord
            </p>
          )}
          <div className="flex justify-center gap-6 mt-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-theory-green">{correctCount}</p>
              <p className="text-xs text-muted">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{missedCount}</p>
              <p className="text-xs text-muted">Missed</p>
            </div>
          </div>
          <button
            onClick={loadChallenge}
            disabled={loading}
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
