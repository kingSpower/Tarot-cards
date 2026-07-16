import type { AISettings, DrawnCard, Spread } from './types'

export interface InterpretationResult {
  text: string
  source: 'ai' | 'local'
}

interface InterpretParams {
  question: string
  spread: Spread
  drawn: DrawnCard[]
  settings: AISettings
}

function buildCardLines(drawn: DrawnCard[]): string {
  return drawn
    .map((d) => {
      const ori = d.reversed ? '逆位' : '正位'
      const meaning = d.reversed ? d.card.reversed : d.card.upright
      return `- 【${d.position}】${d.card.nameCn}（${d.card.name}）${ori}\n  关键词：${d.card.keywords.join('、')}\n  牌意：${meaning}`
    })
    .join('\n')
}

// 本地回退解读：基于牌面内置释义组合而成
export function buildLocalInterpretation(params: InterpretParams): string {
  const { question, spread, drawn } = params
  const header = question.trim()
    ? `关于你的问题「${question.trim()}」，我们用了【${spread.name}】牌阵。`
    : `你使用了【${spread.name}】牌阵。`

  const parts = drawn.map((d) => {
    const ori = d.reversed ? '逆位' : '正位'
    const meaning = d.reversed ? d.card.reversed : d.card.upright
    return `【${d.position} · ${d.card.nameCn} ${ori}】\n${meaning}`
  })

  const closing = question.trim()
    ? `\n—— 以上为各牌位的通用牌义，并未结合你的问题「${question.trim()}」展开。如需针对该问题的个性化解读，请在右上角 ⚙ 设置中接入可用的 AI（如 DeepSeek / OpenAI）后重新抽取。`
    : '\n—— 以上为各牌位的通用牌义。若想获得更贴合你处境的解读，可在设置中接入 AI 并先提出具体问题后重新抽取。'

  return `${header}\n\n${parts.join('\n\n')}${closing}`
}

export async function interpretReading(params: InterpretParams): Promise<InterpretationResult> {
  const { settings } = params
  if (!settings.useAI || !settings.apiKey) {
    return { text: buildLocalInterpretation(params), source: 'local' }
  }

  const cardLines = buildCardLines(params.drawn)
  const questionText = params.question.trim() || '（用户未提出具体问题，请做通用指引）'

  const systemPrompt = `你是一位${settings.style}。请用温暖、有画面感且富有洞察力的中文，为用户做塔罗牌解读。

【核心要求】
1. 必须紧扣用户在下方提出的「具体问题」展开，每一段解读都要直接回应该问题，绝不能泛泛罗列牌义或空谈牌面。
2. 解读要贴合牌阵各位置含义，把多张牌串联成一段连贯的、与问题紧密相关的叙事。
3. 避免绝对化预言，多用“可能”“可以留意”等温和措辞。
4. 若用户未提供具体问题，则做通用指引，并说明这是通用解读而非针对特定疑问。`

  const userPrompt = `【用户的问题】${questionText}

【牌阵】${params.spread.name}（${params.spread.description}）

【抽到的牌】
${cardLines}

【输出要求】请始终围绕上面的「用户的问题」来解读，按以下结构输出：
1. 整体氛围（一句话概括与这个问题相关的能量基调）
2. 逐张解读（对应每个位置，说明正/逆位，并明确它与“用户的问题”之间的关联）
3. 综合建议（直接回应用户的问题，给出可落地的行动指引）`

  try {
    const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 1200,
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`)
    }

    const data = await res.json()
    const raw: string | undefined = data?.choices?.[0]?.message?.content
    if (!raw) throw new Error('返回内容为空')
    // 推理模型（如 GLM-Z1）可能在正文里带 <think>...</think> 思考过程，剥离之
    const text = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    if (!text) throw new Error('返回内容为空')
    return { text, source: 'ai' }
  } catch (e) {
    const reason = e instanceof Error ? e.message : '未知错误'
    const fallback = buildLocalInterpretation(params)
    return {
      text: `${fallback}\n\n（注：AI 解读失败，已回退到本地释义。原因：${reason}）`,
      source: 'local',
    }
  }
}
