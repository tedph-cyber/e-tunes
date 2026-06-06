"use client"
import { useState } from "react"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import { useRecorder } from "@/hooks/useRecorder"
import TranscriptionResult from "@/components/TranscriptionResult"
import * as api from "@/lib/api"
import type { TranscribeNoteResult, TranscribeChordResult } from "@/types"

export default function TranscribePage() {
  const { playChordFromRoot } = useAudioEngine()
  const { isRecording, error: recError, startRecording, stopRecording } = useRecorder()
  const [mode, setMode] = useState<"note" | "chord">("note")
  const [loading, setLoading] = useState(false)
  const [noteResult, setNoteResult] = useState<TranscribeNoteResult | null>(null)
  const [chordResult, setChordResult] = useState<TranscribeChordResult | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleRecord = async () => {
    setApiError(null)
    if (!isRecording) {
      await startRecording()
    } else {
      setLoading(true)
      try {
        const blob = await stopRecording()
        const result =
          mode === "note"
            ? await api.transcribeNote(blob)
            : await api.transcribeChord(blob)
        if (mode === "note") {
          setNoteResult(result as TranscribeNoteResult)
        } else {
          setChordResult(result as TranscribeChordResult)
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Transcription failed")
      } finally {
        setLoading(false)
      }
    }
  }

  const error = apiError || recError

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Title */}
      <h1 className="text-xl font-bold mb-6">Transcription</h1>

      {/* Mode Toggle */}
      <div className="flex mb-8 bg-surface rounded p-1">
        {(["note", "chord"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setNoteResult(null); setChordResult(null) }}
            className={`flex-1 py-2 rounded font-semibold text-sm transition-all ${
              mode === m
                ? "bg-sonic-blue/20 text-sonic-blue"
                : "text-muted hover:text-white"
            }`}
          >
            {m === "note" ? "Note" : "Chord"}
          </button>
        ))}
      </div>

      {/* Mic Button */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={handleRecord}
          disabled={loading}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            loading
              ? "bg-muted/30 cursor-not-allowed"
              : isRecording
              ? "bg-red-500/20 border-2 border-red-500 animate-pulse"
              : "bg-sonic-blue/10 border-2 border-sonic-blue/30 hover:bg-sonic-blue/20 hover:border-sonic-blue/50"
          }`}
        >
          <span className={`material-symbols-outlined text-4xl ${
            isRecording ? "text-red-400" : "text-sonic-blue"
          }`}>
            mic
          </span>
        </button>
        <p className="text-sm text-muted mt-3">
          {loading ? "Processing..." : isRecording ? "Recording..." : "Ready to listen"}
        </p>
      </div>

      {/* Result Display */}
      <TranscriptionResult
        loading={loading}
        noteResult={noteResult}
        chordResult={chordResult}
        mode={mode}
      />

      {/* Error Banner */}
      {error && (
        <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded p-4">
          <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">warning</span>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Reference Play */}
      <div className="mt-8">
        <button
          onClick={() => playChordFromRoot("C", [0, 4, 7])}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined text-lg">play_circle</span>
          Reference Play (C Major)
        </button>
      </div>
    </div>
  )
}
