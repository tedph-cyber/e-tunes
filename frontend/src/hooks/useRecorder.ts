"use client"
import { useState, useRef, useCallback } from "react"

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async (): Promise<void> => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to access microphone"
      setError(message)
      throw err
    }
  }, [])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error("No active recording"))
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        resolve(audioBlob)
      }

      mediaRecorderRef.current.stop()
    })
  }, [])

  return { isRecording, error, startRecording, stopRecording }
}
