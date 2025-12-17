<template>
  <div class="w-full h-full flex flex-col slide-preview-immersive">
    <!-- 沉浸式背景 -->
    <div class="immersive-backdrop"></div>

    <!-- 全屏主题加载遮罩 -->
    <Transition name="fade">
      <div v-if="isLoadingTheme" class="theme-loading-overlay">
        <div class="theme-loading-content">
          <div class="loading-spinner"></div>
          <div class="loading-text">
            <Icon name="palette" :size="24" class="mb-2"/>
            <div class="text-xl font-bold text-white mb-2">正在生成沉浸式主题配色</div>
            <div class="text-sm text-[#8a9a9a]">AI正在根据您的内容定制专属配色方案...</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 顶部工具栏 -->
    <div class="slide-preview-toolbar">
      <div class="flex items-center gap-4">
        <button @click="$emit('back')" class="immersive-toolbar-btn">
          <Icon name="arrow-left" :size="20"/>
        </button>
        <div>
          <h2 class="immersive-toolbar-title">{{ topic }}</h2>
          <div class="immersive-toolbar-subtitle">{{ slides.length }} 张幻灯片</div>
        </div>
      </div>

      <!-- 加载状态区域 -->
      <div v-if="isGenerating || isLoadingTheme" class="flex-1 max-w-md mx-8 space-y-2">
        <!-- 主题加载状态 -->
        <div v-if="isLoadingTheme" class="immersive-progress-text flex items-center gap-2">
          <Icon name="palette" :size="14" class="animate-spin"/>
          正在生成沉浸式主题配色...
        </div>

        <!-- 内容生成进度条 -->
        <div v-if="isGenerating">
          <div class="immersive-progress-text">{{ generationLog }}</div>
          <div class="immersive-progress-track">
            <div class="immersive-progress-bar"
                 :style="{ width: `${generationProgress}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右下角浮动导出按钮 -->
    <button @click="$emit('export')"
            :disabled="isGenerating"
            class="export-floating-btn"
            :class="{ 'opacity-50 cursor-not-allowed': isGenerating }">
      <Icon name="download" :size="20"/>
      <span class="export-btn-text">导出 PPT</span>
      <div class="export-btn-glow"></div>
    </button>

    <!-- 主体区域：左侧缩略图 + 中间预览 + 右侧编辑器 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧缩略图列表 -->
      <ThumbnailList
        :slides="slides"
        :topic="topic"
        :theme="currentTheme"
        :selected-index="selectedIndex"
        :dragging-slide-index="draggingSlideIndex"
        :drop-target-index="dropTargetIndex"
        :get-slide-images="getSlideImages"
        @select-slide="selectSlide"
        @drag-start="handleSlideDragStart"
        @drag-over="handleSlideDragOver"
        @drop="handleSlideDrop"
        @drag-end="handleSlideDragEnd"
      />

      <!-- 中间预览区 -->
      <div class="flex-1 flex items-center justify-center overflow-hidden relative">
        <!-- 封面预览 -->
        <div v-if="selectedIndex === -1" class="preview-container">
          <div class="preview-slide"
               :style="{ background: currentTheme.previewBg }">
            <div class="w-full h-full flex flex-col items-center justify-center relative">
              <!-- 顶部装饰线 -->
              <div class="absolute top-0 left-0 right-0 h-2"
                   :style="{ background: currentTheme.colors.accent }"></div>

              <div class="text-center px-12">
                <div class="text-base font-bold mb-4 tracking-widest opacity-60"
                     :style="{ color: currentTheme.colors.accent }">
                  PRESENTATION
                </div>
                <h1 class="text-5xl font-bold mb-6"
                    :style="{ color: currentTheme.colors.text }">
                  {{ topic }}
                </h1>
                <div class="w-32 h-0.5 mx-auto mb-6"
                     :style="{ background: currentTheme.colors.accent }"></div>
                <div class="text-base opacity-50"
                     :style="{ color: currentTheme.colors.text }">
                  {{ new Date().toLocaleDateString() }}
                </div>
              </div>

              <!-- 底部装饰线 -->
              <div class="absolute bottom-0 left-0 right-0 h-2"
                   :style="{ background: currentTheme.colors.accent }"></div>
            </div>
          </div>
        </div>

        <!-- 内容页预览 + 编辑 -->
        <div v-else class="preview-container">
          <div class="preview-slide"
               :style="{ background: currentTheme.previewBg }">
            <!-- 自定义布局 - 全屏显示 -->
            <div v-if="currentSlide.layout === 'custom' && currentSlide.customLayout" class="w-full h-full">
              <CustomLayoutRenderer
                :layout="currentSlide.customLayout"
                :title="currentSlide.title"
                :content="currentSlide.content"
                :items="currentSlide.items"
                :images="getSlideImages(currentSlide)"
                :theme="currentTheme"
                :font-scale="currentSlide.fontScale || 100"
                :bg-opacity="currentSlide.bgOpacity || 100"
                :text-align="currentSlide.textAlign || 'left'"
                @update-title="(newTitle) => onTitleEdit({ target: { innerText: newTitle } })"
                @update-content="(newContent) => onContentEdit({ target: { innerText: newContent } })"
                @update-item="(index, newItem) => onItemEdit({ target: { innerText: newItem } }, index)"
              />
            </div>

            <!-- 其他布局 - 标准容器 -->
            <div v-else class="w-full h-full p-12 flex flex-col"
                 :style="{
                   fontSize: `${(currentSlide.fontScale || 100) / 100}em`,
                   opacity: (currentSlide.bgOpacity || 100) / 100,
                   textAlign: currentSlide.textAlign || 'left'
                 }">
                <!-- 标题 - 可编辑 -->
                <div class="flex items-center gap-3 mb-6">
                  <h2 class="flex-1 text-3xl font-bold editable-text"
                      :style="{ color: currentTheme.colors.text }"
                      contenteditable="true"
                      @blur="onTitleEdit($event)"
                      @keydown.enter.prevent="$event.target.blur()"
                      @mouseup="handleTextSelection($event)"
                      :data-placeholder="'点击编辑标题'"
                      data-type="title">
                    {{ currentSlide.title }}
                  </h2>
                </div>
                <div class="w-40 h-0.5 mb-8"
                     :style="{ background: currentTheme.colors.accent }"></div>

                <!-- 内容区域 - 根据布局类型渲染 -->
                <div class="flex-1 overflow-y-auto custom-scrollbar">
                  <!-- Classic 布局 -->
                  <div v-if="currentSlide.layout === 'classic'" class="flex gap-8 h-full">
                    <div class="flex-1 space-y-6">
                      <p class="text-base leading-relaxed editable-text"
                         :style="{ color: currentTheme.colors.text }"
                         contenteditable="true"
                         @blur="onContentEdit($event)"
                         @mouseup="handleTextSelection($event)"
                         :data-placeholder="'点击编辑内容'"
                         data-type="content">
                        {{ currentSlide.content }}
                      </p>
                      <ul class="space-y-3">
                        <li v-for="(item, i) in currentSlide.items" :key="i"
                            class="flex items-start gap-3 text-base"
                            :style="{ color: currentTheme.colors.text }">
                          <span class="text-sm mt-1" :style="{ color: currentTheme.colors.accent }">●</span>
                          <span class="flex-1 editable-text"
                                contenteditable="true"
                                @blur="onItemEdit($event, i)"
                                @keydown.enter.prevent="$event.target.blur()"
                                @mouseup="handleTextSelection($event)"
                                data-type="item"
                                :data-index="i">{{ item }}</span>
                        </li>
                      </ul>
                    </div>
                    <!-- 多图显示 -->
                    <div v-if="(currentSlide.images && currentSlide.images.length > 0) || currentSlide.imgData"
                         class="shrink-0">
                      <!-- 单图 -->
                      <div v-if="getSlideImages(currentSlide).length === 1"
                           class="w-80 h-80 rounded-lg overflow-hidden shadow-lg">
                        <img :src="'data:image/png;base64,' + getSlideImages(currentSlide)[0]"
                             class="w-full h-full object-cover">
                      </div>
                      <!-- 多图网格 -->
                      <div v-else-if="getSlideImages(currentSlide).length === 2"
                           class="w-80 space-y-3">
                        <div v-for="(img, idx) in getSlideImages(currentSlide)" :key="idx"
                             class="h-[9.5rem] rounded-lg overflow-hidden shadow-lg">
                          <img :src="'data:image/png;base64,' + img"
                               class="w-full h-full object-cover">
                        </div>
                      </div>
                      <div v-else-if="getSlideImages(currentSlide).length >= 3"
                           class="w-80 grid grid-cols-2 gap-3">
                        <div v-for="(img, idx) in getSlideImages(currentSlide).slice(0, 4)" :key="idx"
                             class="aspect-square rounded-lg overflow-hidden shadow-lg"
                             :class="{'col-span-2': idx === 0 && getSlideImages(currentSlide).length === 3}">
                          <img :src="'data:image/png;base64,' + img"
                               class="w-full h-full object-cover">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Big Data 布局 -->
                  <div v-else-if="currentSlide.layout === 'big-data'" class="flex flex-col items-center justify-center h-full text-center">
                    <div class="text-9xl font-bold mb-6 editable-text"
                         :style="{ color: currentTheme.colors.accent }"
                         contenteditable="true"
                         @blur="onDataValueEdit($event)"
                         @keydown.enter.prevent="$event.target.blur()"
                         @mouseup="handleTextSelection($event)"
                         data-type="dataValue">
                      {{ currentSlide.dataValue || '89%' }}
                    </div>
                    <div class="text-3xl font-bold mb-4 editable-text"
                         :style="{ color: currentTheme.colors.text }"
                         contenteditable="true"
                         @blur="onDataLabelEdit($event)"
                         @keydown.enter.prevent="$event.target.blur()"
                         @mouseup="handleTextSelection($event)"
                         data-type="dataLabel">
                      {{ currentSlide.dataLabel || currentSlide.title }}
                    </div>
                    <div class="w-32 h-0.5 mb-6"
                         :style="{ background: currentTheme.colors.accent }"></div>
                    <p class="text-base max-w-3xl editable-text"
                       :style="{ color: currentTheme.colors.text }"
                       contenteditable="true"
                       @blur="onContentEdit($event)"
                       @mouseup="handleTextSelection($event)"
                       data-type="content">
                      {{ currentSlide.content }}
                    </p>
                  </div>

                  <!-- Chart 布局 -->
                  <div v-else-if="currentSlide.layout === 'chart'" class="flex flex-col h-full">
                    <p class="text-base mb-6 editable-text"
                       :style="{ color: currentTheme.colors.text }"
                       contenteditable="true"
                       @blur="onContentEdit($event)"
                       @mouseup="handleTextSelection($event)"
                       data-type="content">
                      {{ currentSlide.content }}
                    </p>
                    <div class="flex-1">
                      <Chart v-if="currentSlide.chartData && currentSlide.chartType"
                             :chartType="currentSlide.chartType"
                             :chartData="currentSlide.chartData"
                             :theme="currentTheme"
                             class="h-full"
                      />
                    </div>
                  </div>

                  <!-- Classic Vertical, Center, Timeline, Comparison, Image Grid - Similar patterns -->
                  <!-- (Keeping remaining layout types for completeness but simplified) -->

                  <!-- 其他布局使用 Classic 作为后备 -->
                  <div v-else class="space-y-6">
                    <p class="text-base leading-relaxed editable-text"
                       :style="{ color: currentTheme.colors.text }"
                       contenteditable="true"
                       @blur="onContentEdit($event)"
                       @mouseup="handleTextSelection($event)"
                       data-type="content">
                      {{ currentSlide.content }}
                    </p>
                    <ul class="space-y-3">
                      <li v-for="(item, i) in currentSlide.items" :key="i"
                          class="flex items-start gap-3 text-base"
                          :style="{ color: currentTheme.colors.text }">
                        <span class="text-sm mt-1" :style="{ color: currentTheme.colors.accent }">●</span>
                        <span class="flex-1 editable-text"
                              contenteditable="true"
                              @blur="onItemEdit($event, i)"
                              @keydown.enter.prevent="$event.target.blur()"
                              @mouseup="handleTextSelection($event)"
                              data-type="item"
                              :data-index="i">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 页码 -->
                <div class="text-sm text-right mt-6 opacity-50"
                     :style="{ color: currentTheme.colors.text }">
                  {{ selectedIndex + 1 }} / {{ slides.length }}
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 行内AI工具栏 -->
      <InlineAIToolbar
        :visible="showAIToolbar"
        :position="aiToolbarPosition"
        :selected-text="selectedTextContent"
        :config="config"
        @close="showAIToolbar = false"
        @replace-text="handleReplaceText"
      />

      <!-- 右侧编辑面板 -->
      <SlideEditorPanel v-if="selectedIndex >= 0"
        :selected-index="selectedIndex"
        :edit-data="editData"
        :is-regenerating="isRegenerating"
        :is-adding-image="isAddingImage"
        :is-generating-layout="isGeneratingLayout"
        :image-count-status="imageCountStatus"
        :custom-layout="customLayout"
        :show-layout-advice="showLayoutAdvice"
        :layout-recommendation="layoutRecommendation"
        @regenerate-content="regenerateSlideContent(selectedIndex)"
        @update="updateSlideInRealtime"
        @add-image="addImageBySource"
        @remove-image="removeImage"
        @generate-custom-layout="getAICustomLayout"
        @apply-layout-recommendation="applyLayoutRecommendation"
        @dismiss-layout-recommendation="dismissLayoutRecommendation"
        @apply-custom-layout="applyCustomLayout"
        @dismiss-custom-layout="dismissCustomLayout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import Chart from './Chart.vue'
