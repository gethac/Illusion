<template>
  <div class="custom-layout-container" :style="containerStyle">
    <!-- 标题 -->
    <div v-if="layout.elements.title"
         class="layout-element layout-title editable-text"
         :style="getTitleStyle()"
         contenteditable="true"
         @blur="$emit('update-title', $event.target.innerText)"
         @keydown.enter.prevent="$event.target.blur()">
      {{ title }}
    </div>

    <!-- 内容 -->
    <div v-if="layout.elements.content && content"
         class="layout-element layout-content editable-text"
         :style="getContentStyle()"
         contenteditable="true"
         @blur="$emit('update-content', $event.target.innerText)">
      {{ content }}
    </div>

    <!-- 列表 -->
    <div v-if="layout.elements.list && items && items.length"
         class="layout-element layout-list"
         :style="getListContainerStyle()">
      <div v-for="(item, i) in items" :key="i"
           class="list-item editable-text"
           :style="getListItemStyle(i)"
           contenteditable="true"
           @blur="$emit('update-item', i, $event.target.innerText)"
           @keydown.enter.prevent="$event.target.blur()">
        <span class="bullet" v-if="layout.elements.list.style === 'bullet'"
              :style="{ color: theme.colors.accent }">●</span>
        <span class="number" v-else-if="layout.elements.list.style === 'number'"
              :style="{ color: theme.colors.accent }">{{ i + 1 }}.</span>
        <span class="item-text">{{ item }}</span>
      </div>
    </div>

    <!-- 图片 -->
    <div v-for="(imgLayout, i) in layout.elements.images" :key="`img-${i}`"
         v-if="i < images.length"
         class="layout-element layout-image"
         :style="getImageStyle(imgLayout)">
      <img :src="'data:image/png;base64,' + images[i]"
           :style="{ width: '100%', height: '100%', objectFit: 'cover' }">
    </div>

    <!-- 装饰元素 -->
    <div v-for="(decoration, i) in layout.elements.decorations || []" :key="`deco-${i}`"
         class="layout-decoration"
         :style="getDecorationStyle(decoration)">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  layout: {
    type: Object,
    required: true
  },
  title: String,
  content: String,
  items: Array,
  images: Array,
  theme: Object,
  fontScale: {
    type: Number,
    default: 100
  },
  bgOpacity: {
    type: Number,
    default: 100
  },
  textAlign: {
    type: String,
    default: 'left'
  }
})

defineEmits(['update-title', 'update-content', 'update-item'])

const containerStyle = computed(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  opacity: (props.bgOpacity || 100) / 100,
  fontSize: `${(props.fontScale || 100) / 100}em`
}))

// 标题样式
function getTitleStyle() {
  const t = props.layout.elements.title
  return {
    position: 'absolute',
    left: `${t.x}px`,
    top: `${t.y}px`,
    width: `${t.width}px`,
    fontSize: `${t.fontSize}px`,
    fontWeight: 'bold',
    color: props.theme?.colors?.text || '#ffffff',
    textAlign: t.align || props.textAlign || 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    whiteSpace: 'nowrap',
    zIndex: 10
  }
}

// 内容样式
function getContentStyle() {
  const c = props.layout.elements.content
  return {
    position: 'absolute',
    left: `${c.x}px`,
    top: `${c.y}px`,
    width: `${c.width}px`,
    height: `${c.height}px`,
    fontSize: `${c.fontSize}px`,
    lineHeight: c.lineHeight || 1.6,
    color: props.theme?.colors?.text || '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    zIndex: 5
  }
}

// 列表容器样式
function getListContainerStyle() {
  const l = props.layout.elements.list
  return {
    position: 'absolute',
    left: `${l.x}px`,
    top: `${l.y}px`,
    width: `${l.width}px`,
    maxHeight: '400px',
    display: l.columns > 1 ? 'grid' : 'flex',
    gridTemplateColumns: l.columns > 1 ? `repeat(${l.columns}, 1fr)` : undefined,
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
    zIndex: 5
  }
}

// 列表项样式
function getListItemStyle(index) {
  const l = props.layout.elements.list
  return {
    fontSize: `${l.fontSize}px`,
    color: props.theme?.colors?.text || '#ffffff',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '4px 0',
    wordBreak: 'break-word',
    whiteSpace: 'normal'
  }
}

// 图片样式
function getImageStyle(imgLayout) {
  return {
    position: 'absolute',
    left: `${imgLayout.x}px`,
    top: `${imgLayout.y}px`,
    width: `${imgLayout.width}px`,
    height: `${imgLayout.height}px`,
    borderRadius: `${imgLayout.borderRadius || 0}px`,
    overflow: 'hidden',
    boxShadow: imgLayout.shadow ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
    zIndex: 3
  }
}

// 装饰元素样式
function getDecorationStyle(decoration) {
  const baseStyle = {
    position: 'absolute',
    left: `${decoration.x}px`,
    top: `${decoration.y}px`,
    zIndex: 1
  }

  const color = decoration.color === 'primary'
    ? props.theme?.colors?.primary || '#6fffe9'
    : props.theme?.colors?.accent || '#d4b778'

  if (decoration.type === 'line') {
    return {
      ...baseStyle,
      width: `${decoration.width}px`,
      height: `${decoration.height || 2}px`,
      background: color
    }
  } else if (decoration.type === 'circle') {
    const size = decoration.width || decoration.radius * 2
    return {
      ...baseStyle,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: color,
      opacity: 0.6
    }
  } else if (decoration.type === 'rect') {
    return {
      ...baseStyle,
      width: `${decoration.width}px`,
      height: `${decoration.height}px`,
      background: color,
      opacity: 0.3
    }
  }

  return baseStyle
}
</script>

<style scoped>
.custom-layout-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.layout-element {
  user-select: text;
}

.list-item {
  transition: all 0.2s;
}

.list-item:hover {
  transform: translateX(4px);
}

.bullet, .number {
  flex-shrink: 0;
  font-weight: bold;
}

.item-text {
  flex: 1;
}

/* 可编辑文本样式继承 */
.editable-text {
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
  transition: all 0.2s;
  cursor: text;
}

.editable-text:hover {
  background: rgba(111, 255, 233, 0.05);
  box-shadow: 0 0 0 1px rgba(111, 255, 233, 0.2);
}

.editable-text:focus {
  outline: none;
  background: rgba(111, 255, 233, 0.1);
  box-shadow: 0 0 0 2px rgba(111, 255, 233, 0.3);
}
</style>
