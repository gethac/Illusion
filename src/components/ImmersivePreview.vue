<template>
  <Teleport to="body">
    <Transition name="immersive-fade">
      <div v-if="show" class="immersive-preview" @keydown="handleKeydown" tabindex="0" ref="container">
        <!-- 背景 -->
        <div class="immersive-bg"></div>

        <!-- 顶部工具栏 -->
        <div class="immersive-toolbar">
          <div class="flex items-center gap-3">
            <button @click="$emit('close')" class="immersive-btn immersive-btn-icon" title="退出 (ESC)">
              <Icon name="x" :size="20"/>
            </button>
            <div class="immersive-title">{{ topic }}</div>
          </div>

          <div class="flex items-center gap-3">
            <!-- 进度指示 -->
            <div class="immersive-progress-text">
              {{ currentIndex + 1 }} / {{ slides.length }}
            </div>

            <!-- 导出按钮 -->
            <button @click="$emit('export')" class="immersive-btn" :disabled="isGenerating">
              <Icon name="download" :size="16"/>
              导出PPT
            </button>

            <!-- 主题切换按钮 -->
            <button @click="toggleThemeEditor" class="immersive-btn immersive-btn-icon" title="自定义配色">
              <Icon name="palette" :size="20"/>
            </button>
          </div>
        </div>

        <!-- 幻灯片内容区 -->
        <div class="immersive-content">
          <!-- 左侧导航按钮 -->
          <button
            v-if="currentIndex > 0"
            @click="prevSlide"
            class="immersive-nav-btn immersive-nav-left"
            title="上一页 (←)">
            <Icon name="chevron-left" :size="32"/>
          </button>

          <!-- 幻灯片主体 -->
          <div class="immersive-slide-container">
            <TransitionGroup name="slide" mode="out-in">
              <div v-if="currentIndex === -1" key="cover" class="immersive-slide">
                <!-- 封面 -->
                <div class="flex flex-col items-center justify-center h-full">
                  <div class="immersive-cover-badge">PRESENTATION</div>
                  <h1 class="immersive-cover-title">{{ topic }}</h1>
                  <div class="immersive-cover-divider"></div>
                  <div class="immersive-cover-date">{{ new Date().toLocaleDateString() }}</div>
                </div>
              </div>

              <div v-else-if="currentSlide" :key="currentIndex" class="immersive-slide">
                <!-- 标题 -->
                <div class="immersive-slide-header">
                  <h2 class="immersive-slide-title">{{ currentSlide.title }}</h2>
                  <div class="immersive-slide-divider"></div>
                </div>

                <!-- 内容区域 -->
                <div class="immersive-slide-body">
                  <!-- Classic 布局 -->
                  <div v-if="currentSlide.layout === 'classic'" class="flex gap-8 h-full">
                    <div class="flex-1 space-y-6">
                      <p class="immersive-text">{{ currentSlide.content }}</p>
                      <ul class="immersive-list">
                        <li v-for="(item, i) in currentSlide.items" :key="i" class="immersive-list-item">
                          <span class="immersive-bullet">●</span>
                          <span>{{ item }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-if="currentSlide.imgData" class="immersive-image-container">
                      <img :src="'data:image/png;base64,' + currentSlide.imgData" class="immersive-image">
                    </div>
                  </div>

                  <!-- Big Data 布局 -->
                  <div v-else-if="currentSlide.layout === 'big-data'" class="flex flex-col items-center justify-center h-full text-center">
                    <div class="immersive-big-number">{{ currentSlide.dataValue || '89%' }}</div>
                    <div class="immersive-big-label">{{ currentSlide.dataLabel || currentSlide.title }}</div>
                    <div class="immersive-big-divider"></div>
                    <p class="immersive-big-desc">{{ currentSlide.content }}</p>
                  </div>

                  <!-- Image Full 布局 -->
                  <div v-else-if="currentSlide.layout === 'image-full'" class="relative h-full">
                    <div v-if="currentSlide.imgData" class="w-full h-full rounded-2xl overflow-hidden">
                      <img :src="'data:image/png;base64,' + currentSlide.imgData" class="w-full h-full object-cover">
                      <div class="absolute bottom-0 left-0 right-0 immersive-image-overlay">
                        <p class="text-2xl font-bold text-white text-center">
                          {{ currentSlide.content.substring(0, 120) }}{{ currentSlide.content.length > 120 ? '...' : '' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Chart 布局 -->
                  <div v-else-if="currentSlide.layout === 'chart'" class="flex flex-col h-full">
                    <p class="immersive-text mb-6">{{ currentSlide.content }}</p>
                    <div class="flex-1">
                      <Chart
                        v-if="currentSlide.chartData && currentSlide.chartType"
                        :chartType="currentSlide.chartType"
                        :chartData="currentSlide.chartData"
                        :theme="chartTheme"
                        class="h-full"
                      />
                    </div>
                  </div>

                  <!-- 其他布局 -->
                  <div v-else class="space-y-6">
                    <p class="immersive-text">{{ currentSlide.content }}</p>
                    <ul class="immersive-list">
                      <li v-for="(item, i) in currentSlide.items" :key="i" class="immersive-list-item">
                        <span class="immersive-bullet">●</span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- 右侧导航按钮 -->
          <button
            v-if="currentIndex < slides.length - 1"
            @click="nextSlide"
            class="immersive-nav-btn immersive-nav-right"
            title="下一页 (→)">
            <Icon name="chevron-right" :size="32"/>
          </button>
        </div>

        <!-- 底部进度条 -->
        <div class="immersive-progress-bar">
          <div class="immersive-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <!-- 缩略图导航（可选） -->
        <div v-if="showThumbnails" class="immersive-thumbnails">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="immersive-thumbnail"
            :class="{ active: currentIndex === index }">
            <div class="immersive-thumbnail-number">{{ index + 1 }}</div>
            <div class="immersive-thumbnail-title">{{ slide.title }}</div>
          </button>
        </div>

        <!-- 主题编辑器浮层 -->
        <Transition name="slide-up">
          <div v-if="showThemeEditor" class="immersive-theme-editor">
            <div class="immersive-theme-editor-header">
              <h3>自定义配色</h3>
              <button @click="toggleThemeEditor" class="immersive-btn-icon">
                <Icon name="x" :size="20"/>
              </button>
            </div>
            <div class="immersive-theme-editor-body">
              <div class="immersive-color-picker" v-for="(value, key) in editableColors" :key="key">
                <label>{{ colorLabels[key] }}</label>
                <input type="color" :value="value" @input="updateColor(key, $event.target.value)">
              </div>
              <div class="flex gap-3 mt-6">
                <button @click="resetTheme" class="immersive-btn flex-1">重置</button>
                <button @click="regenerateTheme" class="immersive-btn flex-1" :disabled="isRegeneratingTheme">
                  <Icon v-if="isRegeneratingTheme" name="loader-2" :size="14" class="animate-spin"/>
                  {{ isRegeneratingTheme ? '生成中...' : 'AI重新生成' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import Chart from './Chart.vue'
import { applyImmersiveTheme, removeImmersiveTheme, generateImmersiveTheme, getDefaultImmersiveTheme } from '../services/themeGenerator.js'

const props = defineProps({
  show: Boolean,
  topic: String,
  slides: Array,
  theme: Object,
  config: Object,
  isGenerating: Boolean,
  immersiveTheme: Object // 已生成的沉浸式主题
})

const emit = defineEmits(['close', 'export', 'update-immersive-theme'])

const container = ref(null)
const currentIndex = ref(-1) // -1 表示封面
const showThumbnails = ref(false)
const showThemeEditor = ref(false)
const isRegeneratingTheme = ref(false)

// 当前幻灯片
const currentSlide = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= props.slides.length) {
    return null
  }
  return props.slides[currentIndex.value]
})

// 进度百分比
const progressPercentage = computed(() => {
  const total = props.slides.length + 1 // +1 包含封面
  const current = currentIndex.value + 2 // +2 因为从-1开始
  return (current / total) * 100
})

// 图表主题（基于沉浸式主题）
const chartTheme = computed(() => {
  if (props.immersiveTheme && props.immersiveTheme.colors) {
    return {
      colors: {
        accent: props.immersiveTheme.colors.primary,
        text: props.immersiveTheme.colors.text
      }
    }
  }
  return props.theme
})

// 可编辑的颜色
const editableColors = ref({})

const colorLabels = {
  primary: '主色调',
  secondary: '辅助色',
  accent: '强调色',
  surface: '表面色',
  text: '文字颜色',
  textSecondary: '次要文字',
  border: '边框颜色'
}

// 导航函数
function prevSlide() {
  if (currentIndex.value > -1) {
    currentIndex.value--
  }
}

function nextSlide() {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++
  }
}

function goToSlide(index) {
  currentIndex.value = index
}

// 键盘导航
function handleKeydown(e) {
  switch (e.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      prevSlide()
      break
    case 'ArrowRight':
      nextSlide()
      break
    case 'Home':
      currentIndex.value = -1
      break
    case 'End':
      currentIndex.value = props.slides.length - 1
      break
  }
}

// 主题编辑器
function toggleThemeEditor() {
  showThemeEditor.value = !showThemeEditor.value
}

function updateColor(key, value) {
  editableColors.value[key] = value
  // 实时更新CSS变量
  if (props.immersiveTheme && props.immersiveTheme.colors) {
    const updatedTheme = {
      ...props.immersiveTheme,
      colors: {
        ...props.immersiveTheme.colors,
        [key]: value
      }
    }
    // 重新生成CSS变量
    updatedTheme.cssVariables = {
      '--immersive-primary': updatedTheme.colors.primary,
      '--immersive-secondary': updatedTheme.colors.secondary,
      '--immersive-accent': updatedTheme.colors.accent,
      '--immersive-bg': updatedTheme.colors.background,
      '--immersive-surface': updatedTheme.colors.surface,
      '--immersive-text': updatedTheme.colors.text,
      '--immersive-text-secondary': updatedTheme.colors.textSecondary,
      '--immersive-border': updatedTheme.colors.border,
      '--immersive-shadow': updatedTheme.colors.shadow
    }
    applyImmersiveTheme(updatedTheme)
    emit('update-immersive-theme', updatedTheme)
  }
}

function resetTheme() {
  if (props.immersiveTheme && props.immersiveTheme.colors) {
    editableColors.value = { ...props.immersiveTheme.colors }
    applyImmersiveTheme(props.immersiveTheme)
  }
}

async function regenerateTheme() {
  isRegeneratingTheme.value = true
  try {
    const newTheme = await generateImmersiveTheme(
      props.topic,
      '',
      'cyberpunk', // 可以根据当前主题决定
      props.config
    )
    applyImmersiveTheme(newTheme)
    editableColors.value = { ...newTheme.colors }
    emit('update-immersive-theme', newTheme)
  } catch (error) {
    console.error('重新生成主题失败:', error)
  } finally {
    isRegeneratingTheme.value = false
  }
}

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 打开时应用沉浸式主题
    if (props.immersiveTheme) {
      applyImmersiveTheme(props.immersiveTheme)
      editableColors.value = { ...props.immersiveTheme.colors }
    }
    // 聚焦容器以接收键盘事件
    setTimeout(() => {
      container.value?.focus()
    }, 100)
  } else {
    // 关闭时移除沉浸式主题
    removeImmersiveTheme()
  }
})

