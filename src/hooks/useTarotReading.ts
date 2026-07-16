import { useCallback, useState } from 'react'
import { interpretReading } from '../lib/ai'
import type { AISettings, DrawnCard, Spread, TarotCard as TarotCardType } from '../lib/types'

export type Phase = 'setup' | 'select' | 'reading' | 'result'
export type ReadingPhase = 'shuffle' | 'reveal' | 'interpreting' | 'done'

export function useTarotReading(settings: AISettings) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [readingPhase, setReadingPhase] = useState<ReadingPhase>('shuffle')
  const [spread, setSpread] = useState<Spread | null>(null)
  const [question, setQuestion] = useState('')
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const [interpretation, setInterpretation] = useState('')
  const [source, setSource] = useState<'ai' | 'local' | null>(null)
  const [error, setError] = useState('')
  const [manualDrawn, setManualDrawn] = useState<DrawnCard[]>([])

  const startReading = useCallback((s: Spread, q: string) => {
    setSpread(s)
    setQuestion(q)
    setInterpretation('')
    setSource(null)
    setError('')
    setManualDrawn([])
    setPhase('select')
  }, [])

  // 自选模式：从牌库中点选一张放入下一个空位
  const pickCard = useCallback((card: TarotCardType) => {
    if (!spread) return
    setManualDrawn((prev) => {
      if (prev.length >= spread.positions.length) return prev
      const position = spread.positions[prev.length]
      return [...prev, { card, reversed: false, position }]
    })
  }, [spread])

  const removeAt = useCallback((i: number) => {
    setManualDrawn((prev) => prev.filter((_, idx) => idx !== i))
  }, [])

  const confirmManual = useCallback(() => {
    if (!spread || manualDrawn.length < spread.positions.length) return
    // 盲选阶段不揭示牌面，正/逆位在此随机决定，揭示时才可知
    const withOrientation = manualDrawn.map((d) => ({ ...d, reversed: Math.random() < 0.35 }))
    setDrawn(withOrientation)
    setManualDrawn([])
    setReadingPhase('reveal')
    setPhase('reading')
  }, [spread, manualDrawn])

  const onShuffleDone = useCallback(() => {
    setReadingPhase('reveal')
  }, [])

  const onRevealDone = useCallback(async () => {
    if (!spread) return
    setReadingPhase('interpreting')
    try {
      const result = await interpretReading({
        question,
        spread,
        drawn,
        settings,
      })
      setInterpretation(result.text)
      setSource(result.source)
    } catch (e) {
      setError(e instanceof Error ? e.message : '解读失败')
    } finally {
      setReadingPhase('done')
      setPhase('result')
    }
  }, [spread, question, drawn, settings])

  const changeSpread = useCallback((s: Spread) => {
    setSpread(s)
    setManualDrawn([])
    setPhase('select')
  }, [])

  const reset = useCallback(() => {
    setPhase('setup')
    setReadingPhase('shuffle')
    setSpread(null)
    setQuestion('')
    setDrawn([])
    setManualDrawn([])
    setInterpretation('')
    setSource(null)
    setError('')
  }, [])

  return {
    phase,
    readingPhase,
    spread,
    question,
    drawn,
    manualDrawn,
    interpretation,
    source,
    error,
    startReading,
    pickCard,
    removeAt,
    confirmManual,
    onShuffleDone,
    onRevealDone,
    changeSpread,
    reset,
  }
}
