# 局部AI重写功能说明

## 功能概述

幻境 PPT 助手现已支持局部AI重写功能，用户可以在大纲编辑阶段对章节描述进行智能重写，提供三种重写模式：

1. **精简** (Simplify): 压缩内容到原来的50-70%，保留核心要点
2. **扩写** (Expand): 扩展内容到原来的150-200%，增加细节和深度
3. **换个说法** (Rephrase): 改变表达方式，保持相同信息量

## 功能位置

**步骤3：大纲确认**

在生成大纲后，用户可以：
- 查看所有章节大纲
- 编辑标题和描述
- 添加新章节
- 删除章节
- 拖拽排序章节
- **AI重写章节描述**（新功能）

## 使用方法

### 1. 触发重写

1. 将鼠标悬停在大纲项的描述文本框上
2. 右侧会出现三个重写按钮：
   - **精简** (minimize-2 图标): 压缩内容
   - **扩写** (maximize-2 图标): 扩展内容
   - **换个说法** (refresh-cw 图标): 改变表达
3. 点击任意按钮触发AI重写

### 2. 预览重写结果

- 重写过程中，按钮显示加载动画
- 重写完成后，在描述下方显示预览框
- 预览框显示：
  - 重写模式名称（精简/扩写/换个说法）
  - 重写后的文本内容
  - 两个操作按钮：取消、应用

### 3. 应用或取消

- **应用**: 将重写后的文本替换原描述
- **取消**: 放弃重写，保持原文本

## 三种重写模式详解

### 1. 精简模式 (Simplify)

**适用场景**：
- 描述过于冗长，需要提炼核心
- 内容有重复表达
- 需要更简洁的表述

**处理策略**：
- 删除冗余表达和重复内容
- 使用更简洁的词汇
- 压缩到原来的50-70%长度
- 保持原意不变
- 保持专业性

**示例**：
```
原文（120字）：
人工智能技术在近年来得到了飞速发展，深度学习、神经网络等技术
不断突破，在图像识别、自然语言处理、语音识别等多个领域都取得了
重大进展，为各行各业带来了革命性的变化。

精简后（70字）：
人工智能技术飞速发展，深度学习和神经网络不断突破，在图像识别、
NLP、语音识别等领域取得重大进展，为各行业带来革命性变化。
```

### 2. 扩写模式 (Expand)

**适用场景**：
- 描述过于简短，缺乏细节
- 需要增加背景说明
- 需要添加例子或数据支撑
- 内容需要更深入阐述

**处理策略**：
- 添加具体例子或数据支撑
- 增加背景说明或延伸思考
- 扩展到原来的150-200%长度
- 保持逻辑连贯
- 保持专业性和可读性

**示例**：
```
原文（50字）：
介绍团队核心成员及其专业背景。

扩写后（120字）：
介绍团队核心成员及其专业背景。团队由10位资深专家组成，包括3位
博士、5位硕士，平均从业经验超过8年。核心成员曾就职于BAT等知名
互联网企业，在AI算法、产品设计、工程架构等领域拥有丰富经验。
团队曾主导过多个千万级用户产品的研发，获得过国家级技术奖项。
```

### 3. 换个说法模式 (Rephrase)

**适用场景**：
- 表达方式单调，需要变化
- 想尝试不同的表达角度
- 避免重复表述
- 调整语气和风格

**处理策略**：
- 改变句式结构
- 使用同义词替换
- 调整语气和表达角度
- 长度与原文基本相当
- 保持专业性和准确性

**示例**：
```
原文（80字）：
数据分析是现代企业决策的重要工具。通过对海量数据的挖掘和分析，
企业可以发现隐藏的商业价值，优化运营策略，提升竞争力。

换个说法后（80字）：
现代企业离不开数据驱动的决策支持。海量数据的挖掘与分析能够揭示
潜在的商业机遇，帮助企业优化运营策略，在激烈的市场竞争中占据
有利地位。
```

## 技术实现

### 文件结构

```
src/
├── services/
│   └── rewrite.js              # AI重写服务
└── App.vue                     # 集成重写UI和逻辑
```

### API接口

#### 1. rewriteText()

