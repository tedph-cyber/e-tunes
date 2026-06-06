import random
import uuid

from fastapi import APIRouter, Query

from app.models.exercises import (
    ScaleIdChallenge,
    ScaleIdAnswer,
    ScaleIdResult,
    IntervalIdChallenge,
    IntervalIdAnswer,
    IntervalIdResult,
    NoteIdChallenge,
    NoteIdAnswer,
    NoteIdResult,
    ChordIdChallenge,
    ChordIdAnswer,
    ChordIdResult,
)
from app.models.theory import ScaleResponse, IntervalResponse
from app.theory.core import INTERVALS, NOTE_NAMES
from app.theory.generator import generate_scales, CHORD_FORMULAS
from app.theory.curriculum import CURRICULUM

router = APIRouter(prefix="/api/exercises", tags=["exercises"])

_scales = generate_scales()

# In-memory challenge store for answer validation
_challenge_store: dict[str, str] = {}


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


@router.get("/scale-id")
async def get_scale_id_challenge(tier: int = Query(1)):
    tier_def = next((t for t in CURRICULUM if t.id == tier), None)
    if not tier_def:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Tier {tier} not found")

    available_ids: list[str] = []
    for topic in tier_def.topics:
        available_ids.extend(topic.scale_ids)
    available_ids = [s for s in available_ids if s in _scales]

    if len(available_ids) < 2:
        available_ids = list(_scales.keys())

    correct_id = random.choice(available_ids)
    correct_scale = _scales[correct_id]

    distractors = [s for s in available_ids if s != correct_id]
    random.shuffle(distractors)
    choices_ids = [correct_id] + distractors[:3]
    random.shuffle(choices_ids)

    cid = str(uuid.uuid4())
    _challenge_store[cid] = correct_id

    challenge = ScaleIdChallenge(
        challenge_id=cid,
        correct_scale_id=correct_id,
        choices=[_scale_to_response(_scales[sid]) for sid in choices_ids],
        audio_url=f"/api/audio/scale?id={correct_id}&root=C",
    )
    return challenge


@router.post("/scale-id/answer")
async def answer_scale_id(answer: ScaleIdAnswer):
    correct_id = _challenge_store.get(answer.challenge_id, "")
    correct = answer.answer_id == correct_id
    scale_id = answer.answer_id if correct else correct_id
    scale = _scales.get(scale_id)
    return ScaleIdResult(
        correct=correct,
        scale=_scale_to_response(scale) if scale else ScaleResponse(
            id="unknown", name="Unknown", intervals=[], pitch_classes=[],
            bitmask=0, category="", cardinality=0, difficulty=0,
        ),
        explanation=f"That was the {scale.name} scale." if scale else "Scale not found.",
    )


@router.get("/interval-id")
async def get_interval_id_challenge(tier: int = Query(1)):
    tier_def = next((t for t in CURRICULUM if t.id == tier), None)

    available_semitones = [1, 2, 3, 4, 5, 7, 12]
    if tier_def:
        for topic in tier_def.topics:
            if topic.interval_ids:
                available_semitones = topic.interval_ids
                break

    correct_semitones = random.choice(available_semitones)
    distractors = [s for s in available_semitones if s != correct_semitones]
    random.shuffle(distractors)
    choices_semitones = [correct_semitones] + distractors[:3]
    random.shuffle(choices_semitones)

    def _find_interval(sem: int) -> IntervalResponse:
        for i in INTERVALS:
            if i.semitones == sem:
                return IntervalResponse(semitones=i.semitones, quality=i.quality, consonant=i.consonant)
        return IntervalResponse(semitones=sem, quality=f"{sem} semitones", consonant=True)

    cid = str(uuid.uuid4())
    _challenge_store[cid] = str(correct_semitones)

    challenge = IntervalIdChallenge(
        challenge_id=cid,
        correct_semitones=correct_semitones,
        choices=[_find_interval(s) for s in choices_semitones],
        audio_url=f"/api/audio/interval?root=C&semitones={correct_semitones}",
    )
    return challenge


@router.post("/interval-id/answer")
async def answer_interval_id(answer: IntervalIdAnswer):
    correct_semitones = _challenge_store.get(answer.challenge_id, "")
    correct = answer.answer_id == correct_semitones
    semitones = int(answer.answer_id) if answer.answer_id.isdigit() else 0
    interval = next((i for i in INTERVALS if i.semitones == semitones), None)
    return IntervalIdResult(
        correct=correct,
        interval=IntervalResponse(
            semitones=interval.semitones, quality=interval.quality, consonant=interval.consonant
        ) if interval else IntervalResponse(semitones=semitones, quality="", consonant=True),
    )


NOTE_OCTAVES = [3, 4, 5]


@router.get("/note-id")
async def get_note_id_challenge(tier: int = Query(1)):
    octave = random.choice(NOTE_OCTAVES)
    note_name = random.choice(NOTE_NAMES)
    midi = (octave + 1) * 12 + NOTE_NAMES.index(note_name)
    full_note = f"{note_name}{octave}"

    distractors = [n for n in NOTE_NAMES if n != note_name]
    random.shuffle(distractors)
    choices = [note_name] + distractors[:4]
    random.shuffle(choices)

    cid = str(uuid.uuid4())
    _challenge_store[cid] = note_name

    challenge = NoteIdChallenge(
        challenge_id=cid,
        correct_note=full_note,
        correct_midi=midi,
        choices=choices,
        audio_url=f"/api/audio/note?note={note_name}&octave={octave}",
    )
    return challenge


@router.post("/note-id/answer")
async def answer_note_id(answer: NoteIdAnswer):
    correct_note = _challenge_store.get(answer.challenge_id, "")
    correct = answer.answer_id.upper() == correct_note.upper()
    return NoteIdResult(
        correct=correct,
        note=answer.answer_id,
        midi=0,
    )


@router.get("/chord-id")
async def get_chord_id_challenge(tier: int = Query(1)):
    chord_names = list(CHORD_FORMULAS.keys())
    random.shuffle(chord_names)
    correct_key = chord_names[0]
    formula = CHORD_FORMULAS[correct_key]
    correct_name = formula[0]

    distractors = [n for n in chord_names if n != correct_key]
    random.shuffle(distractors)
    choices = [correct_name] + [CHORD_FORMULAS[d][0] for d in distractors[:5]]
    random.shuffle(choices)

    cid = str(uuid.uuid4())
    _challenge_store[cid] = correct_name

    challenge = ChordIdChallenge(
        challenge_id=cid,
        correct_chord=correct_name,
        choices=choices,
        audio_url=f"/api/audio/chord?root=C&intervals={','.join(str(i) for i in formula[1])}",
    )
    return challenge


@router.post("/chord-id/answer")
async def answer_chord_id(answer: ChordIdAnswer):
    correct_name = _challenge_store.get(answer.challenge_id, "")
    correct = answer.answer_id.lower() == correct_name.lower()
    return ChordIdResult(
        correct=correct,
        chord=answer.answer_id,
    )
