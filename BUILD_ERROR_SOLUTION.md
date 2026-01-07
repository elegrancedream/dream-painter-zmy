# 构建预览错误解决方案

## 🔍 问题分析

**现象**：
- `npm run dev` 正常运行 ✅
- `npm run build` 构建成功 ✅
- `npm run preview` 预览时出现"发生未知错误，请稍后重试" ❌

**根本原因**：
1. **环境变量未配置**：生产构建时，`VITE_COZE_BOT_ID` 和 `VITE_COZE_TOKEN` 未注入
2. **错误处理不完善**：错误信息未正确识别，显示为默认错误

---

## 🛠️ 解决方案

### 方案一：创建生产环境变量文件（推荐）

#### 步骤 1：创建 `.env.production` 文件

在项目根目录（`code_files`）创建 `.env.production` 文件：

```env
# 生产环境变量配置
VITE_COZE_API_URL=https://api.coze.cn/open_api/v2/chat
VITE_COZE_BOT_ID=你的Bot_ID
VITE_COZE_TOKEN=你的Token
```

**重要**：
- 将 `你的Bot_ID` 替换为实际的 Bot ID
- 将 `你的Token` 替换为实际的 Token
- 确保 `.gitignore` 中包含 `.env.production`（已包含）

#### 步骤 2：重新构建

```bash
npm run build
npm run preview
```

#### 步骤 3：验证

打开浏览器控制台（F12），检查是否有错误信息。

---

### 方案二：修改错误处理，显示详细错误信息

#### 步骤 1：修改 `src/utils/errorHandler.js`

在 `handleError` 函数中添加对配置错误的识别：

```javascript
export function handleError(error) {
  let errorMessage = '发生未知错误，请稍后重试'
  let errorType = 'UNKNOWN_ERROR'

  // 添加：识别配置错误
  if (error.message && error.message.includes('API配置错误')) {
    errorType = 'CONFIG_ERROR'
    errorMessage = error.message // 直接显示原始错误信息
    // 生产环境也显示详细错误
    console.error('配置错误:', error.message)
    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
    }
  }

  // ... 其余代码保持不变
}
```

#### 步骤 2：重新构建并测试

```bash
npm run build
npm run preview
```

现在会显示具体的配置错误信息，而不是"发生未知错误"。

---

### 方案三：使用命令行注入环境变量

#### Windows (PowerShell)

```powershell
$env:VITE_COZE_BOT_ID="你的Bot_ID"
$env:VITE_COZE_TOKEN="你的Token"
npm run build
npm run preview
```

#### Windows (CMD)

```cmd
set VITE_COZE_BOT_ID=你的Bot_ID
set VITE_COZE_TOKEN=你的Token
npm run build
npm run preview
```

#### Linux/Mac

```bash
export VITE_COZE_BOT_ID="你的Bot_ID"
export VITE_COZE_TOKEN="你的Token"
npm run build
npm run preview
```

**注意**：这种方式只在当前终端会话有效。

---

### 方案四：修改构建配置，支持开发环境变量

#### 步骤 1：修改 `vite.config.js`

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    // 确保环境变量在构建时可用
    define: {
      'import.meta.env.VITE_COZE_BOT_ID': JSON.stringify(env.VITE_COZE_BOT_ID),
      'import.meta.env.VITE_COZE_TOKEN': JSON.stringify(env.VITE_COZE_TOKEN),
      'import.meta.env.VITE_COZE_API_URL': JSON.stringify(env.VITE_COZE_API_URL || 'https://api.coze.cn/open_api/v2/chat'),
    }
  }
})
```

#### 步骤 2：创建 `.env` 文件（开发和生产共用）

```env
VITE_COZE_API_URL=https://api.coze.cn/open_api/v2/chat
VITE_COZE_BOT_ID=你的Bot_ID
VITE_COZE_TOKEN=你的Token
```

#### 步骤 3：重新构建

```bash
npm run build
npm run preview
```

---

### 方案五：改进错误处理，生产环境也显示详细错误（调试用）

#### 修改 `src/utils/errorHandler.js`

```javascript
export function handleError(error) {
  let errorMessage = '发生未知错误，请稍后重试'
  let errorType = 'UNKNOWN_ERROR'

  // 识别配置错误
  if (error.message && error.message.includes('API配置错误')) {
    errorType = 'CONFIG_ERROR'
    errorMessage = error.message
    // 生产环境也显示（便于调试）
    console.error('配置错误:', error.message)
    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
    }
  }

  // ... 其余代码

  // 修改：生产环境也记录错误（便于调试）
  console.error('错误详情:', {
    type: errorType,
    message: errorMessage,
    originalError: error,
    // 显示环境信息
    env: {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    }
  })

  return {
    message: errorMessage,
    type: errorType,
    originalError: error,
  }
}
```

---

## 🔍 调试步骤

### 1. 检查浏览器控制台

打开浏览器开发者工具（F12），查看 Console 标签：
- 是否有红色错误信息？
- 错误信息是什么？

### 2. 检查网络请求

在 Network 标签中：
- 是否有 API 请求？
- 请求状态码是什么？
- 请求 URL 是否正确？

### 3. 检查环境变量

在浏览器控制台执行：

```javascript
console.log('API URL:', import.meta.env.VITE_COZE_API_URL)
console.log('Bot ID:', import.meta.env.VITE_COZE_BOT_ID)
console.log('Token:', import.meta.env.VITE_COZE_TOKEN ? '已配置' : '未配置')
```

如果显示 `undefined`，说明环境变量未正确注入。

---

## ✅ 推荐方案

**推荐使用方案一 + 方案二**：
1. 创建 `.env.production` 文件配置环境变量
2. 改进错误处理，显示详细错误信息

这样既能解决问题，又能方便调试。

---

## 📝 注意事项

1. **不要提交敏感信息**：确保 `.env.production` 在 `.gitignore` 中
2. **不同环境使用不同配置**：
   - `.env.development` - 开发环境
   - `.env.production` - 生产环境
3. **环境变量命名**：Vite 要求环境变量以 `VITE_` 开头
4. **重新构建**：修改环境变量后，必须重新执行 `npm run build`

---

## 🚀 部署时注意事项

部署到生产环境（如 Vercel、Netlify）时：

1. **在平台配置环境变量**：
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

2. **不要将 `.env.production` 提交到 Git**

3. **使用平台的环境变量配置功能**

---

## 📞 如果问题仍然存在

1. 检查浏览器控制台的完整错误信息
2. 检查网络请求的详细信息
3. 确认 API Token 和 Bot ID 是否正确
4. 确认 API URL 是否正确
5. 检查 CORS 设置（如果 API 有跨域限制）

