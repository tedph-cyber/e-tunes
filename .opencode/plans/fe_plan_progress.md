# E-Tunes: fe_plan.md Build Progress

## Overall Status: Phase A ready to start

## Phase A — Design System Overhaul (NOT STARTED)
- [ ] Update `tailwind.config.ts` — add custom colors (navy #0b1326, sonic-blue #adc6ff, theory-green #4edea3), JetBrains Mono font
- [ ] Update `app/layout.tsx` — load Inter + JetBrains Mono from next/font/google
- [ ] Update `app/globals.css` — font defaults, hover-glow, surface elevation utilities
- [ ] Color sweep all 8 pages — replace Tailwind defaults with custom palette
- [ ] Color sweep all 7 components — same palette update

## Phase B — New Exercises (NOT STARTED)
### Backend
- [ ] Add `GET /api/exercises/note-id` endpoint
- [ ] Add `POST /api/exercises/note-id/answer` endpoint
- [ ] Add `GET /api/exercises/chord-id` endpoint
- [ ] Add `POST /api/exercises/chord-id/answer` endpoint
- [ ] Add note audio synthesis endpoint (or reuse existing)

### Frontend
- [ ] Build `InteractivePiano` component (clickable 2-octave keyboard)
- [ ] Build note ID page (`/ear-train/note-id`)
- [ ] Build chord ID page (`/ear-train/chord-id`)
- [ ] Update ear training hub to show 4 exercise modules
- [ ] Add NoteIdChallenge + ChordIdChallenge types to types/index.ts

## Phase C — Progress Enhancements (NOT STARTED)
- [ ] Add 7-day streak logic to progressStore
- [ ] Add daily challenges counter to progressStore
- [ ] Build `HeatmapChart` component
- [ ] Update progress page with heatmap + streaks + daily challenges

## Phase D — Polish (NOT STARTED)
- [ ] Add hover-glow micro-animations to cards
- [ ] Refine recording pulse animation
- [ ] Ensure consistent 8px border-radius everywhere
- [ ] Surface elevation tier system

## Already Built (frontend)
- [x] Hub page `/` with 4 navigation cards
- [x] Transcribe page `/transcribe` — note/chord recording + detection
- [x] Ear training hub `/ear-train`
- [x] Interval ID exercise `/ear-train/interval-id`
- [x] Scale ID exercise `/ear-train/scale-id`
- [x] Scale browser `/scales` with category filters
- [x] Scale detail `/scales/[id]` with piano visual, intervals, modes, chords
- [x] Progress dashboard `/progress` with basic stats
- [x] ErrorBoundary component
- [x] ExercisePanel component (reusable play → choose → submit)
- [x] Recorder component (microphone toggle)
- [x] TranscriptionResult component
- [x] ScaleVisualizer component (read-only piano)
- [x] ProgressRing component (SVG ring)
- [x] AudioPlayer component
- [x] useAudioEngine hook (Web Audio synthesis)
- [x] useRecorder hook (MediaRecorder lifecycle)
- [x] useExercises hook (challenge fetch + submit + progress tracking)
- [x] useScales hook
- [x] API client (lib/api.ts) — all endpoints
- [x] Audio engine (lib/audioEngine.ts) — oscillator synthesis
- [x] Music theory lib (lib/musicTheory.ts)
- [x] sessionStore (zustand)
- [x] progressStore (zustand)
- [x] TypeScript types (types/index.ts)

## Already Built (backend)
- [x] Transcription endpoints (note + chord)
- [x] Theory endpoints (scales, chords, intervals)
- [x] Exercise endpoints (scale-id, interval-id)
- [x] Audio synthesis endpoints (scale, interval)
- [x] Curriculum endpoint
- [x] Health endpoint
- [x] Theory generator (27 scales, 12 chords)
- [x] Relationships engine (modes, diatonic chords, compatible scales)
- [x] Curriculum definition (5 tiers)
- [x] DB schema + seed
- [x] Test suite
