# 手机端"高危网站提示"问题解决方案

## 🔒 问题分析

手机端显示"高危网站提示"通常由以下原因导致：

### 1. **GitHub Pages HTTPS 配置问题** ⚠️ 最常见
- GitHub Pages 使用 Let's Encrypt 证书
- 某些手机浏览器（特别是国产浏览器）可能不信任
- 需要强制 HTTPS 重定向

### 2. **Mixed Content（混合内容）** ⚠️ 高优先级
- 页面中有 HTTP 资源
- 浏览器会阻止加载并显示安全警告

### 3. **Content Security Policy (CSP) 缺失** ⚠️ 中优先级
- 缺少安全策略头
- 某些浏览器会标记为不安全

### 4. **网站被标记为不安全** ⚠️ 低优先级
- 域名或 IP 被安全软件标记
- 需要申诉或更换域名

---

## 🛠️ 解决方案

### 方案一：添加安全响应头（推荐）

创建 `public/_headers` 文件（Netlify）或 `.htaccess`（Apache）或 `_redirects`（GitHub Pages）

#### GitHub Pages 方案：
GitHub Pages 不支持自定义响应头，需要通过其他方式解决。

#### Netlify 方案：
创建 `public/_headers` 文件：
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### Vercel 方案：
创建 `vercel.json`：
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

### 方案二：确保所有资源使用 HTTPS

检查并修复所有 HTTP 资源：

1. **Google Fonts** ✅ 已使用 HTTPS
2. **API 调用** ✅ 已使用 HTTPS
3. **图片资源** ⚠️ 需要检查

---

### 方案三：添加 Content Security Policy

在 `index.html` 中添加 CSP meta 标签：

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.coze.cn;
  frame-ancestors 'none';
">
```

---

### 方案四：GitHub Pages 强制 HTTPS

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 设置
3. 确保 "Enforce HTTPS" 已启用
4. 如果未启用，点击 "Enforce HTTPS" 按钮

---

### 方案五：使用自定义域名 + SSL 证书

如果 GitHub Pages 的 HTTPS 证书不被信任：

1. **使用自定义域名**
   - 购买域名（如：`dream-painter.com`）
   - 在 GitHub Pages 设置中添加自定义域名

2. **使用 Cloudflare（推荐）**
   - 将域名 DNS 指向 Cloudflare
   - Cloudflare 提供免费 SSL 证书
   - 更可靠的 HTTPS 支持

---

## 🔧 立即修复步骤

### 步骤 1：检查 GitHub Pages HTTPS 设置

1. 打开 GitHub 仓库
2. 进入 `Settings` → `Pages`
3. 检查 "Enforce HTTPS" 是否已启用
4. 如果未启用，点击启用

### 步骤 2：添加 CSP 和安全 meta 标签

修改 `index.html`，添加安全相关的 meta 标签。

### 步骤 3：检查所有资源

确保所有外部资源都使用 HTTPS：
- ✅ Google Fonts: `https://fonts.googleapis.com`
- ✅ API: `https://api.coze.cn`
- ✅ 图片: 确保使用 HTTPS URL

### 步骤 4：测试

1. 使用手机浏览器访问
2. 检查是否还有安全警告
3. 查看浏览器 Console 是否有 Mixed Content 警告

---

## 📋 检查清单

### GitHub Pages 设置
- [ ] "Enforce HTTPS" 已启用
- [ ] 自定义域名（如果有）已配置 SSL
- [ ] 仓库设置为 Public（私有仓库可能有限制）

### 代码检查
- [ ] 所有外部资源使用 HTTPS
- [ ] 无 HTTP 资源引用
- [ ] 添加了 CSP meta 标签
- [ ] 添加了安全相关的 meta 标签

### 浏览器测试
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] 微信内置浏览器
- [ ] 其他国产浏览器（UC、QQ浏览器等）

---

## 🚨 常见问题

### Q1: GitHub Pages 显示"不安全"
**原因**：HTTPS 未强制启用
**解决**：在 GitHub Pages 设置中启用 "Enforce HTTPS"

### Q2: 某些浏览器仍显示警告
**原因**：浏览器安全策略不同
**解决**：
- 使用主流浏览器（Chrome、Safari）
- 考虑使用自定义域名 + Cloudflare

### Q3: Mixed Content 警告
**原因**：页面中有 HTTP 资源
**解决**：
- 检查所有资源 URL
- 确保都使用 HTTPS
- 使用浏览器开发者工具检查 Network 标签

### Q4: 证书不受信任
**原因**：Let's Encrypt 证书在某些地区可能不被信任
**解决**：
- 使用自定义域名 + Cloudflare（提供更可靠的证书）
- 或使用其他托管平台（Vercel、Netlify）

---

## 📝 总结

"高危网站提示"的主要原因是：
1. **GitHub Pages HTTPS 未强制启用**（最常见）
2. **Mixed Content**（页面中有 HTTP 资源）
3. **缺少安全响应头**（CSP、HSTS 等）
4. **浏览器不信任 Let's Encrypt 证书**（某些国产浏览器）

**推荐解决方案**：
1. ✅ 启用 GitHub Pages 的 "Enforce HTTPS"
2. ✅ 添加 CSP meta 标签
3. ✅ 确保所有资源使用 HTTPS
4. ✅ 考虑使用自定义域名 + Cloudflare（长期方案）

