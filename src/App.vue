<template>
  <div class="h-screen w-screen overflow-hidden bg-[#05080a] relative flex items-center justify-center"
       :class="{ 'reduce-motion': !configStore.enableAnimations }">

    <!-- 背景效果 -->
    <canvas id="particle-canvas"></canvas>
    <div class="scanlines"></div>
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>

    <!-- 前景视差装饰线条 -->
    <div class="parallax-accent-line accent-line-1 parallax-foreground"></div>
    <div class="parallax-accent-line accent-line-2 parallax-foreground"></div>
    <div class="parallax-accent-line accent-line-3 parallax-foreground"></div>
    <div class="parallax-accent-line accent-line-4 parallax-foreground"></div>
    <div class="parallax-accent-line accent-line-5 parallax-foreground"></div>
    <div class="parallax-accent-line accent-line-6 parallax-foreground"></div>

    <!-- 启动仪式光晕效果 -->
    <div id="launch-glow" class="launch-glow"></div>

    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">

      <!-- 动画开关按钮 -->
      <button @click="configStore.enableAnimations = !configStore.enableAnimations"
              class="fixed top-4 right-4 z-50 p-2 rounded bg-black/60 hover:bg-black/80 border border-white/10 transition-colors group"
              title="切换动画效果">
        <Icon :name="configStore.enableAnimations ? 'zap' : 'zap-off'" :size="20"
              :class="configStore.enableAnimations ? 'text-[var(--accent-gold)]' : 'text-[#8a9a9a]'"/>
        <span class="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs text-white bg-black/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {{ configStore.enableAnimations ? '动画已启用' : '动画已禁用' }}
        </span>
      </button>

      <!-- 步骤内容 -->
      <transition :name="isLaunchingGeneration ? 'launch-animation' : 'step'" mode="out-in">

        <!-- STEP 0: 启动 -->
        <div v-if="step === 0" key="step0" class="text-center">
          <div class="w-24 h-24 mx-auto mb-6 relative">
            <div class="absolute inset-0 border-2 border-[#d4b778] rotate-45 animate-[spin_10s_linear_infinite]"></div>
            <div class="absolute inset-3 border-2 border-[#6fffe9] -rotate-45 animate-[spin_8s_linear_infinite_reverse]"></div>
            <Icon name="presentation" class="text-[#d4b778] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :size="40"/>
          </div>
          <h1 class="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#d4b778] to-[#fff] mb-4 tracking-widest drop-shadow-[0_0_20px_rgba(212,183,120,0.3)]">
            幻境 PPT 助手
          </h1>
          <p class="text-[#8a9a9a] text-sm tracking-[0.3em] mb-12 uppercase typing-cursor">
            Presentation Matrix Loading...
          </p>
          <button @click="nextStep" class="game-btn px-10 py-4 bg-[#d4b778] text-[#0a1111] font-bold text-lg tracking-widest hover:bg-[#ffe0a3]">
            进入工作台
          </button>
        </div>

        <!-- STEP 1: 配置连接 -->
        <div v-else-if="step === 1" key="step1" class="game-container w-full max-w-lg p-8 rounded-xl text-center">
          <div class="text-[#6fffe9] text-xs font-bold tracking-widest mb-2 uppercase">Step 01 // Link</div>
          <h2 class="text-2xl font-serif text-white mb-6">接入智识网络</h2>

          <div class="space-y-4 text-left">
            <div>
              <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block">API 网关 (Base URL)</label>
              <input v-model="configStore.baseUrl" class="magic-input w-full p-3 rounded" placeholder="https://api.openai.com/v1">
            </div>
            <div>
              <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block">API 密钥令符</label>
              <input v-model="configStore.apiKey" type="password" class="magic-input w-full p-3 rounded" placeholder="sk-...">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block">文字模型</label>
                <input v-model="configStore.textModel" class="magic-input w-full p-3 rounded text-sm" placeholder="gpt-5.2">
              </div>
              <div>
                <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block">图像模型</label>
                <input v-model="configStore.imageModel" class="magic-input w-full p-3 rounded text-sm" placeholder="dall-e-3">
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button @click="prevStep" class="text-xs text-[#8a9a9a] hover:text-white">中断连接</button>
            <button @click="saveConfigAndNext" :disabled="!configStore.apiKey" class="game-btn px-8 py-2 bg-[#6fffe9] text-[#0a1111] font-bold">
              验证通过
            </button>
          </div>
        </div>

        <!-- STEP 2: 任务简报 -->
        <div v-else-if="step === 2" key="step2" class="game-container p-10 rounded-2xl w-full max-w-2xl text-center space-y-6">
          <div class="text-[var(--accent-gold)] text-xs font-bold tracking-widest uppercase">Step 02 // Mission</div>
          <h2 class="text-2xl font-bold text-white">输入生成指令</h2>
          <div class="space-y-4 text-left">
            <div>
              <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block">核心议题</label>
              <textarea v-model="presentationStore.topic" class="magic-input w-full h-24 p-4 text-lg font-medium resize-none"
                        placeholder="例如：2025年人工智能发展趋势..."></textarea>
            </div>
            <div>
              <label class="text-[10px] text-[#8a9a9a] uppercase mb-1 block flex items-center gap-2">
                <span class="w-1 h-1 bg-[var(--accent-cyan)] rounded-full"></span> 补充咒文
              </label>
              <textarea v-model="presentationStore.additionalInfo" class="magic-input w-full h-20 p-3 text-xs resize-none"
                        placeholder="例如：包含团队介绍、风格幽默、强调数据增长..."></textarea>
            </div>

            <!-- 文件上传区域 -->
            <div>
              <label class="text-[10px] text-[#8a9a9a] uppercase mb-2 block flex items-center gap-2">
                <Icon name="file-up" :size="12"/> 或从文档导入
              </label>
              <FileUpload
                @topic-extracted="handleTopicExtracted"
                @content-extracted="handleContentExtracted"
              />
            </div>
          </div>
          <div class="flex justify-between items-center pt-4">
            <button @click="prevStep" class="text-xs text-[#8a9a9a] hover:text-white">返回</button>
            <button @click="handleGenerateOutline" :disabled="!presentationStore.topic.trim() || isLoading"
                    class="game-btn px-8 py-2 bg-[var(--accent-gold)] text-[#0a1111] font-bold flex items-center gap-2">
              <Icon v-if="isLoading" name="loader-2" class="animate-spin" :size="16"/>
              {{ isLoading ? '解析中...' : '生成大纲' }}
            </button>
          </div>
          <div v-if="error" class="text-red-400 text-xs">{{ error }}</div>
        </div>

        <!-- STEP 3: 大纲确认 -->
        <div v-else-if="step === 3" key="step3" class="game-container w-full max-w-4xl p-8 rounded-xl h-[75vh] flex flex-col">
          <div class="flex justify-between items-center mb-6 shrink-0">
            <div>
              <div class="text-[var(--accent-cyan)] text-xs font-bold tracking-widest uppercase">Step 03 // Structure</div>
              <h2 class="text-2xl font-bold text-white">确认战术大纲</h2>
            </div>
            <button @click="handleAddOutlineItem" class="px-3 py-1 border border-[#6fffe9]/30 text-[#6fffe9] hover:bg-[#6fffe9]/10 rounded text-xs flex items-center gap-1 transition-colors">
              <Icon name="plus" :size="14"/> 增援节点
            </button>
          </div>
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            <div
              v-for="(item, index) in presentationStore.outline"
              :key="index"
              draggable="true"
              @dragstart="handleDragStart(index, $event)"
              @dragover.prevent="handleDragOver(index, $event)"
              @drop="handleDrop(index, $event)"
              @dragend="handleDragEnd"
              class="group flex items-start gap-4 p-4 bg-black/40 border border-white/5 rounded-lg hover:border-[var(--accent-gold)] transition-colors relative cursor-move"
              :class="{ 'opacity-50 scale-95': draggingIndex === index, 'ring-2 ring-[var(--accent-cyan)]': dropTargetIndex === index }"
            >
              <!-- 拖拽手柄 -->
              <div class="flex flex-col items-center gap-1 pt-2 cursor-grab active:cursor-grabbing">
                <Icon name="grip-vertical" :size="14" class="text-[#8a9a9a] group-hover:text-[var(--accent-cyan)]" />
              </div>

              <div class="text-[#8a9a9a] font-mono text-xs mt-2 w-6">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="flex-1 space-y-2">
                <input v-model="item.title" class="w-full bg-transparent border-b border-transparent focus:border-[var(--accent-gold)] text-white font-bold text-sm outline-none" @click.stop>
                <textarea v-model="item.desc" rows="1" class="w-full bg-transparent border-b border-transparent focus:border-[var(--accent-cyan)] text-[#8a9a9a] text-xs outline-none resize-none" @click.stop></textarea>
              </div>
              <button @click.stop="handleRemoveOutlineItem(index)" class="opacity-0 group-hover:opacity-100 text-[#8a9a9a] hover:text-red-400 absolute top-2 right-2 z-10">
                <Icon name="x" :size="14"/>
              </button>
            </div>
          </div>
          <div class="mt-6 flex justify-between shrink-0 pt-4 border-t border-white/10">
            <button @click="prevStep" class="text-xs text-[#8a9a9a] hover:text-white">返回重置</button>
            <button @click="nextStep" class="game-btn px-8 py-2 bg-[var(--accent-cyan)] text-[#0a1111] font-bold">结构确认</button>
          </div>
        </div>

        <!-- STEP 4: 风格选择 -->
        <div v-else-if="step === 4" key="step4" class="w-full max-w-5xl h-[80vh] flex flex-col">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">选择具象化模组</h2>
            <p class="text-[#8a9a9a] text-sm">系统 UI 保持魔法连接状态，但输出产物将适配目标维度的物理法则</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 overflow-y-auto custom-scrollbar pr-2">
            <div v-for="(theme, key) in themes" :key="key"
                 @click="presentationStore.setTheme(key)"
                 class="style-card relative rounded-xl overflow-hidden group h-40 flex flex-col cursor-pointer"
                 :class="{ 'ring-2 ring-[var(--accent-gold)]': presentationStore.currentThemeKey === key }">
              <div class="flex-1 relative" :style="{background: theme.previewBg}">
                <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div class="w-16 h-2 rounded mb-1" :style="{background: theme.colors.accent}"></div>
                  <div class="w-10 h-2 rounded opacity-50" :style="{background: theme.colors.text}"></div>
                </div>
              </div>
              <div class="p-3 bg-black/60 border-t border-white/10 flex justify-between items-center">
                <span class="text-xs font-bold text-[#e0e0e0]">{{ theme.name }}</span>
                <div class="w-2 h-2 rounded-full" :class="presentationStore.currentThemeKey === key ? 'bg-[var(--accent-gold)]' : 'bg-white/20'"></div>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-6 mt-auto">
            <button @click="prevStep" class="text-xs text-[#8a9a9a] hover:text-white py-3">返回调整</button>
            <button @click="startFullGeneration" :disabled="presentationStore.isGenerating" class="game-btn launch-btn px-12 py-3 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-cyan)] text-[#0a1111] text-lg font-bold shadow-[0_0_30px_rgba(212,183,120,0.3)]">
              启动生成仪式
            </button>
          </div>
        </div>

        <!-- STEP 5: 生成结果（简化版预览） -->
        <div v-else-if="step === 5" key="step5" class="w-full h-full flex flex-col items-center justify-center gap-4">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-white mb-2">正在生成演示文稿</h2>
            <p class="text-[#8a9a9a] text-sm mb-8">
              {{ presentationStore.generationLog }}
            </p>

            <!-- 进度条 -->
            <div class="w-96 h-2 bg-black/60 rounded-full overflow-hidden">
              <div class="progress-fill h-full rounded-full transition-all duration-500"
                   :style="{ width: `${presentationStore.generationProgress}%` }"></div>
            </div>

            <!-- 已生成的幻灯片列表 -->
            <div v-if="presentationStore.slides.length > 0" class="mt-8 max-w-4xl mx-auto">
              <div class="text-[var(--accent-cyan)] text-xs font-bold tracking-wider uppercase mb-4">已生成幻灯片</div>
              <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                <div v-for="(slide, index) in presentationStore.slides" :key="index"
                     class="p-4 bg-black/40 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                  <div class="flex items-start gap-3 mb-2">
                    <Icon v-if="slide.isGenerating" name="loader-2" :size="16" class="text-[var(--accent-cyan)] animate-spin mt-1"/>
                    <Icon v-else name="check" :size="16" class="text-green-400 mt-1"/>
                    <div class="flex-1">
                      <div class="text-white text-sm font-bold">{{ slide.title }}</div>
                      <div class="text-[#8a9a9a] text-xs">{{ slide.layout }}</div>
                    </div>
                  </div>

                  <!-- 图表预览 -->
                  <div v-if="slide.layout === 'chart' && slide.chartData && slide.chartType"
                       class="mt-3 bg-black/60 rounded p-4 border border-[var(--accent-cyan)]/20">
                    <Chart
                      :chartType="slide.chartType"
                      :chartData="slide.chartData"
                      :theme="themes[presentationStore.currentThemeKey]"
                      class="h-48"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button v-if="!presentationStore.isGenerating" @click="handleExportPPT"
                  class="game-btn px-10 py-3 bg-gradient-to-r from-[#d4b778] to-[#6fffe9] text-[#0a1111] font-bold text-lg flex items-center gap-3 mt-8">
            <Icon name="download" :size="18"/>
            导出具象化文件
          </button>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from './stores/config'