import CustomLayoutRenderer from './CustomLayoutRenderer.vue'
import InlineAIToolbar from './InlineAIToolbar.vue'
import ThumbnailList from './ThumbnailList.vue'
import SlideEditorPanel from './SlideEditorPanel.vue'
import { applyImmersiveTheme, removeImmersiveTheme } from '../services/themeGenerator.js'
import { useSlideEditor } from '../composables/useSlideEditor.js'
import { useImageManagement } from '../composables/useImageManagement.js'
import { useLayoutRecommendation } from '../composables/useLayoutRecommendation.js'
import { useSlideDragDrop } from '../composables/useSlideDragDrop.js'

const props = defineProps({
  topic: String,
  slides: Array,
  theme: Object,
  config: Object,
  outline: Array,
  isGenerating: Boolean,
  generationProgress: Number,
  generationLog: String,
  immersiveTheme: Object,
  isLoadingTheme: Boolean
})

const emit = defineEmits(['back', 'export', 'update-slide', 'reorder-slides'])

const selectedIndex = ref(-1)
const isRegenerating = ref(false)
const isGeneratingLayout = ref(false)
const customLayout = ref(null)

// AI工具栏状态
const showAIToolbar = ref(false)
const aiToolbarPosition = ref({ x: 0, y: 0 })
const selectedTextContent = ref('')
const currentEditingElement = ref(null)

