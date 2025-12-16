/**
 * 网络图片搜索服务
 * 支持从Unsplash和Pexels获取免费高质量图片
 */

import axios from 'axios'

/**
 * Unsplash图片搜索配置
 * 需要在 https://unsplash.com/developers 注册获取Access Key
 */
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY' // 用户需要配置

/**
 * Pexels图片搜索配置
 * 需要在 https://www.pexels.com/api/ 注册获取API Key
 */
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY' // 用户需要配置

/**
 * 从Unsplash搜索图片
 * @param {string} query - 搜索关键词（英文）
 * @param {number} perPage - 每页数量
 * @returns {Promise<Array>} 图片列表
 */
export async function searchUnsplashImages(query, perPage = 10) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: perPage,
        orientation: 'landscape' // 横向图片，适合PPT
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    })

    return response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular, // 中等尺寸
      thumbnail: photo.urls.thumb, // 缩略图
      downloadUrl: photo.urls.full, // 完整尺寸
      description: photo.alt_description || photo.description || '',
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      source: 'unsplash'
    }))
  } catch (error) {
    console.error('Unsplash搜索失败:', error)
    if (error.response?.status === 401) {
      throw new Error('Unsplash API密钥无效，请在配置中设置正确的Access Key')
    }
    throw new Error('图片搜索失败，请稍后重试')
  }
}

/**
 * 从Pexels搜索图片
 * @param {string} query - 搜索关键词（英文）
 * @param {number} perPage - 每页数量
 * @returns {Promise<Array>} 图片列表
 */
export async function searchPexelsImages(query, perPage = 10) {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: perPage,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    })

    return response.data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large, // 大尺寸
      thumbnail: photo.src.small, // 缩略图
      downloadUrl: photo.src.original, // 原图
      description: photo.alt || '',
      author: photo.photographer,
      authorUrl: photo.photographer_url,
      source: 'pexels'
    }))
  } catch (error) {
    console.error('Pexels搜索失败:', error)
    if (error.response?.status === 401) {
      throw new Error('Pexels API密钥无效，请在配置中设置正确的API Key')
    }
    throw new Error('图片搜索失败，请稍后重试')
  }
}

/**
 * 统一搜索接口（自动选择可用的服务）
 * @param {string} query - 搜索关键词
 * @param {string} source - 图片源 ('auto', 'unsplash', 'pexels')
 * @returns {Promise<Array>} 图片列表
 */
export async function searchWebImages(query, source = 'auto') {
  // 如果查询为空，返回空数组
  if (!query || !query.trim()) {
    return []
  }

  try {
    // 自动选择：优先Unsplash，失败则尝试Pexels
    if (source === 'auto' || source === 'unsplash') {
      try {
        return await searchUnsplashImages(query)
      } catch (error) {
        console.warn('Unsplash失败，尝试Pexels:', error.message)
        if (source === 'unsplash') throw error
        // 如果是auto模式，继续尝试Pexels
      }
    }

    if (source === 'auto' || source === 'pexels') {
      return await searchPexelsImages(query)
    }

    throw new Error(`不支持的图片源: ${source}`)
  } catch (error) {
    console.error('网络图片搜索失败:', error)
    throw error
  }
}

/**
 * 将图片URL转换为Base64
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<string>} Base64字符串
 */
export async function imageUrlToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })

    const base64 = Buffer.from(response.data, 'binary').toString('base64')
    return base64
  } catch (error) {
    console.error('图片转换Base64失败:', error)
    throw new Error('图片下载失败')
  }
}

/**
 * 使用Fetch API将图片URL转换为Base64（浏览器环境）
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<string>} Base64字符串
 */
export async function imageUrlToBase64Browser(imageUrl) {
  try {
    // 使用代理避免CORS问题
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`

    const response = await fetch(proxyUrl)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('图片转换Base64失败:', error)
    throw new Error('图片下载失败')
  }
}

/**
 * 生成图片搜索关键词（中文转英文）
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Object} config - API配置
 * @returns {Promise<string>} 英文搜索关键词
 */
export async function generateSearchKeywords(slideTitle, slideContent, config) {
  const { createChatCompletion } = await import('../services/openai.js')

  const messages = [{
    role: "user",
    content: `根据以下PPT内容，生成2-3个英文关键词用于图片搜索（用空格分隔）：

标题：${slideTitle}
内容：${slideContent}

要求：
1. 只返回英文关键词，不要有其他文字
2. 关键词要具体、形象、适合搜索图片
3. 避免抽象概念，选择能找到相关图片的词汇
4. 最多3个词，用空格分隔

示例：
标题：人工智能的应用
输出：artificial intelligence technology robot

直接返回关键词：`
  }]

  const keywords = await createChatCompletion(config, messages, 0.7)
  return keywords.trim()
}

/**
 * 检查API密钥是否已配置
 * @param {string} source - 图片源
 * @returns {boolean}
 */
export function hasApiKey(source) {
  if (source === 'unsplash') {
    return UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY'
  }
  if (source === 'pexels') {
    return PEXELS_API_KEY && PEXELS_API_KEY !== 'YOUR_PEXELS_API_KEY'
  }
  return false
}
