"use client"
import { useState, useRef, useCallback } from "react"
import { createAudioContext, playScale, playChord, playInterval, scheduleNote } from "@/lib/audioEngine"
import { noteToFreq, scaleFrequencies, chordFrequencies } from "@/lib/musicTheory"
import { getAudioUrl } from "@/lib/api"

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playNote = useCallback((note: string, octave: number = 4, duration: number = 1.0) => {
    const ctx = getCtx()
    const freq = noteToFreq(note, octave)
    scheduleNote(ctx, freq, ctx.currentTime, duration, 0.3)
  }, [getCtx])

  const playChordFromRoot = useCallback(
    (root: string, intervals: number[], duration: number = 1.5) => {
      const ctx = getCtx()
      const freqs = chordFrequencies(intervals, root)
      playChord(ctx, freqs, duration)
    },
    [getCtx]
  )

  const playScaleFromRoot = useCallback(
    (intervals: number[], root: string = "C", tempo: number = 0.4) => {
      const ctx = getCtx()
      const freqs = scaleFrequencies(intervals, root)
      playScale(ctx, freqs, tempo)
    },
    [getCtx]
  )

  const playIntervalFromRoot = useCallback(
    (root: string, semitones: number, harmonic: boolean = false) => {
      const ctx = getCtx()
      const freq1 = noteToFreq(root, 4)
      const freq2 = noteToFreq(root, 4) * 2 ** (semitones / 12)
      playInterval(ctx, freq1, freq2, harmonic)
    },
    [getCtx]
  )

  const playAudioUrl = useCallback(
    (url: string) => {
      const audio = new Audio(getAudioUrl(url))
      audio.play().catch(console.error)
    },
    []
  )

  return {
    playNote,
    playChordFromRoot,
    playScaleFromRoot,
    playIntervalFromRoot,
    playAudioUrl,
  }
}
