# VoiceScribe - AI语音转文字平台

## 功能特点

- 🎤 专业级AI语音转文字（基于OpenAI Whisper）
- 🌍 支持50+种语言自动检测和转录
- 👥 智能说话人识别和分离
- 🔄 实时AI翻译（基于xAI Grok）
- 📱 现代化响应式界面
- ⚡ 大文件自动分割处理

## 本地运行

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件 `.env.local`：
```
REPLICATE_API_TOKEN=your_replicate_api_token_here
XAI_API_KEY=your_xai_api_key_here
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## Vercel部署说明

### 1. 连接GitHub仓库
- 登录 [Vercel控制台](https://vercel.com/dashboard)
- 点击 "New Project"
- 选择 "Import Git Repository" 
- 连接此GitHub仓库

### 2. 配置环境变量
在Vercel项目设置中添加以下环境变量：

| 变量名 | 值 | 环境 |
|--------|----|----- |
| `REPLICATE_API_TOKEN` | `your_replicate_token` | Production, Preview, Development |
| `XAI_API_KEY` | `your_xai_token` | Production, Preview, Development |

**API密钥获取方式**:
- Replicate Token: 访问 https://replicate.com/account/api-tokens
- xAI API Key: 访问 https://console.x.ai/

### 3. 部署设置
- Framework Preset: `Next.js`
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`

### 4. 故障排除

#### 问题1: API路由404错误
```bash
# 检查API端点
curl https://your-app.vercel.app/api/check

# 如果返回404，检查：
# 1. vercel.json配置是否正确
# 2. 环境变量是否设置
# 3. 重新部署项目
```

#### 问题2: JSON解析错误
通常表示API返回了HTML错误页面而不是JSON，原因可能是：
- 环境变量未设置
- API服务不可用
- CORS问题

#### 问题3: 部署失败
- 检查构建日志中的错误信息
- 确认所有依赖都在package.json中
- 检查TypeScript类型错误

## 测试API端点

部署成功后，可以测试以下端点：

```bash
# 健康检查
curl https://your-app.vercel.app/api/check

# 测试转录API（需要音频文件）
curl -X POST https://your-app.vercel.app/api/simple-transcribe \
  -F "file=@your-audio.mp3" \
  -F "language=auto"
```

## 支持的音频格式

- MP3
- WAV  
- M4A
- FLAC
- OGG
- WEBM

最大文件大小：50MB

## 技术栈

- **前端**: Next.js 13, React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **AI服务**: OpenAI Whisper (via Replicate), xAI Grok
- **部署**: Vercel

---

*最后更新: 2024-06-03* 