```javascript
/**
 * 重写文本
 * @param {string} text - 原始文本
 * @param {string} mode - 重写模式: 'simplify' | 'expand' | 'rephrase'
 * @param {Object} config - API配置
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<string>} 重写后的文本
 */
const rewrittenText = await rewriteText(
  '原始描述文本...',
  'simplify',
  {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-...',
    textModel: 'gpt-5.2'
  }
)
```

#### 2. rewriteBatch()

```javascript
/**
 * 批量重写多个文本
 * @param {Array<{text: string, mode: string}>} items - 待重写的文本列表
 * @param {Object} config - API配置
 * @param {Function} onProgress - 进度回调
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<Array<string>>} 重写后的文本列表
 */
const results = await rewriteBatch(
  [
    { text: '文本1', mode: 'simplify' },
    { text: '文本2', mode: 'expand' }
  ],
  config,
  ({ current, total, text }) => {
    console.log(`进度: ${current}/${total}`)
  }
)
```

#### 3. smartRewrite()

```javascript
/**
 * 智能重写 - 根据文本特征自动选择最佳重写模式
 * @param {string} text - 原始文本
 * @param {Object} config - API配置
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<{mode: string, text: string}>} 重写模式和结果
 */
const result = await smartRewrite('文本...', config)
// 返回: { mode: 'simplify', text: '重写后的文本...' }

// 智能规则：
// - 文本长度 > 200字 → 精简
// - 文本长度 < 50字 → 扩写
// - 50-200字 → 换个说法
```

### UI组件

#### 重写按钮组

位于每个大纲项描述文本框的右侧：

```vue
<!-- AI重写按钮组 -->
<div class="absolute -right-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
  <button @click.stop="handleRewrite(index, 'simplify')" title="精简">
    <Icon name="minimize-2" :size="10"/>
  </button>
  <button @click.stop="handleRewrite(index, 'expand')" title="扩写">
    <Icon name="maximize-2" :size="10"/>
  </button>
  <button @click.stop="handleRewrite(index, 'rephrase')" title="换个说法">
    <Icon name="refresh-cw" :size="10"/>
  </button>
</div>
```

**视觉效果**：
- 默认不可见（opacity-0）
- 悬停时显示（group-hover:opacity-100）
- 青色边框和图标
- 悬停时背景高亮
- 加载时显示旋转动画

#### 重写预览框

位于描述文本框下方：

```vue
<!-- 重写预览 -->
<div v-if="rewritePreview && rewritePreview.index === index" class="...">
  <div class="...">
    <Icon name="sparkles" :size="12"/>
    AI重写预览 ({{ rewritePreview.modeName }})
  </div>
  <div class="...">{{ rewritePreview.text }}</div>
  <div class="...">
    <button @click.stop="cancelRewritePreview">取消</button>
    <button @click.stop="applyRewritePreview">应用</button>
  </div>
</div>
```

**视觉效果**：
- 青色半透明背景
- 青色边框
- 显示重写模式名称
- 清晰的应用/取消按钮

### 状态管理

```javascript
// AI重写状态
const rewritingIndex = ref(null)      // 正在重写的项索引
const rewritingMode = ref(null)       // 当前重写模式
const rewritePreview = ref(null)      // 预览数据：{ index, text, modeName, originalText }
```

### 事件处理

```javascript
// 处理重写请求
const handleRewrite = async (index, mode) => {
  const item = presentationStore.outline[index]
  if (!item.desc || !item.desc.trim()) return

  rewritingIndex.value = index
  rewritingMode.value = mode

  try {
    const config = {
      baseUrl: configStore.baseUrl,
      apiKey: configStore.apiKey,
      textModel: configStore.textModel
    }

    const rewrittenText = await rewriteText(item.desc, mode, config)
    const modeInfo = getRewriteMode(mode)

    rewritePreview.value = {
      index,
      text: rewrittenText,
      modeName: modeInfo.name,
      originalText: item.desc
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('重写失败: ' + err.message)
    }
  } finally {
    rewritingIndex.value = null
    rewritingMode.value = null
  }
}

// 应用重写
const applyRewritePreview = () => {
  if (rewritePreview.value) {
    const { index, text } = rewritePreview.value
    presentationStore.updateOutlineItem(index, {
      ...presentationStore.outline[index],
      desc: text
    })
    rewritePreview.value = null
  }
}

// 取消重写
const cancelRewritePreview = () => {
  rewritePreview.value = null
}
```

