# 幻境 PPT 助手 (Illusion PPT Assistant)

> 基于 AI 的智能 PPT 生成工具，让创作回归思想本身

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

[快速开始](#-快速开始) | [功能特性](#-功能特性) | [使用指南](#-使用指南) | [技术架构](#-技术架构) | [部署](#-部署)

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

构建产物位于 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

---

## 🔧 配置

### 必需配置

1. **OpenAI API Key** - 用于 AI 生成
   - 获取地址：https://platform.openai.com/api-keys
   - 在应用步骤 1 中输入，会自动保存在浏览器本地

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
- 配置模型（文本模型、图像模型）
- （可选）配置网络搜图 API Key

#### 步骤 2：输入任务
**方式一：直接输入**
- 输入核心议题
- 添加补充要求（可选）

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
- 启动生成（会自动生成沉浸式主题）
- 查看实时生成进度
- **沉浸式预览**：左侧缩略图 + 中间预览 + 右侧编辑面板
- **行内编辑**：直接点击预览区域的文本进行编辑
- **图片管理**：添加/删除配图（AI 生成或网络搜图）
- **布局调整**：手动选择或使用 AI 智能推荐
- **AI 自定义排版**：生成个性化布局
- **高级设置**：调整字体缩放、背景透明度、内容对齐、入场动画
- **演讲备注**：查看并编辑 AI 生成的演讲稿

#### 步骤 6：导出 PPT
- 点击右下角浮动导出按钮
- 生成原生 PowerPoint 文件
- 文件名自动使用主题名称

### 高级功能

#### 🔮 AI 自定义排版
点击右侧面板的"AI自定义排版"按钮，AI 会根据当前幻灯片内容生成专属布局：
- 智能元素定位（标题、内容、列表、图片）
- 自动添加装饰元素
- 响应式设计
- 完全可编辑

#### 💡 智能布局推荐
系统会根据内容特征自动推荐最佳布局：
- 图片数量分析
- 内容长度评估
- 列表项数量考虑
- 置信度评分（70% 以上才推荐）
- 一键应用或忽略

#### ✍️ 行内 AI 重写
选中预览区域的任意文本，弹出 AI 工具栏：
- **改写**：换个说法
- **精简**：浓缩内容
- **扩写**：增加细节
- **专业化**：提升专业度
- **通俗化**：更易理解

#### 🖼️ 智能配图管理
右侧面板配图管理功能：
- 添加图片（AI 生成 / 网络搜图）
- 实时图片数量状态提示
- 自动触发布局推荐
- 多图网格预览
- 一键删除

#### 🎯 拖拽功能
- **大纲排序**：在步骤 3 拖拽大纲项调整顺序
- **幻灯片排序**：在预览页面左侧缩略图区域拖拽重排

---

## 🎨 功能特性

### 🤖 智能生成

- **AI 大纲生成**：输入主题自动生成结构化大纲
- **AI 内容生成**：为每页生成专业内容和演讲稿（避免"本页""这一页"等自我指涉）
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
- **右侧面板编辑**：标题、布局、配图、演讲备注、高级设置

### 🎨 丰富主题（11 种 + 沉浸式配色）

Business（商务）| Tech（科技）| Creative（创意）| Academic（学术）| Minimal（极简）| Dark（暗黑）| Vintage（复古）| Nature（自然）| Ocean（海洋）| Sunset（日落）| Purple（紫调）

每个主题会在生成时自动创建沉浸式配色方案，与内容高度契合。

### 📐 多种布局（9 种）

- **Classic**（经典）：标题 + 要点列表 + 配图
- **Classic Vertical**（垂直）：上下排列，适合多内容 + 图片
- **Classic Center**（居中）：简洁内容居中展示
- **Big Data**（大数据）：突出关键数字
- **Timeline**（时间线）：展示发展历程
- **Comparison**（对比）：双栏对比展示
- **Chart**（图表）：数据可视化
- **Image Grid**（多图网格）：2-4 张图片网格展示
- **Custom**（自定义）：AI 生成的个性化布局

### 📤 专业导出

- **PowerPoint 导出**：生成原生 `.pptx` 文件
- **动态文件名**：自动使用主题名称
- **演讲者备注**：自动生成 200 字演讲稿
- **原生图表**：生成可编辑的 PPT 图表（非截图）
- **完整样式**：封面装饰、页码、阴影、渐变

---

## 🏗️ 技术架构

### 核心技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite 5
- **状态管理**：Pinia 2
- **样式**：Tailwind CSS 3
- **图表**：ECharts 5 + vue-echarts 6
- **文档解析**：mammoth.js 1.6.0
- **PPT 导出**：PptxGenJS 3.12.0

### 架构特点

- **模块化设计**：按功能领域清晰划分
- **组合式函数**：可复用的业务逻辑
- **组件化**：小型、专注的组件
- **类型安全**：完整的 props 和 emits 定义
- **状态管理**：Pinia 持久化 + 会话状态分离

### 项目结构

```
Illusion/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── Icon.vue        # 图标组件
│   │   ├── Chart.vue       # 图表组件
│   │   ├── FileUpload.vue  # 文件上传组件
│   │   ├── SlidePreview.vue      # 幻灯片预览（重构后 689 行）
│   │   ├── ThumbnailList.vue     # 缩略图列表
│   │   ├── SlideEditorPanel.vue  # 编辑器面板
│   │   ├── LayoutAdviceCard.vue  # 布局建议卡片
│   │   ├── ImageStatusHint.vue   # 图片状态提示
│   │   ├── CustomLayoutRenderer.vue  # 自定义布局渲染器
│   │   └── InlineAIToolbar.vue   # 行内 AI 工具栏
│   ├── composables/         # 组合式函数
│   │   ├── useSlideEditor.js         # 幻灯片编辑
│   │   ├── useImageManagement.js     # 图片管理
│   │   ├── useLayoutRecommendation.js # 布局推荐
│   │   └── useSlideDragDrop.js       # 拖拽排序
│   ├── stores/             # Pinia 状态管理
│   │   ├── config.js       # 配置 Store（持久化）
│   │   └── presentation.js # 演示 Store（会话）
│   ├── services/           # 服务层
│   │   ├── openai.js       # OpenAI API
│   │   ├── imageSearch.js  # 图片搜索
│   │   ├── rewrite.js      # AI 重写
│   │   ├── themeGenerator.js       # 沉浸式主题生成
│   │   ├── layoutRecommender.js    # 布局推荐系统
│   │   └── customLayoutGenerator.js # 自定义布局生成
│   ├── generators/         # 生成器
│   │   ├── outline.js      # 大纲生成
│   │   ├── content.js      # 内容生成
│   │   └── image.js        # 图片生成
│   ├── exporters/          # 导出器
│   │   ├── pptx.js         # PPT 导出
│   │   └── PPTBuilder.js   # PPT 构建引擎
│   ├── config/             # 配置
│   │   └── themes.js       # 主题配置
│   ├── utils/              # 工具
│   │   ├── parseDocument.js
│   │   ├── storage.js
│   │   ├── particle.js
│   │   └── helpers.js
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口
│   └── style.css           # 全局样式
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
├── package.json            # 依赖配置
└── README.md               # 本文档
```

### 代码重构亮点

**SlidePreview.vue 重构（2061 → 689 行）**：
- 提取 4 个子组件（ThumbnailList、SlideEditorPanel、LayoutAdviceCard、ImageStatusHint）
- 提取 4 个组合式函数（useSlideEditor、useImageManagement、useLayoutRecommendation、useSlideDragDrop）
- 代码减少 66.6%，可维护性大幅提升

---

## 🚀 部署

### GitHub Pages 部署

1. **配置 base 路径**

编辑 `vite.config.js`：

```javascript
export default defineConfig({
  base: '/your-repo-name/', // 替换为你的仓库名
  // ... 其他配置
})
```

2. **构建项目**

```bash
npm run build
```

3. **部署到 GitHub Pages**

方式一：使用 `gh-pages` 包

```bash
npm install -D gh-pages
npm run deploy
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

方式二：手动部署

```bash
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git master:gh-pages
```

4. **启用 GitHub Pages**

在 GitHub 仓库设置中：
- Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages / root

### Vercel / Netlify 部署

一键部署，无需配置：

**Vercel**：
```bash
npm i -g vercel
vercel
```

**Netlify**：
```bash
npm i -g netlify-cli
netlify deploy
```

### Docker 部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
docker build -t illusion-ppt .
docker run -p 3000:3000 illusion-ppt
```

---

## 🎯 功能清单

### ✅ 已实现

- [x] Vite 5 + Vue 3 现代化架构
- [x] Pinia 状态管理
- [x] 11 个主题 + 沉浸式主题生成
- [x] 9 种专业布局
- [x] AI 自定义排版生成
- [x] 智能布局推荐系统
- [x] 图片数量智能提示
- [x] PPTBuilder 统一样式系统
- [x] 演讲者逐字稿生成（200 字）
- [x] ECharts 图表可视化
- [x] 原生 PPT 图表导出
- [x] 文档上传解析（.md/.txt/.docx）
- [x] 双源配图机制（AI + 网络）
- [x] 两步式 AI 配图（提示词优化 + DALL-E 3）
- [x] 幻灯片拖拽排序
- [x] 大纲 AI 重写（精简/扩写/换个说法）
- [x] 行内 AI 重写（改写/精简/扩写/专业化/通俗化）
- [x] 请求取消机制（AbortController）
- [x] 代码重构（组件化 + 组合式函数）
- [x] 右侧编辑面板（实时更新）
- [x] 高级设置（字体缩放、透明度、对齐、动画）
- [x] 沉浸式预览界面

### 📋 计划中

- [ ] 结构化指令输入（演讲对象、时长）
- [ ] 流式响应（实时打字机效果）
- [ ] 容错重试机制
- [ ] 批量 AI 重写
- [ ] 重写历史记录
- [ ] 移动端适配
- [ ] 多语言支持

---

## 💡 常见问题

### Q: 如何获取 OpenAI API Key？
A: 访问 https://platform.openai.com/api-keys ，注册后创建 API Key。

### Q: 支持哪些模型？
A: 支持所有兼容 OpenAI API 的文本模型（如 GPT-4、GPT-3.5）和图像模型（DALL-E 3）。

### Q: 可以使用第三方 API 代理吗？
A: 可以，在"API 网关"中填入代理的 Base URL。

### Q: 如何降低 API 调用费用？
A:
- 选择网络搜图模式（完全免费）
- 使用更经济的文本模型（如 GPT-3.5）
- 在大纲阶段仔细编辑，减少重新生成
- 配置 Unsplash/Pexels API 代替 DALL-E 3

### Q: 导出的 PPT 可以编辑吗？
A: 可以，导出的是原生 `.pptx` 文件，在 PowerPoint / WPS / Keynote 中完全可编辑。

### Q: AI 自定义排版和智能布局推荐有什么区别？
A:
- **智能布局推荐**：从现有 9 种布局中推荐最合适的
- **AI 自定义排版**：生成全新的个性化布局（包含元素定位、装饰等）

### Q: 为什么有时候没有布局推荐？
A: 系统只在置信度 ≥ 70% 时才显示推荐，这表示有明确更好的布局选择。

### Q: 请求取消功能是什么？
A: 在步骤 4 返回风格选择时，会自动取消正在进行的生成请求，避免资源浪费和费用产生。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 代码规范

- 使用 Vue 3 Composition API
- 遵循 ESLint 规则
- 组件应小而专注
- 复用逻辑应提取为组合式函数
- 保持代码简洁和可读性

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
- [Unsplash](https://unsplash.com/) - 免费图片
- [Pexels](https://www.pexels.com/) - 免费图片
- [OpenAI](https://openai.com/) - AI 支持

---

<div align="center">

**幻境 PPT 助手 - 让创作回归思想本身** ✨

Made with ❤️ by gethac

</div>