// 右侧面板编辑状态
const editData = ref({
  title: '',
  content: '',
  items: [],
  layout: 'classic',
  images: [],
  notes: '',
  bgOpacity: 100,
  fontScale: 100,
  textAlign: 'left',
  animation: 'none'
})

const currentTheme = computed(() => props.theme)

const currentSlide = computed(() => {
  if (selectedIndex.value === -1) {
    return { title: props.topic }
  }
  return props.slides[selectedIndex.value] || {}
})

// 使用组合式函数
const { onTitleEdit, onContentEdit, onItemEdit, onDataValueEdit, onDataLabelEdit } = useSlideEditor(emit)
const {
  isAddingImage,
  imageCountStatus,
  addImageBySource: addImage,
  removeImage: deleteImage,
  getSlideImages
} = useImageManagement(editData)
const {
  layoutRecommendation,
  showLayoutAdvice,
  checkLayoutRecommendation,
  applyLayoutRecommendation: applyLayout,
  dismissLayoutRecommendation
} = useLayoutRecommendation()
const {
  draggingSlideIndex,
  dropTargetIndex,
  handleSlideDragStart,
  handleSlideDragOver,
  handleSlideDrop: handleDrop,
  handleSlideDragEnd
} = useSlideDragDrop(emit)

function selectSlide(index) {
  selectedIndex.value = index
  if (index >= 0 && index < props.slides.length) {
    loadSlideDataToPanel(index)
  }
}

