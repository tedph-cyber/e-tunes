import { create } from "zustand"
import type { ExerciseType } from "@/types"

interface ExerciseResult {
  type: ExerciseType
  correct: boolean
  timestamp: number
}

interface SessionState {
  currentMode: "transcribe" | "ear-train" | "scales" | null
  exerciseHistory: ExerciseResult[]
  currentStreak: number
  longestStreak: number
  sessionStartTime: number | null

  setMode: (mode: SessionState["currentMode"]) => void
  addResult: (result: ExerciseResult) => void
  resetSession: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentMode: null,
  exerciseHistory: [],
  currentStreak: 0,
  longestStreak: 0,
  sessionStartTime: null,

  setMode: (mode) =>
    set({
      currentMode: mode,
      sessionStartTime: mode ? Date.now() : null,
    }),

  addResult: (result) =>
    set((state) => {
      const newStreak = result.correct ? state.currentStreak + 1 : 0
      return {
        exerciseHistory: [...state.exerciseHistory, result],
        currentStreak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
      }
    }),

  resetSession: () =>
    set({
      exerciseHistory: [],
      currentStreak: 0,
      sessionStartTime: null,
    }),
}))