## AI提示词设计

### 精简模式提示词

```
请将以下文字精简到原来的50-70%长度，保留核心要点和关键信息。要求：
1. 删除冗余表达和重复内容
2. 使用更简洁的词汇
3. 保持原意不变
4. 保持专业性

原文：
{text}

请直接返回精简后的文字，不要添加任何解释或说明。
```

### 扩写模式提示词

```
请将以下文字扩写到原来的150-200%长度，增加细节和深度。要求：
1. 添加具体例子或数据支撑
2. 增加背景说明或延伸思考
3. 保持逻辑连贯
4. 保持专业性和可读性

原文：
{text}

请直接返回扩写后的文字，不要添加任何解释或说明。
```

### 换个说法模式提示词

```
请用不同的表达方式重写以下文字，保持相同的意思和信息量。要求：
1. 改变句式结构
2. 使用同义词替换
3. 调整语气和表达角度
4. 保持专业性和准确性
5. 长度与原文基本相当

原文：
{text}

请直接返回重写后的文字，不要添加任何解释或说明。
```

## 使用场景

### 场景1：快速优化冗长描述

用户生成大纲后，发现某个章节描述过长，使用**精简模式**快速提炼核心要点。

### 场景2：丰富简短内容

某个章节描述过于简单，缺乏细节，使用**扩写模式**增加背景和例子。

### 场景3：避免重复表述

多个章节描述风格类似，使用**换个说法模式**改变表达方式，使演示更生动。

### 场景4：多次迭代优化

用户可以对同一段描述多次重写，选择最满意的版本。

## 交互细节

### 1. 防止误操作

- 重写按钮默认隐藏，悬停时显示
- 使用 `@click.stop` 防止触发拖拽
- 预览框提供取消选项，避免误应用

### 2. 加载状态反馈

- 重写过程中按钮显示旋转动画
- 禁用其他重写按钮，避免并发请求
- 清晰显示当前正在重写的模式

### 3. 预览机制

- 不直接修改原文本
- 提供预览框对比新旧文本
- 用户明确确认后才应用

### 4. 错误处理

- API调用失败时显示错误提示
- 支持 AbortController 取消请求
- 失败后恢复按钮状态

## 性能优化

1. **单次重写**：每次只重写一个描述，避免并发冲突
2. **状态控制**：使用 `rewritingIndex` 防止重复触发
3. **中断支持**：预留 AbortSignal 参数，支持取消
4. **温度参数**：设置 `temperature: 0.7` 平衡创造性和一致性

## 已知限制

1. **只支持描述文本**：目前只能重写章节描述，不支持标题重写
2. **单个重写**：暂不支持批量重写多个章节
3. **无历史记录**：重写后不保留历史版本，无法撤销
4. **依赖网络**：需要调用OpenAI API，离线不可用

## 未来增强

- [ ] 支持标题重写
- [ ] 批量重写多个章节
- [ ] 重写历史记录和撤销功能
- [ ] 自定义重写规则（目标长度、语气、风格）
- [ ] 智能建议（系统主动提示哪些描述需要优化）
- [ ] 对比视图（并排显示新旧文本）
- [ ] 本地模型支持（减少API调用成本）

## 开发说明

### 添加新的重写模式

如果需要添加新的重写模式，在 `src/services/rewrite.js` 中扩展 `REWRITE_MODES`：

```javascript
const REWRITE_MODES = {
  // 现有模式...

  // 新模式
  formal: {
    name: '正式化',
    icon: 'briefcase',
    prompt: `请将以下文字改写为更正式的商务表达...`
  },

  casual: {
    name: '口语化',
    icon: 'message-circle',
    prompt: `请将以下文字改写为更轻松口语化的表达...`
  }
}
```

然后在 App.vue 中添加对应的按钮。

### 调试技巧

- 使用 `console.log` 查看重写请求和响应
- 检查 `rewritingIndex`、`rewritingMode`、`rewritePreview` 状态
- 验证 API 配置是否正确
- 使用 Vue DevTools 查看响应式更新

---

**实现时间**：2025-12-16
**版本**：V2.0 - 阶段三
**依赖**：OpenAI API (文本模型)
