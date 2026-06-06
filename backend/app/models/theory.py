from pydantic import BaseModel


class ScaleResponse(BaseModel):
    id: str
    name: str
    aliases: list[str] = []
    intervals: list[int]
    pitch_classes: list[int]
    bitmask: int
    category: str
    cardinality: int
    difficulty: int


class ScaleDetailResponse(ScaleResponse):
    modes: list["ScaleResponse"] = []
    diatonic_chords: list[dict] = []


class ChordResponse(BaseModel):
    id: str
    name: str
    intervals: list[int]
    bitmask: int
    quality: str


class ChordDetailResponse(ChordResponse):
    compatible_scales: list["ScaleResponse"] = []


class IntervalResponse(BaseModel):
    semitones: int
    quality: str
    consonant: bool
