"use client"

interface AudioPlayerProps {
  onPlay: () => void
  label?: string
  loading?: boolean
}

export default function AudioPlayer({ onPlay, label = "Play", loading }: AudioPlayerProps) {
  return (
    <button
      onClick={onPlay}
      disabled={loading}
      className="btn-primary flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-lg">play_arrow</span>
      {loading ? "Loading..." : label}
    </button>
  )
}
