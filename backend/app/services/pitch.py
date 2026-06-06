"""Monophonic pitch transcription using librosa pyin."""

import io

import librosa
import numpy as np
from fastapi import HTTPException


NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


def hz_to_note_name(frequency: float) -> tuple[str, int]:
    if frequency <= 0 or np.isnan(frequency):
        return "Unknown", 0
    semitones_from_a4 = round(12 * np.log2(frequency / 440.0))
    midi_note = semitones_from_a4 + 69
    if midi_note < 0 or midi_note > 127:
        return "Unknown", 0
    name = f"{NOTE_NAMES[midi_note % 12]}{(midi_note // 12) - 1}"
    return name, midi_note


def load_audio(file_bytes: bytes) -> tuple[np.ndarray, int]:
    try:
        y, sr = librosa.load(io.BytesIO(file_bytes), sr=None, mono=True)
        return y, sr
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")


async def transcribe_note(file_bytes: bytes) -> dict:
    y, sr = load_audio(file_bytes)

    f0, voiced_flag, voiced_probs = librosa.pyin(
        y, sr=sr, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7')
    )

    valid_pitches = f0[voiced_flag & (voiced_probs > 0.6)]

    if len(valid_pitches) == 0:
        return {"detected": False, "note": None, "hz": 0.0, "midi": None}

    detected_hz = float(np.median(valid_pitches))
    note_name, midi = hz_to_note_name(detected_hz)
    return {"detected": True, "note": note_name, "hz": round(detected_hz, 2), "midi": midi}
