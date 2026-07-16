import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TarotCard from './TarotCard'
import type { DrawnCard } from '../lib/types'
import type { ReadingPhase } from '../hooks/useTarotReading'

interface Props {
  drawn: DrawnCard[]
  readingPhase: ReadingPhase
  onShuffleDone: () => void
  onRevealDone: () => void
}

const SHUFFLE_MS = 1900

export default function DrawingStage({ drawn, readingPhase, onShuffleDone, onRevealDone }: Props) {
  const [revealed, setRevealed] = useState<boolean[]>([])

  // 洗牌动画结束后进入翻牌阶段
  useEffect(() => {
    if (readingPhase !== 'shuffle') return
    const t = window.setTimeout(onShuffleDone, SHUFFLE_MS)
    return () => clearTimeout(t)
  }, [readingPhase, onShuffleDone])

  // 翻牌阶段：逐张翻开，全部翻开后请求解读
  useEffect(() => {
    if (readingPhase !== 'reveal') return
    setRevealed(new Array(drawn.length).fill(false))
    const timers: number[] = []
    drawn.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
        }, 350 + i * 520),
      )
    })
    const total = 350 + drawn.length * 520 + 800
    const done = window.setTimeout(onRevealDone, total)
    return () => {
      timers.forEach((t) => clearTimeout(t))
      clearTimeout(done)
    }
  }, [readingPhase, drawn, onRevealDone])

  if (readingPhase === 'shuffle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="relative w-40 h-60">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-xl border border-mystic-purple/40 bg-gradient-to-br from-mystic-700 to-mystic-900 shadow-glow"
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: [0, (i - 2) * 14, 0],
                y: [0, -10 - i * 4, 0],
                rotate: [0, (i - 2) * 10, 0],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
            >
              <div className="absolute inset-2 rounded-lg border border-mystic-gold/30" />
            </motion.div>
          ))}
        </div>
        <p className="mt-10 text-mystic-glow tracking-[0.3em] text-sm animate-pulse">洗 牌 中 …</p>
      </div>
    )
  }

  const isInterpreting = readingPhase === 'interpreting'

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-4">
      <p className="mb-8 text-white/50 text-sm">
        {isInterpreting ? '牌已落定，正在为你解读……' : '牌已翻开，请静心感受'}
      </p>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {drawn.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <TarotCard
              card={d.card}
              reversed={d.reversed}
              revealed={revealed[i]}
              className="w-28 h-44 sm:w-32 sm:h-48"
            />
            <span className="text-xs text-mystic-gold/80 tracking-wide">{d.position}</span>
          </div>
        ))}
      </div>
      {isInterpreting && (
        <div className="mt-10 flex items-center gap-3 text-mystic-glow">
          <span className="w-4 h-4 rounded-full border-2 border-mystic-purple border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">
            {drawn.some((_, i) => !revealed[i]) ? '翻牌中…' : '正在生成解读…'}
          </span>
        </div>
      )}
    </div>
  )
}
