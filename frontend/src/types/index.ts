export interface TranscribeNoteResult {
  detected: boolean
  note: string | null
  hz: number
  midi: number | null
}

export interface TranscribeChordResult {
  detected: boolean
  chord: string | null
  root: string | null
  quality: string | null
}

export interface Scale {
  id: string
  name: string
  aliases: string[]
  intervals: number[]
  pitch_classes: number[]
  bitmask: number
  category: string
  cardinality: number
  difficulty: number
}

export interface ScaleDetail extends Scale {
  modes: Scale[]
  diatonic_chords: DiatonicChord[]
}

export interface DiatonicChord {
  degree: number
  root_offset: number
  quality: string
  chord_type: string
  intervals: number[]
}

export interface Chord {
  id: string
  name: string
  intervals: number[]
  bitmask: number
  quality: string
}

export interface Interval {
  semitones: number
  quality: string
  consonant: boolean
}

export interface ScaleIdChallenge {
  challenge_id: string
  correct_scale_id: string
  choices: Scale[]
  audio_url: string
}

export interface ScaleIdResult {
  correct: boolean
  scale: Scale
  explanation: string
}

export interface IntervalIdChallenge {
  challenge_id: string
  correct_semitones: number
  choices: Interval[]
  audio_url: string
}

export interface IntervalIdResult {
  correct: boolean
  interval: Interval
}

export interface NoteIdChallenge {
  challenge_id: string
  correct_note: string
  correct_midi: number
  choices: string[]
  audio_url: string
}

export interface NoteIdResult {
  correct: boolean
  note: string
  midi: number
}

export interface ChordIdChallenge {
  challenge_id: string
  correct_chord: string
  choices: string[]
  audio_url: string
}

export interface ChordIdResult {
  correct: boolean
  chord: string
}

export interface Tier {
  id: number
  name: string
  description: string
  topics: TierTopic[]
  unlock_requirement: { tier: number; accuracy: number; min_attempts?: number } | null
}

export interface TierTopic {
  id: string
  name: string
  scale_ids: string[]
  interval_ids: number[]
}

export type ExerciseType = "scale-id" | "interval-id" | "note-id" | "chord-id"
