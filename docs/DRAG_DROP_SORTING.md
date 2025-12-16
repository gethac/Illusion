# 幻灯片拖拽排序功能说明

## 功能概述

幻境 PPT 助手现已支持大纲项拖拽排序功能，用户可以通过拖拽直观地调整幻灯片章节顺序，无需手动编辑。

## 功能位置

**步骤3：大纲确认**

在生成大纲后，用户可以：
- 查看所有章节大纲
- 编辑标题和描述
- 添加新章节
- 删除章节
- **拖拽排序章节**（新功能）

## 使用方法

### 1. 拖拽排序
1. 将鼠标悬停在大纲项上
2. 看到左侧的拖拽手柄图标（三条横线）
3. 按住鼠标左键并拖动
4. 拖到目标位置后松开鼠标
5. 大纲项自动重新排序，序号自动更新

### 2. 视觉反馈
- **拖拽手柄**：左侧显示三条横线图标（grip-vertical）
- **正在拖拽**：被拖拽项变半透明并缩小
- **放置目标**：目标位置显示青色光环
- **鼠标样式**：拖拽时显示"抓取"手势

### 3. 编辑保护
- 拖拽时输入框自动失焦
- 防止误触发删除按钮
- 序号自动重新计算

## 技术实现

### HTML5 拖拽API

使用原生HTML5拖拽API实现，无需第三方库：

```vue
<div
  v-for="(item, index) in outline"
  :key="index"
  draggable="true"
  @dragstart="handleDragStart(index, $event)"
  @dragover.prevent="handleDragOver(index, $event)"
  @drop="handleDrop(index, $event)"
  @dragend="handleDragEnd"
>
  <!-- 内容 -->
</div>
```

### 拖拽事件处理

#### 1. dragstart - 开始拖拽
```javascript
const handleDragStart = (index, event) => {
  draggingIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())
}
```

#### 2. dragover - 拖拽经过
```javascript
const handleDragOver = (index, event) => {
  event.preventDefault()  // 允许放置
  dropTargetIndex.value = index  // 高亮目标
}
```

#### 3. drop - 放置
```javascript
const handleDrop = (toIndex, event) => {
  event.preventDefault()
  const fromIndex = draggingIndex.value

  if (fromIndex !== null && fromIndex !== toIndex) {
    presentationStore.reorderOutline(fromIndex, toIndex)
  }

  // 清除状态
  draggingIndex.value = null
  dropTargetIndex.value = null
}
```

#### 4. dragend - 结束拖拽
```javascript
const handleDragEnd = () => {
  draggingIndex.value = null
  dropTargetIndex.value = null
}
```

### PresentationStore 方法

#### reorderOutline()
```javascript
function reorderOutline(fromIndex, toIndex) {
  if (fromIndex >= 0 && fromIndex < outline.value.length &&
      toIndex >= 0 && toIndex < outline.value.length &&
      fromIndex !== toIndex) {
    // 移除原位置的项
    const item = outline.value.splice(fromIndex, 1)[0]
    // 插入到新位置
    outline.value.splice(toIndex, 0, item)
  }
}
```

#### swapOutlineItems()
```javascript
function swapOutlineItems(fromIndex, toIndex) {
  if (fromIndex >= 0 && fromIndex < outline.value.length &&
      toIndex >= 0 && toIndex < outline.value.length) {
    // 交换两个项的位置
    const temp = outline.value[fromIndex]
    outline.value[fromIndex] = outline.value[toIndex]
    outline.value[toIndex] = temp
  }
}
```

**注意**：当前实现使用 `reorderOutline()`，它会将项从原位置移除并插入到新位置，而不是简单交换。

### 状态管理

```javascript
// 拖拽状态
const draggingIndex = ref(null)      // 正在拖拽的项索引
const dropTargetIndex = ref(null)    // 目标位置索引
```

### CSS样式

