import { SPREADS } from '../data/tarotDeck'
import type { Spread } from './types'

function get(id: string): Spread {
  const s = SPREADS.find((x) => x.id === id)
  if (!s) throw new Error(`未知牌阵: ${id}`)
  return s
}

// 按优先级匹配：是否 > 抉择 > 关系 > 财富 > 事业 > 疗愈 > 成长 > 综合大阵 > 时间 > 通用
const RULES: { id: string; keywords: string[] }[] = [
  {
    id: 'yesno',
    keywords: ['能不能', '会不会', '行不行', '成不成', '有没有可能', '可不可以', '是不是', '能否', '会否'],
  },
  {
    id: 'choice',
    keywords: ['要不要', '是否', '还是', '纠结', '该不该', '换不换', '去不去', '二选一', '犹豫', '抉择', '选a', '选b', 'a还是b'],
  },
  {
    id: 'relationship',
    keywords: ['感情', '关系', '恋', '爱', '他', '她', '我们', '对方', '男朋友', '女朋友', '女友', '男友', '分手', '复合', '婚姻', '夫妻', '暧昧', '前任', '喜欢'],
  },
  {
    id: 'wealth',
    keywords: ['财运', '财富', '钱', '金钱', '收入', '赚钱', '发财', '投资', '理财', '股票', '基金', '债', '收益', '偏财'],
  },
  {
    id: 'career',
    keywords: ['事业', '工作', '职业', '跳槽', '升职', '面试', '项目', '学业', '考试', '生意', 'offer', '考研', '留学', '创业'],
  },
  {
    id: 'healing',
    keywords: ['焦虑', '迷茫', '疗愈', '压力', '疲惫', '受伤', '痛苦', '抑郁', '不安', '内心', '治愈', '情绪', '失眠', '委屈'],
  },
  {
    id: 'growth',
    keywords: ['成长', '自己', '自我', '性格', '课题', '认识自己', '人生', '意义', '方向', '使命', '天赋', '潜能'],
  },
  {
    id: 'celtic',
    keywords: ['全面', '详细', '深入', '复杂', '完整', '整体', '综合', '来龙去脉', '方方面面'],
  },
  {
    id: 'horseshoe',
    keywords: ['过程', '经过', '演变', '一步步', '来龙', '阻碍', '障碍'],
  },
  {
    id: 'three',
    keywords: ['未来', '发展', '走向', '趋势', '会怎样', '结果', '接下来', '以后', '前景', '运势', '怎么', '如何', '怎么办'],
  },
]

export function detectSpread(question: string): Spread {
  const q = question.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k.toLowerCase()))) {
      return get(rule.id)
    }
  }
  return get('single')
}