import { usePresentationStore } from './stores/presentation'
import Icon from './components/Icon.vue'
import Chart from './components/Chart.vue'
import FileUpload from './components/FileUpload.vue'
import { generateOutline } from './generators/outline'
import { generateSlideContent } from './generators/content'
import { exportToPPTX } from './exporters/pptx'
import { PPT_THEMES } from './config/themes'

// Stores
const configStore = useConfigStore()
const presentationStore = usePresentationStore()

// State
const step = ref(0)
const isLoading = ref(false)
const error = ref('')
const isLaunchingGeneration = ref(false)
const themes = PPT_THEMES

// 拖拽状态
const draggingIndex = ref(null)
const dropTargetIndex = ref(null)

// Methods
const nextStep = () => {
  step.value++
}

const prevStep = () => {
  if (step.value > 0) step.value--
}

const saveConfigAndNext = () => {
  configStore.saveConfig()
  nextStep()
}

const handleGenerateOutline = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const config = {
      baseUrl: configStore.baseUrl,
      apiKey: configStore.apiKey,
      textModel: configStore.textModel,
      imageModel: configStore.imageModel
    }

    const outline = await generateOutline(
      presentationStore.topic,
      presentationStore.additionalInfo,
      config,
      configStore.pageCount
    )

    presentationStore.setOutline(outline)
    nextStep()
  } catch (err) {
    error.value = err.message || '生成大纲失败，请检查配置并重试'
  } finally {
    isLoading.value = false
  }
}

