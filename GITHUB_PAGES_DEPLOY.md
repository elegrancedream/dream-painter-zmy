# GitHub Pages 详细部署指南

本文档详细介绍如何将 Dream Painter 项目部署到 GitHub Pages。

---

## 📋 目录

1. [准备工作](#准备工作)
2. [创建 GitHub 仓库](#创建-github-仓库)
3. [配置项目](#配置项目)
4. [推送代码到 GitHub](#推送代码到-github)
5. [部署到 GitHub Pages](#部署到-github-pages)
6. [访问网站](#访问网站)
7. [更新网站](#更新网站)
8. [常见问题](#常见问题)

---

## 🚀 准备工作

### 1. 检查项目状态

确保项目可以正常运行：

```bash
# 进入项目目录
cd "第2阶段-代码开发与迭代/产出文档/code_files"

# 安装依赖（如果还没有安装）
npm install

# 本地测试运行
npm run dev
```

### 2. 检查 Git 状态

检查是否已经初始化 Git：

```bash
# 检查 Git 状态
git status
```

如果没有初始化，会提示：
```
fatal: not a git repository
```

### 3. 准备 GitHub 账号

- 如果没有 GitHub 账号，访问 [GitHub](https://github.com) 注册
- 记住你的用户名（username）

---

## 📦 创建 GitHub 仓库

### 步骤 1：登录 GitHub

1. 访问 [GitHub](https://github.com)
2. 登录你的账号

### 步骤 2：创建新仓库

1. 点击右上角的 **"+"** 图标
2. 选择 **"New repository"**

### 步骤 3：填写仓库信息

**Repository name**（仓库名称）：
- 例如：`dream-painter`
- 建议使用小写字母和连字符
- 这个名称会出现在 URL 中：`your-username.github.io/dream-painter`

**Description**（描述，可选）：
- 例如：`梦境画师 - 将梦境转化为画作的 Web 应用`

**Visibility**（可见性）：
- ✅ 选择 **Public**（公开）- GitHub Pages 免费版需要公开仓库
- ❌ Private（私有）- 需要 GitHub Pro（付费）

**其他选项**：
- ❌ 不要勾选 "Add a README file"（我们已经有代码了）
- ❌ 不要勾选 "Add .gitignore"（我们已经有了）
- ❌ 不要勾选 "Choose a license"（可选）

### 步骤 4：创建仓库

点击 **"Create repository"** 按钮

### 步骤 5：记录仓库地址

创建成功后，GitHub 会显示仓库地址，类似：
```
https://github.com/your-username/dream-painter.git
```

**记住这个地址，后面会用到！**

---

## ⚙️ 配置项目

### 步骤 1：安装 gh-pages

在项目目录执行：

```bash
cd "第2阶段-代码开发与迭代/产出文档/code_files"
npm install --save-dev gh-pages
```

### 步骤 2：修改 package.json

打开 `package.json`，在 `scripts` 部分添加部署脚本：

**修改前**：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

**修改后**：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**说明**：
- `deploy` 脚本会先执行 `npm run build` 构建项目
- 然后将 `dist` 文件夹部署到 GitHub Pages

### 步骤 3：修改 vite.config.js

打开 `vite.config.js`，添加 `base` 配置：

**修改前**：
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

**修改后**：
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dream-painter/', // ⚠️ 重要：替换为你的仓库名称
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

**重要提示**：
- 将 `/dream-painter/` 替换为你的实际仓库名称
- 例如，如果你的仓库名是 `my-dream-app`，则改为 `/my-dream-app/`
- 必须以 `/` 开头和结尾
- 这个配置确保资源路径正确

---

## 📤 推送代码到 GitHub

### 步骤 1：初始化 Git（如果还没有）

```bash
# 检查是否已初始化
git status

# 如果没有初始化，执行：
git init
```

### 步骤 2：添加文件到 Git

```bash
# 添加所有文件
git add .

# 查看将要提交的文件
git status
```

### 步骤 3：提交代码

```bash
# 提交代码（第一次提交）
git commit -m "Initial commit: Dream Painter project"

# 或者使用中文
git commit -m "初始提交：梦境画师项目"
```

### 步骤 4：添加远程仓库

```bash
# 添加远程仓库（替换为你的实际仓库地址）
git remote add origin https://github.com/your-username/dream-painter.git

# 验证远程仓库
git remote -v
```

**说明**：
- 将 `your-username` 替换为你的 GitHub 用户名
- 将 `dream-painter` 替换为你的仓库名称

### 步骤 5：推送到 GitHub

```bash
# 推送到 GitHub（第一次推送）
git push -u origin main

# 如果提示分支名不是 main，可能是 master，使用：
git push -u origin master
```

**如果遇到认证问题**：

**方法 A：使用 HTTPS（推荐）**
- GitHub 会提示输入用户名和密码
- 密码需要使用 Personal Access Token（不是 GitHub 密码）
- 创建 Token：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- 权限选择：`repo`（完整仓库访问权限）

**方法 B：使用 SSH**
```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加 SSH 密钥到 GitHub
# 1. 复制公钥内容：cat ~/.ssh/id_ed25519.pub
# 2. GitHub → Settings → SSH and GPG keys → New SSH key
# 3. 粘贴公钥并保存

# 使用 SSH 地址添加远程仓库
git remote set-url origin git@github.com:your-username/dream-painter.git
git push -u origin main
```

---

## 🚀 部署到 GitHub Pages

### 步骤 1：执行部署命令

```bash
# 在项目目录执行
npm run deploy
```

**这个命令会**：
1. 执行 `npm run build` 构建项目
2. 将 `dist` 文件夹部署到 GitHub Pages
3. 自动创建 `gh-pages` 分支

**输出示例**：
```
> dream-painter@1.0.0 deploy
> npm run build && gh-pages -d dist

> dream-painter@1.0.0 build
> vite build

vite v5.0.8 building for production...
✓ 123 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.js       245.67 kB
dist/assets/index-def456.css      12.34 kB
built in 2.34s

Published
```

### 步骤 2：等待部署完成

部署过程可能需要 1-2 分钟，请耐心等待。

### 步骤 3：启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（设置）标签
3. 在左侧菜单中找到 **Pages**（页面）
4. 在 **Source**（源）部分：
   - 选择 **Deploy from a branch**（从分支部署）
   - Branch（分支）：选择 `gh-pages`
   - Folder（文件夹）：选择 `/ (root)`
5. 点击 **Save**（保存）

### 步骤 4：等待 GitHub 处理

- GitHub 需要几分钟来处理部署
- 页面会显示：`Your site is live at https://your-username.github.io/dream-painter/`
- 如果显示 "Your site is ready to be published"，等待几分钟后刷新页面

---

## 🌐 访问网站

### 网站地址格式

```
https://your-username.github.io/repository-name/
```

**示例**：
- 用户名：`zhangsan`
- 仓库名：`dream-painter`
- 网站地址：`https://zhangsan.github.io/dream-painter/`

### 首次访问

1. 打开浏览器
2. 访问你的网站地址
3. 如果显示 404，等待几分钟后重试（GitHub 需要时间处理）

### 分享链接

将网站地址分享给其他人：
- 微信、QQ、邮件等任何方式
- 其他人可以直接访问，无需注册任何账号

---

## 🔄 更新网站

当你修改了代码后，需要重新部署：

### 方法 1：使用部署命令（推荐）

```bash
# 1. 修改代码后，提交更改
git add .
git commit -m "更新：修改了某个功能"

# 2. 推送到 GitHub
git push

# 3. 部署到 GitHub Pages
npm run deploy
```

### 方法 2：自动部署（如果配置了 GitHub Actions）

如果配置了 GitHub Actions，每次推送到 `main` 分支会自动部署。

---

## 🔐 配置环境变量（如果需要）

如果你的项目使用了 API Token 等环境变量：

### 方法：使用 GitHub Secrets（推荐）

1. 在 GitHub 仓库中，进入 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下变量：
   - Name: `VITE_COZE_BOT_ID`
   - Value: 你的 Bot ID
4. 重复添加其他变量：
   - `VITE_COZE_TOKEN`
   - `VITE_COZE_API_URL`（可选）

**注意**：GitHub Pages 是静态网站，环境变量需要在构建时注入。需要使用 GitHub Actions 来实现。

### 创建 GitHub Actions 工作流

创建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        env:
          VITE_COZE_BOT_ID: ${{ secrets.VITE_COZE_BOT_ID }}
          VITE_COZE_TOKEN: ${{ secrets.VITE_COZE_TOKEN }}
          VITE_COZE_API_URL: ${{ secrets.VITE_COZE_API_URL }}
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## ⚠️ 常见问题

### 问题 1：部署后显示 404

**原因**：
- `vite.config.js` 中的 `base` 路径配置错误
- 仓库名称与配置不一致

**解决方案**：
1. 检查 `vite.config.js` 中的 `base` 配置
2. 确保 `base` 值与仓库名称一致
3. 重新执行 `npm run deploy`

### 问题 2：资源加载失败（CSS、JS 文件 404）

**原因**：
- `base` 路径配置错误
- 资源路径不正确

**解决方案**：
1. 检查浏览器控制台（F12）的错误信息
2. 确认 `vite.config.js` 中的 `base` 配置正确
3. 重新构建和部署：
   ```bash
   npm run build
   npm run deploy
   ```

### 问题 3：Git 推送失败

**错误信息**：
```
error: failed to push some refs to 'github.com:...'
```

**解决方案**：
```bash
# 拉取远程更改
git pull origin main --rebase

# 或者强制推送（谨慎使用）
git push -f origin main
```

### 问题 4：gh-pages 命令失败

**错误信息**：
```
Error: Command failed: git push --set-upstream origin gh-pages
```

**解决方案**：
1. 检查 Git 认证是否正确
2. 确认仓库权限
3. 尝试手动创建 gh-pages 分支：
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   npm run build
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

### 问题 5：环境变量不生效

**原因**：
- GitHub Pages 是静态网站，无法读取环境变量
- 需要在构建时注入环境变量

**解决方案**：
- 使用 GitHub Actions 工作流（见上方"配置环境变量"部分）
- 或者在代码中直接配置（不推荐，会暴露敏感信息）

### 问题 6：网站更新后还是旧版本

**原因**：
- 浏览器缓存
- GitHub Pages 缓存

**解决方案**：
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 强制刷新（Ctrl+F5）
3. 等待几分钟后重试（GitHub 需要时间更新）

---

## 📝 完整部署流程总结

```bash
# 1. 进入项目目录
cd "第2阶段-代码开发与迭代/产出文档/code_files"

# 2. 安装 gh-pages
npm install --save-dev gh-pages

# 3. 修改 package.json（添加 deploy 脚本）
# 4. 修改 vite.config.js（添加 base 配置）

# 5. 初始化 Git（如果还没有）
git init

# 6. 添加文件
git add .

# 7. 提交代码
git commit -m "Initial commit"

# 8. 添加远程仓库
git remote add origin https://github.com/your-username/dream-painter.git

# 9. 推送到 GitHub
git push -u origin main

# 10. 部署到 GitHub Pages
npm run deploy

# 11. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source: gh-pages branch → Save

# 12. 访问网站
# https://your-username.github.io/dream-painter/
```

---

## 🎯 部署检查清单

- [ ] GitHub 账号已注册
- [ ] GitHub 仓库已创建
- [ ] `gh-pages` 已安装
- [ ] `package.json` 已添加 `deploy` 脚本
- [ ] `vite.config.js` 已配置 `base` 路径
- [ ] Git 已初始化
- [ ] 代码已推送到 GitHub
- [ ] `npm run deploy` 执行成功
- [ ] GitHub Pages 已启用
- [ ] 网站可以正常访问
- [ ] 所有资源（CSS、JS）加载正常

---

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/pages)
- [gh-pages 包文档](https://github.com/tschaub/gh-pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Git 基础教程](https://git-scm.com/book/zh/v2)

---

## 💡 提示

1. **仓库名称建议**：使用小写字母和连字符，避免空格和特殊字符
2. **首次部署**：可能需要等待 5-10 分钟才能访问
3. **更新部署**：修改代码后记得重新执行 `npm run deploy`
4. **自定义域名**：可以在 GitHub Pages 设置中绑定自己的域名
5. **私有仓库**：如果需要私有仓库，需要 GitHub Pro（付费）

---

## 🎉 完成！

部署成功后，你的网站就可以通过以下地址访问：
```
https://your-username.github.io/dream-painter/
```

这个链接可以直接分享给任何人使用！

