/**
 * 网络图片搜索服务
 * 支持从Unsplash和Pexels获取免费高质量图片
 */

import axios from 'axios'

/**
 * 从Unsplash搜索图片
 * @param {string} query - 搜索关键词（英文）
 * @param {string} accessKey - Unsplash Access Key
 * @param {number} perPage - 每页数量
 * @returns {Promise<Array>} 图片列表
 */
export async function searchUnsplashImages(query, accessKey, perPage = 10) {
  if (!accessKey || accessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
    throw new Error('Unsplash Access Key未配置，请在Step 1配置中设置')
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: perPage,
        orientation: 'landscape' // 横向图片，适合PPT
      },
      headers: {
        'Authorization': `Client-ID ${accessKey}`
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
      throw new Error('Unsplash Access Key无效，请检查配置中的Access Key')
    }
    throw new Error('图片搜索失败: ' + (error.response?.data?.errors?.[0] || error.message))
  }
}

/**
 * 从Pexels搜索图片
 * @param {string} query - 搜索关键词（英文）
 * @param {string} apiKey - Pexels API Key
 * @param {number} perPage - 每页数量
 * @returns {Promise<Array>} 图片列表
 */
export async function searchPexelsImages(query, apiKey, perPage = 10) {
  if (!apiKey || apiKey === 'YOUR_PEXELS_API_KEY') {
    throw new Error('Pexels API Key未配置，请在Step 1配置中设置')
  }

  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: perPage,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': apiKey
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Pexels API Key无效，请检查配置中的API Key')
    }
    throw new Error('图片搜索失败: ' + (error.message))
  }
}

/**
 * 统一搜索接口（自动选择可用的服务）
 * @param {string} query - 搜索关键词
 * @param {Object} apiKeys - API密钥对象 { unsplashApiKey, pexelsApiKey }
 * @param {string} source - 图片源 ('auto', 'unsplash', 'pexels')
 * @returns {Promise<Array>} 图片列表
 */
export async function searchWebImages(query, apiKeys = {}, source = 'auto') {
  // 如果查询为空，返回空数组
  if (!query || !query.trim()) {
    return []
  }

  const { unsplashApiKey, pexelsApiKey } = apiKeys

  try {
    // 自动选择：优先Unsplash，失败则尝试Pexels
    if (source === 'auto' || source === 'unsplash') {
      if (unsplashApiKey && unsplashApiKey !== 'YOUR_UNSPLASH_ACCESS_KEY') {
        try {
          return await searchUnsplashImages(query, unsplashApiKey)
        } catch (error) {
          console.warn('Unsplash失败，尝试Pexels:', error.message)
          if (source === 'unsplash') throw error
          // 如果是auto模式，继续尝试Pexels
        }
      }
    }

    if (source === 'auto' || source === 'pexels') {
      if (pexelsApiKey && pexelsApiKey !== 'YOUR_PEXELS_API_KEY') {
        return await searchPexelsImages(query, pexelsApiKey)
      }
    }

    throw new Error('未配置任何图片搜索API密钥，请在Step 1配置中设置Unsplash或Pexels API Key')
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
 * @param {Object} apiKeys - API密钥对象 { unsplashApiKey, pexelsApiKey }
 * @param {string} source - 图片源
 * @returns {boolean}
 */
export function hasApiKey(apiKeys, source) {
  if (source === 'unsplash') {
    return apiKeys.unsplashApiKey && apiKeys.unsplashApiKey !== 'YOUR_UNSPLASH_ACCESS_KEY'
  }
  if (source === 'pexels') {
    return apiKeys.pexelsApiKey && apiKeys.pexelsApiKey !== 'YOUR_PEXELS_API_KEY'
  }
  return false
}
