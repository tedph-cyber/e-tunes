export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

export function scheduleNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number = 0.3
): void {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  osc.type = "triangle"
  osc.frequency.setValueAtTime(freq, startTime)

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02)
  gainNode.gain.setValueAtTime(volume, startTime + duration - 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playScale(
  ctx: AudioContext,
  frequencies: number[],
  noteDuration: number = 0.4,
  gap: number = 0.05
): void {
  const now = ctx.currentTime
  frequencies.forEach((freq, i) => {
    const startTime = now + i * (noteDuration + gap)
    scheduleNote(ctx, freq, startTime, noteDuration, 0.25)
  })
}

export function playChord(
  ctx: AudioContext,
  frequencies: number[],
  duration: number = 1.5
): void {
  const now = ctx.currentTime
  const voiceVolume = 0.4 / frequencies.length
  frequencies.forEach((freq) => {
    scheduleNote(ctx, freq, now, duration, voiceVolume)
  })
}

export function playInterval(
  ctx: AudioContext,
  freq1: number,
  freq2: number,
  harmonic: boolean = false
): void {
  const now = ctx.currentTime
  if (harmonic) {
    scheduleNote(ctx, freq1, now, 0.8, 0.25)
    scheduleNote(ctx, freq2, now, 0.8, 0.25)
  } else {
    scheduleNote(ctx, freq1, now, 0.35, 0.25)
    scheduleNote(ctx, freq2, now + 0.45, 0.35, 0.25)
  }
}
