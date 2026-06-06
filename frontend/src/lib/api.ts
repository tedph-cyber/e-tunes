import type {
  TranscribeNoteResult,
  TranscribeChordResult,
  Scale,
  ScaleDetail,
  Chord,
  Interval,
  ScaleIdChallenge,
  ScaleIdResult,
  IntervalIdChallenge,
  IntervalIdResult,
  NoteIdChallenge,
  NoteIdResult,
  ChordIdChallenge,
  ChordIdResult,
  Tier,
} from "@/types"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function transcribeNote(blob: Blob): Promise<TranscribeNoteResult> {
  const formData = new FormData()
  formData.append("file", blob, "capture.webm")
  return fetchJson<TranscribeNoteResult>(`${API}/api/transcribe/note`, {
    method: "POST",
    body: formData,
  })
}

export async function transcribeChord(blob: Blob): Promise<TranscribeChordResult> {
  const formData = new FormData()
  formData.append("file", blob, "capture.webm")
  return fetchJson<TranscribeChordResult>(`${API}/api/transcribe/chord`, {
    method: "POST",
    body: formData,
  })
}

export async function getScales(category?: string): Promise<{ scales: Scale[]; total: number }> {
  const params = category ? `?category=${category}` : ""
  return fetchJson(`${API}/api/scales${params}`)
}

export async function getScale(id: string): Promise<ScaleDetail> {
  return fetchJson(`${API}/api/scales/${id}`)
}

export async function getChords(quality?: string): Promise<{ chords: Chord[]; total: number }> {
  const params = quality ? `?quality=${quality}` : ""
  return fetchJson(`${API}/api/chords${params}`)
}

export async function getIntervals(): Promise<{ intervals: Interval[] }> {
  return fetchJson(`${API}/api/intervals`)
}

export async function getScaleIdChallenge(tier: number = 1): Promise<ScaleIdChallenge> {
  return fetchJson(`${API}/api/exercises/scale-id?tier=${tier}`)
}

export async function answerScaleIdChallenge(
  challengeId: string,
  answerId: string
): Promise<ScaleIdResult> {
  return fetchJson(`${API}/api/exercises/scale-id/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challenge_id: challengeId, answer_id: answerId }),
  })
}

export async function getIntervalIdChallenge(tier: number = 1): Promise<IntervalIdChallenge> {
  return fetchJson(`${API}/api/exercises/interval-id?tier=${tier}`)
}

export async function answerIntervalIdChallenge(
  challengeId: string,
  answerId: string
): Promise<IntervalIdResult> {
  return fetchJson(`${API}/api/exercises/interval-id/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challenge_id: challengeId, answer_id: answerId }),
  })
}

export async function getNoteIdChallenge(tier: number = 1): Promise<NoteIdChallenge> {
  return fetchJson(`${API}/api/exercises/note-id?tier=${tier}`)
}

export async function answerNoteIdChallenge(
  challengeId: string,
  answerId: string
): Promise<NoteIdResult> {
  return fetchJson(`${API}/api/exercises/note-id/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challenge_id: challengeId, answer_id: answerId }),
  })
}

export async function getChordIdChallenge(tier: number = 1): Promise<ChordIdChallenge> {
  return fetchJson(`${API}/api/exercises/chord-id?tier=${tier}`)
}

export async function answerChordIdChallenge(
  challengeId: string,
  answerId: string
): Promise<ChordIdResult> {
  return fetchJson(`${API}/api/exercises/chord-id/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challenge_id: challengeId, answer_id: answerId }),
  })
}

export async function getCurriculum(): Promise<{ tiers: Tier[] }> {
  return fetchJson(`${API}/api/curriculum`)
}

export function getAudioUrl(path: string): string {
  return `${API}${path}`
}
