import { motion } from 'framer-motion'
import type { TarotCard as TarotCardType, Suit } from '../lib/types'

interface Props {
  card: TarotCardType
  reversed: boolean
  revealed: boolean
  className?: string
  onClick?: () => void
}

const SUIT_ACCENT: Record<Suit, { ring: string; text: string; chip: string }> = {
  wands: { ring: 'ring-rose-400/50', text: 'text-rose-200', chip: 'bg-rose-500/20 text-rose-200' },
  cups: { ring: 'ring-sky-400/50', text: 'text-sky-200', chip: 'bg-sky-500/20 text-sky-200' },
  swords: { ring: 'ring-cyan-300/50', text: 'text-cyan-100', chip: 'bg-cyan-500/20 text-cyan-100' },
  pentacles: { ring: 'ring-amber-300/50', text: 'text-amber-200', chip: 'bg-amber-500/20 text-amber-200' },
}

const MAJOR_ACCENT = { ring: 'ring-mystic-gold/60', text: 'text-mystic-gold', chip: 'bg-mystic-gold/20 text-mystic-gold' }

export default function TarotCard({ card, reversed, revealed, className = '', onClick }: Props) {
  const accent = card.suit ? SUIT_ACCENT[card.suit] : MAJOR_ACCENT

  return (
    <div className={`card-3d ${className}`} onClick={onClick}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 牌背 */}
        <div className="card-face absolute inset-0 rounded-xl border border-mystic-purple/40 bg-gradient-to-br from-mystic-700 to-mystic-900 shadow-glow flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 rounded-lg border border-mystic-gold/30" />
          <div className="text-4xl opacity-80 animate-floatStars">🔮</div>
          <div className="absolute bottom-3 text-[10px] tracking-[0.3em] text-mystic-gold/70">TAROT</div>
        </div>

        {/* 牌面 */}
        <div
          className="card-face absolute inset-0 rounded-xl border bg-gradient-to-b from-mystic-800 to-mystic-900 p-2 flex flex-col items-center text-center shadow-gold overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className={`absolute inset-1.5 rounded-lg border ${accent.ring}`} />
          <div className={`relative mt-1 text-[11px] tracking-widest ${accent.text}`}>
            {card.number} · {card.arcana === 'major' ? '大阿尔卡纳' : '小阿尔卡纳'}
          </div>
          <div
            className="relative flex-1 flex flex-col items-center justify-center gap-1"
            style={reversed ? { transform: 'rotate(180deg)' } : undefined}
          >
            <div className="text-4xl leading-none">{card.symbol}</div>
            <div className="text-sm font-semibold text-mystic-glow leading-tight">{card.nameCn}</div>
            <div className="text-[10px] text-white/50 leading-tight">{card.name}</div>
          </div>
          <div className="relative mb-1">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                reversed ? 'bg-rose-500/25 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'
              }`}
            >
              {reversed ? '逆位' : '正位'}
            </span>
          </div>
          <div className="relative flex flex-wrap gap-1 justify-center px-0.5 pb-0.5">
            {card.keywords.map((k) => (
              <span key={k} className={`text-[9px] px-1.5 py-0.5 rounded-full ${accent.chip}`}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