function loadSlideDataToPanel(index) {
  const slide = props.slides[index]
  if (!slide) return

  let images = []
  if (slide.images && Array.isArray(slide.images)) {
    images = [...slide.images]
  } else if (slide.imgData) {
    images = [slide.imgData]
  }

  editData.value = {
    title: slide.title || '',
    content: slide.content || '',
    items: [...(slide.items || [])],
    layout: slide.layout || 'classic',
    images: images,
    notes: slide.notes || '',
    bgOpacity: slide.bgOpacity || 100,
    fontScale: slide.fontScale || 100,
    textAlign: slide.textAlign || 'left',
    animation: slide.animation || 'none'
  }
}

function updateSlideInRealtime() {
  if (selectedIndex.value < 0 || selectedIndex.value >= props.slides.length) return

  const slide = props.slides[selectedIndex.value]
  const updatedSlide = {
    ...slide,
    title: editData.value.title,
    content: editData.value.content,
    items: editData.value.items,
    layout: editData.value.layout,
    notes: editData.value.notes,
    bgOpacity: editData.value.bgOpacity,
    fontScale: editData.value.fontScale,
    textAlign: editData.value.textAlign,
    animation: editData.value.animation
  }

  if (editData.value.images && editData.value.images.length > 0) {
    updatedSlide.images = [...editData.value.images]
    updatedSlide.imgData = editData.value.images[0]
  } else {
    updatedSlide.images = []
    updatedSlide.imgData = null
  }

  emit('update-slide', selectedIndex.value, updatedSlide)
}

