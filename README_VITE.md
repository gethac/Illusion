# 幻境 PPT 助手 V2.0 - Vite重构版本

## 项目概述

这是幻境PPT助手的Vite + Vue 3 + Pinia重构版本，旨在实现更好的工程化、模块化和扩展性。

## 🎯 迁移进度

### ✅ 阶段一：工程化底座 (已完成)

#### 已完成
- ✅ 初始化Vite + Vue 3项目结构
- ✅ 配置Tailwind CSS
- ✅ 引入Pinia状态管理
  - ConfigStore：管理API配置、模型设置（持久化到LocalStorage）
  - PresentationStore：管理PPT数据、生成状态（内存存储）
- ✅ 迁移现有JS模块到src目录
  - `src/config/` - 主题配置
  - `src/services/` - OpenAI API服务
  - `src/generators/` - 内容生成器（大纲、内容、图片）
  - `src/exporters/` - PPT导出器
  - `src/utils/` - 工具函数
  - `src/composables/` - 组合式函数
- ✅ 创建Icon组件（使用lucide-vue-next）
- ✅ 创建完整App.vue（包含所有步骤0-5）
- ✅ 复制并保留所有CSS样式
- ✅ 确保11个主题正常工作

### ✅ 阶段二：核心体验打磨 (已完成)

- ✅ 封装独立的PPTBuilder类（685行）
  - 统一Web预览和PPTX导出样式
  - LAYOUT_SCHEMA配置所有布局参数
  - 支持6种布局渲染器
  - 11个主题装饰元素
- ✅ 实现演讲者逐字稿生成和导出
  - AI生成200字演讲稿（speakerNotes）
  - 自动导出到PPT备注栏
  - 包含演讲思路和过渡建议
- ✅ 实现图表可视化支持（ECharts + PptxGenJS）
  - Chart.vue组件（180行）
  - 支持4种图表：bar、pie、line、area
  - ECharts Web预览
  - PptxGenJS原生图表导出
  - 自动主题适配

### ⏳ 阶段三：高级功能 (待开始)

- ⬜ 文档上传解析（.md/.txt/.docx）
- ⬜ 双源配图机制（AI + 网络搜图）
- ⬜ 幻灯片拖拽排序
- ⬜ 局部AI重写功能

### ⏳ 其他完善 (待开始)

- ⬜ 流式响应和容错重试
- ⬜ 结构化指令输入
- ⬜ 沉浸式预览模式

## 📁 项目结构

```
illusion/
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件（400行，5步工作流）
│   ├── assets/
│   │   └── styles/
│   │       └── main.css        # 全局样式（450行）
│   ├── stores/                 # Pinia状态管理
│   │   ├── config.js           # ConfigStore（73行）
│   │   └── presentation.js     # PresentationStore（173行）
│   ├── components/             # Vue组件
│   │   ├── Icon.vue            # 图标组件
│   │   └── Chart.vue           # ✅ ECharts图表组件（180行）
│   ├── composables/            # 组合式函数
│   │   ├── useSteps.js
│   │   ├── useSlides.js
│   │   └── useModal.js
│   ├── services/               # 服务层
│   │   └── openai.js           # OpenAI API
│   ├── generators/             # 生成器
│   │   ├── outline.js
│   │   ├── content.js          # ✅ 含图表数据生成
│   │   └── image.js
│   ├── exporters/              # 导出器
│   │   ├── pptx.js
│   │   └── PPTBuilder.js       # ✅ PPT构建引擎（685行）
│   ├── config/                 # 配置
│   │   └── themes.js           # 11个主题配置
│   └── utils/                  # 工具函数
│       ├── helpers.js
│       ├── storage.js
│       └── particle.js
├── docs/                       # 📚 文档
│   └── CHART_VISUALIZATION.md  # ✅ 图表可视化文档
├── public/                     # 静态资源
├── index.html                  # HTML入口
├── vite.config.js             # Vite配置
├── tailwind.config.js         # Tailwind配置
├── postcss.config.js          # PostCSS配置
├── package.json               # 项目配置
├── README_VITE.md             # 项目文档
├── STAGE1_COMPLETE.md         # ✅ 阶段一完成报告
├── STAGE2_COMPLETE.md         # ✅ 阶段二完成报告
└── 需求.md                    # 📋 需求文档

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🔧 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **状态管理**: Pinia 2
- **样式**: Tailwind CSS 3
- **图标**: lucide-vue-next
- **PPT生成**: PptxGenJS 3
- **图表**: ECharts 5 + vue-echarts
- **文档解析**: mammoth.js
- **HTTP客户端**: axios

## 📝 开发说明

### 状态管理

项目使用Pinia进行状态管理，主要分为两个store：

1. **ConfigStore** (`src/stores/config.js`)
   - 管理API配置（baseUrl、apiKey、textModel、imageModel）
   - 管理PPT配置（pageCount、themeColor）
   - 管理视觉效果配置（enableAnimations）
   - 数据持久化到LocalStorage

2. **PresentationStore** (`src/stores/presentation.js`)
   - 管理当前PPT数据（topic、outline、slides）
   - 管理UI状态（selectedSlideIndex）
   - 管理生成状态（isGenerating、progress、log）
   - 提供幻灯片操作方法（add、remove、update、swap）

### 主题系统

主题配置位于 `src/config/themes.js`，包含11个预设主题：
- business (商务)
- tech (科技)
- creative (创意)
- academic (学术)
- finance (金融)
- marketing (营销)
- education (教育)
- minimal (极简)
- nature (自然)
- elegant (优雅)
- modern (现代)

每个主题包含：
- 颜色配置（背景、文字、强调色）
- 字体配置（标题字体、正文字体）
- 预览背景

### 布局系统

支持6种幻灯片布局：
- classic: 经典布局（文本+列表+图片）
- big-data: 大数据布局（突出数字展示）
- timeline: 时间线布局（流程步骤）
- comparison: 对比布局（左右两列）
- image-grid: 图片网格（多图展示）
- chart: 图表布局（数据可视化）

## 🐛 已知问题

1. ~~App.vue当前只实现了前3个步骤，步骤3-5需要继续完善~~ ✅ 已完成
2. ~~部分组件还未拆分为独立.vue文件~~ ✅ 已完成Chart.vue
3. ~~原有的一些复杂交互逻辑需要重新实现~~ ✅ 已完成
4. 需要测试所有功能是否正常工作（需要API Key）

## 🔜 下一步计划

### 立即可做（测试）
1. 配置真实API Key
2. 测试大纲生成功能
3. 测试完整生成流程（包含图表）
4. 验证PPT导出功能（包含演讲者备注）
5. 测试所有11个主题
6. 验证图表在PowerPoint中可编辑

### ⏳ 阶段三：高级功能 (待开始)
1. 文档上传解析（.md/.txt/.docx）
2. 双源配图机制（AI + 网络搜图）
3. 幻灯片拖拽排序
4. 局部AI重写功能（精简、扩写、换个说法）

### 其他完善
1. 流式响应和容错重试
2. 结构化指令输入（演讲对象、演讲时长）
3. 沉浸式预览模式

## 📄 许可证

[原项目许可证]
