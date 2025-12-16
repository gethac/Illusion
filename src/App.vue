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
        <div v-else-if="step === 2" key="step2" class="game-container p-10 rounded-2xl w-full max-w-lg text-center space-y-6">
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

        <!-- Placeholder for other steps -->
        <div v-else key="other" class="text-white text-center">
          <p>步骤 {{ step }} 开发中...</p>
          <button @click="prevStep" class="mt-4 game-btn px-6 py-2 bg-[#d4b778] text-[#0a1111] font-bold">返回</button>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from './stores/config'
import { usePresentationStore } from './stores/presentation'
import Icon from './components/Icon.vue'
import { generateOutline } from './generators/outline'

// Stores
const configStore = useConfigStore()
const presentationStore = usePresentationStore()

// State
const step = ref(0)
const isLoading = ref(false)
const error = ref('')
const isLaunchingGeneration = ref(false)

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

onMounted(() => {
  // 加载保存的配置
  configStore.loadConfig()
})
</script>