onUnmounted(() => {
  removeImmersiveTheme()
})
</script>

<style scoped>
.immersive-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  outline: none;
}

.immersive-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--immersive-bg, linear-gradient(135deg, #1a1a2e 0%, #000000 100%));
  z-index: -1;
}

/* 工具栏 */
.immersive-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.1));
}

.immersive-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--immersive-text, #ffffff);
}

.immersive-progress-text {
  font-size: 0.875rem;
  color: var(--immersive-text-secondary, #8a9a9a);
  font-variant-numeric: tabular-nums;
}

.immersive-btn {
  padding: 0.5rem 1rem;
  background: var(--immersive-primary, #6fffe9);
  color: var(--immersive-bg, #000);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.immersive-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--immersive-shadow, rgba(111, 255, 233, 0.3));
}

.immersive-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.immersive-btn-icon {
  padding: 0.5rem;
  background: transparent;
  color: var(--immersive-text, #ffffff);
  border: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.2));
}

/* 内容区域 */
.immersive-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.immersive-slide-container {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 700px;
  position: relative;
}

.immersive-slide {
  width: 100%;
  height: 100%;
  padding: 3rem;
  background: var(--immersive-surface, rgba(26, 26, 46, 0.8));
  border-radius: 1.5rem;
  border: 1px solid var(--immersive-border, rgba(212, 183, 120, 0.3));
  box-shadow: 0 20px 60px var(--immersive-shadow, rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
}

/* 封面样式 */
.immersive-cover-badge {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--immersive-accent, #d4b778);
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.immersive-cover-title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--immersive-text, #e0e0e0);
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.immersive-cover-divider {
  width: 8rem;
  height: 0.25rem;
  background: var(--immersive-accent, #d4b778);
  margin-bottom: 2rem;
}

.immersive-cover-date {
  font-size: 1.125rem;
  color: var(--immersive-text-secondary, #8a9a9a);
}

/* 幻灯片标题 */
.immersive-slide-header {
  margin-bottom: 2rem;
}

.immersive-slide-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--immersive-text, #e0e0e0);
  margin-bottom: 1rem;
}

.immersive-slide-divider {
  width: 6rem;
  height: 0.2rem;
  background: var(--immersive-accent, #d4b778);
}

/* 幻灯片内容 */
.immersive-slide-body {
  flex: 1;
  overflow-y: auto;
}

.immersive-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--immersive-text, #e0e0e0);
}

.immersive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  space-y: 1rem;
}

.immersive-list-item {
  display: flex;
  align-items: start;
  gap: 1rem;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--immersive-text, #e0e0e0);
  margin-bottom: 1rem;
}

.immersive-bullet {
  color: var(--immersive-accent, #d4b778);
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

/* 图片容器 */
.immersive-image-container {
  width: 400px;
  height: 400px;
  flex-shrink: 0;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid var(--immersive-border, rgba(212, 183, 120, 0.3));
  box-shadow: 0 10px 30px var(--immersive-shadow, rgba(0, 0, 0, 0.3));
}

.immersive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.immersive-image-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  backdrop-filter: blur(10px);
  padding: 2rem;
}

/* Big Data 样式 */
.immersive-big-number {
  font-size: 8rem;
  font-weight: 700;
  color: var(--immersive-accent, #d4b778);
  line-height: 1;
  margin-bottom: 1.5rem;
}

.immersive-big-label {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--immersive-text, #e0e0e0);
  margin-bottom: 1.5rem;
}

.immersive-big-divider {
  width: 8rem;
  height: 0.25rem;
  background: var(--immersive-accent, #d4b778);
  margin-bottom: 2rem;
}

.immersive-big-desc {
  font-size: 1.25rem;
  max-width: 800px;
  line-height: 1.8;
  color: var(--immersive-text, #e0e0e0);
}

/* 导航按钮 */
.immersive-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 1rem;
  background: var(--immersive-surface, rgba(26, 26, 46, 0.8));
  border: 1px solid var(--immersive-border, rgba(212, 183, 120, 0.3));
  border-radius: 50%;
  color: var(--immersive-text, #e0e0e0);
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.immersive-nav-btn:hover {
  background: var(--immersive-primary, #6fffe9);
  color: var(--immersive-bg, #000);
  transform: translateY(-50%) scale(1.1);
}

.immersive-nav-left {
  left: 1rem;
}

.immersive-nav-right {
  right: 1rem;
}

/* 进度条 */
.immersive-progress-bar {
  height: 4px;
  background: var(--immersive-surface, rgba(26, 26, 46, 0.8));
  position: relative;
}

.immersive-progress-fill {
  height: 100%;
  background: var(--immersive-accent, #d4b778);
  transition: width 0.3s ease;
}

/* 主题编辑器 */
.immersive-theme-editor {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--immersive-surface, rgba(26, 26, 46, 0.95));
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--immersive-border, rgba(212, 183, 120, 0.3));
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.immersive-theme-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.immersive-theme-editor-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--immersive-text, #e0e0e0);
}

.immersive-theme-editor-body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.immersive-color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.immersive-color-picker label {
  font-size: 0.875rem;
  color: var(--immersive-text-secondary, #8a9a9a);
}

.immersive-color-picker input[type="color"] {
  width: 100%;
  height: 3rem;
  border: 2px solid var(--immersive-border, rgba(212, 183, 120, 0.3));
  border-radius: 0.5rem;
  cursor: pointer;
}

/* 动画 */
.immersive-fade-enter-active,
.immersive-fade-leave-active {
  transition: opacity 0.3s ease;
}

.immersive-fade-enter-from,
.immersive-fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 滚动条样式 */
.immersive-slide-body::-webkit-scrollbar {
  width: 8px;
}

.immersive-slide-body::-webkit-scrollbar-track {
  background: transparent;
}

.immersive-slide-body::-webkit-scrollbar-thumb {
  background: var(--immersive-border, rgba(212, 183, 120, 0.3));
  border-radius: 4px;
}

.immersive-slide-body::-webkit-scrollbar-thumb:hover {
  background: var(--immersive-accent, #d4b778);
}
</style>
