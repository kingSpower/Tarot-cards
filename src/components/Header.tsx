import type { Phase } from '../hooks/useTarotReading'

interface Props {
  phase: Phase
  onReset: () => void
}

export default function Header({ phase, onReset }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-floatStars">🔮</span>
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-shimmer">塔罗占卜</h1>
          <p className="text-[11px] text-white/40">聆听牌面的低语</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {phase !== 'setup' && (
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:bg-white/10 transition"
          >
            重新抽牌
          </button>
        )}
      </div>
    </header>
  )
}
