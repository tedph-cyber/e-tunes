"""Generate scale and chord knowledge programmatically + via music21."""

from __future__ import annotations

from .core import Scale, Chord

SCALE_FORMULAS: dict[str, tuple[str, list[int], str, int]] = {
    "major": ("Major (Ionian)", [0, 2, 4, 5, 7, 9, 11], "diatonic", 1),
    "natural_minor": ("Natural Minor (Aeolian)", [0, 2, 3, 5, 7, 8, 10], "diatonic", 1),
    "harmonic_minor": ("Harmonic Minor", [0, 2, 3, 5, 7, 8, 11], "harmonic_minor", 2),
    "melodic_minor": ("Melodic Minor", [0, 2, 3, 5, 7, 9, 11], "melodic_minor", 2),
    "dorian": ("Dorian Mode", [0, 2, 3, 5, 7, 9, 10], "diatonic_mode", 2),
    "phrygian": ("Phrygian Mode", [0, 1, 3, 5, 7, 8, 10], "diatonic_mode", 2),
    "lydian": ("Lydian Mode", [0, 2, 4, 6, 7, 9, 11], "diatonic_mode", 2),
    "mixolydian": ("Mixolydian Mode", [0, 2, 4, 5, 7, 9, 10], "diatonic_mode", 2),
    "locrian": ("Locrian Mode", [0, 1, 3, 5, 6, 8, 10], "diatonic_mode", 2),
    "major_pentatonic": ("Major Pentatonic", [0, 2, 4, 7, 9], "pentatonic", 1),
    "minor_pentatonic": ("Minor Pentatonic", [0, 3, 5, 7, 10], "pentatonic", 1),
    "blues_major": ("Blues Major", [0, 2, 3, 4, 7, 9], "blues", 3),
    "blues_minor": ("Blues Minor", [0, 3, 5, 6, 7, 10], "blues", 3),
    "whole_tone": ("Whole Tone", [0, 2, 4, 6, 8, 10], "symmetric", 3),
    "diminished_hw": ("Diminished (Half-Whole)", [0, 1, 3, 4, 6, 7, 9, 10], "symmetric", 4),
    "diminished_wh": ("Diminished (Whole-Half)", [0, 2, 3, 5, 6, 8, 9, 11], "symmetric", 4),
    "augmented": ("Augmented", [0, 3, 4, 7, 8, 11], "symmetric", 4),
    "double_harmonic": ("Double Harmonic", [0, 1, 4, 5, 7, 8, 11], "exotic", 5),
    "hungarian_minor": ("Hungarian Minor", [0, 2, 3, 6, 7, 8, 11], "exotic", 5),
    "neapolitan_minor": ("Neapolitan Minor", [0, 1, 3, 5, 7, 8, 11], "exotic", 5),
    "neapolitan_major": ("Neapolitan Major", [0, 1, 3, 5, 7, 9, 11], "exotic", 5),
    "enigmatic": ("Enigmatic", [0, 1, 4, 6, 8, 10, 11], "exotic", 5),
    "hirajoshi": ("Hirajoshi", [0, 2, 3, 7, 8], "japanese", 5),
    "iwato": ("Iwato", [0, 1, 5, 6, 10], "japanese", 5),
    "pelog": ("Pelog", [0, 1, 3, 7, 8], "gamelan", 5),
    "slendro": ("Slendro", [0, 2, 5, 7, 9], "gamelan", 5),
}


def bitmask_from_intervals(intervals: list[int]) -> int:
    mask = 0
    for interval in intervals:
        mask |= 1 << (interval % 12)
    return mask


def generate_scales() -> dict[str, Scale]:
    scales: dict[str, Scale] = {}
    for sid, (name, intervals, category, difficulty) in SCALE_FORMULAS.items():
        pcs = [i % 12 for i in intervals]
        scales[sid] = Scale(
            id=sid,
            name=name,
            intervals=intervals,
            pitch_classes=sorted(set(pcs)),
            bitmask=bitmask_from_intervals(intervals),
            category=category,
            cardinality=len(set(pcs)),
            difficulty=difficulty,
        )
    return scales


def generate_modes(scales: dict[str, Scale]) -> dict[str, list[Scale]]:
    modes_dict: dict[str, list[Scale]] = {}
    if "major" not in scales:
        return modes_dict
    major = scales["major"]
    mode_ids = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]
    for i, mode_id in enumerate(mode_ids):
        rotated = major.intervals[i:] + [i + 12 for i in major.intervals[:i]]
        rotated_intervals = [(x - rotated[0]) % 12 for x in rotated]
        pcs = sorted(set(x % 12 for x in rotated_intervals))
        scales[mode_id] = Scale(
            id=mode_id,
            name=mode_id.capitalize() + " Mode",
            intervals=rotated_intervals,
            pitch_classes=pcs,
            bitmask=bitmask_from_intervals(rotated_intervals),
            category="diatonic_mode",
            cardinality=len(pcs),
            difficulty=2,
        )
    for sid in scales:
        modes_dict[sid] = []
    return modes_dict


CHORD_FORMULAS: dict[str, tuple[str, list[int], str]] = {
    "maj": ("Major", [0, 4, 7], "major"),
    "min": ("Minor", [0, 3, 7], "minor"),
    "dim": ("Diminished", [0, 3, 6], "diminished"),
    "aug": ("Augmented", [0, 4, 8], "augmented"),
    "dom7": ("Dominant 7th", [0, 4, 7, 10], "major"),
    "maj7": ("Major 7th", [0, 4, 7, 11], "major"),
    "min7": ("Minor 7th", [0, 3, 7, 10], "minor"),
    "m7b5": ("Minor 7th Flat 5", [0, 3, 6, 10], "diminished"),
    "dim7": ("Diminished 7th", [0, 3, 6, 9], "diminished"),
    "aug7": ("Augmented 7th", [0, 4, 8, 10], "augmented"),
    "sus2": ("Suspended 2nd", [0, 2, 7], "suspended"),
    "sus4": ("Suspended 4th", [0, 5, 7], "suspended"),
}


def generate_chords() -> dict[str, Chord]:
    chords: dict[str, Chord] = {}
    for cid, (name, intervals, quality) in CHORD_FORMULAS.items():
        chords[cid] = Chord(
            id=cid,
            name=name,
            intervals=intervals,
            bitmask=bitmask_from_intervals(intervals),
            quality=quality,
            extensions=[7] if len(intervals) == 4 else [],
        )
    return chords
