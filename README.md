# 梦境画师 (Dream Painter)

将抽象、破碎的梦境记忆转化为具象的高质量画作的H5 Web应用。

## 技术栈

- **React 18+** - UI框架
- **Vite 5+** - 构建工具
- **Tailwind CSS 3+** - 样式方案
- **Framer Motion 10+** - 动画库

## 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 为 `.env.development` 并配置：

```bash
VITE_COZE_API_URL=https://api.coze.cn/v1/workflow/run
VITE_COZE_BOT_ID=your_bot_id
VITE_COZE_TOKEN=your_token
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
```

## 项目结构

```
src/
├── components/      # UI组件
├── api/            # API服务层
├── hooks/          # 自定义Hooks
├── utils/          # 工具函数
├── styles/         # 样式文件
├── App.jsx         # 主应用组件
└── main.jsx        # 入口文件
```

## 功能特性

- ✅ 梦境输入（捕星瓶组件）
- ✅ 风格选择（5种画风）
- ✅ 梦境生成（Coze API集成）
- ✅ 结果展示（立体绘本组件）
- ✅ 引导提示（非梦境场景）
- ✅ 移动端适配（陀螺仪交互）

## 浏览器支持

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 移动端浏览器（iOS Safari、Chrome Mobile）

