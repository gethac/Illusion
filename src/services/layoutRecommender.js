/**
 * 布局推荐系统 - 根据幻灯片内容特征智能推荐最佳布局
 * 实现右侧面板各功能的联动协调
 */

/**
 * 根据幻灯片内容推荐最佳布局
 * @param {Object} slideData - 幻灯片数据
 * @param {string} slideData.title - 标题
 * @param {string} slideData.content - 内容文字
 * @param {Array} slideData.items - 列表项
 * @param {Array} slideData.images - 图片数组
 * @param {string} slideData.layout - 当前布局
 * @returns {Object} { recommendedLayout, reason, confidence }
 */
export function recommendLayout(slideData) {
  const {
    title = '',
    content = '',
    items = [],
    images = [],
    layout = 'classic',
    dataValue = '',
    chartData = null
  } = slideData

  const imageCount = images?.length || 0
  const itemCount = items?.length || 0
  const contentLength = content?.length || 0
  const hasDataValue = !!dataValue

  // 特殊布局优先级最高（不建议自动切换）
  const specialLayouts = ['chart', 'big-data', 'timeline', 'custom', 'image-full']
  if (specialLayouts.includes(layout)) {
    return {
      recommendedLayout: layout,
      reason: '保持特殊布局',
      confidence: 1.0,
      shouldChange: false
    }
  }

  // 规则1: 有图片时根据图片数量推荐
  if (imageCount > 0) {
    if (imageCount === 1) {
      // 单图：classic 或 classic-vertical 都适合
      if (contentLength > 300 || itemCount > 4) {
        return {
          recommendedLayout: 'classic-vertical',
          reason: `内容较多（${contentLength}字 + ${itemCount}项），建议使用垂直布局以便更好展示单张图片`,
          confidence: 0.8,
          shouldChange: layout !== 'classic-vertical' && layout !== 'classic'
        }
      }
      return {
        recommendedLayout: 'classic',
        reason: '单张图片适合经典布局（左右排列）',
        confidence: 0.7,
        shouldChange: layout !== 'classic'
      }
    } else if (imageCount === 2) {
      // 双图：对比或垂直布局
      if (itemCount > 0 && contentLength < 200) {
        return {
          recommendedLayout: 'comparison',
          reason: '两张图片适合对比布局（左右各一张）',
          confidence: 0.85,
          shouldChange: layout !== 'comparison'
        }
      }
      return {
        recommendedLayout: 'classic-vertical',
        reason: '两张图片适合垂直布局（上下排列）',
        confidence: 0.75,
        shouldChange: layout !== 'classic-vertical'
      }
    } else if (imageCount >= 3) {
      // 多图：image-grid 布局
      return {
        recommendedLayout: 'image-grid',
        reason: `${imageCount}张图片建议使用网格布局`,
        confidence: 0.9,
        shouldChange: layout !== 'image-grid'
      }
    }
  }

  // 规则2: 无图片时根据内容特征推荐
  if (imageCount === 0) {
    // 如果内容很短且列表项较少，使用居中布局
    if (contentLength < 150 && itemCount <= 3) {
      return {
        recommendedLayout: 'classic-center',
        reason: '内容简洁，居中布局更突出重点',
        confidence: 0.75,
        shouldChange: layout !== 'classic-center'
      }
    }

    // 如果列表项很多，使用经典布局
    if (itemCount >= 5) {
      return {
        recommendedLayout: 'classic',
        reason: `${itemCount}个列表项适合经典布局`,
        confidence: 0.7,
        shouldChange: layout !== 'classic'
      }
    }

    // 内容较长，使用经典布局
    if (contentLength > 300) {
      return {
        recommendedLayout: 'classic',
        reason: '内容较多，经典布局更易阅读',
        confidence: 0.65,
        shouldChange: layout !== 'classic'
      }
    }

    // 默认推荐经典布局
    return {
      recommendedLayout: 'classic',
      reason: '通用场景，经典布局最稳妥',
      confidence: 0.6,
      shouldChange: layout !== 'classic'
    }
  }

  // 默认保持当前布局
  return {
    recommendedLayout: layout,
    reason: '当前布局已经很合适',
    confidence: 0.5,
    shouldChange: false
  }
}

/**
 * 根据布局类型推荐图片数量
 * @param {string} layout - 布局类型
 * @returns {Object} { recommendedCount, reason }
 */
