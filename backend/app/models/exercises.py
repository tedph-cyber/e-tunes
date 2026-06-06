from pydantic import BaseModel

from .theory import IntervalResponse, ScaleResponse


class ScaleIdChallenge(BaseModel):
    challenge_id: str
    correct_scale_id: str
    choices: list[ScaleResponse]
    audio_url: str


class ScaleIdAnswer(BaseModel):
    challenge_id: str
    answer_id: str


class ScaleIdResult(BaseModel):
    correct: bool
    scale: ScaleResponse
    explanation: str


class IntervalIdChallenge(BaseModel):
    challenge_id: str
    correct_semitones: int
    choices: list[IntervalResponse]
    audio_url: str


class IntervalIdAnswer(BaseModel):
    challenge_id: str
    answer_id: str


class IntervalIdResult(BaseModel):
    correct: bool
    interval: IntervalResponse


class NoteIdChallenge(BaseModel):
    challenge_id: str
    correct_note: str
    correct_midi: int
    choices: list[str]
    audio_url: str


class NoteIdAnswer(BaseModel):
    challenge_id: str
    answer_id: str


class NoteIdResult(BaseModel):
    correct: bool
    note: str
    midi: int


class ChordIdChallenge(BaseModel):
    challenge_id: str
    correct_chord: str
    choices: list[str]
    audio_url: str


class ChordIdAnswer(BaseModel):
    challenge_id: str
    answer_id: str


class ChordIdResult(BaseModel):
    correct: bool
    chord: str
