import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 演示文稿Store - 管理当前PPT的大纲、内容、选中状态
 * 数据存储在内存中，刷新后重置
 */
export const usePresentationStore = defineStore('presentation', () => {
  // 基础数据
  const topic = ref('')
  const additionalInfo = ref('')
  const outline = ref([])
  const slides = ref([])

  // 当前主题样式
  const currentThemeKey = ref('business')

  // UI状态
  const selectedSlideIndex = ref(-1) // -1 表示封面

  // 生成状态
  const isGenerating = ref(false)
  const generationProgress = ref(0)
  const generationLog = ref('Waiting...')
  const generationError = ref('')

  // 生成控制器（用于取消请求）
  const abortController = ref(null)

  // 计算属性：当前选中的幻灯片
  const currentSlide = computed(() => {
    if (selectedSlideIndex.value === -1) {
      // 封面
      return {
        title: topic.value,
        date: new Date().toLocaleDateString(),
        isCover: true
      }
    } else {
      // 内容页
      return {
        ...slides.value[selectedSlideIndex.value],
        isCover: false
      }
    }
  })

  // 计算属性：幻灯片总数（包括封面）
  const totalSlides = computed(() => slides.value.length + 1)

  // 设置主题
  function setTopic(newTopic) {
    topic.value = newTopic
  }

  // 设置附加信息
  function setAdditionalInfo(info) {
    additionalInfo.value = info
  }

  // 设置大纲
  function setOutline(newOutline) {
    outline.value = newOutline
  }

  // 添加大纲项
  function addOutlineItem(item) {
    outline.value.push(item)
  }

  // 移除大纲项
  function removeOutlineItem(index) {
    outline.value.splice(index, 1)
  }

  // 更新大纲项
  function updateOutlineItem(index, item) {
    if (index >= 0 && index < outline.value.length) {
      outline.value[index] = item
    }
  }

  // 设置幻灯片列表
  function setSlides(newSlides) {
    slides.value = newSlides
  }

  // 添加幻灯片
  function addSlide(slide) {
    slides.value.push(slide)
  }

  // 移除幻灯片
  function removeSlide(index) {
    if (index >= 0 && index < slides.value.length) {
      slides.value.splice(index, 1)
      // 如果删除的是当前选中的，重新选择
      if (selectedSlideIndex.value === index) {
        selectedSlideIndex.value = Math.max(-1, index - 1)
      } else if (selectedSlideIndex.value > index) {
        selectedSlideIndex.value--
      }
    }
  }

  // 更新幻灯片
  function updateSlide(index, slide) {
    if (index >= 0 && index < slides.value.length) {
      slides.value[index] = { ...slides.value[index], ...slide }
    }
  }

  // 交换幻灯片位置（用于拖拽排序）
  function swapSlides(fromIndex, toIndex) {
    if (fromIndex >= 0 && fromIndex < slides.value.length &&
        toIndex >= 0 && toIndex < slides.value.length) {
      const temp = slides.value[fromIndex]
      slides.value[fromIndex] = slides.value[toIndex]
      slides.value[toIndex] = temp

      // 更新选中索引
      if (selectedSlideIndex.value === fromIndex) {
        selectedSlideIndex.value = toIndex
      } else if (selectedSlideIndex.value === toIndex) {
        selectedSlideIndex.value = fromIndex
      }
    }
  }

  // 选择幻灯片
  function selectSlide(index) {
    selectedSlideIndex.value = index
  }

  // 设置主题样式
  function setTheme(themeKey) {
    currentThemeKey.value = themeKey
  }

  // 开始生成
  function startGeneration() {
    isGenerating.value = true
    generationProgress.value = 0
    generationLog.value = 'Starting generation...'
    generationError.value = ''
    abortController.value = new AbortController()
  }

  // 更新生成进度
  function updateGenerationProgress(progress, log) {
    generationProgress.value = progress
    if (log) generationLog.value = log
  }

  // 生成完成
  function finishGeneration(success = true, error = '') {
    isGenerating.value = false
    generationProgress.value = success ? 100 : generationProgress.value
    generationError.value = error
    abortController.value = null
  }

  // 取消生成
  function cancelGeneration() {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    isGenerating.value = false
    generationLog.value = 'Generation cancelled'
  }

  // 重置所有数据
  function reset() {
    topic.value = ''
    additionalInfo.value = ''
    outline.value = []
    slides.value = []
    selectedSlideIndex.value = -1
    isGenerating.value = false
    generationProgress.value = 0
    generationLog.value = 'Waiting...'
    generationError.value = ''
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  return {
    // State
    topic,
    additionalInfo,
    outline,
    slides,
    currentThemeKey,
    selectedSlideIndex,
    isGenerating,
    generationProgress,
    generationLog,
    generationError,
    abortController,
    // Computed
    currentSlide,
    totalSlides,
    // Actions
    setTopic,
    setAdditionalInfo,
    setOutline,
    addOutlineItem,
    removeOutlineItem,
    updateOutlineItem,
    setSlides,
    addSlide,
    removeSlide,
    updateSlide,
    swapSlides,
    selectSlide,
    setTheme,
    startGeneration,
    updateGenerationProgress,
    finishGeneration,
    cancelGeneration,
    reset
  }
})
