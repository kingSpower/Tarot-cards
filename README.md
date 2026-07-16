# 🔮 塔罗牌占卜（Tarot Cards）

一个带有 **UI 动画** 与 **AI 解读** 的塔罗牌抽卡 Web 应用。包含完整的 78 张韦特塔罗牌、洗牌/翻牌动画，并支持接入 OpenAI 兼容接口进行个性化解读（无密钥时也能用内置释义）。

## ✨ 功能

- **78 张完整牌组**：22 张大阿尔卡纳 + 56 张小阿尔卡纳，含正/逆位释义与关键词。
- **多种牌阵（12 种）**：每日一牌、时间之流、关系之镜、抉择指引、事业之途、心灵疗愈、财富之流、灵魂成长、是或否、五芒星、马蹄七星、凯尔特十字。
- **智能选阵**：输入问题后，应用会根据关键词自动匹配最合适的牌阵（也可手动覆盖）。
- **流畅动画**：星空背景、洗牌动画、3D 翻牌（Framer Motion）。
- **AI 解读**：接入任意 OpenAI 兼容接口（OpenAI / DeepSeek / 通义 / 自建等），失败时自动回退到本地释义。
- **纯前端**：配置保存在浏览器本地，无需后端。

## 🛠️ 技术栈

- Vite + React + TypeScript
- Tailwind CSS（暗色神秘主题）
- Framer Motion（动画）

## 🚀 本地运行

```bash
npm install
npm run dev      # 打开 http://localhost:5173
```

构建生产版本：

```bash
npm run build
npm run preview
```

## 🤖 接入 AI 解读

1. 点击右上角 **⚙ AI 设置**。
2. 勾选「启用 AI 解读」，填写：
   - **API 地址**：如 `https://api.openai.com/v1`（DeepSeek 为 `https://api.deepseek.com/v1`）。
   - **API Key**：你的密钥（仅存于浏览器本地，不会上传）。
   - **模型名称**：如 `gpt-4o-mini`、`deepseek-chat`。
   - **占卜师风格**：自定义解读语气。
3. 保存后重新抽牌即可获得 AI 解读。

> 接口说明：前端会向 `{API 地址}/chat/completions` 发送标准 OpenAI Chat 请求。若未配置或调用失败，将自动使用内置牌义生成「本地解读」。

也可在 `.env` 中预置默认值（参考 `.env.example`，建议复制为 `.env` 后填写）。

## 📁 目录结构

```
src/
├── data/tarotDeck.ts        # 78 张牌 + 牌阵定义
├── lib/
│   ├── types.ts             # 类型定义
│   ├── ai.ts                # AI 解读 + 本地回退
│   └── storage.ts           # 设置本地存储
├── hooks/useTarotReading.ts # 抽牌状态机
├── components/              # UI 组件（卡片、牌阵选择、抽牌舞台、结果、设置）
└── App.tsx
```

> 说明：牌面为符号化样式（emoji + 牌义），未使用真实塔罗插画，便于直接运行与二次美化。
