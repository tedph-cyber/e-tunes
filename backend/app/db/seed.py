"""Seed database with theory data from generators."""

import json
import aiosqlite
from app.db.connection import get_db
from app.theory.generator import generate_scales, generate_chords
from app.theory.relationships import diatonic_chords, compatible_scales


async def seed():
    db = await get_db()
    scales = generate_scales()
    chords = generate_chords()

    for sid, scale in scales.items():
        await db.execute(
            "INSERT OR REPLACE INTO scales (id, name, aliases, intervals, pitch_classes, bitmask, category, cardinality, difficulty) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                scale.id, scale.name, json.dumps(scale.aliases),
                json.dumps(scale.intervals), json.dumps(scale.pitch_classes),
                scale.bitmask, scale.category, scale.cardinality,
                scale.difficulty,
            ),
        )

    for cid, chord in chords.items():
        await db.execute(
            "INSERT OR REPLACE INTO chords (id, name, intervals, bitmask, quality, extensions) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (
                chord.id, chord.name, json.dumps(chord.intervals),
                chord.bitmask, chord.quality, json.dumps(chord.extensions),
            ),
        )

    await db.commit()
    await db.close()
