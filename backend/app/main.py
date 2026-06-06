from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, transcription, theory, exercises, audio, curriculum

app = FastAPI(title="Aural Transcription Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(transcription.router)
app.include_router(theory.router)
app.include_router(exercises.router)
app.include_router(audio.router)
app.include_router(curriculum.router)
