"""Relationships between scales, chords, and modes."""

from .core import Scale, Chord


def modes_of(scale: Scale, all_scales: dict[str, Scale]) -> list[Scale]:
    """Return all modes (rotations) of a given scale."""
    if scale.cardinality != 7:
        return []
    result: list[Scale] = []
    root_pcs = set(scale.pitch_classes)
    for s in all_scales.values():
        if s.id == scale.id:
            continue
        if s.cardinality == scale.cardinality and set(s.pitch_classes) == root_pcs:
            result.append(s)
    return result


def diatonic_chords(scale: Scale) -> list[dict]:
    """Return chords built by stacking thirds on each degree."""
    if scale.cardinality < 5:
        return []
    chords: list[dict] = []
    pcs = sorted(set(scale.pitch_classes))
    n = len(pcs)
    for i in range(n):
        root = pcs[i]
        third = pcs[(i + 2) % n]
        fifth = pcs[(i + 4) % n]
        seventh = pcs[(i + 6) % n] if n >= 7 else None

        third_interval = (third - root) % 12
        fifth_interval = (fifth - root) % 12

        if third_interval == 4 and fifth_interval == 7:
            quality = "major"
        elif third_interval == 3 and fifth_interval == 7:
            quality = "minor"
        elif third_interval == 3 and fifth_interval == 6:
            quality = "diminished"
        elif third_interval == 4 and fifth_interval == 8:
            quality = "augmented"
        else:
            quality = "unknown"

        chord_type = quality
        seventh_interval = None
        if seventh is not None:
            seventh_interval = (seventh - root) % 12
            if seventh_interval == 10:
                chord_type = "dom7" if quality == "major" else "min7"
            elif seventh_interval == 11:
                chord_type = "maj7"
            elif seventh_interval == 9:
                chord_type = "dim7" if quality == "diminished" else "m7b5"

        chords.append({
            "degree": i + 1,
            "root_offset": root,
            "quality": quality,
            "chord_type": chord_type,
            "intervals": [0, third_interval, fifth_interval] + ([seventh_interval] if seventh_interval else []),
        })
    return chords


def compatible_scales(chord: Chord, all_scales: dict[str, Scale], threshold: float = 0.8) -> list[tuple[Scale, float]]:
    """Find scales whose pitch-class set is a superset of the chord's."""
    results: list[tuple[Scale, float]] = []
    chord_pcs = set()
    for interval in chord.intervals:
        chord_pcs.add(interval % 12)
    for scale in all_scales.values():
        scale_pcs = set(scale.pitch_classes)
        overlap = len(chord_pcs & scale_pcs)
        score = overlap / len(chord_pcs) if chord_pcs else 0
        if score >= threshold:
            results.append((scale, round(score, 2)))
    return sorted(results, key=lambda x: -x[1])
