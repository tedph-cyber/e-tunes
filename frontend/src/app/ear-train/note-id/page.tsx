"use client"
import { useState, useCallback } from "react"
import InteractivePiano from "@/components/InteractivePiano"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import * as api from "@/lib/api"
import type { NoteIdChallenge, NoteIdResult } from "@/types"

export default function NoteIdPage() {
  const { playNote, playAudioUrl } = useAudioEngine()
  const [challenge, setChallenge] = useState<NoteIdChallenge | null>(null)
  const [result, setResult] = useState<NoteIdResult | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [streak, setStreak] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const loadChallenge = useCallback(async () => {
    setResult(null)
    setSelected(null)
    setError(null)
    setLoading(true)
    try {
      const c = await api.getNoteIdChallenge(1)
      setChallenge(c)
      setQuestionNum((n) => n + 1)
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
      const res = await api.answerNoteIdChallenge(challenge.challenge_id, selected)
      setResult(res)
      if (res.correct) {
        setStreak((s) => s + 1)
      } else {
        setStreak(0)
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header info */}
      {challenge && !result && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Aural Precision Labs • Level 1</p>
            <h1 className="text-xl font-bold mt-1">Perfect Pitch: Note Identification</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Question {questionNum} of 10</p>
            {streak > 0 && <p className="text-sm text-theory-green">Streak: {streak} 🔥</p>}
          </div>
        </div>
      )}

      {!challenge && !result && (
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-2">Note Identification</h1>
          <p className="text-muted text-sm mb-8">Hear a note and identify it on the piano</p>
          <button onClick={loadChallenge} className="btn-primary">
            Start Practice
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 mb-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">warning</span>
          <div className="flex-1">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={loadChallenge} className="text-sm text-red-300 hover:underline mt-1">
              Retry
            </button>
          </div>
        </div>
      )}

      {challenge && !result && (
        <>
          {/* Play button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-20 h-20 rounded-full bg-sonic-blue/10 border-2 border-sonic-blue/30 hover:bg-sonic-blue/20 hover:border-sonic-blue/50 
                         flex items-center justify-center transition-all duration-200"
            >
              <span className="material-symbols-outlined text-3xl text-sonic-blue">
                {loading ? "hourglass" : "play_arrow"}
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-muted mb-4">
            Select the key that matches the pitch
          </p>

          {/* Piano */}
          <InteractivePiano
            startOctave={3}
            endOctave={4}
            selectedNote={selected}
            onNoteClick={(note) => setSelected(note)}
            disabled={loading}
          />

          {/* Selected display */}
          {selected && (
            <p className="text-center text-sm text-sonic-blue mt-3">
              Selected: <span className="font-mono font-bold">{selected}</span>
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-40"
            >
              {loading ? "Checking..." : "Submit Answer"}
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>

          {/* Progression Tip */}
          <div className="mt-8 surface-elevation-1 rounded p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-sonic-blue text-sm mt-0.5">insights</span>
            <p className="text-sm text-muted">
              <strong className="text-white">Progression Tip:</strong> Master single notes now. Starting at Level 4, 
              difficulty scales to complex chords and jazz-based harmonic progressions.
            </p>
          </div>
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
          <p className="text-muted mb-2">
            The note was <span className="font-mono text-white font-bold">{result.note}</span>
          </p>
          <InteractivePiano
            startOctave={3}
            endOctave={4}
            highlightNotes={[result.note]}
          />
          <button
            onClick={loadChallenge}
            className="btn-primary mt-6 flex items-center gap-2 mx-auto"
          >
            Next Challenge
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}
