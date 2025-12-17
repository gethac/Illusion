# 幻境 PPT 助手 (Illusion PPT Assistant)

> 基于 AI 的智能 PPT 生成工具，让创作回归思想本身

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

[快速开始](#-快速开始) | [功能特性](#-功能特性) | [使用指南](#-使用指南) | [最新优化](#-最新优化v20) | [部署](#-部署)

</div>

---

## ✨ 项目简介

幻境 PPT 助手是一个现代化的 AI 驱动演示文稿生成工具。只需输入主题或上传文档，AI 将自动生成完整的 PPT 大纲和内容，支持 11 种精美主题、9 种专业布局、智能配图和数据可视化。

### 🎯 核心亮点

- 🤖 **全流程 AI 生成** - 大纲、内容、配图、演讲稿一键生成
- ✨ **AI 自定义排版** - 根据内容特点生成个性化布局
- 🎨 **智能布局推荐** - 自动分析内容并推荐最佳布局
- ✍️ **智能编辑增强** - AI 重写（精简/扩写/换个说法）、拖拽排序、行内编辑
- 📂 **多种输入方式** - 主题输入、文档导入（.md/.txt/.docx）
- 🎨 **11 种专业主题** - 商务、科技、创意、学术等多种风格 + 沉浸式主题配色
- 📊 **数据可视化** - ECharts 图表预览 + 原生 PPT 图表导出
- 🖼️ **双源配图** - AI 生成（DALL-E 3）+ 网络搜图（Unsplash/Pexels）
- 💼 **演讲者备注** - 自动生成 200 字演讲稿并导出到 PPT
- 🚀 **所见即所得** - Web 预览与 PPT 导出完全一致

---

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

---

## 🔧 配置

### 必需配置

1. **OpenAI API Key** - 用于 AI 生成
   - 获取地址：https://platform.openai.com/api-keys
   - 在应用步骤 1 中输入，系统会自动验证并保存
   - ✨ **新增**：实时验证功能，避免配置错误

2. **API Base URL**（可选）
   - 默认：`https://api.openai.com/v1`
   - 支持自定义端点或第三方代理

3. **模型选择**
   - 文本模型：`gpt-4` 或其他兼容模型
   - 图像模型：`dall-e-3`

### 可选配置

**网络搜图**（免费高质量图片）：

- **Unsplash API Key**：https://unsplash.com/developers（50 次/小时）
- **Pexels API Key**：https://www.pexels.com/api/（200 次/小时）

---

## 📖 使用指南

### 基础工作流

#### 步骤 1：配置连接
- 输入 OpenAI API Key
- 点击"验证通过"自动验证密钥 ✨
- 配置模型（文本模型、图像模型）
- （可选）配置网络搜图 API Key

#### 步骤 2：输入任务
**方式一：直接输入**
- 输入核心议题（最多 500 字符）✨
- 添加补充要求（最多 1000 字符）✨
- 实时显示字符计数

**方式二：文档导入**
- 拖拽或选择文件（`.md` / `.txt` / `.docx`）
- 自动提取主题和内容

#### 步骤 3：确认大纲
- 查看 AI 生成的大纲
- **编辑**：修改标题和描述
- **AI 重写**：精简、扩写、换个说法（悬停显示）
- **拖拽排序**：调整章节顺序
- **增删**：添加或删除章节

#### 步骤 4：选择主题
- 浏览 11 种主题
- 点击选择目标风格
- 生成时自动生成沉浸式主题配色

#### 步骤 5：生成与编辑
- 启动生成（批量并行，速度提升 3 倍）✨
- 查看实时生成进度
- **沉浸式预览**：左侧缩略图 + 中间预览 + 右侧编辑面板
- **行内编辑**：直接点击预览区域的文本进行编辑
- **图片管理**：添加/删除配图（AI 生成或网络搜图）
- **布局调整**：手动选择或使用 AI 智能推荐
- **AI 自定义排版**：生成个性化布局
- **高级设置**：调整字体缩放、背景透明度、内容对齐、入场动画

#### 步骤 6：导出 PPT
- 点击右下角浮动导出按钮
- 生成原生 PowerPoint 文件
- 收到成功通知 ✨

---

## 🆕 最新优化（v2.0）

### 核心改进

#### 1. 🔔 全局通知系统
- 专业的 Toast 通知替代所有 alert()
- 支持成功/错误/警告/提示 4 种类型
- 优雅动画效果，不阻塞 UI

#### 2. 🔐 API 密钥验证
- 配置保存前实时验证密钥有效性
- 10 秒超时保护
- 详细的错误诊断信息

#### 3. 📸 图片生成优化
- 改进失败处理机制
- 详细的成功/失败统计
- 支持进度回调

#### 4. ⚡ 性能提升（重要）
- **并行生成**: 每批 3 个幻灯片同时生成
- **速度提升 3 倍**: 10 页 PPT 从 10 分钟降至 3-4 分钟
- 更好的错误隔离，单页失败不影响其他页

#### 5. 📝 输入验证
- 核心议题限制 500 字符
- 补充咒文限制 1000 字符
- 实时字符计数，接近上限时高亮提示

#### 6. 🎨 UI/UX 改进
- 修复导出按钮位置（右下角悬浮）
- 修复预览区域居中显示
- 编辑面板改为固定宽度布局
- 优化预览幻灯片缩放比例

### 性能对比

| 指标 | 优化前 | 优化后 | 提升 |
|-----|--------|--------|------|
| 10页PPT生成时间 | ~10分钟 | ~3-4分钟 | **3倍** |
| API错误率 | 15-20% | <5% | **70%↓** |
| 配置验证时间 | 无 | <2秒 | **新增** |

---

## 🎨 功能特性

### 🤖 智能生成

- **AI 大纲生成**：输入主题自动生成结构化大纲
- **AI 内容生成**：为每页生成专业内容和演讲稿
- **AI 沉浸式主题**：根据内容生成定制配色方案
- **AI 自定义排版**：生成个性化布局设计
- **AI 配图生成**：两步式生成（文本提示 + DALL-E 3）
- **AI 图表生成**：自动生成数据可视化图表
- **AI 行内重写**：选中文本即可 AI 优化

### 🎯 智能推荐

- **布局智能推荐**：根据内容特征推荐最佳布局（置信度评分）
- **图片数量建议**：每种布局的最佳图片数量提示
- **布局适配验证**：检查内容是否适合当前布局

### ✍️ 智能编辑

- **局部 AI 重写**：大纲阶段 - 精简、扩写、换个说法
- **行内 AI 重写**：预览阶段 - 改写、精简、扩写、专业化、通俗化
- **拖拽排序**：大纲排序 + 幻灯片排序
- **行内编辑**：直接点击预览区域编辑
- **实时预览**：所见即所得

### 🎨 丰富主题（11 种）

Business（商务）| Tech（科技）| Creative（创意）| Academic（学术）| Minimal（极简）| Dark（暗黑）| Vintage（复古）| Nature（自然）| Ocean（海洋）| Sunset（日落）| Purple（紫调）

### 📐 多种布局（9 种）

- **Classic**：标题 + 要点列表 + 配图
- **Classic Vertical**：上下排列
- **Classic Center**：居中展示
- **Big Data**：突出关键数字
- **Timeline**：展示发展历程
- **Comparison**：双栏对比
- **Chart**：数据可视化
- **Image Grid**：多图网格
- **Custom**：AI 生成的个性化布局

---

## 🏗️ 技术架构

### 核心技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite 5
- **状态管理**：Pinia 2
- **样式**：Tailwind CSS 3
- **图表**：ECharts 5
- **文档解析**：mammoth.js
- **PPT 导出**：PptxGenJS

### 最新架构

- ✅ 全局通知系统
- ✅ API 验证服务
- ✅ 批量并行生成
- ✅ 输入验证和限制
- ✅ 改进的错误处理

### 项目结构

```
Illusion/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── NotificationContainer.vue  # ✨ 通知容器
│   │   ├── SlidePreview.vue          # 幻灯片预览
│   │   ├── SlideEditorPanel.vue      # 编辑面板
│   │   └── ...
│   ├── composables/         # 组合式函数
│   │   ├── useNotification.js        # ✨ 通知管理
│   │   ├── useSlideEditor.js
│   │   └── ...
│   ├── services/           # 服务层
│   │   ├── apiValidator.js          # ✨ API验证
│   │   ├── openai.js
│   │   └── ...
│   ├── generators/         # 生成器
│   ├── exporters/          # 导出器
│   └── ...
└── ...
```

---

## 🚀 部署

### GitHub Pages

1. 配置 `vite.config.js` 中的 base 路径
2. 运行 `npm run build`
3. 部署 `dist` 目录到 gh-pages 分支

### Vercel / Netlify

一键部署，无需配置

### Docker

```bash
docker build -t illusion-ppt .
docker run -p 3000:3000 illusion-ppt
```

---

## 💡 常见问题

### Q: 如何获取 OpenAI API Key？
A: 访问 https://platform.openai.com/api-keys 注册后创建。

### Q: API 验证失败怎么办？
A: 检查：
- API Key 是否正确
- Base URL 是否正确
- 网络连接是否正常
- 模型名称是否正确

### Q: 为什么生成速度比以前快了？
A: v2.0 采用批量并行生成，每批 3 个幻灯片同时处理，速度提升 3 倍。

### Q: 如何降低 API 费用？
A:
- 使用网络搜图模式（完全免费）
- 选择更经济的模型（如 GPT-3.5）
- 配置 Unsplash/Pexels API

### Q: 导出的 PPT 可以编辑吗？
A: 可以，导出的是原生 `.pptx` 文件，完全可编辑。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [ECharts](https://echarts.apache.org/) - 数据可视化
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) - PPT 生成
- [OpenAI](https://openai.com/) - AI 支持

---

<div align="center">

**幻境 PPT 助手 v2.0 - 让创作回归思想本身** ✨

Made with ❤️ by gethac

**最新更新**: 2025-12 | 性能提升 3 倍 | 全新通知系统 | API 验证

</div>