async function addImageBySource(source) {
  const result = await addImage(source, editData.value.title, editData.value.content, currentTheme.value, props.config)
  if (result) {
    updateSlideInRealtime()
    checkLayoutRecommendation({ ...props.slides[selectedIndex.value], ...editData.value })
  }
}

function removeImage(index) {
  const success = deleteImage(index)
  if (success) {
    updateSlideInRealtime()
    checkLayoutRecommendation({ ...props.slides[selectedIndex.value], ...editData.value })
  }
}

function applyLayoutRecommendation() {
  const applied = applyLayout(editData, updateSlideInRealtime)
  if (applied) {
    console.log('✅ 已应用布局建议:', editData.value.layout)
  }
}

async function getAICustomLayout() {
  if (selectedIndex.value < 0 || selectedIndex.value >= props.slides.length) return

  isGeneratingLayout.value = true
  customLayout.value = null

  try {
    const { generateCustomLayout } = await import('../services/customLayoutGenerator.js')
    const slide = props.slides[selectedIndex.value]

    const result = await generateCustomLayout(slide, props.config)

    if (result.success && result.layout) {
      customLayout.value = result.layout
      console.log('🎨 AI生成自定义布局:', result.layout)
    } else {
      throw new Error(result.error || '生成失败')
    }
  } catch (error) {
    console.error('AI自定义排版失败:', error)
    alert('AI自定义排版失败: ' + error.message)
  } finally {
    isGeneratingLayout.value = false
  }
}

function applyCustomLayout() {
  if (!customLayout.value) return

  editData.value.layout = 'custom'
  const slide = props.slides[selectedIndex.value]
  emit('update-slide', selectedIndex.value, {
    ...slide,
    layout: 'custom',
    customLayout: customLayout.value
  })

  console.log('✅ 已应用AI自定义排版:', customLayout.value.layoutName)
}

