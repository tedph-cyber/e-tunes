from fastapi import APIRouter, UploadFile, File

from app.models.transcription import TranscribeNoteResponse, TranscribeChordResponse
from app.services.pitch import transcribe_note
from app.services.chord import transcribe_chord

router = APIRouter(prefix="/api/transcribe", tags=["transcription"])


@router.post("/note", response_model=TranscribeNoteResponse)
async def transcribe_note_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    result = await transcribe_note(contents)
    return TranscribeNoteResponse(**result)


@router.post("/chord", response_model=TranscribeChordResponse)
async def transcribe_chord_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    result = await transcribe_chord(contents)
    return TranscribeChordResponse(**result)
