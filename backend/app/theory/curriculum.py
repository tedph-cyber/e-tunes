"""Learning path / curriculum definitions."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Topic:
    id: str
    name: str
    scale_ids: list[str] = field(default_factory=list)
    interval_ids: list[int] = field(default_factory=list)


@dataclass
class Tier:
    id: int
    name: str
    description: str
    topics: list[Topic] = field(default_factory=list)
    unlock_requirement: dict | None = None


CURRICULUM: list[Tier] = [
    Tier(
        id=1,
        name="Foundations",
        description="Major and natural minor scales, basic intervals",
        topics=[
            Topic(id="foundations-scales", name="Major & Minor", scale_ids=["major", "natural_minor"]),
            Topic(id="foundations-intervals", name="Basic Intervals", interval_ids=[1, 2, 3, 4, 5, 7, 12]),
        ],
        unlock_requirement=None,
    ),
    Tier(
        id=2,
        name="Diatonic Modes",
        description="All seven modes of the major scale",
        topics=[
            Topic(
                id="modes-scales",
                name="Diatonic Modes",
                scale_ids=["dorian", "phrygian", "lydian", "mixolydian", "locrian"],
            ),
            Topic(id="modes-intervals", name="Compound Intervals", interval_ids=[6, 8, 9, 10, 11]),
        ],
        unlock_requirement={"tier": 1, "accuracy": 0.8, "min_attempts": 20},
    ),
    Tier(
        id=3,
        name="Harmonic & Melodic Minor",
        description="The minor mode families and their modes",
        topics=[
            Topic(
                id="minor-modes-scales",
                name="Minor Mode Families",
                scale_ids=["harmonic_minor", "melodic_minor"],
            ),
        ],
        unlock_requirement={"tier": 2, "accuracy": 0.8, "min_attempts": 20},
    ),
    Tier(
        id=4,
        name="Pentatonic & Blues",
        description="Pentatonic and blues scale families",
        topics=[
            Topic(
                id="penta-blues",
                name="Pentatonic & Blues",
                scale_ids=["major_pentatonic", "minor_pentatonic", "blues_major", "blues_minor"],
            ),
        ],
        unlock_requirement={"tier": 3, "accuracy": 0.75},
    ),
    Tier(
        id=5,
        name="Symmetric & Exotic",
        description="Whole-tone, diminished, augmented, and world scales",
        topics=[
            Topic(
                id="symmetric-scales",
                name="Symmetric Scales",
                scale_ids=["whole_tone", "diminished_hw", "diminished_wh", "augmented"],
            ),
            Topic(
                id="exotic-scales",
                name="Exotic & World Scales",
                scale_ids=[
                    "double_harmonic", "hungarian_minor", "neapolitan_minor",
                    "neapolitan_major", "enigmatic", "hirajoshi", "iwato",
                    "pelog", "slendro",
                ],
            ),
        ],
        unlock_requirement={"tier": 4, "accuracy": 0.75},
    ),
]
