export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type Arcana = 'major' | 'minor'

export interface TarotCard {
  id: string
  name: string
  nameCn: string
  arcana: Arcana
  suit: Suit | null
  number: string
  symbol: string
  keywords: string[]
  upright: string
  reversed: string
}

export interface DrawnCard {
  card: TarotCard
  reversed: boolean
  position: string
}

export interface Spread {
  id: string
  name: string
  description: string
  positions: string[]
}

export interface AISettings {
  baseUrl: string
  apiKey: string
  model: string
  style: string
  useAI: boolean
}
