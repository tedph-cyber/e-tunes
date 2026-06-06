"use client"

interface ScaleVisualizerProps {
  pitchClasses: number[]
  root?: number
  label?: string
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11]
const BLACK_KEYS = [1, 3, 6, 8, 10]

export default function ScaleVisualizer({ pitchClasses, root, label }: ScaleVisualizerProps) {
  const pcs = new Set(pitchClasses)

  return (
    <div className="w-full">
      {label && <p className="text-sm text-muted mb-2">{label}</p>}
      <div className="relative h-32 select-none">
        {/* White keys */}
        <div className="flex">
          {WHITE_KEYS.map((pc) => {
            const inScale = pcs.has(pc)
            const isRoot = root !== undefined && pc === root
            return (
              <div
                key={pc}
                className={`flex-1 h-32 border-r last:border-r-0 border-surface-2 rounded-b flex items-end justify-center pb-2 text-xs font-mono transition-colors ${
                  inScale
                    ? isRoot
                      ? "bg-sonic-blue/20 text-sonic-blue border-sonic-blue/30"
                      : "bg-theory-green/10 text-theory-green border-theory-green/20"
                    : "bg-surface text-muted"
                }`}
              >
                {NOTE_NAMES[pc]}
              </div>
            )
          })}
        </div>
        {/* Black keys */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          {BLACK_KEYS.map((pc, i) => {
            const pos = [0.7, 1.7, 3.7, 4.7, 5.7][i]
            const inScale = pcs.has(pc)
            const isRoot = root !== undefined && pc === root
            return (
              <div
                key={pc}
                className={`absolute w-[8%] h-20 rounded-b text-[9px] flex items-end justify-center pb-1 font-mono transition-colors ${
                  inScale
                    ? isRoot
                      ? "bg-sonic-blue/30 text-sonic-blue"
                      : "bg-theory-green/20 text-theory-green"
                    : "bg-navy text-muted/60"
                }`}
                style={{ left: `calc(${pos} * (100% / 7) - 4%)`, zIndex: 10 }}
              >
                {NOTE_NAMES[pc]}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
