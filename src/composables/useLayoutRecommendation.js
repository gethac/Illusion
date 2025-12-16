/**
 * 布局推荐组合式函数
 * 处理智能布局推荐和建议显示
 */

import { ref } from 'vue'
import { recommendLayout } from '../services/layoutRecommender.js'

export function useLayoutRecommendation() {
  const layoutRecommendation = ref(null)
  const showLayoutAdvice = ref(false)

  /**
   * 检查并生成布局推荐
   */
  function checkLayoutRecommendation(slideData) {
    if (!slideData) {
      layoutRecommendation.value = null
      showLayoutAdvice.value = false
      return
    }

    // 使用智能推荐系统
    const recommendation = recommendLayout(slideData)

    // 如果推荐的布局与当前不同，且置信度较高，显示建议
    if (recommendation.shouldChange && recommendation.confidence >= 0.7) {
      layoutRecommendation.value = recommendation
      showLayoutAdvice.value = true
      console.log('💡 布局建议:', recommendation)
    } else {
      // 清除旧的建议
      layoutRecommendation.value = null
      showLayoutAdvice.value = false
    }
  }

  /**
   * 应用布局建议
   */
  function applyLayoutRecommendation(editData, updateCallback) {
    if (!layoutRecommendation.value) return false

    editData.value.layout = layoutRecommendation.value.recommendedLayout

    if (updateCallback) {
      updateCallback()
    }

    // 清除建议
    layoutRecommendation.value = null
    showLayoutAdvice.value = false

    console.log('✅ 已应用布局建议:', editData.value.layout)
    return true
  }

  /**
   * 忽略布局建议
   */
  function dismissLayoutRecommendation() {
    layoutRecommendation.value = null
    showLayoutAdvice.value = false
  }

  return {
    layoutRecommendation,
    showLayoutAdvice,
    checkLayoutRecommendation,
    applyLayoutRecommendation,
    dismissLayoutRecommendation
  }
}
