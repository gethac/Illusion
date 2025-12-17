# 幻境 PPT 助手

> 基于 AI 的智能 PPT 生成工具，让创作回归思想本身

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![部署状态](https://github.com/gethac/Illusion/actions/workflows/deploy.yml/badge.svg)](https://github.com/gethac/Illusion/actions/workflows/deploy.yml)

**🌐 在线演示**: [https://gethac.github.io/Illusion/](https://gethac.github.io/Illusion/)

</div>

---

## ✨ 核心特性

- 🤖 **AI 全流程生成** - 输入主题，一键生成大纲、内容、配图、演讲稿
- ⚡ **极速生成** - 批量并行处理，10 页 PPT 仅需 3-4 分钟（v2.0 优化）
- 🎨 **11 种主题** - 商务/科技/创意/学术等专业风格 + AI 沉浸式配色
- 📐 **9 种布局** - 经典/数据/时间线/对比/图表/自定义等多样化排版
- ✨ **AI 智能辅助** - 自定义排版、布局推荐、内容重写、智能配图
- 📂 **灵活输入** - 支持主题输入或文档导入（.md/.txt/.docx）
- 🖼️ **双源配图** - AI 生成（DALL-E 3）+ 免费图库（Unsplash/Pexels）
- 📊 **数据可视化** - ECharts 图表 + 原生 PPT 图表导出
- 🚀 **所见即所得** - Web 预览与导出 PPT 完全一致

### 🆕 v2.0 新特性

- ✅ **API 密钥验证** - 配置时实时验证，避免错误
- ✅ **全局通知系统** - 专业 Toast 提示替代 alert()
- ✅ **3 倍性能提升** - 批量并行生成，大幅加速
- ✅ **输入验证** - 字符计数和限制，实时提示
- ✅ **改进错误处理** - 详细的失败反馈和统计

---

## 🚀 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 配置 API

1. **获取 OpenAI API Key**
   - 访问 https://platform.openai.com/api-keys
   - 创建 API Key

2. **在应用中配置**
   - 启动应用后，在步骤 1 输入 API Key
   - 点击"验证通过"自动验证
   - 配置保存在浏览器本地

3. **可选配置**
   - Unsplash API（免费图片，50次/小时）
   - Pexels API（免费图片，200次/小时）

### 使用流程

1. **配置连接** - 输入并验证 API Key
2. **输入任务** - 描述主题或上传文档
3. **确认大纲** - 编辑/重写/排序章节
4. **选择主题** - 11 种风格任选
5. **生成编辑** - AI 生成内容，支持实时编辑
6. **导出 PPT** - 下载原生 PowerPoint 文件

---

## 🎯 主要功能

### AI 生成

- 自动生成大纲和内容
- AI 配图（两步式优化提示词）
- 沉浸式主题配色
- 自定义布局设计
- 200 字演讲备注

### 智能编辑

- **大纲阶段**: AI 重写（精简/扩写/换说法）、拖拽排序
- **预览阶段**: 行内编辑、AI 优化、布局调整、配图管理
- **智能推荐**: 根据内容推荐最佳布局

### 布局类型

Classic | Classic Vertical | Classic Center | Big Data | Timeline | Comparison | Chart | Image Grid | Custom（AI 生成）

---

## 📦 部署

### GitHub Pages（推荐）

项目已配置自动部署，每次推送到 main 分支自动触发。

**步骤**：

1. 访问仓库设置: `Settings` → `Pages`
2. Source 选择: `GitHub Actions`
3. 推送代码或手动触发
4. 访问: https://gethac.github.io/Illusion/

**查看部署状态**: [GitHub Actions](https://github.com/gethac/Illusion/actions)

### Vercel / Netlify

```bash
# Vercel
vercel

# Netlify
netlify deploy
```

### 手动构建

```bash
npm run build
# 产物位于 dist/ 目录
```

---

## 💡 常见问题

**Q: 如何获取 API Key？**
A: 访问 https://platform.openai.com/api-keys 注册并创建。

**Q: 为什么生成速度很快？**
A: v2.0 采用批量并行生成，每批处理 3 个幻灯片，速度提升 3 倍。

**Q: 如何降低费用？**
A: 使用网络搜图模式（免费）、选择更经济的模型、配置免费图库 API。

**Q: 导出的 PPT 可以编辑吗？**
A: 可以，导出的是原生 .pptx 文件，完全可编辑。

**Q: 支持哪些文档导入？**
A: 支持 .md、.txt、.docx 格式。

---

## 🛠️ 技术栈

Vue 3 • Vite 5 • Pinia • Tailwind CSS • ECharts • PptxGenJS

---

## 📄 许可证

MIT License

---

## 🙏 致谢

[Vue.js](https://vuejs.org/) • [Vite](https://vitejs.dev/) • [ECharts](https://echarts.apache.org/) • [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) • [OpenAI](https://openai.com/)

---

<div align="center">

**幻境 PPT 助手 v2.0** ✨

Made with ❤️ by [gethac](https://github.com/gethac)

性能提升 3 倍 | 全新通知系统 | API 验证

</div>
