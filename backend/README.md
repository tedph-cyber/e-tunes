# E-Tunes Backend

FastAPI-based audio transcription and music theory engine.

## Quick Start

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `GET /api/health` — Health check
- `POST /api/transcribe/note` — Upload audio, detect note
- `POST /api/transcribe/chord` — Upload audio, detect chord
- `GET /api/scales` — List all scales
- `GET /api/scales/:id` — Scale detail with modes and chords
- `GET /api/chords` — List all chords
- `GET /api/intervals` — List all intervals
- `GET /api/exercises/scale-id` — Generate scale ID challenge
- `GET /api/exercises/interval-id` — Generate interval ID challenge
- `GET /api/curriculum` — Get learning path tiers
- `GET /api/audio/scale` — Synthesized scale WAV
- `GET /api/audio/interval` — Synthesized interval WAV

## Testing

```bash
pytest
```
