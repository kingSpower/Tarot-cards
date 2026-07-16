import { motion } from 'framer-motion'
import TarotCard from './TarotCard'
import type { DrawnCard } from '../lib/types'

interface Props {
  spreadName: string
  question: string
  drawn: DrawnCard[]
  interpretation: string
  source: 'ai' | 'local' | null
  onReset: () => void
  onChange: () => void
}

export default function ResultPanel({
  spreadName,
  question,
  drawn,
  interpretation,
  source,
  onReset,
  onChange,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto px-5 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <span className="text-xs text-white/40">牌阵 · {spreadName}</span>
          {question.trim() && (
            <p className="mt-1 text-mystic-glow">「{question.trim()}」</p>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-center gap-5 mb-8">
          {drawn.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <TarotCard
                card={d.card}
                reversed={d.reversed}
                revealed
                className="w-24 h-36 sm:w-28 sm:h-44"
              />
              <span className="text-[11px] text-mystic-gold/80">{d.position}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-mystic-purple/40 bg-white/5 p-5 sm:p-6 shadow-glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-mystic-glow">牌面解读</h3>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                source === 'ai'
                  ? 'bg-mystic-purple/30 text-mystic-glow'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {source === 'ai' ? 'AI 解读' : '本地解读'}
            </span>
          </div>
          <div className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
            {interpretation}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-mystic-purple to-mystic-gold text-mystic-900 font-semibold hover:opacity-90 transition shadow-glow"
          >
            重新抽牌
          </button>
          <button
            onClick={onChange}
            className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:bg-white/10 transition"
          >
            换个牌阵
          </button>
        </div>
      </motion.div>
    </div>
  )
}
