from dataclasses import dataclass, field

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


@dataclass
class PitchClass:
    value: int  # 0=C, 1=C#, ... 11=B

    @property
    def name(self) -> str:
        return NOTE_NAMES[self.value % 12]

    @classmethod
    def from_name(cls, name: str) -> "PitchClass":
        return cls(value=NOTE_NAMES.index(name))


@dataclass
class Scale:
    id: str
    name: str
    aliases: list[str] = field(default_factory=list)
    intervals: list[int] = field(default_factory=list)
    pitch_classes: list[int] = field(default_factory=list)
    bitmask: int = 0
    category: str = "unknown"
    cardinality: int = 0
    difficulty: int = 1
    is_symmetric: bool = False
    transposition_count: int = 12


@dataclass
class Chord:
    id: str
    name: str
    intervals: list[int] = field(default_factory=list)
    bitmask: int = 0
    quality: str = "unknown"
    extensions: list[int] = field(default_factory=list)


@dataclass
class Interval:
    semitones: int
    quality: str
    consonant: bool = True
    dissonant: bool = False


INTERVALS: list[Interval] = [
    Interval(0, "P1", consonant=True),
    Interval(1, "m2", consonant=False, dissonant=True),
    Interval(2, "M2", consonant=False, dissonant=True),
    Interval(3, "m3", consonant=True),
    Interval(4, "M3", consonant=True),
    Interval(5, "P4", consonant=True),
    Interval(6, "TT", consonant=False, dissonant=True),
    Interval(7, "P5", consonant=True),
    Interval(8, "m6", consonant=True),
    Interval(9, "M6", consonant=True),
    Interval(10, "m7", consonant=False, dissonant=True),
    Interval(11, "M7", consonant=False, dissonant=True),
    Interval(12, "P8", consonant=True),
]
