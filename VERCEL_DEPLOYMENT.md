# Vercel 部署指南

## 常见部署错误解决方案

### 1. "Failed to collect page data" 错误

这是最常见的 Vercel 部署错误，通常由以下原因引起：

#### 🔧 Prisma 客户端生成问题
- **原因**: Prisma 客户端在 Vercel 构建时没有正确生成
- **解决方案**: 我们已经在 `package.json` 中添加了修复：
  ```json
  {
    "scripts": {
      "build": "prisma generate && next build",
      "postinstall": "prisma generate"
    }
  }
  ```

#### 🌍 环境变量缺失
必须在 Vercel 项目设置中添加以下环境变量：

1. **DATABASE_URL** (必需)
   ```
   file:./dev.db
   ```
   
2. **NEXTAUTH_SECRET** (必需)
   ```
   请生成一个随机密钥，例如：abc123def456...
   ```
   
3. **NEXTAUTH_URL** (必需)
   ```
   https://your-app.vercel.app
   ```
   
4. **REPLICATE_API_TOKEN** (可选，用于真实转录)
   ```
   从 https://replicate.com/account/api-tokens 获取
   ```

5. **XAI_API_TOKEN** (可选，用于 AI 翻译)
   ```
   从 https://console.x.ai 获取
   ```

### 2. 设置 Vercel 环境变量

1. 进入 Vercel 项目仪表板
2. 点击 "Settings" 标签
3. 选择 "Environment Variables"
4. 添加上述所有必需的环境变量
5. 重新部署项目

### 3. 部署步骤

1. **本地测试**：
   ```bash
   npm install
   npm run build
   npm start
   ```

2. **推送到 GitHub**：
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push origin main
   ```

3. **Vercel 自动部署**：
   - Vercel 会自动检测到推送并开始部署
   - 检查构建日志确保没有错误

### 4. 故障排除

如果仍然遇到部署问题：

1. **检查构建日志**：
   - 在 Vercel 仪表板中查看详细的构建日志
   - 寻找具体的错误信息

2. **清除缓存**：
   - 在 Vercel 设置中清除构建缓存
   - 重新部署项目

3. **版本兼容性**：
   - 确保 Node.js 版本兼容（推荐 18.x）
   - 检查 Next.js 版本（当前使用 13.5.1）

### 5. 演示模式

如果没有配置 API Token，应用会自动进入演示模式：
- 显示模拟的转录结果
- 所有功能界面正常工作
- 用户可以体验完整的 UI

### 6. 生产就绪检查清单

- [ ] 所有环境变量已设置
- [ ] Prisma 客户端正确生成
- [ ] 构建命令包含 `prisma generate`
- [ ] 数据库连接正常
- [ ] API 路由正常响应
- [ ] 认证系统工作正常

---

如果遇到其他问题，请检查：
1. Vercel 函数超时设置（已配置为 300 秒）
2. 文件大小限制（Vercel 免费版限制 5MB）
3. 数据库连接是否稳定 