function dismissCustomLayout() {
  customLayout.value = null
  if (editData.value.layout === 'custom') {
    editData.value.layout = 'classic'
    updateSlideInRealtime()
  }
}

async function regenerateSlideContent(index) {
  if (index < 0 || index >= props.slides.length) return

  isRegenerating.value = true
  try {
    const { generateSlideContent } = await import('../generators/content.js')

    const newSlideData = await generateSlideContent(
      props.topic,
      props.outline[index],
      props.config
    )

    emit('update-slide', index, {
      ...newSlideData,
      title: props.outline[index].title
    })

    if (index === selectedIndex.value) {
      loadSlideDataToPanel(index)
    }
  } catch (error) {
    console.error('重新生成失败:', error)
    alert('重新生成失败: ' + error.message)
  } finally {
    isRegenerating.value = false
  }
}

function handleSlideDrop(toIndex, event) {
  const result = handleDrop(toIndex, event, props.slides)
  if (result) {
    const { fromIndex, toIndex: to } = result
    if (selectedIndex.value === fromIndex) {
      selectedIndex.value = to
    } else if (selectedIndex.value > fromIndex && selectedIndex.value <= to) {
      selectedIndex.value--
    } else if (selectedIndex.value < fromIndex && selectedIndex.value >= to) {
      selectedIndex.value++
    }
  }
}

function handleTextSelection(event) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (selectedText && selectedText.length > 0) {
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    aiToolbarPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY
    }
    selectedTextContent.value = selectedText
    currentEditingElement.value = event.target
    showAIToolbar.value = true
  } else {
    showAIToolbar.value = false
  }
}

function handleReplaceText(newText) {
  if (!currentEditingElement.value || !selectedTextContent.value) return

  const element = currentEditingElement.value
  const currentText = element.innerText

  element.innerText = currentText.replace(selectedTextContent.value, newText)

  if (element.classList.contains('layout-title') || element.dataset.type === 'title') {
    onTitleEdit({ target: element }, selectedIndex.value, currentSlide.value)
  } else if (element.classList.contains('layout-content') || element.dataset.type === 'content') {
    onContentEdit({ target: element }, selectedIndex.value, currentSlide.value)
  } else if (element.dataset.type === 'item') {
    const itemIndex = parseInt(element.dataset.index)
    if (!isNaN(itemIndex)) {
      onItemEdit({ target: element }, itemIndex, selectedIndex.value, currentSlide.value)
    }
  }

  showAIToolbar.value = false
  selectedTextContent.value = ''
  currentEditingElement.value = null
}

// 监听immersiveTheme变化，自动应用
watch(() => props.immersiveTheme, (newTheme) => {
  if (newTheme) {
    applyImmersiveTheme(newTheme)
  }
}, { immediate: true })

// 监听图片数量变化，触发布局推荐
watch(() => editData.value.images?.length, (newCount, oldCount) => {
  if (newCount !== oldCount && selectedIndex.value >= 0) {
    setTimeout(() => {
      checkLayoutRecommendation({ ...props.slides[selectedIndex.value], ...editData.value })
    }, 100)
  }
})

// 监听布局切换，清除旧的推荐
watch(() => editData.value.layout, () => {
  if (showLayoutAdvice.value) {
    dismissLayoutRecommendation()
  }
})

onMounted(() => {
  if (props.immersiveTheme) {
    applyImmersiveTheme(props.immersiveTheme)
  }
})

onUnmounted(() => {
  removeImmersiveTheme()
})
</script>

