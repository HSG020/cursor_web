# VoiceScribe - AI语音转文字平台

一个功能强大的AI语音转文字应用，支持多语言转录、AI智能助手和实时翻译。

## ✨ 核心功能

- 🎙️ **专业语音转录**: 基于OpenAI Whisper模型，支持50+语言
- 🤖 **AI智能助手**: 使用xAI Grok模型进行内容分析和问答
- 🌍 **多语言翻译**: 实时翻译转录内容
- 👥 **说话人识别**: 自动识别和区分不同说话人
- 📱 **响应式界面**: 现代化UI设计，支持移动端

## 🚀 快速开始

### 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```env
# 语音转录API密钥 (Replicate OpenAI Whisper)
REPLICATE_API_TOKEN=your_replicate_api_token_here

# AI助手和翻译API密钥 (xAI Grok)
XAI_API_TOKEN=your_xai_api_token_here
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用。

### Vercel部署

1. 将代码推送到GitHub仓库
2. 在Vercel控制台连接GitHub仓库
3. **重要**: 在Vercel项目设置中添加环境变量：
   - `REPLICATE_API_TOKEN`
   - `XAI_API_TOKEN`
4. 触发重新部署

## 📋 支持的音频格式

- MP3, WAV, M4A, FLAC, OGG, WEBM
- 最大文件大小: 100MB
- 支持批量处理

## 🛠️ 技术栈

- **前端**: Next.js 13 + React + TypeScript
- **UI**: Tailwind CSS + Shadcn UI
- **语音转录**: OpenAI Whisper (via Replicate)
- **AI助手**: xAI Grok API
- **部署**: Vercel

---

*最后更新: 2024-06-03* 