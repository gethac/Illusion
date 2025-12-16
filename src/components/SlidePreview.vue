<template>
  <div class="w-full h-full flex flex-col bg-[#05080a]">
    <!-- 顶部工具栏 -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$emit('back')" class="text-[#8a9a9a] hover:text-white transition-colors">
          <Icon name="arrow-left" :size="20"/>
        </button>
        <div>
          <h2 class="text-white font-bold text-lg">{{ topic }}</h2>
          <div class="text-[#8a9a9a] text-xs">{{ slides.length }} 张幻灯片</div>
        </div>
      </div>

      <!-- 生成进度条（生成中显示） -->
      <div v-if="isGenerating" class="flex-1 max-w-md mx-8">
        <div class="text-[var(--accent-cyan)] text-xs mb-1">{{ generationLog }}</div>
        <div class="h-1.5 bg-black/60 rounded-full overflow-hidden">
          <div class="progress-fill h-full rounded-full transition-all duration-300"
               :style="{ width: `${generationProgress}%` }"></div>
        </div>
      </div>

      <button @click="$emit('export')"
              :disabled="isGenerating"
              class="game-btn px-6 py-2 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-cyan)] text-[#0a1111] font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
        <Icon name="download" :size="16"/>
        导出 PPT
      </button>

      <button @click="$emit('open-immersive')"
              :disabled="isGenerating"
              class="game-btn px-6 py-2 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] text-[#0a1111] font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="沉浸式全屏预览 (F11)">
        <Icon name="maximize" :size="16"/>
        沉浸式预览
      </button>
    </div>

    <!-- 主体区域：左侧缩略图 + 右侧预览 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧缩略图列表 -->
      <div class="w-64 border-r border-white/10 overflow-y-auto custom-scrollbar p-4 space-y-3">
        <!-- 封面缩略图 -->
        <div @click="selectSlide(-1)"
             class="thumbnail-card rounded-lg overflow-hidden cursor-pointer transition-all"
             :class="{ 'ring-2 ring-[var(--accent-gold)]': selectedIndex === -1 }">
          <div class="aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] p-4 flex items-center justify-center">
            <div class="text-center">
              <div class="text-[var(--accent-gold)] text-xs font-bold mb-1">PRESENTATION</div>
              <div class="text-white text-sm font-bold">{{ topic }}</div>
            </div>
          </div>
          <div class="p-2 bg-black/40 text-[#8a9a9a] text-xs flex items-center gap-2">
            <Icon name="home" :size="12"/>
            封面
          </div>
        </div>

        <!-- 内容页缩略图 -->
        <div v-for="(slide, index) in slides" :key="index"
             @click="selectSlide(index)"
             draggable="true"
             @dragstart="handleSlideDragStart(index, $event)"
             @dragover.prevent="handleSlideDragOver(index, $event)"
             @drop="handleSlideDrop(index, $event)"
             @dragend="handleSlideDragEnd"
             class="thumbnail-card rounded-lg overflow-hidden cursor-pointer transition-all relative group"
             :class="{
               'ring-2 ring-[var(--accent-gold)]': selectedIndex === index,
               'opacity-60': slide.isGenerating,
               'opacity-50 scale-95': draggingSlideIndex === index,
               'ring-2 ring-[var(--accent-cyan)]': dropTargetIndex === index
             }">
          <!-- 生成状态图标 -->
          <div v-if="slide.isGenerating" class="absolute top-1 right-1 z-10">
            <Icon name="loader-2" :size="14" class="text-[var(--accent-cyan)] animate-spin"/>
          </div>
          <div v-else class="absolute top-1 right-1 z-10">
            <Icon name="check-circle" :size="14" class="text-green-400"/>
          </div>

          <!-- 拖拽手柄 -->
          <div class="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded p-1">
            <Icon name="grip-vertical" :size="12" class="text-[#8a9a9a]"/>
          </div>

          <!-- 缩略图内容 -->
          <div class="aspect-video bg-black/60 p-3 flex flex-col" :style="{ background: currentTheme.previewBg }">
            <!-- 根据布局类型显示不同内容 -->
            <div v-if="slide.layout === 'big-data'" class="flex-1 flex flex-col items-center justify-center">
              <div class="text-xl font-bold mb-1" :style="{ color: currentTheme.colors.accent }">
                {{ slide.dataValue || '89%' }}
              </div>
              <div class="text-[8px] text-center" :style="{ color: currentTheme.colors.text }">
                {{ slide.dataLabel || slide.title }}
              </div>
            </div>

            <div v-else class="flex-1 flex flex-col">
              <!-- 标题 -->
              <div class="text-white text-[10px] font-bold mb-1 truncate">{{ slide.title }}</div>
              <div class="h-px w-6 mb-2" :style="{ background: currentTheme.colors.accent }"></div>

              <!-- 内容和列表 -->
              <div v-if="!slide.isGenerating" class="flex-1 flex gap-2">
                <!-- 文字部分 -->
                <div class="flex-1 min-w-0">
                  <div class="text-[#8a9a9a] text-[8px] line-clamp-2 mb-1">{{ slide.content }}</div>
                  <div v-if="slide.items && slide.items.length" class="space-y-0.5">
                    <div v-for="i in Math.min(3, slide.items.length)" :key="i"
                         class="text-[#6fffe9] text-[7px] flex items-center gap-1">
                      <div class="w-1 h-1 rounded-full" :style="{ background: currentTheme.colors.accent }"></div>
                      <div class="truncate">{{ slide.items[i-1] }}</div>
                    </div>
                  </div>
                </div>

                <!-- 图片预览（如果有） -->
                <div v-if="slide.imgData" class="w-12 h-12 rounded overflow-hidden shrink-0 border border-white/10">
                  <img :src="'data:image/png;base64,' + slide.imgData" class="w-full h-full object-cover">
                </div>
              </div>
              <div v-else class="text-[var(--accent-cyan)] text-[8px]">生成中...</div>
            </div>
          </div>

          <!-- 底部信息栏 -->
          <div class="p-2 bg-black/40 text-[#8a9a9a] text-xs flex items-center justify-between">
            <div class="flex items-center gap-1">
              <Icon name="file-text" :size="12"/>
              第 {{ index + 1 }} 页
            </div>
            <div class="text-[8px] opacity-70">{{ slide.layout }}</div>
          </div>

          <!-- 拖拽指示器 -->
          <div v-if="dropTargetIndex === index" class="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] rounded-full"></div>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 封面预览 -->
        <div v-if="selectedIndex === -1" class="flex-1 flex items-center justify-center p-8">
          <div class="w-full max-w-5xl aspect-video rounded-xl shadow-2xl overflow-hidden"
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
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <div class="flex-1 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div class="w-full max-w-5xl aspect-video rounded-xl shadow-2xl overflow-hidden"
                 :style="{ background: currentTheme.previewBg }">
              <div class="w-full h-full p-12 flex flex-col">
                <!-- 标题 -->
                <div class="flex items-center gap-3 mb-6">
                  <h2 class="flex-1 text-3xl font-bold"
                      :style="{ color: currentTheme.colors.text }">
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
                      <p class="text-base leading-relaxed"
                         :style="{ color: currentTheme.colors.text }">
                        {{ currentSlide.content }}
                      </p>
                      <ul class="space-y-3">
                        <li v-for="(item, i) in currentSlide.items" :key="i"
                            class="flex items-start gap-3 text-base"
                            :style="{ color: currentTheme.colors.text }">
                          <span class="text-sm mt-1" :style="{ color: currentTheme.colors.accent }">●</span>
                          <span>{{ item }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-if="currentSlide.imgData"
                         class="w-80 h-80 rounded-lg overflow-hidden shadow-lg shrink-0">
                      <img :src="'data:image/png;base64,' + currentSlide.imgData"
                           class="w-full h-full object-cover">
                    </div>
                  </div>

                  <!-- Big Data 布局 -->
                  <div v-else-if="currentSlide.layout === 'big-data'" class="flex flex-col items-center justify-center h-full text-center">
                    <div class="text-9xl font-bold mb-6"
                         :style="{ color: currentTheme.colors.accent }">
                      {{ currentSlide.dataValue || '89%' }}
                    </div>
                    <div class="text-3xl font-bold mb-4"
                         :style="{ color: currentTheme.colors.text }">
                      {{ currentSlide.dataLabel || currentSlide.title }}
                    </div>
                    <div class="w-32 h-0.5 mb-6"
                         :style="{ background: currentTheme.colors.accent }"></div>
                    <p class="text-base max-w-3xl"
                       :style="{ color: currentTheme.colors.text }">
                      {{ currentSlide.content }}
                    </p>
                  </div>

                  <!-- Image Full 布局 -->
                  <div v-else-if="currentSlide.layout === 'image-full'" class="relative h-full">
                    <div v-if="currentSlide.imgData" class="w-full h-full rounded-lg overflow-hidden">
                      <img :src="'data:image/png;base64,' + currentSlide.imgData"
                           class="w-full h-full object-cover">
                      <!-- 半透明覆盖层 -->
                      <div class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-6">
                        <p class="text-lg font-bold text-white text-center">
                          {{ currentSlide.content.substring(0, 120) }}{{ currentSlide.content.length > 120 ? '...' : '' }}
                        </p>
                      </div>
                    </div>
                    <div v-else class="flex items-center justify-center h-full">
                      <p class="text-base" :style="{ color: currentTheme.colors.text }">
                        {{ currentSlide.content }}
                      </p>
                    </div>
                  </div>

                  <!-- Chart 布局 -->
                  <div v-else-if="currentSlide.layout === 'chart'" class="flex flex-col h-full">
                    <p class="text-base mb-6" :style="{ color: currentTheme.colors.text }">
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

                  <!-- 其他布局使用 Classic 作为后备 -->
                  <div v-else class="space-y-6">
                    <p class="text-base leading-relaxed"
                       :style="{ color: currentTheme.colors.text }">
                      {{ currentSlide.content }}
                    </p>
                    <ul class="space-y-3">
                      <li v-for="(item, i) in currentSlide.items" :key="i"
                          class="flex items-start gap-3 text-base"
                          :style="{ color: currentTheme.colors.text }">
                        <span class="text-sm mt-1" :style="{ color: currentTheme.colors.accent }">●</span>
                        <span>{{ item }}</span>
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

          <!-- 底部编辑工具栏 -->
          <div class="border-t border-white/10 p-4 shrink-0 bg-black/40">
            <div class="flex items-center gap-3 justify-between max-w-4xl mx-auto">
              <div class="flex items-center gap-2">
                <button @click="regenerateSlideContent(selectedIndex)"
                        :disabled="isRegenerating"
                        class="px-3 py-1.5 bg-[var(--accent-cyan)]/20 hover:bg-[var(--accent-cyan)]/30 border border-[var(--accent-cyan)]/30 rounded text-[var(--accent-cyan)] text-xs flex items-center gap-1 transition-colors">
                  <Icon :name="isRegenerating ? 'loader-2' : 'refresh-cw'" :size="12" :class="{ 'animate-spin': isRegenerating }"/>
                  重新生成
                </button>

                <!-- 配图方式选择 -->
                <div class="relative group">
                  <button :disabled="isRegeneratingImage"
                          class="px-3 py-1.5 bg-[var(--accent-gold)]/20 hover:bg-[var(--accent-gold)]/30 border border-[var(--accent-gold)]/30 rounded text-[var(--accent-gold)] text-xs flex items-center gap-1 transition-colors">
                    <Icon :name="isRegeneratingImage ? 'loader-2' : 'image'" :size="12" :class="{ 'animate-spin': isRegeneratingImage }"/>
                    重新配图
                    <Icon name="chevron-down" :size="10"/>
                  </button>

                  <!-- 下拉菜单 -->
                  <div class="absolute bottom-full left-0 mb-1 bg-black/95 border border-white/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[180px] z-50">
                    <button @click="regenerateSlideImage(selectedIndex, 'ai')"
                            :disabled="isRegeneratingImage"
                            class="w-full px-4 py-2.5 hover:bg-white/10 flex items-center gap-2 border-b border-white/10 transition-colors">
                      <Icon name="sparkles" :size="14" class="text-[var(--accent-gold)]"/>
                      <div class="text-left flex-1">
                        <div class="text-white text-xs font-bold">AI 生成</div>
                        <div class="text-[#8a9a9a] text-[9px]">定制化，高相关性</div>
                      </div>
                    </button>
                    <button @click="regenerateSlideImage(selectedIndex, 'web')"
                            :disabled="isRegeneratingImage"
                            class="w-full px-4 py-2.5 hover:bg-white/10 flex items-center gap-2 transition-colors">
                      <Icon name="search" :size="14" class="text-[var(--accent-cyan)]"/>
                      <div class="text-left flex-1">
                        <div class="text-white text-xs font-bold">网络搜图</div>
                        <div class="text-[#8a9a9a] text-[9px]">速度快，质量高</div>
                      </div>
                    </button>
                  </div>
                </div>

                <button @click="editSlide(selectedIndex)"
                        class="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white text-xs flex items-center gap-1 transition-colors">
                  <Icon name="edit" :size="12"/>
                  编辑内容
                </button>
              </div>

              <div class="text-[#8a9a9a] text-xs">
                布局：{{ currentSlide.layout }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <SlideEditor
      :show="showEditor"
      :slide="editingSlideIndex >= 0 ? slides[editingSlideIndex] : null"
      :slide-index="editingSlideIndex"
      :config="config"
      @close="showEditor = false"
      @save="handleSaveEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'
import Chart from './Chart.vue'
import SlideEditor from './SlideEditor.vue'

const props = defineProps({
  topic: String,
  slides: Array,
  theme: Object,
  config: Object,
  outline: Array,
  isGenerating: Boolean,
  generationProgress: Number,
  generationLog: String
})

const emit = defineEmits(['back', 'export', 'update-slide', 'reorder-slides', 'open-immersive'])

const selectedIndex = ref(-1)
const isRegenerating = ref(false)
const isRegeneratingImage = ref(false)

// 拖拽状态
const draggingSlideIndex = ref(null)
const dropTargetIndex = ref(null)

// 编辑对话框状态
const showEditor = ref(false)
const editingSlideIndex = ref(-1)

const currentTheme = computed(() => props.theme)

const currentSlide = computed(() => {
  if (selectedIndex.value === -1) {
    return { title: props.topic }
  }
  return props.slides[selectedIndex.value] || {}
})

function selectSlide(index) {
  selectedIndex.value = index
}

async function regenerateSlideContent(index) {
  if (index < 0 || index >= props.slides.length) return

  isRegenerating.value = true
  try {
    // 导入生成器
    const { generateSlideContent } = await import('../generators/content.js')

    // 重新生成内容
    const newSlideData = await generateSlideContent(
      props.topic,
      props.outline[index],
      props.config
    )

    // 更新幻灯片
    emit('update-slide', index, {
      ...newSlideData,
      title: props.outline[index].title
    })
  } catch (error) {
    console.error('重新生成失败:', error)
    alert('重新生成失败: ' + error.message)
  } finally {
    isRegenerating.value = false
  }
}

async function regenerateSlideImage(index, imageSource = 'ai') {
  if (index < 0 || index >= props.slides.length) return

  isRegeneratingImage.value = true
  try {
    // 导入图片生成器
    const { generateSlideImage } = await import('../generators/image.js')

    const slide = props.slides[index]

    // 重新生成配图，使用指定的图片源
    const imageResult = await generateSlideImage(
      slide.title,
      slide.content,
      currentTheme.value,
      props.config,
      imageSource  // 使用传入的图片源参数
    )

    // 更新图片数据
    if (imageResult.type === 'base64') {
      emit('update-slide', index, {
        ...slide,
        imgData: imageResult.data
      })
    } else if (imageResult.type === 'url') {
      // 如果是 URL，需要转换为 base64
      const { imageUrlToBase64Browser } = await import('../services/imageSearch.js')
      const base64 = await imageUrlToBase64Browser(imageResult.data)
      emit('update-slide', index, {
        ...slide,
        imgData: base64
      })
    }
  } catch (error) {
    console.error('重新配图失败:', error)
    alert('重新配图失败: ' + error.message)
  } finally {
    isRegeneratingImage.value = false
  }
}

function editSlide(index) {
  if (index < 0 || index >= props.slides.length) return
  editingSlideIndex.value = index
  showEditor.value = true
}

// 保存编辑
function handleSaveEdit(index, updatedData) {
  const slide = props.slides[index]
  emit('update-slide', index, {
    ...slide,
    title: updatedData.title,
    content: updatedData.content,
    items: updatedData.items,
    layout: updatedData.layout
  })
}

// 拖拽处理函数
function handleSlideDragStart(index, event) {
  draggingSlideIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())
}

function handleSlideDragOver(index, event) {
  event.preventDefault()
  dropTargetIndex.value = index
}

function handleSlideDrop(toIndex, event) {
  event.preventDefault()
  const fromIndex = draggingSlideIndex.value

  if (fromIndex !== null && fromIndex !== toIndex) {
    // 通知父组件重新排序幻灯片
    const newSlides = [...props.slides]
    const [movedSlide] = newSlides.splice(fromIndex, 1)
    newSlides.splice(toIndex, 0, movedSlide)

    // 发送事件让父组件更新所有幻灯片
    emit('reorder-slides', newSlides)

    // 更新选中索引
    if (selectedIndex.value === fromIndex) {
      selectedIndex.value = toIndex
    } else if (selectedIndex.value > fromIndex && selectedIndex.value <= toIndex) {
      selectedIndex.value--
    } else if (selectedIndex.value < fromIndex && selectedIndex.value >= toIndex) {
      selectedIndex.value++
    }
  }

  draggingSlideIndex.value = null
  dropTargetIndex.value = null
}

function handleSlideDragEnd() {
  draggingSlideIndex.value = null
  dropTargetIndex.value = null
}
</script>

<style scoped>
.thumbnail-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.thumbnail-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(111, 255, 233, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(111, 255, 233, 0.5);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