export function recommendImageCount(layout) {
  const recommendations = {
    'classic': {
      recommendedCount: 1,
      min: 0,
      max: 1,
      reason: '经典布局适合单张图片或无图片'
    },
    'classic-vertical': {
      recommendedCount: 1,
      min: 0,
      max: 2,
      reason: '垂直布局适合1-2张图片'
    },
    'classic-center': {
      recommendedCount: 0,
      min: 0,
      max: 0,
      reason: '居中布局聚焦文字，不建议添加图片'
    },
    'comparison': {
      recommendedCount: 2,
      min: 0,
      max: 2,
      reason: '对比布局最适合两张图片（左右各一）'
    },
    'image-grid': {
      recommendedCount: 4,
      min: 2,
      max: 4,
      reason: '网格布局适合2-4张图片'
    },
    'image-full': {
      recommendedCount: 1,
      min: 1,
      max: 1,
      reason: '全图布局需要一张高质量图片'
    },
    'big-data': {
      recommendedCount: 0,
      min: 0,
      max: 0,
      reason: '大数据布局聚焦数字，不需要图片'
    },
    'timeline': {
      recommendedCount: 0,
      min: 0,
      max: 0,
      reason: '时间线布局聚焦流程，不需要图片'
    },
    'chart': {
      recommendedCount: 0,
      min: 0,
      max: 0,
      reason: '图表布局已有数据可视化，不需要额外图片'
    }
  }

  return recommendations[layout] || {
    recommendedCount: 1,
    min: 0,
    max: 2,
    reason: '自定义布局，建议添加1张图片'
  }
}

/**
 * 检查内容是否适合当前布局
 * @param {Object} slideData - 幻灯片数据
 * @returns {Object} { isGoodFit, issues, suggestions }
 */
export function validateLayoutFit(slideData) {
  const {
    layout = 'classic',
    content = '',
    items = [],
    images = [],
    dataValue = '',
    chartData = null
  } = slideData

  const issues = []
  const suggestions = []
  const imageCount = images?.length || 0

  // 检查图片数量是否匹配布局
  const imageRec = recommendImageCount(layout)
  if (imageCount < imageRec.min) {
    issues.push(`${layout}布局建议至少${imageRec.min}张图片，当前只有${imageCount}张`)
    suggestions.push(`添加${imageRec.min - imageCount}张图片，或切换到其他布局`)
  }
  if (imageCount > imageRec.max) {
    issues.push(`${layout}布局最多支持${imageRec.max}张图片，当前有${imageCount}张`)
    suggestions.push(`移除多余图片，或切换到image-grid布局`)
  }

  // 检查 big-data 布局是否有数据值
  if (layout === 'big-data' && !dataValue) {
    issues.push('大数据布局需要设置dataValue（数据值）')
    suggestions.push('在右侧面板填写数据值，如"89%"或"1.2亿"')
  }

  // 检查 chart 布局是否有图表数据
  if (layout === 'chart' && !chartData) {
    issues.push('图表布局需要chartData（图表数据）')
    suggestions.push('需要重新生成内容以获取图表数据')
  }

  // 检查内容长度是否适合布局
  const contentLength = content?.length || 0
  if (layout === 'classic-center' && contentLength > 300) {
    issues.push('居中布局适合简洁内容，当前内容较长')
    suggestions.push('精简内容至300字以内，或切换到classic布局')
  }

  if (layout === 'image-full' && contentLength > 200) {
    issues.push('全图布局的文字应该简洁，当前内容过长')
    suggestions.push('精简内容至200字以内，突出视觉冲击')
  }

  return {
    isGoodFit: issues.length === 0,
    issues,
    suggestions
  }
}

/**
 * 获取布局切换建议（用于添加/删除图片后）
 * @param {Object} oldData - 修改前的数据
 * @param {Object} newData - 修改后的数据
 * @returns {Object} { shouldSuggest, recommendation }
 */
export function getLayoutChangeAdvice(oldData, newData) {
  const oldImageCount = oldData.images?.length || 0
  const newImageCount = newData.images?.length || 0

  // 图片数量没变化，不建议
  if (oldImageCount === newImageCount) {
    return { shouldSuggest: false }
  }

  const recommendation = recommendLayout(newData)

  // 如果推荐的布局与当前布局不同，且置信度较高
  if (recommendation.shouldChange && recommendation.confidence >= 0.7) {
    return {
      shouldSuggest: true,
      recommendation,
      trigger: oldImageCount < newImageCount ? 'image_added' : 'image_removed'
    }
  }

  return { shouldSuggest: false }
}
