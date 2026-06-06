"use client"

interface ProgressRingProps {
  accuracy: number
  size?: number
  label?: string
}

export default function ProgressRing({ accuracy, size = 80, label }: ProgressRingProps) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - accuracy * circumference
  const color = accuracy >= 0.8 ? "#22c55e" : accuracy >= 0.6 ? "#eab308" : "#ef4444"

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-gray-700"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="text-sm font-mono">{Math.round(accuracy * 100)}%</span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}
