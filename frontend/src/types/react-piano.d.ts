declare module "react-piano" {
  import type { ReactNode } from "react"

  interface NoteRange {
    first: number
    last: number
  }

  interface RenderNoteLabelArgs {
    keyboardShortcut: string | undefined
    midiNumber: number
    isActive: boolean
    isAccidental: boolean
  }

  interface PianoProps {
    noteRange: NoteRange
    width: number
    playNote: (midiNumber: number) => void
    stopNote: (midiNumber: number) => void
    activeNotes?: number[]
    disabled?: boolean
    keyWidthToHeight?: number
    className?: string
    keyboardShortcuts?: { key: string; midiNumber: number }[]
    renderNoteLabel?: (args: RenderNoteLabelArgs) => ReactNode
    onPlayNoteInput?: (midiNumber: number, extra: { prevActiveNotes: number[] }) => void
    onStopNoteInput?: (midiNumber: number, extra: { prevActiveNotes: number[] }) => void
  }

  export const Piano: React.FC<PianoProps>

  export const MidiNumbers: {
    fromNote: (note: string) => number
    NATURAL_MIDI_NUMBERS: readonly number[]
  }

  export const KeyboardShortcuts: {
    create: (config: { firstNote: number; lastNote: number; keyboardConfig: unknown[] }) => { key: string; midiNumber: number }[]
    HOME_ROW: unknown[]
    BOTTOM_ROW: unknown[]
  }

  export const Keyboard: React.FC<Record<string, unknown>>
  export const ControlledPiano: React.FC<Record<string, unknown>>
}