const handleAddOutlineItem = () => {
  presentationStore.addOutlineItem({
    title: '新增章节',
    desc: '请编辑描述...'
  })
}

const handleRemoveOutlineItem = (index) => {
  presentationStore.removeOutlineItem(index)
}

// 拖拽处理函数
const handleDragStart = (index, event) => {
  draggingIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())
}

const handleDragOver = (index, event) => {
  event.preventDefault()
  dropTargetIndex.value = index
}

const handleDrop = (toIndex, event) => {
  event.preventDefault()
  const fromIndex = draggingIndex.value

  if (fromIndex !== null && fromIndex !== toIndex) {
    presentationStore.reorderOutline(fromIndex, toIndex)
  }

  draggingIndex.value = null
  dropTargetIndex.value = null
}

const handleDragEnd = () => {
  draggingIndex.value = null
  dropTargetIndex.value = null
}

const startFullGeneration = async () => {
  // 启动仪式动画
  isLaunchingGeneration.value = true

  const canvas = document.getElementById('particle-canvas')
  if (canvas) {
    canvas.classList.add('launch-particle-burst')
    setTimeout(() => canvas.classList.remove('launch-particle-burst'), 800)
  }

  const glow = document.getElementById('launch-glow')
  if (glow) {
    glow.classList.add('active')
    setTimeout(() => glow.classList.remove('active'), 1200)
  }

  await new Promise(resolve => setTimeout(resolve, 400))

  nextStep()

  setTimeout(() => {
    isLaunchingGeneration.value = false
  }, 1200)

  // 开始生成内容
  presentationStore.startGeneration()

  const config = {
    baseUrl: configStore.baseUrl,
    apiKey: configStore.apiKey,
    textModel: configStore.textModel,
    imageModel: configStore.imageModel
  }

  // 初始化幻灯片
  const slides = presentationStore.outline.map(o => ({
    title: o.title,
    content: '等待生成...',
    layout: 'classic',
    items: [],
    isGenerating: true
  }))
  presentationStore.setSlides(slides)

  // 逐页生成
  for (let i = 0; i < presentationStore.outline.length; i++) {
    if (presentationStore.abortController?.signal.aborted) {
      break
    }

    try {
      presentationStore.updateGenerationProgress(
        ((i / presentationStore.outline.length) * 100),
        `正在生成第 ${i + 1}/${presentationStore.outline.length} 页...`
      )

      const slideData = await generateSlideContent(
        presentationStore.topic,
        presentationStore.outline[i],
        config,
        presentationStore.abortController?.signal
      )

      presentationStore.updateSlide(i, {
        ...slideData,
        title: presentationStore.outline[i].title,
        isGenerating: false
      })

    } catch (e) {
      if (e.name === 'AbortError') {
        console.log(`第 ${i + 1} 页生成被取消`)
        break
      }
      console.error(`第 ${i + 1} 页生成失败:`, e)
      presentationStore.updateSlide(i, {
        content: '生成失败',
        isGenerating: false
      })
    }
  }

  presentationStore.finishGeneration(true)
}

const handleExportPPT = async () => {
  try {
    const theme = themes[presentationStore.currentThemeKey]
    await exportToPPTX(
      presentationStore.topic,
      presentationStore.slides,
      theme,
      presentationStore.currentThemeKey
    )
  } catch (err) {
    alert('导出失败: ' + err.message)
  }
}

// 处理从文件提取的主题
const handleTopicExtracted = (topic) => {
  presentationStore.topic = topic
}

// 处理从文件提取的内容
const handleContentExtracted = (content) => {
  // 如果补充咒文为空，直接使用提取的内容
  // 如果已有内容，追加到现有内容后面
  if (!presentationStore.additionalInfo.trim()) {
    presentationStore.additionalInfo = content
  } else {
    presentationStore.additionalInfo += '\n\n' + content
  }
}

onMounted(() => {
  configStore.loadConfig()
})
</script>
