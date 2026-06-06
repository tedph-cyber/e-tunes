"use client"
import { useState, useCallback } from "react"
import type {
  ScaleIdChallenge,
  ScaleIdResult,
  IntervalIdChallenge,
  IntervalIdResult,
  ExerciseType,
} from "@/types"
import * as api from "@/lib/api"
import { useSessionStore } from "@/store/sessionStore"
import { useProgressStore } from "@/store/progressStore"

export function useExercises() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addResult = useSessionStore((s) => s.addResult)
  const recordExercise = useProgressStore((s) => s.recordExercise)

  const fetchScaleChallenge = useCallback(
    async (tier: number = 1): Promise<ScaleIdChallenge | null> => {
      setLoading(true)
      setError(null)
      try {
        return await api.getScaleIdChallenge(tier)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch challenge")
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const submitScaleAnswer = useCallback(
    async (challengeId: string, answerId: string, tier: number = 1): Promise<ScaleIdResult | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.answerScaleIdChallenge(challengeId, answerId)
        addResult({ type: "scale-id", correct: result.correct, timestamp: Date.now() })
        recordExercise(tier, "scale", result.scale.id, result.correct)
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit answer")
        return null
      } finally {
        setLoading(false)
      }
    },
    [addResult, recordExercise]
  )

  const fetchIntervalChallenge = useCallback(
    async (tier: number = 1): Promise<IntervalIdChallenge | null> => {
      setLoading(true)
      setError(null)
      try {
        return await api.getIntervalIdChallenge(tier)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch challenge")
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const submitIntervalAnswer = useCallback(
    async (
      challengeId: string,
      answerId: string,
      tier: number = 1
    ): Promise<IntervalIdResult | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await api.answerIntervalIdChallenge(challengeId, answerId)
        addResult({ type: "interval-id", correct: result.correct, timestamp: Date.now() })
        recordExercise(tier, "interval", result.interval.quality, result.correct)
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit answer")
        return null
      } finally {
        setLoading(false)
      }
    },
    [addResult, recordExercise]
  )

  return {
    loading,
    error,
    fetchScaleChallenge,
    submitScaleAnswer,
    fetchIntervalChallenge,
    submitIntervalAnswer,
  }
}
