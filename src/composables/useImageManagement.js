/**
 * 图片管理组合式函数
 * 处理幻灯片配图的添加、删除和状态管理
 */

import { ref, computed } from 'vue'
import { recommendImageCount } from '../services/layoutRecommender.js'

export function useImageManagement(editData) {
  const isAddingImage = ref(false)

  /**
   * 当前布局的图片推荐
   */
  const currentLayoutImageRec = computed(() => {
    return recommendImageCount(editData.value.layout)
  })

  /**
   * 当前图片数量状态
   */
  const imageCountStatus = computed(() => {
    const currentCount = editData.value.images?.length || 0
    const rec = currentLayoutImageRec.value

    if (currentCount < rec.min) {
      return {
        type: 'warning',
        message: `当前布局建议至少 ${rec.min} 张图片`
      }
    }
    if (currentCount > rec.max) {
      return {
        type: 'warning',
        message: `当前布局最多支持 ${rec.max} 张图片`
      }
    }
    if (currentCount === rec.recommendedCount) {
      return {
        type: 'success',
        message: '图片数量完美匹配'
      }
    }
    return {
      type: 'info',
      message: rec.reason
    }
  })

  /**
   * 添加图片（通过指定来源）
   */
  async function addImageBySource(source, title, content, theme, config) {
    if (!title || !content) {
      alert('请先填写标题和内容')
      return null
    }

    isAddingImage.value = true
    try {
      const { generateSlideImage } = await import('../generators/image.js')

      const imageResult = await generateSlideImage(
        title,
        content,
        theme,
        config,
        source
      )

      // 处理图片结果
      let base64Image = ''
      if (imageResult.type === 'base64') {
        base64Image = imageResult.data
      } else if (imageResult.type === 'url') {
        const { imageUrlToBase64Browser } = await import('../services/imageSearch.js')
        base64Image = await imageUrlToBase64Browser(imageResult.data)
      }

      if (base64Image) {
        if (!editData.value.images) {
          editData.value.images = []
        }
        editData.value.images.push(base64Image)
        return base64Image
      }
    } catch (error) {
      console.error('添加图片失败:', error)
      alert('添加图片失败: ' + error.message)
    } finally {
      isAddingImage.value = false
    }

    return null
  }

  /**
   * 删除图片
   */
  function removeImage(index) {
    if (editData.value.images && index >= 0 && index < editData.value.images.length) {
      editData.value.images.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 获取幻灯片的所有图片（兼容新旧格式）
   */
  function getSlideImages(slide) {
    if (!slide) return []

    // 优先使用新格式的 images 数组
    if (slide.images && Array.isArray(slide.images) && slide.images.length > 0) {
      return slide.images
    }

    // 回退到旧格式的单个 imgData
    if (slide.imgData) {
      return [slide.imgData]
    }

    return []
  }

  return {
    isAddingImage,
    currentLayoutImageRec,
    imageCountStatus,
    addImageBySource,
    removeImage,
    getSlideImages
  }
}
