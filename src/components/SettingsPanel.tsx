import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { AISettings } from '../lib/types'

interface Props {
  settings: AISettings
  onSave: (s: AISettings) => void
  onClose: () => void
}

export default function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<AISettings>(settings)
  const set = <K extends keyof AISettings>(k: K, v: AISettings[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-mystic-purple/40 bg-mystic-800 p-5 shadow-glow max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-mystic-glow">AI 解读设置</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            ✕
          </button>
        </div>

        <label className="flex items-center justify-between mb-4 text-sm">
          <span>启用 AI 解读</span>
          <input
            type="checkbox"
            checked={draft.useAI}
            onChange={(e) => set('useAI', e.target.checked)}
            className="w-4 h-4 accent-mystic-purple"
          />
        </label>

        <p className="text-[11px] text-white/40 mb-4 leading-relaxed">
          密钥仅保存在你的浏览器本地（localStorage），不会上传到任何服务器，由前端直接调用你配置的接口。
        </p>

        <div className="space-y-3">
          <Field label="API 地址（Base URL）">
            <input
              value={draft.baseUrl}
              onChange={(e) => set('baseUrl', e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="input"
            />
          </Field>
          <Field label="API Key">
            <input
              type="password"
              value={draft.apiKey}
              onChange={(e) => set('apiKey', e.target.value)}
              placeholder="sk-..."
              className="input"
            />
          </Field>
          <Field label="模型名称">
            <input
              value={draft.model}
              onChange={(e) => set('model', e.target.value)}
              placeholder="gpt-4o-mini"
              className="input"
            />
          </Field>
          <Field label="占卜师风格">
            <input
              value={draft.style}
              onChange={(e) => set('style', e.target.value)}
              placeholder="温柔而富有洞察力……"
              className="input"
            />
          </Field>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onSave(draft)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-mystic-purple to-mystic-gold text-mystic-900 font-semibold hover:opacity-90 transition"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:bg-white/10 transition"
          >
            取消
          </button>
        </div>
      </motion.div>

      <style>{`
        .input {
          width: 100%;
          margin-top: 4px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 12px;
          font-size: 13px;
          color: #fff;
          outline: none;
        }
        .input:focus { border-color: rgba(139,92,246,0.6); }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm text-white/70">
      {label}
      {children}
    </label>
  )
}
