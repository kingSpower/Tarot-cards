import type { AISettings } from './types'

const SETTINGS_KEY = 'tarot.ai.settings'

export const DEFAULT_SETTINGS: AISettings = {
  baseUrl: import.meta.env.VITE_AI_BASE_URL || 'https://api.siliconflow.cn/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || 'sk-nsflgpzwqatzphgvwnjxyqbgrzqovwyvhkfifxmybmyoztyy',
  model: import.meta.env.VITE_AI_MODEL || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
  style: '温柔而富有洞察力，像一位经验丰富的塔罗占卜师',
  useAI: true,
}

export function loadSettings(): AISettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AISettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* ignore */
  }
}
