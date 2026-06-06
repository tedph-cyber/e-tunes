"use client"
import { useRef, useState, useEffect } from "react"
import { Piano, MidiNumbers } from "react-piano"
import "react-piano/dist/styles.css"
import "../app/piano-styles.css"

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function noteToMidi(note: string): number {
  const match = note.match(/^([A-G]#?)(\d+)$/)
  if (!match) return 60
  const pc = NOTE_NAMES.indexOf(match[1])
  const octave = parseInt(match[2])
  return MidiNumbers.fromNote(`${match[1].toLowerCase()}${octave}`)
}

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
  const [width, setWidth] = useState(700)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const firstNote = MidiNumbers.fromNote(`c${startOctave}`)
  const lastNote = MidiNumbers.fromNote(`b${endOctave}`)

  const activeNotes: number[] = []
  if (selectedNote) activeNotes.push(noteToMidi(selectedNote))
  highlightNotes.forEach((n) => {
    const m = noteToMidi(n)
    if (!activeNotes.includes(m)) activeNotes.push(m)
  })

  return (
    <div ref={containerRef} className="w-full">
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        width={width}
        activeNotes={activeNotes}
        playNote={(midiNumber) => {
          const pc = (midiNumber + 12) % 12
          const octave = Math.floor(midiNumber / 12) - 1
          const note = `${NOTE_NAMES[pc]}${octave}`
          onNoteClick?.(note, midiNumber)
        }}
        stopNote={() => {}}
        disabled={disabled}
        keyWidthToHeight={0.55}
        renderNoteLabel={({ midiNumber, isActive, isAccidental }) => {
          const pc = (midiNumber + 12) % 12
          const octave = Math.floor(midiNumber / 12) - 1
          const note = `${NOTE_NAMES[pc]}${octave}`
          const show = isActive || pc === 0
          if (!show) return null
          return (
            <div className={`ReactPiano__NoteLabel ${isAccidental ? "ReactPiano__NoteLabel--accidental" : "ReactPiano__NoteLabel--natural"} ${isActive ? "ReactPiano__NoteLabel--active" : ""}`}>
              {note}
            </div>
          )
        }}
      />
    </div>
  )
}
