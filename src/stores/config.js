import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 配置Store - 管理API密钥、模型设置等配置
 * 数据持久化到LocalStorage
 */
export const useConfigStore = defineStore('config', () => {
  // API配置
  const baseUrl = ref('https://api.openai.com/v1')
  const apiKey = ref('')
  const textModel = ref('gpt-5.2')
  const imageModel = ref('dall-e-3')

  // 图片源配置
  const imageSource = ref('ai') // 'ai' | 'web'
  const unsplashApiKey = ref('')
  const pexelsApiKey = ref('')

  // PPT配置
  const pageCount = ref(8)
  const themeColor = ref('#d4b778')

  // 视觉效果配置
  const enableAnimations = ref(true)

  // 从LocalStorage加载配置
  function loadConfig() {
    try {
      const saved = localStorage.getItem('illusion-config')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.baseUrl) baseUrl.value = data.baseUrl
        if (data.apiKey) apiKey.value = data.apiKey
        if (data.textModel) textModel.value = data.textModel
        if (data.imageModel) imageModel.value = data.imageModel
        if (data.imageSource) imageSource.value = data.imageSource
        if (data.unsplashApiKey) unsplashApiKey.value = data.unsplashApiKey
        if (data.pexelsApiKey) pexelsApiKey.value = data.pexelsApiKey
        if (data.pageCount) pageCount.value = data.pageCount
        if (data.themeColor) themeColor.value = data.themeColor
        if (data.enableAnimations !== undefined) enableAnimations.value = data.enableAnimations
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  // 保存配置到LocalStorage
  function saveConfig() {
    try {
      const data = {
        baseUrl: baseUrl.value,
        apiKey: apiKey.value,
        textModel: textModel.value,
        imageModel: imageModel.value,
        imageSource: imageSource.value,
        unsplashApiKey: unsplashApiKey.value,
        pexelsApiKey: pexelsApiKey.value,
        pageCount: pageCount.value,
        themeColor: themeColor.value,
        enableAnimations: enableAnimations.value
      }
      localStorage.setItem('illusion-config', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  // 重置配置
  function resetConfig() {
    baseUrl.value = 'https://api.openai.com/v1'
    apiKey.value = ''
    textModel.value = 'gpt-5.2'
    imageModel.value = 'dall-e-3'
    imageSource.value = 'ai'
    unsplashApiKey.value = ''
    pexelsApiKey.value = ''
    pageCount.value = 8
    themeColor.value = '#d4b778'
    enableAnimations.value = true
    localStorage.removeItem('illusion-config')
  }

  return {
    // State
    baseUrl,
    apiKey,
    textModel,
    imageModel,
    imageSource,
    unsplashApiKey,
    pexelsApiKey,
    pageCount,
    themeColor,
    enableAnimations,
    // Actions
    loadConfig,
    saveConfig,
    resetConfig
  }
})
