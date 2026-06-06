"use client"

interface RecorderProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  loading?: boolean
  label?: string
}

export default function Recorder({
  isRecording,
  onStart,
  onStop,
  loading,
  label = "Record",
}: RecorderProps) {
  const handleClick = () => {
    if (isRecording) {
      onStop()
    } else {
      onStart()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 mx-auto ${
        loading
          ? "bg-muted/30 cursor-not-allowed"
          : isRecording
          ? "bg-red-500/20 border-2 border-red-500 animate-pulse"
          : "bg-sonic-blue/10 border-2 border-sonic-blue/30 hover:bg-sonic-blue/20 hover:border-sonic-blue/50"
      }`}
    >
      <span className={`material-symbols-outlined text-4xl ${
        isRecording ? "text-red-400" : "text-sonic-blue"
      }`}>
        {loading ? "hourglass" : "mic"}
      </span>
    </button>
  )
}
