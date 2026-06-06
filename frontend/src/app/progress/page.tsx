"use client"
import ProgressRing from "@/components/ProgressRing"
import { useProgressStore } from "@/store/progressStore"
import { useSessionStore } from "@/store/sessionStore"

export default function ProgressPage() {
  const tierProgress = useProgressStore((s) => s.tierProgress)
  const scaleAccuracy = useProgressStore((s) => s.scaleAccuracy)
  const intervalAccuracy = useProgressStore((s) => s.intervalAccuracy)
  const dailyStats = useProgressStore((s) => s.dailyStats)
  const { currentStreak, longestStreak } = useSessionStore()

  const today = new Date().toISOString().split("T")[0]
  const todayStats = dailyStats[today] || { exercises: 0, correct: 0 }
  const todayAccuracy = todayStats.exercises > 0
    ? Math.round((todayStats.correct / todayStats.exercises) * 100)
    : 0

  const tierNames: Record<number, string> = {
    1: "Basic",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
    5: "Studio Pro",
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Technical Progress Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="card text-center">
          <span className="material-symbols-outlined text-2xl text-orange-400 mb-2">local_fire_department</span>
          <p className="text-2xl font-bold">{currentStreak}</p>
          <p className="text-xs text-muted">Day Streak</p>
        </div>
        <div className="card text-center">
          <span className="material-symbols-outlined text-2xl text-amber-400 mb-2">emoji_events</span>
          <p className="text-2xl font-bold">{longestStreak}</p>
          <p className="text-xs text-muted">High Score: {longestStreak}</p>
        </div>
        <div className="card text-center">
          <span className="material-symbols-outlined text-2xl text-sonic-blue mb-2">bolt</span>
          <p className="text-2xl font-bold">{todayStats.exercises}</p>
          <p className="text-xs text-muted">Challenges Today</p>
        </div>
      </div>

      {/* Curriculum Mastery */}
      <section className="mb-10">
        <h2 className="font-semibold text-white mb-4">Curriculum Mastery</h2>
        <p className="text-xs text-muted mb-4">
          Tier-based skill progression across five difficulty layers.
        </p>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(tierProgress).map(([tier, prog]) => {
            const tierNum = Number(tier)
            const isHighest = tierNum === Math.max(...Object.keys(tierProgress).map(Number))
            return (
              <div key={tier} className="card text-center">
                <ProgressRing accuracy={prog.accuracy} size={70} label={tierNames[tierNum]} />
                <p className="text-xs text-muted mt-2">
                  {isHighest ? "LEVEL: ADVANCED" : `Tier ${tier}: ${tierNames[tierNum]}`}
                </p>
                <p className="text-xs text-muted/60">{prog.totalAttempts} attempts</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Accuracy breakdowns */}
      <div className="grid sm:grid-cols-2 gap-6">
        <section>
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">music_note</span>
            Scale Identification
          </h2>
          <div className="space-y-2">
            {Object.keys(scaleAccuracy).length === 0 && (
              <p className="text-sm text-muted">No data yet</p>
            )}
            {Object.entries(scaleAccuracy).map(([name, acc]) => (
              <div key={name} className="bg-surface border border-surface-2 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">{name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sonic-blue transition-all"
                        style={{ width: `${(acc.correct / Math.max(acc.total, 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted">
                      {Math.round((acc.correct / Math.max(acc.total, 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">hearing</span>
            Interval Identification
          </h2>
          <div className="space-y-2">
            {Object.keys(intervalAccuracy).length === 0 && (
              <p className="text-sm text-muted">No data yet</p>
            )}
            {Object.entries(intervalAccuracy).map(([name, acc]) => (
              <div key={name} className="bg-surface border border-surface-2 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">{name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sonic-blue transition-all"
                        style={{ width: `${(acc.correct / Math.max(acc.total, 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted">
                      {Math.round((acc.correct / Math.max(acc.total, 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
