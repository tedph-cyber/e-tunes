"""Audio synthesis for exercises (scale playback, interval playback)."""

import io
import struct
import math

from fastapi import APIRouter, Query
from fastapi.responses import Response

from app.theory.generator import generate_scales

router = APIRouter(prefix="/api/audio", tags=["audio"])

SAMPLE_RATE = 22050
NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def _note_to_freq(note_name: str, octave: int = 4) -> float:
    try:
        semitone = NOTE_NAMES.index(note_name)
    except ValueError:
        return 440.0
    return 440.0 * (2.0 ** ((semitone + (octave - 4) * 12 - 9) / 12))


def _generate_tone(freq: float, duration: float, volume: float = 0.3) -> bytes:
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        envelope = min(1.0, t / 0.02) * min(1.0, (duration - t) / 0.05)
        value = int(volume * envelope * math.sin(2 * math.pi * freq * t) * 32767)
        value = max(-32768, min(32767, value))
        samples.append(value)
    return struct.pack(f"<{num_samples}h", *samples)


def _mix_audio(a: bytes, b: bytes) -> bytes:
    if len(a) == 0:
        return b
    if len(b) == 0:
        return a
    max_len = max(len(a), len(b))
    a_padded = a.ljust(max_len, b"\x00")
    b_padded = b.ljust(max_len, b"\x00")
    mixed = bytearray(max_len)
    for i in range(0, max_len, 2):
        sample_a = int.from_bytes(a_padded[i:i+2], "little", signed=True)
        sample_b = int.from_bytes(b_padded[i:i+2], "little", signed=True)
        mixed_sample = max(-32768, min(32767, sample_a + sample_b))
        mixed[i:i+2] = mixed_sample.to_bytes(2, "little", signed=True)
    return bytes(mixed)


def _generate_wav(data: bytes) -> bytes:
    num_samples = len(data) // 2
    data_size = len(data)
    buf = io.BytesIO()
    buf.write(b"RIFF")
    buf.write(struct.pack("<I", 36 + data_size))
    buf.write(b"WAVE")
    buf.write(b"fmt ")
    buf.write(struct.pack("<I", 16))
    buf.write(struct.pack("<H", 1))
    buf.write(struct.pack("<H", 1))
    buf.write(struct.pack("<I", SAMPLE_RATE))
    buf.write(struct.pack("<I", SAMPLE_RATE * 2))
    buf.write(struct.pack("<H", 2))
    buf.write(struct.pack("<H", 16))
    buf.write(b"data")
    buf.write(struct.pack("<I", data_size))
    buf.write(data)
    return buf.getvalue()


_scales = generate_scales()


@router.get("/scale")
async def play_scale(id: str = Query(...), root: str = Query("C")):
    scale = _scales.get(id)
    if not scale:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Scale '{id}' not found")

    root_freq = _note_to_freq(root, 4)
    note_duration = 0.4
    gap = 0.05

    audio_data = b""
    for interval in sorted(set(scale.intervals)):
        freq = root_freq * (2.0 ** (interval / 12.0))
        tone = _generate_tone(freq, note_duration)
        silence = struct.pack(f"<{int(SAMPLE_RATE * gap)}h", *([0] * int(SAMPLE_RATE * gap)))
        audio_data += tone + silence

    wav = _generate_wav(audio_data)
    return Response(content=wav, media_type="audio/wav")


@router.get("/note")
async def play_note(note: str = Query("C"), octave: int = Query(4)):
    freq = _note_to_freq(note, octave)
    tone = _generate_tone(freq, 0.8)
    wav = _generate_wav(tone)
    return Response(content=wav, media_type="audio/wav")


@router.get("/chord")
async def play_chord(root: str = Query("C"), intervals: str = Query("0,4,7")):
    root_freq = _note_to_freq(root, 4)
    interval_list = [int(i) for i in intervals.split(",")]
    duration = 1.2

    audio_data = b""
    for semitone in interval_list:
        freq = root_freq * (2.0 ** (semitone / 12.0))
        tone = _generate_tone(freq, duration, 0.2)
        audio_data = _mix_audio(audio_data, tone)

    wav = _generate_wav(audio_data)
    return Response(content=wav, media_type="audio/wav")


@router.get("/interval")
async def play_interval(root: str = Query("C"), semitones: int = Query(4)):
    root_freq = _note_to_freq(root, 4)
    target_freq = root_freq * (2.0 ** (semitones / 12.0))
    duration = 0.8

    tone1 = _generate_tone(root_freq, duration)
    tone2 = _generate_tone(target_freq, duration)

    audio_data = tone1 + tone2
    wav = _generate_wav(audio_data)
    return Response(content=wav, media_type="audio/wav")
