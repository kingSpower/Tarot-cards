import { useState } from 'react'
import Header from './components/Header'
import AskQuestion from './components/AskQuestion'
import ManualSelect from './components/ManualSelect'
import DrawingStage from './components/DrawingStage'
import ResultPanel from './components/ResultPanel'
import SettingsPanel from './components/SettingsPanel'
import { useTarotReading } from './hooks/useTarotReading'
import { loadSettings, saveSettings } from './lib/storage'
import type { AISettings } from './lib/types'

export default function App() {
  const [settings, setSettings] = useState<AISettings>(() => loadSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const reading = useTarotReading(settings)

  const handleSave = (s: AISettings) => {
    setSettings(s)
    saveSettings(s)
    setSettingsOpen(false)
  }

  return (
    <div className="relative min-h-screen">
      <div className="starfield" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header phase={reading.phase} onReset={reading.reset} />

        <main className="flex-1 flex flex-col justify-center py-6">
          {reading.phase === 'setup' && (
            <AskQuestion onStart={reading.startReading} />
          )}
          {reading.phase === 'select' && reading.spread && (
            <ManualSelect
              spread={reading.spread}
              manualDrawn={reading.manualDrawn}
              onPick={reading.pickCard}
              onRemove={reading.removeAt}
              onConfirm={reading.confirmManual}
              onBack={reading.reset}
              onSwitchSpread={reading.changeSpread}
            />
          )}
          {reading.phase === 'reading' && (
            <DrawingStage
              drawn={reading.drawn}
              readingPhase={reading.readingPhase}
              onShuffleDone={reading.onShuffleDone}
              onRevealDone={reading.onRevealDone}
            />
          )}
          {reading.phase === 'result' && (
            <ResultPanel
              spreadName={reading.spread?.name ?? ''}
              question={reading.question}
              drawn={reading.drawn}
              interpretation={reading.interpretation}
              source={reading.source}
              onReset={reading.reset}
              onChange={reading.reset}
            />
          )}
        </main>

        <footer className="text-center text-[11px] text-white/30 py-4">
          塔罗仅供娱乐与自我觉察 · 命运始终握在你手中
        </footer>
      </div>

      {settingsOpen && (
        <SettingsPanel settings={settings} onSave={handleSave} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