<style scoped>
/* 沉浸式预览容器 */
.slide-preview-immersive {
  position: relative;
  background: var(--immersive-bg, linear-gradient(135deg, #1a1a2e 0%, #000000 100%));
}

/* 沉浸式背景 */
.immersive-backdrop {
  position: absolute;
  inset: 0;
  background: var(--immersive-bg, linear-gradient(135deg, #1a1a2e 0%, #000000 100%));
  z-index: -1;
  pointer-events: none;
}

/* 预览容器 - 使用scale缩放实现自适应 */
.preview-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.preview-slide {
  width: 960px;
  height: 540px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transform-origin: center center;
  /* 自动计算scale以适应容器 */
  transform: scale(var(--preview-scale, 0.65));
  transition: transform 0.3s ease;
}

@media (min-width: 1280px) {
  .preview-slide {
    --preview-scale: 0.75;
  }
}

@media (min-width: 1536px) {
  .preview-slide {
    --preview-scale: 0.85;
  }
}

@media (min-width: 1920px) {
  .preview-slide {
    --preview-scale: 1;
  }
}

@media (min-width: 2560px) {
  .preview-slide {
    --preview-scale: 1.2;
  }
}

/* 顶部工具栏 */
.slide-preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.1));
  position: relative;
  z-index: 10;
}

.immersive-toolbar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--immersive-text, #ffffff);
  letter-spacing: 0.02em;
}

.immersive-toolbar-subtitle {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary, #8a9a9a);
  margin-top: 0.25rem;
}

/* 工具栏按钮 */
.immersive-toolbar-btn {
  padding: 0.5rem;
  background: transparent;
  color: var(--immersive-text, #ffffff);
  border: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.2));
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.immersive-toolbar-btn:hover {
  background: var(--immersive-primary, #6fffe9);
  color: var(--immersive-bg, #000);
  border-color: var(--immersive-primary, #6fffe9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--immersive-shadow, rgba(111, 255, 233, 0.3));
}

/* 导出按钮 */
.immersive-export-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, var(--immersive-primary, #6fffe9), var(--immersive-accent, #d4b778));
  color: var(--immersive-bg, #000);
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.immersive-export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--immersive-shadow, rgba(212, 183, 120, 0.4));
}

.immersive-export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 进度条 */
.immersive-progress-text {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary, #8a9a9a);
  margin-bottom: 0.5rem;
  text-align: center;
}

.immersive-progress-track {
  width: 100%;
  height: 4px;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.4));
  border-radius: 2px;
  overflow: hidden;
}

.immersive-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--immersive-primary, #6fffe9), var(--immersive-accent, #d4b778));
  transition: width 0.3s ease;
  border-radius: 2px;
}

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

/* 可编辑文本样式 */
.editable-text {
  position: relative;
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

.editable-text:empty:before {
  content: attr(data-placeholder);
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* 工具类 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 拖拽状态 */
.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.drop-target {
  position: relative;
}

.drop-target::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--immersive-primary, #6fffe9), var(--immersive-accent, #d4b778));
  border-radius: 1px;
}

/* 全屏主题加载遮罩 */
.theme-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-loading-content {
  text-align: center;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border: 4px solid rgba(111, 255, 233, 0.1);
  border-top: 4px solid var(--immersive-primary, #6fffe9);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 高级设置 - 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-cyan, #6fffe9);
  cursor: pointer;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px var(--accent-cyan, #6fffe9);
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-cyan, #6fffe9);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px var(--accent-cyan, #6fffe9);
}

/* 右下角浮动导出按钮 */
.export-floating-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--accent-gold, #d4b778) 0%, var(--accent-cyan, #6fffe9) 100%);
  color: #0a1111;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 24px rgba(212, 183, 120, 0.4), 0 4px 12px rgba(111, 255, 233, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.export-floating-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(212, 183, 120, 0.5), 0 6px 16px rgba(111, 255, 233, 0.4);
}

.export-floating-btn:active:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
}

.export-btn-text {
  position: relative;
  z-index: 2;
}

.export-btn-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--accent-gold, #d4b778), var(--accent-cyan, #6fffe9));
  border-radius: 50px;
  opacity: 0;
  filter: blur(12px);
  transition: opacity 0.3s;
  z-index: 0;
}

.export-floating-btn:hover:not(:disabled) .export-btn-glow {
  opacity: 0.6;
}

.export-floating-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
