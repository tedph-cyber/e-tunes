from pydantic import BaseModel


class TranscribeNoteResponse(BaseModel):
    detected: bool
    note: str | None = None
    hz: float = 0.0
    midi: int | None = None


class TranscribeChordResponse(BaseModel):
    detected: bool
    chord: str | None = None
    root: str | None = None
    quality: str | None = None