```css
/* 正在拖拽 */
.opacity-50.scale-95 {
  opacity: 0.5;
  transform: scale(0.95);
}

/* 放置目标 */
.ring-2.ring-[var(--accent-cyan)] {
  box-shadow: 0 0 0 2px var(--accent-cyan);
}

/* 鼠标样式 */
.cursor-move { cursor: move; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
```

## UI设计

### 拖拽手柄
- **图标**：`grip-vertical`（三条竖线）
- **位置**：每个大纲项最左侧
- **颜色**：默认灰色，悬停时变青色
- **大小**：14px

### 视觉反馈
- **拖拽中**：
  - 半透明（opacity: 0.5）
  - 缩小（scale: 0.95）
  - 鼠标变为"抓取"手势

- **目标位置**：
  - 青色光环（ring-2 ring-cyan）
  - 边框高亮

- **正常状态**：
  - 黑色背景（bg-black/40）
  - 白色边框（border-white/5）
  - 悬停时金色边框（hover:border-gold）

## 交互细节

### 1. 防止误操作
- 拖拽时点击事件使用 `@click.stop` 阻止
- 输入框添加 `@click.stop` 防止触发拖拽
- 删除按钮添加 `@click.stop` 独立处理

### 2. 序号自动更新
- 使用 `v-for` 的 `index` 动态生成
- 格式化为两位数：`String(index + 1).padStart(2, '0')`
- 拖拽后自动重新计算

### 3. 响应式反馈
- 拖拽开始：立即显示视觉效果
- 经过目标：实时高亮
- 放置成功：立即更新顺序
- 拖拽结束：清除所有状态

## 使用场景

### 场景1：调整章节逻辑顺序
用户生成大纲后，发现某个章节应该提前或延后，可以直接拖拽调整，无需重新生成。

### 场景2：优化演讲流程
根据演讲逻辑，调整章节顺序使内容更连贯。

### 场景3：快速重组
将相关章节拖到一起，形成更好的内容分组。

## 兼容性

- ✅ 支持所有现代浏览器
- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 3.1+
- ✅ Edge (所有版本)

## 性能优化

1. **轻量级实现**：使用原生API，无第三方依赖
2. **响应式更新**：Vue自动追踪数据变化
3. **最小DOM操作**：只更新受影响的项
4. **事件委托**：使用 `@click.stop` 优化事件处理

## 已知限制

1. **移动端支持**：HTML5拖拽API在移动设备上支持有限，可能需要触摸事件适配
2. **动画效果**：当前没有平滑过渡动画，可以考虑添加CSS transitions
3. **批量操作**：暂不支持多选批量拖拽

## 未来增强

- [ ] 添加拖拽动画效果
- [ ] 支持移动端触摸拖拽
- [ ] 支持键盘快捷键（Ctrl+↑/↓）
- [ ] 支持多选批量拖拽
- [ ] 添加撤销/重做功能
- [ ] 拖拽过程中显示预览位置线

## 开发说明

### 添加新的拖拽功能
如果需要为其他列表添加拖拽功能（如幻灯片列表），可以复用相同的逻辑：

```vue
<template>
  <div
    v-for="(item, index) in items"
    draggable="true"
    @dragstart="handleDragStart(index, $event)"
    @dragover.prevent="handleDragOver(index, $event)"
    @drop="handleDrop(index, $event)"
    @dragend="handleDragEnd"
  >
    <!-- 内容 -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const draggingIndex = ref(null)
const dropTargetIndex = ref(null)

// 使用相同的处理函数
// ...
</script>
```

### 调试技巧
- 使用 `console.log` 查看拖拽事件
- 检查 `draggingIndex` 和 `dropTargetIndex` 状态
- 验证 Store 方法是否正确调用
- 使用 Vue DevTools 查看响应式更新

---

**实现时间**：2025-12-16
**版本**：V2.0 - 阶段三
**依赖**：无（原生HTML5 API）
