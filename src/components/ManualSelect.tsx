import { motion } from 'framer-motion'
import { TAROT_DECK, SPREADS } from '../data/tarotDeck'
import type { DrawnCard, Spread, TarotCard as TarotCardType } from '../lib/types'

interface Props {
  spread: Spread
  manualDrawn: DrawnCard[]
  onPick: (card: TarotCardType) => void
  onRemove: (i: number) => void
  onConfirm: () => void
  onBack: () => void
  onSwitchSpread: (s: Spread) => void
}

export default function ManualSelect({
  spread,
  manualDrawn,
  onPick,
  onRemove,
  onConfirm,
  onBack,
  onSwitchSpread,
}: Props) {
  const total = spread.positions.length
  const isFull = manualDrawn.length >= total
  const pickedIds = new Set(manualDrawn.map((d) => d.card.id))

  return (
    <div className="max-w-5xl mx-auto px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h2 className="text-2xl font-semibold text-mystic-glow">亲手选牌</h2>
        <p className="text-sm text-white/50 mt-2">
          静下心，凭直觉从下方牌库中点选 {total} 张——牌面被覆盖，选中的才会在上方揭开
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-white/50">牌阵</span>
          <select
            value={spread.id}
            onChange={(e) => {
              const s = SPREADS.find((x) => x.id === e.target.value)
              if (s) onSwitchSpread(s)
            }}
            className="text-xs bg-white/5 border border-white/15 rounded-full px-3 py-1.5 text-mystic-glow outline-none focus:border-mystic-purple/60"
          >
            {SPREADS.map((s) => (
              <option key={s.id} value={s.id} className="bg-mystic-900 text-white">
                {s.name}（{s.positions.length} 张）
              </option>
            ))}
          </select>
          <span className="text-[11px] text-mystic-gold/80">已选 {manualDrawn.length} / {total}</span>
        </div>
      </motion.div>

      {/* 已选槽位（遮挡，选牌阶段不揭示牌面） */}
      <div className="flex flex-wrap items-start justify-center gap-3 mb-6">
        {spread.positions.map((pos, i) => {
          const d = manualDrawn[i]
          return (
            <div key={pos} className="flex flex-col items-center gap-1 w-24">
              <span className="text-[11px] text-mystic-gold/80 text-center h-4 leading-tight">{pos}</span>
              {d ? (
                <div className="relative">
                  <div className="w-16 h-24 rounded-lg border border-mystic-purple/40 bg-gradient-to-br from-mystic-700 to-mystic-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-1.5 rounded-md border border-mystic-gold/30" />
                    <span className="text-xl opacity-80 animate-floatStars">🔮</span>
                  </div>
                  <button
                    onClick={() => onRemove(i)}
                    title="移除这张，重新选"
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white text-xs leading-none flex items-center justify-center hover:bg-rose-400"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-16 h-24 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-white/30 text-2xl">
                  ？
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 牌库（覆盖 / 牌背，盲选） */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/50 mb-3">牌库 · 凭直觉点选（牌面覆盖）</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[44vh] overflow-y-auto pr-1">
          {TAROT_DECK.map((card) => {
            const selected = pickedIds.has(card.id)
            const disabled = isFull && !selected
            return (
              <button
                key={card.id}
                disabled={disabled}
                onClick={() => onPick(card)}
                title={selected ? '已选入' : '凭直觉点选'}
                className={`relative aspect-[3/4] rounded-lg border border-mystic-purple/40 bg-gradient-to-br from-mystic-700 to-mystic-900 flex items-center justify-center overflow-hidden transition ${
                  selected ? 'opacity-25' : 'hover:border-mystic-gold/60'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                <div className="absolute inset-1.5 rounded-md border border-mystic-gold/30" />
                <span className="text-xl opacity-80 animate-floatStars">🔮</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:bg-white/10 transition"
        >
          重新选牌
        </button>
        <button
          disabled={!isFull}
          onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl font-semibold transition ${
            isFull
              ? 'bg-gradient-to-r from-mystic-purple to-mystic-gold text-mystic-900 hover:opacity-90 shadow-glow'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          完成选牌，开始解读 ✦
        </button>
      </div>
    </div>
  )
}
