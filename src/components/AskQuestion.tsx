import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SPREADS } from '../data/tarotDeck'
import { detectSpread } from '../lib/spreadDetect'
import type { Spread } from '../lib/types'

interface Props {
  onStart: (spread: Spread, question: string) => void
}

export default function AskQuestion({ onStart }: Props) {
  const [question, setQuestion] = useState('')
  const [manual, setManual] = useState(false)
  const [selected, setSelected] = useState<Spread>(() => detectSpread(''))

  const detected = useMemo(() => detectSpread(question), [question])

  // 未手动选择时，跟随问题自动判断牌阵
  useEffect(() => {
    if (!manual) setSelected(detected)
  }, [manual, detected])

  const handlePick = (s: Spread) => {
    setSelected(s)
    setManual(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-semibold text-mystic-glow">说出你的疑问</h2>
        <p className="text-sm text-white/50 mt-2">我会根据你的提问，自动为你选择合适的牌阵</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value)
            if (manual) setManual(false)
          }}
          rows={3}
          placeholder="例如：我该不该接受那份新工作？ / 他和我的关系会如何发展？ / 最近很迷茫，不知方向……"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-mystic-purple/60 resize-none"
        />
      </motion.div>

      <div className="mb-4 flex items-center gap-2 text-xs">
        {question.trim() ? (
          <span className="text-mystic-gold/80">
            {manual ? '已手动选择牌阵' : '✨ 已根据你的提问自动选择：'}
            {!manual && <span className="text-mystic-glow font-semibold"> {detected.name}</span>}
          </span>
        ) : (
          <span className="text-white/40">未填写问题 · 默认使用「每日一牌」</span>
        )}
        {manual && (
          <button onClick={() => setManual(false)} className="text-mystic-purple/80 underline">
            恢复自动
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPREADS.map((s, i) => {
          const active = s.id === selected.id
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handlePick(s)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                active
                  ? 'border-mystic-gold/70 bg-mystic-purple/20 shadow-gold'
                  : 'border-white/10 bg-white/5 hover:border-mystic-purple/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-mystic-glow">{s.name}</h3>
                <span className="text-[11px] text-white/40">{s.positions.length} 张牌</span>
              </div>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{s.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {s.positions.map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/60">
                    {p}
                  </span>
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={() => onStart(selected, question)}
        className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-mystic-purple to-mystic-gold text-mystic-900 font-semibold tracking-wide hover:opacity-90 transition shadow-glow"
      >
        开始选牌 ✦
      </button>
    </div>
  )
}
