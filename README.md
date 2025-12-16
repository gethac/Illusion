# 幻境 PPT 助手

> 基于 AI 的智能 PPT 生成工具，让创作回归思想本身

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

[快速开始](#-快速开始) | [功能特性](#-功能特性) | [使用指南](#-使用指南) | [技术架构](#-技术架构)

</div>

---

## ✨ 项目简介

幻境 PPT 助手是一个现代化的 AI 驱动演示文稿生成工具。只需输入主题或上传文档，AI 将自动生成完整的 PPT 大纲和内容，支持 11 种精美主题、6 种专业布局、智能配图和数据可视化。

### 🎯 核心亮点

- 🤖 **全流程 AI 生成** - 大纲、内容、配图、演讲稿一键生成
- ✍️ **智能编辑增强** - AI 重写（精简/扩写/换个说法）、拖拽排序
- 📂 **多种输入方式** - 主题输入、文档导入（.md/.txt/.docx）
- 🎨 **11 种专业主题** - 商务、科技、创意、学术等多种风格
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

---

## 🔧 配置

### 必需配置

1. **OpenAI API Key** - 用于 AI 生成
   - 获取地址：https://platform.openai.com/api-keys
   - 在应用步骤 1 中输入，会自动保存

2. **API Base URL**（可选）
   - 默认：`https://api.openai.com/v1`
   - 支持自定义端点或第三方代理

3. **模型选择**
   - 文本模型：`gpt-5.2` 或其他兼容模型
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
- 选择图片源（AI 生成 / 网络搜图）

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
- **AI 重写**：精简、扩写、换个说法
- **拖拽排序**：调整章节顺序
- **增删**：添加或删除章节

#### 步骤 4：选择主题
- 浏览 11 种主题
- 点击选择目标风格

#### 步骤 5：生成与导出
- 启动生成
- 查看进度和预览
- 导出 PowerPoint 文件

### 高级功能

#### AI 重写
悬停在描述文本框上，显示三个重写按钮：
- **精简**：压缩到 50-70%
- **扩写**：扩展到 150-200%
- **换个说法**：改变表达方式

#### 拖拽排序
按住大纲项左侧的拖拽手柄，拖动到目标位置即可排序。

#### 双源配图
- **AI 生成**：定制化、高相关性（适合抽象概念）
- **网络搜图**：速度快、质量高、免费（适合具体事物）

---

## 🎨 功能特性

### 🤖 智能生成

- **AI 大纲生成**：输入主题自动生成结构化大纲
- **AI 内容生成**：为每页生成专业内容和演讲稿
- **AI 配图生成**：DALL-E 3 定制图片 + Unsplash/Pexels 搜图
- **AI 图表生成**：自动生成数据可视化图表

### ✍️ 智能编辑

- **局部 AI 重写**：精简、扩写、换个说法
- **拖拽排序**：直观调整幻灯片顺序
- **实时预览**：所见即所得

### 🎨 丰富主题（11 种）

Business（商务）| Tech（科技）| Creative（创意）| Academic（学术）| Minimal（极简）| Dark（暗黑）| Vintage（复古）| Nature（自然）| Ocean（海洋）| Sunset（日落）| Purple（紫调）

### 📐 多种布局（6 种）

- **Classic**（经典）：标题 + 要点列表 + 配图
- **Big Data**（大数据）：突出关键数字
- **Timeline**（时间线）：展示发展历程
- **Comparison**（对比）：双栏对比展示
- **Chart**（图表）：数据可视化
- **Quote**（引用）：名言金句展示

### 📤 专业导出

- **PowerPoint 导出**：生成原生 `.pptx` 文件
- **演讲者备注**：自动生成 200 字演讲稿
- **原生图表**：生成可编辑的 PPT 图表（非截图）

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

### 项目结构

```
Illusion/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── Icon.vue        # 图标组件
│   │   ├── Chart.vue       # 图表组件
│   │   └── FileUpload.vue  # 文件上传组件
│   ├── stores/             # Pinia 状态管理
│   │   ├── config.js       # 配置 Store（持久化）
│   │   └── presentation.js # 演示 Store（会话）
│   ├── services/           # 服务层
│   │   ├── openai.js       # OpenAI API
│   │   ├── imageSearch.js  # 图片搜索
│   │   └── rewrite.js      # AI 重写
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
└── README.md               # 本文档
```

---

## 🎯 功能清单

### ✅ 已实现

- [x] Vite 5 + Vue 3 现代化架构
- [x] Pinia 状态管理
- [x] 11 个主题 + 6 种布局
- [x] PPTBuilder 统一样式系统
- [x] 演讲者逐字稿生成（200 字）
- [x] ECharts 图表可视化
- [x] 原生 PPT 图表导出
- [x] 文档上传解析（.md/.txt/.docx）
- [x] 双源配图机制（AI + 网络）
- [x] 幻灯片拖拽排序
- [x] 局部 AI 重写（精简/扩写/换个说法）

### 📋 计划中

- [ ] 结构化指令输入（演讲对象、时长）
- [ ] 沉浸式预览模式
- [ ] 流式响应（实时打字机效果）
- [ ] 容错重试机制
- [ ] 批量 AI 重写
- [ ] 重写历史记录
- [ ] 移动端适配

---

## 💡 常见问题

### Q: 如何获取 OpenAI API Key？
A: 访问 https://platform.openai.com/api-keys ，注册后创建 API Key。

### Q: 支持哪些模型？
A: 支持所有兼容 OpenAI API 的文本模型和图像模型。

### Q: 可以使用第三方 API 代理吗？
A: 可以，在"API 网关"中填入代理的 Base URL。

### Q: 如何降低 API 调用费用？
A: 选择网络搜图模式（完全免费）、使用更经济的文本模型、在大纲阶段仔细编辑。

### Q: 导出的 PPT 可以编辑吗？
A: 可以，导出的是原生 `.pptx` 文件，在 PowerPoint 中完全可编辑。

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
- [Unsplash](https://unsplash.com/) - 免费图片
- [Pexels](https://www.pexels.com/) - 免费图片
- [OpenAI](https://openai.com/) - AI 支持

---

<div align="center">

**幻境 PPT 助手 - 让创作回归思想本身** ✨

Made with by gethac

</div>
