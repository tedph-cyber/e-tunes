"use client"
import { useEffect, useRef } from "react"
import { Piano } from "pianova"
import type { NoteInfo } from "pianova"
import "../app/piano-styles.css"

interface InteractivePianoProps {
  startOctave?: number
  endOctave?: number
  selectedNote?: string | null
  highlightNotes?: string[]
  onNoteClick?: (note: string, midi: number) => void
  disabled?: boolean
}

export default function InteractivePiano({
  startOctave = 3,
  endOctave = 4,
  selectedNote,
  highlightNotes = [],
  onNoteClick,
  disabled,
}: InteractivePianoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pianoRef = useRef<Piano | null>(null)
  const onNoteClickRef = useRef(onNoteClick)
  const disabledRef = useRef(disabled)
  const isHighlightingRef = useRef(false)
  const prevHighlightsRef = useRef<Set<string>>(new Set())

  onNoteClickRef.current = onNoteClick
  disabledRef.current = disabled

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const piano = new Piano({
      root: container,
      range: { first: `C${startOctave}`, last: `B${endOctave}` },
      onPlayNote: (info: NoteInfo) => {
        if (!isHighlightingRef.current && !disabledRef.current) {
          onNoteClickRef.current?.(info.name, info.midi)
        }
      },
      keyboardShortcuts: !disabled,
    })

    pianoRef.current = piano

    return () => {
      piano.destroy()
      pianoRef.current = null
    }
  }, [startOctave, endOctave, disabled])

  useEffect(() => {
    const piano = pianoRef.current
    if (!piano) return

    const currentNotes = new Set([
      ...highlightNotes,
      ...(selectedNote ? [selectedNote] : []),
    ])

    const prev = prevHighlightsRef.current

    isHighlightingRef.current = true

    prev.forEach((n) => {
      if (!currentNotes.has(n)) {
        piano.stopNote(n)
      }
    })

    currentNotes.forEach((n) => {
      if (!prev.has(n)) {
        piano.playNote(n)
      }
    })

    prevHighlightsRef.current = currentNotes
    isHighlightingRef.current = false
  }, [selectedNote, highlightNotes])

  return <div ref={containerRef} className="w-full pianova-keyboard" />
}
