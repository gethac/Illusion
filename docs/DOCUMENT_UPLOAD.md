# 文档上传解析功能说明

## 功能概述

幻境 PPT 助手现已支持从外部文档导入内容，用户可以上传 Markdown、纯文本或 Word 文档，系统会自动提取主题和内容，填充到生成指令中。

## 支持的文件格式

### 1. Markdown 文件 (.md / .markdown)
**特点**：
- 自动提取一级标题（`# 标题`）作为主题
- 移除 Markdown 语法标记，保留纯文本内容
- 支持列表、加粗、斜体、代码块等格式

**示例**：
```markdown
# 2025年人工智能发展趋势

人工智能技术在过去一年取得了突破性进展...

## 主要趋势
- **大模型普及化**：更多企业开始使用
- **多模态融合**：文本、图像、语音统一
```

**解析结果**：
- 主题：`2025年人工智能发展趋势`
- 内容：`人工智能技术在过去一年取得了突破性进展... 主要趋势 • 大模型普及化：更多企业开始使用...`

### 2. 纯文本文件 (.txt)
**特点**：
- 第一行作为主题（如果不超过50字）
- 其余内容作为补充说明

**示例**：
```
AI技术演进报告
本报告分析了人工智能在各个领域的应用现状...
涵盖自然语言处理、计算机视觉、强化学习等方向...
```

**解析结果**：
- 主题：`AI技术演进报告`
- 内容：`本报告分析了人工智能在各个领域的应用现状...`

### 3. Word 文档 (.docx)
**特点**：
- 使用 mammoth.js 提取文本内容
- 移除格式，保留纯文本
- 解析逻辑与纯文本相同

**支持**：
- Office 2007+ (.docx)
- 自动提取文字内容
- 忽略图片和表格

## 技术实现

### 文件解析工具 (parseDocument.js)

```javascript
// 主函数
export async function parseDocument(file) {
  const fileType = file.name.split('.').pop().toLowerCase()

  switch (fileType) {
    case 'md':
    case 'markdown':
      return parseMarkdown(await readFileAsText(file))
    case 'txt':
      return parseText(await readFileAsText(file))
    case 'docx':
      return parseDocx(await readFileAsArrayBuffer(file))
    default:
      throw new Error('不支持的文件格式')
  }
}
```

**关键方法**：
- `parseMarkdown()` - Markdown语法解析
- `parseText()` - 纯文本解析
- `parseDocx()` - Word文档解析（mammoth.js）
- `validateFileSize()` - 文件大小验证（最大5MB）
- `validateFileType()` - 文件类型验证

### 文件上传组件 (FileUpload.vue)

```vue
<FileUpload
  @topic-extracted="handleTopicExtracted"
  @content-extracted="handleContentExtracted"
/>
```

**功能特性**：
- ✅ 拖拽上传支持
- ✅ 点击选择文件
- ✅ 实时文件预览
- ✅ 提取内容预览
- ✅ 一键应用主题/内容
- ✅ 错误提示

**状态管理**：
- `isDragging` - 拖拽状态
- `uploadedFile` - 上传的文件信息
- `error` - 错误信息

**事件**：
- `topic-extracted` - 主题提取完成
- `content-extracted` - 内容提取完成

## 使用流程

### 1. 上传文件
用户可以通过以下方式上传：
- **拖拽**：将文件拖入上传区域
- **点击**：点击"选择文件"按钮

### 2. 自动解析
系统自动：
- 验证文件类型（.md/.txt/.docx）
- 验证文件大小（≤5MB）
- 解析文件内容
- 提取主题和内容

### 3. 内容预览
显示：
- 文件名和类型
- 字数统计
- 提取的主题
- 提取的内容（前3行预览）

### 4. 应用内容
用户可以：
- **应用主题**：填充到"核心议题"输入框
- **应用内容**：填充到"补充咒文"输入框
- **清除文件**：删除已上传文件

## 集成到 App.vue

### 步骤2（任务简报）
```vue
<div v-else-if="step === 2">
  <!-- 核心议题输入 -->
  <textarea v-model="presentationStore.topic" />

  <!-- 补充咒文输入 -->
  <textarea v-model="presentationStore.additionalInfo" />

  <!-- 文件上传 -->
  <FileUpload
    @topic-extracted="handleTopicExtracted"
    @content-extracted="handleContentExtracted"
  />
</div>
```

### 事件处理
```javascript
// 处理提取的主题
const handleTopicExtracted = (topic) => {
  presentationStore.topic = topic
}

// 处理提取的内容
const handleContentExtracted = (content) => {
  if (!presentationStore.additionalInfo.trim()) {
    presentationStore.additionalInfo = content
  } else {
    presentationStore.additionalInfo += '\n\n' + content
  }
}
```

## 文件大小和格式限制

| 限制项 | 值 | 说明 |
|--------|-----|------|
| 最大文件大小 | 5MB | 防止浏览器内存溢出 |
| 支持格式 | .md, .txt, .docx | 常见文档格式 |
| 主题长度建议 | ≤50字 | 确保简洁明确 |
| 内容长度 | 无限制 | 但建议1000字以内 |

## 错误处理

### 常见错误
1. **文件格式不支持**
   - 错误信息：`不支持的文件格式，请上传 .md、.txt 或 .docx 文件`
   - 解决方案：转换文件格式

2. **文件过大**
   - 错误信息：`文件大小超过限制（最大 5MB）`
   - 解决方案：压缩文件或分段上传

3. **DOCX解析失败**
   - 错误信息：`DOCX文件解析失败，请确保文件格式正确`
   - 解决方案：检查文件是否损坏，尝试重新保存

4. **文件内容为空**
   - 错误信息：`文件内容为空或无法解析`
   - 解决方案：检查文件是否有实际内容

## 样式设计

### 上传区域
- 虚线边框（青色）
- 半透明黑色背景
- 拖拽时高亮放大
- 已上传时切换为金色边框

### 文件信息卡片
- 文件图标 + 文件名
- 文件类型和字数
- 内容预览框（黑色背景）
- 应用按钮（金色/青色）

### 交互动画
- 拖拽进入时缩放效果
- 错误提示滑入动画
- 按钮悬停效果

## 技术栈

- **mammoth.js** ^1.6.0 - Word文档解析
- **FileReader API** - 浏览器原生文件读取
- **拖拽API** - 原生拖放事件

## 性能优化

1. **文件大小限制**：最大5MB防止浏览器卡顿
2. **按需解析**：只在用户点击"应用"时填充数据
3. **异步处理**：文件读取和解析都是异步操作
4. **错误边界**：完善的try-catch错误捕获

## 未来增强

- [ ] 支持PDF文件解析
- [ ] 支持批量文件上传
- [ ] 支持从URL导入文档
- [ ] 智能内容分段（自动识别章节）
- [ ] 内容摘要生成（AI提炼关键点）

## 使用示例

### 场景1：从研究报告生成PPT
1. 准备一份Markdown格式的研究报告
2. 上传到系统
3. 系统提取标题和内容
4. 点击"应用主题"和"应用内容"
5. 生成PPT大纲

### 场景2：从会议记录生成PPT
1. 将会议记录保存为.txt文件
2. 拖拽上传到系统
3. 系统提取会议主题和要点
4. 应用到生成指令
5. 自动生成会议总结PPT

---

**实现时间**：2025-12-16
**版本**：V2.0 - 阶段三
