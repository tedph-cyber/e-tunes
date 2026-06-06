"use client"
import { useState, useEffect } from "react"
import type { Scale, ScaleDetail } from "@/types"
import * as api from "@/lib/api"

export function useScales(category?: string) {
  const [scales, setScales] = useState<Scale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .getScales(category)
      .then((data) => setScales(data.scales))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category])

  return { scales, loading, error }
}

export function useScale(id: string) {
  const [scale, setScale] = useState<ScaleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .getScale(id)
      .then(setScale)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { scale, loading, error }
}
