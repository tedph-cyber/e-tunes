import { create } from "zustand"

interface TierProgress {
  accuracy: number
  totalAttempts: number
  correctAttempts: number
  unlocked: boolean
}

interface ScaleAccuracy {
  correct: number
  total: number
}

interface DailyStats {
  exercises: number
  correct: number
}

interface ProgressState {
  tierProgress: Record<number, TierProgress>
  scaleAccuracy: Record<string, ScaleAccuracy>
  intervalAccuracy: Record<string, ScaleAccuracy>
  lastActiveDate: string
  dailyStats: Record<string, DailyStats>

  recordExercise: (
    tier: number,
    type: "scale" | "interval",
    id: string,
    correct: boolean
  ) => void
}

function today(): string {
  return new Date().toISOString().split("T")[0]
}

export const useProgressStore = create<ProgressState>((set) => ({
  tierProgress: {
    1: { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: true },
    2: { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: false },
    3: { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: false },
    4: { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: false },
    5: { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: false },
  },
  scaleAccuracy: {},
  intervalAccuracy: {},
  lastActiveDate: "",
  dailyStats: {},

  recordExercise: (tier, type, id, correct) =>
    set((state) => {
      const tierProg = state.tierProgress[tier]
        ? { ...state.tierProgress[tier] }
        : { accuracy: 0, totalAttempts: 0, correctAttempts: 0, unlocked: false }

      tierProg.totalAttempts++
      if (correct) tierProg.correctAttempts++
      tierProg.accuracy =
        tierProg.totalAttempts > 0
          ? Math.round((tierProg.correctAttempts / tierProg.totalAttempts) * 100) / 100
          : 0

      const accuracyMap = type === "scale" ? { ...state.scaleAccuracy } : { ...state.intervalAccuracy }
      const entry = accuracyMap[id] || { correct: 0, total: 0 }
      entry.total++
      if (correct) entry.correct++
      accuracyMap[id] = entry

      const day = today()
      const dailies = { ...state.dailyStats }
      const daily = dailies[day] || { exercises: 0, correct: 0 }
      daily.exercises++
      if (correct) daily.correct++
      dailies[day] = daily

      return {
        tierProgress: { ...state.tierProgress, [tier]: tierProg },
        ...(type === "scale"
          ? { scaleAccuracy: accuracyMap }
          : { intervalAccuracy: accuracyMap }),
        dailyStats: dailies,
        lastActiveDate: day,
      }
    }),
}))
