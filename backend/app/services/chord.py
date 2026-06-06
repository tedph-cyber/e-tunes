"""Chord transcription using chromagram template matching."""

import io

import librosa
import numpy as np
from fastapi import HTTPException


NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

CHORD_TEMPLATES = {
    "Major": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    "Minor": [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    "Diminished": [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    "Augmented": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    "Dominant 7th": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    "Major 7th": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    "Minor 7th": [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
}


def load_audio(file_bytes: bytes) -> tuple[np.ndarray, int]:
    try:
        y, sr = librosa.load(io.BytesIO(file_bytes), sr=None, mono=True)
        return y, sr
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")


async def transcribe_chord(file_bytes: bytes) -> dict:
    y, sr = load_audio(file_bytes)

    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    mean_chroma = np.mean(chroma, axis=1)

    best_score = -1.0
    detected_root = 0
    detected_quality = "Unknown"

    for root_shift in range(12):
        shifted_chroma = np.roll(mean_chroma, -root_shift)
        for quality, template in CHORD_TEMPLATES.items():
            score = np.dot(shifted_chroma, template)
            if score > best_score:
                best_score = score
                detected_root = root_shift
                detected_quality = quality

    chord_name = f"{NOTE_NAMES[detected_root]} {detected_quality}"
    return {
        "detected": True,
        "chord": chord_name,
        "root": NOTE_NAMES[detected_root],
        "quality": detected_quality,
    }
