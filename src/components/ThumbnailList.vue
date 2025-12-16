<template>
  <div class="w-64 border-r border-white/10 overflow-y-auto custom-scrollbar p-3 space-y-3">
    <!-- 封面缩略图 -->
    <div @click="$emit('select-slide', -1)"
         class="thumbnail-card cursor-pointer transition-all"
         :class="{ 'thumbnail-active': selectedIndex === -1 }">
      <div class="thumbnail-preview aspect-video rounded overflow-hidden mb-2"
           :style="{ background: theme.previewBg }">
        <div class="w-full h-full flex items-center justify-center">
          <Icon name="home" :size="32" class="text-[var(--accent-gold)] opacity-60"/>
        </div>
      </div>
      <div class="px-2">
        <div class="text-xs font-bold text-white truncate">封面</div>
        <div class="text-[10px] text-[#8a9a9a] truncate">{{ topic }}</div>
      </div>
    </div>

    <!-- 内容页缩略图 -->
    <div v-for="(slide, index) in slides" :key="index"
         @click="$emit('select-slide', index)"
         draggable="true"
         @dragstart="$emit('drag-start', index, $event)"
         @dragover.prevent="$emit('drag-over', index, $event)"
         @drop="$emit('drop', index, $event)"
         @dragend="$emit('drag-end')"
         class="thumbnail-card cursor-pointer transition-all relative group"
         :class="{
           'thumbnail-active': selectedIndex === index,
           'opacity-60': slide.isGenerating,
           'opacity-50 scale-95': draggingSlideIndex === index,
           'ring-2 ring-[var(--accent-cyan)]': dropTargetIndex === index
         }">
      <!-- 预览框 -->
      <div class="thumbnail-preview aspect-video rounded overflow-hidden mb-2 relative"
           :style="{ background: theme.previewBg }">
        <!-- 页码徽章 -->
        <div class="absolute top-2 left-2 w-6 h-6 rounded bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-cyan)] flex items-center justify-center text-[#0a1111] font-bold text-xs z-10">
          {{ index + 1 }}
        </div>

        <!-- 简化的内容预览 -->
        <div class="w-full h-full p-2 flex flex-col text-[8px] opacity-70">
          <div class="font-bold mb-1 truncate" :style="{ color: theme.colors.text }">
            {{ slide.title }}
          </div>
          <div class="flex-1 flex gap-1">
            <div class="flex-1">
              <div v-if="slide.items && slide.items.length > 0" class="space-y-0.5">
                <div v-for="i in Math.min(3, slide.items.length)" :key="i"
                     class="flex items-center gap-1">
                  <div class="w-1 h-1 rounded-full" :style="{ background: theme.colors.accent }"></div>
                  <div class="flex-1 h-1.5 rounded" :style="{ background: theme.colors.text, opacity: 0.3 }"></div>
                </div>
              </div>
              <div v-else class="space-y-1">
                <div class="h-1 rounded" :style="{ background: theme.colors.text, opacity: 0.3 }"></div>
                <div class="h-1 rounded w-3/4" :style="{ background: theme.colors.text, opacity: 0.3 }"></div>
              </div>
            </div>
            <!-- 图片预览 -->
            <div v-if="getSlideImages(slide).length > 0" class="w-10 h-10 rounded overflow-hidden shrink-0">
              <img :src="'data:image/png;base64,' + getSlideImages(slide)[0]" class="w-full h-full object-cover opacity-80">
            </div>
          </div>
        </div>

        <!-- 拖拽手柄 -->
        <div class="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="grip-vertical" :size="12" class="text-[#8a9a9a]"/>
        </div>
      </div>

      <!-- 标题和状态 -->
      <div class="px-2 flex items-center gap-2">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-white truncate">{{ slide.title }}</div>
          <div class="text-[9px] text-[#8a9a9a] truncate">{{ slide.layout }}</div>
        </div>
        <Icon v-if="slide.isGenerating" name="loader-2" :size="12" class="text-[var(--accent-cyan)] animate-spin shrink-0"/>
        <Icon v-else name="check-circle" :size="12" class="text-green-400 shrink-0"/>
      </div>

      <!-- 拖拽指示器 -->
      <div v-if="dropTargetIndex === index" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  slides: Array,
  topic: String,
  theme: Object,
  selectedIndex: Number,
  draggingSlideIndex: Number,
  dropTargetIndex: Number,
  getSlideImages: Function
})

defineEmits([
  'select-slide',
  'drag-start',
  'drag-over',
  'drop',
  'drag-end'
])
</script>

<style scoped>
/* 缩略图卡片样式 */
.thumbnail-card {
  background: var(--immersive-surface, rgba(0, 0, 0, 0.3));
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: all 0.2s;
}

.thumbnail-card:hover {
  background: var(--immersive-surface, rgba(0, 0, 0, 0.5));
  border-color: var(--immersive-border, rgba(255, 255, 255, 0.1));
  transform: translateY(-2px);
}

.thumbnail-active {
  background: var(--immersive-surface, rgba(0, 0, 0, 0.6)) !important;
  border-color: var(--immersive-primary, #6fffe9) !important;
  box-shadow: 0 2px 8px var(--immersive-shadow, rgba(111, 255, 233, 0.2));
}

/* 缩略图预览框 */
.thumbnail-preview {
  position: relative;
  overflow: hidden;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.6));
  border: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.05));
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--immersive-surface, rgba(0, 0, 0, 0.3));
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--immersive-primary, rgba(111, 255, 233, 0.3));
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--immersive-primary, rgba(111, 255, 233, 0.5));
}
</style>
