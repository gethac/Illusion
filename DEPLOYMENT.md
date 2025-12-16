# GitHub Pages 部署指南

本项目支持自动部署到 GitHub Pages。

## 方式一：GitHub Actions 自动部署（推荐）

### 步骤 1：配置仓库设置

1. 进入 GitHub 仓库页面
2. Settings → Pages
3. Source 选择：**GitHub Actions**

### 步骤 2：推送代码

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

推送后会自动触发部署，查看进度：Actions → Deploy to GitHub Pages

### 步骤 3：访问网站

部署完成后，访问：`https://<username>.github.io/Illusion/`

## 方式二：使用 gh-pages 包手动部署

### 步骤 1：安装依赖

```bash
npm install
```

### 步骤 2：修改 base 路径

编辑 `vite.config.js`，确保 base 设置为你的仓库名：

```javascript
base: process.env.NODE_ENV === 'production' ? '/Illusion/' : '/',
```

如果仓库名不是 `Illusion`，请修改为实际仓库名。

### 步骤 3：部署

```bash
npm run deploy
```

### 步骤 4：启用 GitHub Pages

1. Settings → Pages
2. Source 选择：**Deploy from a branch**
3. Branch 选择：**gh-pages** / root
4. 点击 Save

## 方式三：Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Illusion)

## 方式四：Netlify 一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/Illusion)

## 注意事项

1. **API Key 安全**：不要将 OpenAI API Key 提交到代码仓库
2. **Base 路径**：部署到子路径时必须正确配置 base
3. **构建输出**：dist 目录已在 .gitignore 中，不会被提交
4. **域名设置**：可以在 Settings → Pages 中配置自定义域名

## 故障排查

### 问题：页面空白或资源 404
**解决**：检查 vite.config.js 中的 base 配置是否正确

### 问题：GitHub Actions 部署失败
**解决**：
1. 检查 Settings → Actions → General 是否启用了 workflow 权限
2. 确保 Settings → Pages → Source 选择了 "GitHub Actions"

### 问题：样式丢失
**解决**：确保 base 路径配置正确，且所有资源引用使用相对路径

## 更多部署选项

- **Docker**: 参见 README.md 中的 Docker 部署章节
- **自建服务器**: 构建后直接部署 dist 目录到任何静态服务器
- **CDN**: 可配合 CDN 服务加速访问
