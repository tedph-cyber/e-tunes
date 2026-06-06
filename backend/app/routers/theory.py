from fastapi import APIRouter, Query

from app.models.theory import (
    ScaleResponse,
    ScaleDetailResponse,
    ChordResponse,
    ChordDetailResponse,
    IntervalResponse,
)
from app.theory.core import INTERVALS
from app.theory.generator import generate_scales, generate_chords
from app.theory.relationships import modes_of, diatonic_chords, compatible_scales

router = APIRouter(prefix="/api", tags=["theory"])

_scales = generate_scales()
_chords = generate_chords()


def _scale_to_response(scale) -> ScaleResponse:
    return ScaleResponse(
        id=scale.id,
        name=scale.name,
        aliases=scale.aliases,
        intervals=scale.intervals,
        pitch_classes=scale.pitch_classes,
        bitmask=scale.bitmask,
        category=scale.category,
        cardinality=scale.cardinality,
        difficulty=scale.difficulty,
    )


def _chord_to_response(chord) -> ChordResponse:
    return ChordResponse(
        id=chord.id,
        name=chord.name,
        intervals=chord.intervals,
        bitmask=chord.bitmask,
        quality=chord.quality,
    )


@router.get("/scales")
async def list_scales(
    category: str | None = Query(None),
    difficulty: int | None = Query(None),
):
    result = [_scale_to_response(s) for s in _scales.values()]
    if category:
        result = [s for s in result if s.category == category]
    if difficulty:
        result = [s for s in result if s.difficulty == difficulty]
    return {"scales": result, "total": len(result)}


@router.get("/scales/{scale_id}")
async def get_scale(scale_id: str):
    scale = _scales.get(scale_id)
    if not scale:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Scale '{scale_id}' not found")

    detail = ScaleDetailResponse(
        **_scale_to_response(scale).model_dump(),
        modes=[_scale_to_response(m) for m in modes_of(scale, _scales)],
        diatonic_chords=diatonic_chords(scale),
    )
    return detail


@router.get("/scales/{scale_id}/modes")
async def get_scale_modes(scale_id: str):
    scale = _scales.get(scale_id)
    if not scale:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Scale '{scale_id}' not found")
    return {"modes": [_scale_to_response(m) for m in modes_of(scale, _scales)]}


@router.get("/chords")
async def list_chords(quality: str | None = Query(None)):
    result = [_chord_to_response(c) for c in _chords.values()]
    if quality:
        result = [c for c in result if c.quality == quality]
    return {"chords": result, "total": len(result)}


@router.get("/chords/{chord_id}")
async def get_chord(chord_id: str):
    chord = _chords.get(chord_id)
    if not chord:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Chord '{chord_id}' not found")

    compatible = compatible_scales(chord, _scales)
    detail = ChordDetailResponse(
        **_chord_to_response(chord).model_dump(),
        compatible_scales=[_scale_to_response(s) for s, _ in compatible],
    )
    return detail


@router.get("/intervals")
async def list_intervals():
    return {
        "intervals": [
            IntervalResponse(semitones=i.semitones, quality=i.quality, consonant=i.consonant)
            for i in INTERVALS
        ]
    }
