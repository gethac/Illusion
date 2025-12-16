<template>
  <div class="h-screen w-screen overflow-hidden bg-[#05080a] relative flex items-center justify-center"
       :class="{ 'reduce-motion': !configStore.enableAnimations }">

    <!-- 通知容器 -->
    <NotificationContainer />

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
        <div v-else-if="step === 1" key="step1" class="game-container w-full max-w-2xl p-8 rounded-xl text-center max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div class="text-[#6fffe9] text-xs font-bold tracking-widest mb-2 uppercase">Step 01 // Link</div>
          <h2 class="text-2xl font-serif text-white mb-6">接入智识网络</h2>

          <div class="space-y-6 text-left">
            <!-- API 配置 -->
            <div class="space-y-4">
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

            <!-- 可选：图片搜索API -->
            <div class="space-y-3 bg-black/20 p-4 rounded-lg">
              <div class="text-[10px] text-[#8a9a9a] uppercase flex items-center gap-2">
                <Icon name="key" :size="12"/>
                可选：网络搜图 API 密钥
              </div>
              <div class="text-[9px] text-[#6fffe9] mb-2">
                💡 配置后可使用"网络搜图"功能，无需消耗OpenAI图像额度
              </div>
              <div>
                <label class="text-[10px] text-[#8a9a9a] mb-1 block flex items-center gap-2">
                  <Icon name="image" :size="10"/>
                  Unsplash Access Key <span class="text-[9px] opacity-50">(50次/小时，免费)</span>
                </label>
                <input v-model="configStore.unsplashApiKey" type="password" class="magic-input w-full p-2 rounded text-xs" placeholder="填写 Access Key（不是Secret key）">
                <div class="text-[8px] text-[#8a9a9a] mt-1 flex items-center gap-1">
                  <Icon name="info" :size="8"/>
                  注册地址：unsplash.com/developers → 使用 Access Key
                </div>
              </div>
              <div>
                <label class="text-[10px] text-[#8a9a9a] mb-1 block flex items-center gap-2">
                  <Icon name="image" :size="10"/>
                  Pexels API Key <span class="text-[9px] opacity-50">(200次/小时，免费)</span>
                </label>
                <input v-model="configStore.pexelsApiKey" type="password" class="magic-input w-full p-2 rounded text-xs" placeholder="可选">
                <div class="text-[8px] text-[#8a9a9a] mt-1 flex items-center gap-1">
                  <Icon name="info" :size="8"/>
                  注册地址：pexels.com/api
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button @click="prevStep" class="text-xs text-[#8a9a9a] hover:text-white">中断连接</button>
            <button @click="validateAndSaveConfig" :disabled="!configStore.apiKey || isValidating" class="game-btn px-8 py-2 bg-[#6fffe9] text-[#0a1111] font-bold">
              {{ isValidating ? '验证中...' : '验证通过' }}
            </button>
          </div>
        </div>

        <!-- STEP 2: 任务简报 -->
        <div v-else-if="step === 2" key="step2" class="game-container p-10 rounded-2xl w-full max-w-2xl text-center space-y-6">
          <div class="text-[var(--accent-gold)] text-xs font-bold tracking-widest uppercase">Step 02 // Mission</div>
          <h2 class="text-2xl font-bold text-white">输入生成指令</h2>
          <div class="space-y-4 text-left">
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-[10px] text-[#8a9a9a] uppercase">核心议题</label>
                <span class="text-[10px]" :class="presentationStore.topic.length > 200 ? 'text-amber-400' : 'text-[#8a9a9a]'">
                  {{ presentationStore.topic.length }} / 500
                </span>
              </div>
              <textarea v-model="presentationStore.topic"
                        maxlength="500"
                        class="magic-input w-full h-24 p-4 text-lg font-medium resize-none"
                        placeholder="例如：2025年人工智能发展趋势..."></textarea>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-[10px] text-[#8a9a9a] uppercase flex items-center gap-2">
                  <span class="w-1 h-1 bg-[var(--accent-cyan)] rounded-full"></span> 补充咒文
                </label>
                <span class="text-[10px]" :class="presentationStore.additionalInfo.length > 300 ? 'text-amber-400' : 'text-[#8a9a9a]'">
                  {{ presentationStore.additionalInfo.length }} / 1000
                </span>
              </div>
              <textarea v-model="presentationStore.additionalInfo"
                        maxlength="1000"
                        class="magic-input w-full h-20 p-3 text-xs resize-none"
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
        <div v-else-if="step === 3" key="step3" class="w-full max-w-6xl h-[85vh] flex flex-col">
          <!-- 顶部标题栏 -->
          <div class="flex justify-between items-center mb-8 shrink-0">
            <div>
              <div class="text-[var(--accent-cyan)] text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                <Icon name="list" :size="14"/>
                Step 03 // Structure
              </div>
              <h2 class="text-3xl font-bold text-white mb-1">确认战术大纲</h2>
              <p class="text-[#8a9a9a] text-sm">共 {{ presentationStore.outline.length }} 个章节 · 拖拽排序 · AI 优化</p>
            </div>
            <button @click="handleAddOutlineItem"
                    class="game-btn px-6 py-3 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] text-[#0a1111] font-bold flex items-center gap-2 shadow-lg">
              <Icon name="plus-circle" :size="16"/>
              添加章节
            </button>
          </div>

          <!-- 大纲列表 -->
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div class="grid gap-4">
              <div
                v-for="(item, index) in presentationStore.outline"
                :key="index"
                draggable="true"
                @dragstart="handleDragStart(index, $event)"
                @dragover.prevent="handleDragOver(index, $event)"
                @drop="handleDrop(index, $event)"
                @dragend="handleDragEnd"
                class="outline-card group relative"
                :class="{
                  'dragging': draggingIndex === index,
                  'drop-target': dropTargetIndex === index
                }"
              >
                <!-- 背景装饰 -->
                <div class="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/5 to-[var(--accent-cyan)]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <!-- 内容区域 -->
                <div class="relative flex gap-4 p-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[var(--accent-gold)]/50 transition-all">
                  <!-- 左侧：序号 + 拖拽手柄 -->
                  <div class="flex flex-col items-center gap-3 shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-cyan)] flex items-center justify-center font-bold text-[#0a1111] text-sm shadow-lg">
                      {{ index + 1 }}
                    </div>
                    <div class="cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded transition-colors">
                      <Icon name="grip-vertical" :size="16" class="text-[#8a9a9a] group-hover:text-[var(--accent-cyan)]" />
                    </div>
                  </div>

                  <!-- 中间：内容编辑区 -->
                  <div class="flex-1 space-y-3">
                    <!-- 标题 -->
                    <div class="flex items-center gap-2">
                      <Icon name="heading" :size="14" class="text-[var(--accent-gold)]"/>
                      <input
                        v-model="item.title"
                        class="flex-1 bg-transparent border-b-2 border-transparent focus:border-[var(--accent-gold)] text-white font-bold text-lg outline-none transition-colors"
                        placeholder="输入章节标题..."
                        @click.stop>
                    </div>

                    <!-- 描述 -->
                    <div class="relative">
                      <div class="flex items-start gap-2">
                        <Icon name="file-text" :size="14" class="text-[var(--accent-cyan)] mt-1"/>
                        <textarea
                          v-model="item.desc"
                          rows="2"
                          class="flex-1 bg-transparent border border-transparent focus:border-[var(--accent-cyan)] text-[#d0d0d0] text-sm outline-none resize-none rounded p-2 transition-colors"
                          placeholder="输入章节描述..."
                          @click.stop></textarea>
                      </div>

                      <!-- AI重写按钮组 -->
                      <div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/90 p-2 rounded-lg border border-white/10 shadow-xl">
                        <button
                          @click.stop="handleRewrite(index, 'simplify')"
                          :disabled="rewritingIndex === index"
                          class="ai-rewrite-btn"
                          title="精简">
                          <Icon v-if="rewritingIndex === index && rewritingMode === 'simplify'" name="loader-2" :size="12" class="animate-spin"/>
                          <Icon v-else name="minimize-2" :size="12"/>
                          <span class="text-[9px]">精简</span>
                        </button>
                        <button
                          @click.stop="handleRewrite(index, 'expand')"
                          :disabled="rewritingIndex === index"
                          class="ai-rewrite-btn"
                          title="扩写">
                          <Icon v-if="rewritingIndex === index && rewritingMode === 'expand'" name="loader-2" :size="12" class="animate-spin"/>
                          <Icon v-else name="maximize-2" :size="12"/>
                          <span class="text-[9px]">扩写</span>
                        </button>
                        <button
                          @click.stop="handleRewrite(index, 'rephrase')"
                          :disabled="rewritingIndex === index"
                          class="ai-rewrite-btn"
                          title="换个说法">
                          <Icon v-if="rewritingIndex === index && rewritingMode === 'rephrase'" name="loader-2" :size="12" class="animate-spin"/>
                          <Icon v-else name="refresh-cw" :size="12"/>
                          <span class="text-[9px]">换说法</span>
                        </button>
                      </div>
                    </div>

                    <!-- 重写预览 -->
                    <div v-if="rewritePreview && rewritePreview.index === index" class="mt-3 p-4 bg-gradient-to-br from-[var(--accent-cyan)]/10 to-[var(--accent-gold)]/10 border border-[var(--accent-cyan)]/30 rounded-lg space-y-3 shadow-lg">
                      <div class="flex items-center justify-between">
                        <div class="text-[var(--accent-cyan)] font-bold text-xs uppercase flex items-center gap-2">
                          <Icon name="sparkles" :size="14"/>
                          AI重写预览 · {{ rewritePreview.modeName }}
                        </div>
                        <button @click.stop="cancelRewritePreview" class="text-[#8a9a9a] hover:text-white text-xs">
                          <Icon name="x" :size="14"/>
                        </button>
                      </div>
                      <div class="text-white leading-relaxed text-sm bg-black/20 p-3 rounded">{{ rewritePreview.text }}</div>
                      <div class="flex gap-2 justify-end">
                        <button @click.stop="cancelRewritePreview" class="px-4 py-2 text-xs text-[#8a9a9a] hover:text-white transition-colors">取消</button>
                        <button @click.stop="applyRewritePreview" class="px-4 py-2 text-xs bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/80 text-[#0a1111] rounded font-bold transition-colors">应用</button>
                      </div>
                    </div>
                  </div>

                  <!-- 右侧：删除按钮 -->
                  <button
                    @click.stop="handleRemoveOutlineItem(index)"
                    class="opacity-0 group-hover:opacity-100 self-start p-2 text-[#8a9a9a] hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="删除章节">
                    <Icon name="trash-2" :size="16"/>
                  </button>
                </div>

                <!-- 拖拽指示器 -->
                <div v-if="dropTargetIndex === index" class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="mt-6 flex justify-between items-center shrink-0 pt-6 border-t border-white/10">
            <button @click="prevStep" class="px-6 py-3 text-sm text-[#8a9a9a] hover:text-white hover:bg-white/5 rounded transition-colors">
              <Icon name="arrow-left" :size="14" class="inline mr-2"/>
              返回重置
            </button>
            <div class="flex items-center gap-4">
              <div class="text-[#8a9a9a] text-xs">
                <Icon name="info" :size="12" class="inline mr-1"/>
                支持拖拽排序 · 悬停显示AI优化
              </div>
              <button @click="nextStep" class="game-btn px-10 py-3 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] text-[#0a1111] text-lg font-bold shadow-lg">
                确认大纲
                <Icon name="arrow-right" :size="16" class="inline ml-2"/>
              </button>
            </div>
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

        <!-- STEP 5: 预览界面（统一显示生成中和完成状态） -->
        <SlidePreview v-else-if="step === 5" key="step5"
                      :topic="presentationStore.topic"
                      :slides="presentationStore.slides"
                      :theme="themes[presentationStore.currentThemeKey]"
                      :config="{
                        baseUrl: configStore.baseUrl,
                        apiKey: configStore.apiKey,
                        textModel: configStore.textModel,
                        imageModel: configStore.imageModel,
                        imageSource: configStore.imageSource,
                        unsplashApiKey: configStore.unsplashApiKey,
                        pexelsApiKey: configStore.pexelsApiKey
                      }"
                      :outline="presentationStore.outline"
                      :immersive-theme="presentationStore.immersiveTheme"
                      :is-loading-theme="presentationStore.isLoadingTheme"
                      :is-generating="presentationStore.isGenerating"
                      :generation-progress="presentationStore.generationProgress"
                      :generation-log="presentationStore.generationLog"
                      @back="prevStep"
                      @export="handleExportPPT"
                      @update-slide="handleUpdateSlide"
                      @reorder-slides="handleReorderSlides"
        />

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from './stores/config'
import { usePresentationStore } from './stores/presentation'
import { useNotification } from './composables/useNotification'
import { validateAPIKey } from './services/apiValidator'
import Icon from './components/Icon.vue'
import Chart from './components/Chart.vue'
import FileUpload from './components/FileUpload.vue'
import SlidePreview from './components/SlidePreview.vue'
import NotificationContainer from './components/NotificationContainer.vue'
import { generateOutline } from './generators/outline'
import { generateSlideContent } from './generators/content'
import { exportToPPTX } from './exporters/pptx'
import { PPT_THEMES } from './config/themes'
import { rewriteText, getRewriteMode } from './services/rewrite'
import { generateImmersiveTheme, getDefaultImmersiveTheme } from './services/themeGenerator'

// Stores
const configStore = useConfigStore()
const presentationStore = usePresentationStore()

// Notification
const { success, error, warning, info } = useNotification()

// State
const step = ref(0)
const isLoading = ref(false)
const isValidating = ref(false)
const error = ref('')
const isLaunchingGeneration = ref(false)
const themes = PPT_THEMES

// 拖拽状态
const draggingIndex = ref(null)
const dropTargetIndex = ref(null)

// AI重写状态
const rewritingIndex = ref(null)
const rewritingMode = ref(null)
const rewritePreview = ref(null)

// Methods
const nextStep = () => {
  step.value++
}

const prevStep = () => {
  if (step.value > 0) step.value--
}

const saveConfigAndNext = () => {
  configStore.saveConfig()
  success('配置已保存')
  nextStep()
}

const validateAndSaveConfig = async () => {
  isValidating.value = true

  try {
    info('正在验证 API 密钥...')

    const result = await validateAPIKey(
      configStore.baseUrl,
      configStore.apiKey,
      configStore.textModel
    )

    if (result.valid) {
      configStore.saveConfig()
      success(result.message)
      nextStep()
    }
  } catch (err) {
    error(err.message || '验证失败，请检查配置')
  } finally {
    isValidating.value = false
  }
}

const handleGenerateOutline = async () => {
  isLoading.value = true
  error.value = ''

  try {
    info('正在生成大纲，请稍候...')

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

    if (!outline || outline.length === 0) {
      throw new Error('生成的大纲为空，请重试')
    }

    presentationStore.setOutline(outline)
    success(`成功生成 ${outline.length} 个章节`)
    nextStep()
  } catch (err) {
    const errorMsg = err.message || '生成大纲失败，请检查配置并重试'
    error.value = errorMsg
    error(errorMsg)
    console.error('大纲生成错误:', err)
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

// AI重写处理函数
const handleRewrite = async (index, mode) => {
  const item = presentationStore.outline[index]
  if (!item.desc || !item.desc.trim()) {
    return
  }

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
      error('重写失败: ' + err.message)
    }
  } finally {
    rewritingIndex.value = null
    rewritingMode.value = null
  }
}

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

const cancelRewritePreview = () => {
  rewritePreview.value = null
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

  // 立即开始生成沉浸式主题（并行执行，不阻塞）
  generateImmersiveThemeAsync()

  // 开始生成内容
  presentationStore.startGeneration()

  const config = {
    baseUrl: configStore.baseUrl,
    apiKey: configStore.apiKey,
    textModel: configStore.textModel,
    imageModel: configStore.imageModel,
    unsplashApiKey: configStore.unsplashApiKey,
    pexelsApiKey: configStore.pexelsApiKey
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

  // 批量并行生成（每批3个以平衡性能和API限制）
  const batchSize = 3
  const totalSlides = presentationStore.outline.length

  for (let batchStart = 0; batchStart < totalSlides; batchStart += batchSize) {
    if (presentationStore.abortController?.signal.aborted) {
      break
    }

    const batchEnd = Math.min(batchStart + batchSize, totalSlides)
    const batchPromises = []

    // 创建当前批次的生成任务
    for (let i = batchStart; i < batchEnd; i++) {
      const slideIndex = i
      const promise = (async () => {
        try {
          presentationStore.updateGenerationProgress(
            ((slideIndex / totalSlides) * 100),
            `正在生成第 ${slideIndex + 1}/${totalSlides} 页...`
          )

          const slideData = await generateSlideContent(
            presentationStore.topic,
            presentationStore.outline[slideIndex],
            config,
            presentationStore.abortController?.signal
          )

          presentationStore.updateSlide(slideIndex, {
            ...slideData,
            title: presentationStore.outline[slideIndex].title,
            isGenerating: false
          })

          return { index: slideIndex, success: true }
        } catch (e) {
          if (e.name === 'AbortError') {
            console.log(`第 ${slideIndex + 1} 页生成被取消`)
            throw e
          }
          console.error(`第 ${slideIndex + 1} 页生成失败:`, e)
          presentationStore.updateSlide(slideIndex, {
            content: '生成失败',
            isGenerating: false
          })
          warning(`第 ${slideIndex + 1} 页生成失败: ${e.message}`)
          return { index: slideIndex, success: false, error: e.message }
        }
      })()

      batchPromises.push(promise)
    }

    // 等待当前批次完成
    try {
      const results = await Promise.all(batchPromises)
      const failedCount = results.filter(r => !r.success).length
      if (failedCount > 0) {
        info(`批次 ${Math.floor(batchStart / batchSize) + 1} 完成，${failedCount} 页失败`)
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        break
      }
    }
  }

  // 更新最终进度
  presentationStore.updateGenerationProgress(100, '生成完成！')

  // 延迟一点再完成，让用户看到100%
  await new Promise(resolve => setTimeout(resolve, 500))

  presentationStore.finishGeneration(true)
  console.log('生成已完成，isGenerating:', presentationStore.isGenerating)
}

// 异步生成沉浸式主题
async function generateImmersiveThemeAsync() {
  presentationStore.startLoadingTheme()

  try {
    console.log('开始生成沉浸式主题配色...')
    const theme = await generateImmersiveTheme(
      presentationStore.topic,
      presentationStore.additionalInfo,
      presentationStore.currentThemeKey,
      {
        baseUrl: configStore.baseUrl,
        apiKey: configStore.apiKey,
        textModel: configStore.textModel
      }
    )
    presentationStore.setImmersiveTheme(theme)
    console.log('✨ 沉浸式主题已生成:', theme.name)
  } catch (error) {
    console.warn('沉浸式主题生成失败，使用默认主题:', error)
    // 使用默认主题
    const defaultTheme = getDefaultImmersiveTheme(presentationStore.currentThemeKey)
    presentationStore.setImmersiveTheme(defaultTheme)
  }
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
    success('PPT 导出成功！')
  } catch (err) {
    error('导出失败: ' + err.message)
  }
}

// 处理幻灯片更新
const handleUpdateSlide = (index, updatedSlide) => {
  presentationStore.updateSlide(index, updatedSlide)
}

// 处理幻灯片重新排序
const handleReorderSlides = (newSlides) => {
  presentationStore.setSlides(newSlides)
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
