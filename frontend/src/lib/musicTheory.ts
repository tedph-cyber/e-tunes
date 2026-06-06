const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export function noteToFreq(note: string, octave: number = 4): number {
  const semitone = NOTE_NAMES.indexOf(note)
  if (semitone === -1) return 440
  return 440 * 2 ** ((semitone + (octave - 4) * 12 - 9) / 12)
}

export function intervalToFreq(root: string, semitones: number, octave: number = 4): number {
  const rootFreq = noteToFreq(root, octave)
  return rootFreq * 2 ** (semitones / 12)
}

export function scaleFrequencies(
  intervals: number[],
  root: string = "C",
  octave: number = 4
): number[] {
  const rootFreq = noteToFreq(root, octave)
  return intervals.map((interval) => rootFreq * 2 ** (interval / 12))
}

export function chordFrequencies(
  intervals: number[],
  root: string = "C",
  octave: number = 4
): number[] {
  return scaleFrequencies(intervals, root, octave)
}

export function midiToNoteName(midi: number): string {
  const note = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${note}${octave}`
}
