/**
 * PPTBuilder - PPT构建引擎类
 *
 * 目标：统一Web预览和PPTX导出的样式，确保"所见即所得"
 *
 * 核心思想：
 * 1. 建立统一的ThemeSchema，定义所有样式参数
 * 2. 将Tailwind样式映射为PptxGenJS参数
 * 3. 提供统一的API用于Web渲染和PPT导出
 */

import { cleanHex } from '../utils/helpers.js'

/**
 * 布局配置Schema
 * 定义每种布局的尺寸、位置、字体大小等参数
 */
export const LAYOUT_SCHEMA = {
  // PPT尺寸（16:9比例，单位：英寸）
  pptSize: {
    width: 10,    // 宽度10英寸
    height: 5.625 // 高度5.625英寸 (10 * 9/16)
  },

  // Web预览尺寸（像素）
  webSize: {
    thumbnail: { width: 240, height: 135 },  // 缩略图
    preview: { width: 960, height: 540 },    // 大预览
    slide: { width: 400, height: 225 }       // 幻灯片
  },

  // 封面布局
  cover: {
    ppt: {
      subtitle: { x: 0.5, y: 1.5, w: 9, fontSize: 16, charSpacing: 3 },
      title: { x: 0.5, y: 2.2, w: 9, h: 1.5, fontSize: 48 },
      divider: { x: 4.5, y: 3.9, w: 1, h: 0.03 },
      date: { x: 0.5, y: 4.3, w: 9, fontSize: 16 },
      topBar: { x: 0, y: 0, w: '100%', h: 0.08 },
      bottomBar: { x: 0, y: 5.58, w: '100%', h: 0.08 }
    },
    web: {
      subtitle: { fontSize: '1.25rem', letterSpacing: '0.2em' },
      title: { fontSize: '3.75rem', lineHeight: 1.2 },
      divider: { width: '10rem', height: '0.25rem' },
      date: { fontSize: '1.125rem' }
    }
  },

  // 经典布局（文本+列表+图片）
  classic: {
    ppt: {
      title: { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28 },
      titleDivider: { x: 0.5, y: 0.95, w: 1.5, h: 0.02 },
      content: { x: 0.5, y: 1.3, w: 5.2, h: 1.2, fontSize: 14, lineSpacing: 16 },
      contentFull: { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 14, lineSpacing: 16 },
      itemStart: { x: 0.5, y: 2.7, w: 5.2, fontSize: 13, lineSpacing: 15, itemGap: 0.55 },
      image: { x: 5.8, y: 1.3, w: 3.7, h: 3.7 },
      imageShadow: { x: 5.95, y: 1.45, w: 3.7, h: 3.7 },
      pageNumber: { x: 9.2, y: 5.3, w: 0.5, fontSize: 10 }
    },
    web: {
      title: { fontSize: '2.25rem', marginBottom: '2rem' },
      content: { fontSize: '1.25rem', lineHeight: 1.8 },
      item: { fontSize: '1.125rem', lineHeight: 1.6, gap: '1rem' },
      image: { width: '20rem', height: '20rem' }
    }
  },

  // 大数据布局
  bigData: {
    ppt: {
      title: { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28 },
      titleDivider: { x: 0.5, y: 0.95, w: 1.5, h: 0.02 },
      dataValue: { x: 0, y: 1.8, w: '100%', fontSize: 80 },
      dataLabel: { x: 0, y: 3.2, w: '100%', fontSize: 20 },
      divider: { x: 4.5, y: 3.7, w: 1, h: 0.02 },
      description: { x: 1.5, y: 3.9, w: 7, fontSize: 14 },
      pageNumber: { x: 9.2, y: 5.3, w: 0.5, fontSize: 10 }
    },
    web: {
      title: { fontSize: '2.25rem', marginBottom: '1.5rem' },
      dataValue: { fontSize: '6rem', fontWeight: 'bold' },
      dataLabel: { fontSize: '1.875rem', marginBottom: '2rem' },
      description: { fontSize: '1.25rem', maxWidth: '48rem' }
    }
  },

  // 时间线布局
  timeline: {
    ppt: {
      title: { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28 },
      titleDivider: { x: 0.5, y: 0.95, w: 1.5, h: 0.02 },
      content: { x: 0.5, y: 1.2, w: 9, fontSize: 12 },
      nodeStart: { x: 0.8, y: 2.2, fontSize: 11, stepY: 0.7 },
      nodeCircle: { w: 0.2, h: 0.2 },
      nodeText: { x: 1.3, w: 8 },
      pageNumber: { x: 9.2, y: 5.3, w: 0.5, fontSize: 10 }
    },
    web: {
      title: { fontSize: '2.25rem', marginBottom: '1.5rem' },
      content: { fontSize: '1.125rem', marginBottom: '2rem' },
      nodeCircle: { width: '1.5rem', height: '1.5rem' },
      nodeText: { fontSize: '1.125rem', paddingLeft: '2rem' }
    }
  },

  // 对比布局
  comparison: {
    ppt: {
      title: { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28 },
      titleDivider: { x: 0.5, y: 0.95, w: 1.5, h: 0.02 },
      content: { x: 0.5, y: 1.2, w: 9, fontSize: 12 },
      leftTitle: { x: 0.5, y: 2.0, w: 4.2, fontSize: 14 },
      leftItems: { x: 0.5, y: 2.5, w: 4.2, fontSize: 11, itemGap: 0.5 },
      divider: { x: 5, y: 1.8, w: 0, h: 3.5 },
      rightTitle: { x: 5.3, y: 2.0, w: 4.2, fontSize: 14 },
      rightItems: { x: 5.3, y: 2.5, w: 4.2, fontSize: 11, itemGap: 0.5 },
      pageNumber: { x: 9.2, y: 5.3, w: 0.5, fontSize: 10 }
    },
    web: {
      title: { fontSize: '2.25rem', marginBottom: '1.5rem' },
      content: { fontSize: '1.125rem', marginBottom: '2rem' },
      columnTitle: { fontSize: '1.5rem', marginBottom: '1rem' },
      item: { fontSize: '1.125rem', gap: '0.75rem' }
    }
  },

  // 图表布局
  chart: {
    ppt: {
      title: { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28 },
      titleDivider: { x: 0.5, y: 0.95, w: 1.5, h: 0.02 },
      content: { x: 0.5, y: 1.2, w: 9, fontSize: 12 },
      chart: { x: 1.5, y: 2.2, w: 7, h: 3 },
      pageNumber: { x: 9.2, y: 5.3, w: 0.5, fontSize: 10 }
    },
    web: {
      title: { fontSize: '2.25rem', marginBottom: '1.5rem' },
      content: { fontSize: '1.125rem', marginBottom: '2rem' },
      chart: { width: '100%', height: '24rem' }
    }
  }
}

/**
 * PPTBuilder类
 * 提供统一的PPT构建API
 */
export class PPTBuilder {
  constructor(theme) {
    this.theme = theme
    this.pptx = null
    this.colors = {
      bg: theme.pptBg || 'FFFFFF',
      text: cleanHex(theme.colors.text),
      accent: cleanHex(theme.colors.accent),
      border: cleanHex(theme.colors.border)
    }
    this.fonts = {
      header: theme.pptFont || 'Arial',
      body: theme.pptFont || 'Arial'
    }
  }

  /**
   * 初始化PPT文档
   */
  init() {
    this.pptx = new PptxGenJS()
    this.pptx.layout = 'LAYOUT_16x9'
    return this
  }

  /**
   * 设置母版
   */
  setupMaster(themeKey, customBg = null) {
    const masterOpts = { title: 'MASTER' }

    // 背景设置
    if (customBg) {
      masterOpts.background = { data: customBg }
    } else {
      masterOpts.background = { color: this.colors.bg }
    }

    // 主题装饰元素
    masterOpts.objects = this.getThemeDecorations(themeKey)

    this.pptx.defineSlideMaster(masterOpts)
    return this
  }

  /**
   * 获取主题装饰元素
   */
  getThemeDecorations(themeKey) {
    const decorations = {
      'cyberpunk': [
        { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: this.colors.accent } } },
        { rect: { x: 0, y: 0, w: 0.1, h: '100%', fill: { color: this.colors.accent } } }
      ],
      'business': [
        { rect: { x: 0, y: 5.4, w: '100%', h: 0.225, fill: { color: this.colors.accent } } }
      ],
      'tech': [
        { rect: { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: this.colors.accent } } },
        { rect: { x: 0, y: 5.58, w: '100%', h: 0.08, fill: { color: this.colors.accent } } }
      ],
      'academic': [
        { rect: { x: 0, y: 5.4, w: '100%', h: 0.25, fill: { color: this.colors.accent } } }
      ],
      'nature': [
        { rect: { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: this.colors.accent } } },
        { rect: { x: 0.15, y: 0, w: 0.05, h: '100%', fill: { color: '81c784' }, transparency: 50 } }
      ],
      'vintage': [
        { rect: { x: 0.2, y: 0.2, w: 9.6, h: 0.05, fill: { color: this.colors.accent } } },
        { rect: { x: 0.2, y: 5.4, w: 9.6, h: 0.05, fill: { color: this.colors.accent } } },
        { rect: { x: 0.2, y: 0.2, w: 0.05, h: 5.25, fill: { color: this.colors.accent } } },
        { rect: { x: 9.75, y: 0.2, w: 0.05, h: 5.25, fill: { color: this.colors.accent } } }
      ],
      'gradient': [
        { rect: { x: 0, y: 0, w: 0.3, h: 0.3, fill: { color: this.colors.accent } } },
        { rect: { x: 0.3, y: 0, w: 0.15, h: 0.15, fill: { color: '80d0c7' } } }
      ],
      'corporate': [
        { rect: { x: 0, y: 0, w: 0.12, h: '100%', fill: { color: this.colors.accent } } },
        { rect: { x: 0, y: 5.45, w: '100%', h: 0.2, fill: { color: this.colors.accent }, transparency: 30 } }
      ]
    }

    return decorations[themeKey] || []
  }

  /**
   * 添加封面幻灯片
   */
  addCover(topic, customBg = null) {
    const cover = this.pptx.addSlide()
    const schema = LAYOUT_SCHEMA.cover.ppt

    // 背景
    if (customBg) {
      cover.background = { data: customBg }
    } else {
      cover.background = { color: this.colors.bg }
    }

    // 顶部装饰线
    cover.addShape('rect', {
      ...schema.topBar,
      fill: { color: this.colors.accent }
    })

    // 副标题装饰
    cover.addText('PRESENTATION', {
      ...schema.subtitle,
      color: this.colors.accent,
      align: 'center',
      fontFace: this.fonts.header,
      bold: true
    })

    // 主标题
    cover.addText(topic, {
      ...schema.title,
      color: this.colors.text,
      align: 'center',
      fontFace: this.fonts.header,
      bold: true,
      valign: 'middle'
    })

    // 装饰分隔线
    cover.addShape('rect', {
      ...schema.divider,
      fill: { color: this.colors.accent }
    })

    // 日期
    cover.addText(new Date().toLocaleDateString(), {
      ...schema.date,
      color: this.colors.text,
      align: 'center',
      fontFace: this.fonts.body,
      transparency: 50
    })

    // 底部装饰线
    cover.addShape('rect', {
      ...schema.bottomBar,
      fill: { color: this.colors.accent }
    })

    return this
  }

  /**
   * 添加内容幻灯片
   */
  addSlide(slideData, pageNum, totalPages) {
    const slide = this.pptx.addSlide({ masterName: 'MASTER' })

    // 根据布局类型渲染
    switch(slideData.layout) {
      case 'big-data':
        this.renderBigData(slide, slideData)
        break
      case 'timeline':
        this.renderTimeline(slide, slideData)
        break
      case 'comparison':
        this.renderComparison(slide, slideData)
        break
      case 'chart':
        this.renderChart(slide, slideData)
        break
      default:
        this.renderClassic(slide, slideData)
    }

    // 添加页码
    this.addPageNumber(slide, pageNum, totalPages)

    // 添加演讲者备注（如果有）
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes)
    }

    return this
  }

  /**
   * 渲染经典布局
   */
  renderClassic(slide, data) {
    const schema = LAYOUT_SCHEMA.classic.ppt
    const hasImage = data.imgData

    // 标题
    this.addTitle(slide, data.title, schema.title)

    // 主要内容
    if (data.content) {
      const contentSchema = hasImage ? schema.content : schema.contentFull
      slide.addText(data.content, {
        ...contentSchema,
        color: this.colors.text,
        fontFace: this.fonts.body,
        align: 'justify'
      })
    }

    // 项目列表
    if (data.items && data.items.length) {
      const startY = data.content ? schema.itemStart.y : 1.3
      const textW = hasImage ? schema.itemStart.w : 9

      data.items.forEach((item, idx) => {
        slide.addText(item, {
          x: schema.itemStart.x,
          y: startY + (idx * schema.itemStart.itemGap),
          w: textW,
          fontSize: schema.itemStart.fontSize,
          color: this.colors.text,
          bullet: { code: '2022', color: this.colors.accent },
          fontFace: this.fonts.body,
          lineSpacing: schema.itemStart.lineSpacing
        })
      })
    }

    // 图片
    if (hasImage) {
      // 阴影
      slide.addShape('rect', {
        ...schema.imageShadow,
        fill: { color: '000000', transparency: 90 }
      })

      // 图片
      slide.addImage({
        data: `image/png;base64,${data.imgData}`,
        ...schema.image,
        sizing: { type: 'cover', w: schema.image.w, h: schema.image.h }
      })
    }
  }

  /**
   * 渲染大数据布局
   */
  renderBigData(slide, data) {
    const schema = LAYOUT_SCHEMA.bigData.ppt

    // 标题
    this.addTitle(slide, data.title, schema.title)

    // 大数字
    slide.addText(data.dataValue || '89%', {
      ...schema.dataValue,
      align: 'center',
      color: this.colors.accent,
      fontFace: this.fonts.header,
      bold: true
    })

    // 数据标签
    slide.addText(data.dataLabel || data.title, {
      ...schema.dataLabel,
      align: 'center',
      color: this.colors.text,
      fontFace: this.fonts.body,
      bold: true
    })

    // 装饰线
    slide.addShape('rect', {
      ...schema.divider,
      fill: { color: this.colors.accent }
    })

    // 描述文本
    if (data.content) {
      slide.addText(data.content, {
        ...schema.description,
        align: 'center',
        color: this.colors.text,
        fontFace: this.fonts.body
      })
    }
  }

  /**
   * 渲染时间线布局
   */
  renderTimeline(slide, data) {
    const schema = LAYOUT_SCHEMA.timeline.ppt

    // 标题
    this.addTitle(slide, data.title, schema.title)

    // 描述
    if (data.content) {
      slide.addText(data.content, {
        ...schema.content,
        color: this.colors.text,
        fontFace: this.fonts.body
      })
    }

    // 时间线节点
    if (data.items && data.items.length) {
      data.items.forEach((item, idx) => {
        const y = schema.nodeStart.y + (idx * schema.nodeStart.stepY)

        // 圆圈
        slide.addShape('circle', {
          x: schema.nodeStart.x,
          y: y + 0.1,
          ...schema.nodeCircle,
          fill: { color: this.colors.accent }
        })

        // 连接线
        if (idx < data.items.length - 1) {
          slide.addShape('line', {
            x: schema.nodeStart.x + 0.1,
            y: y + 0.3,
            w: 0,
            h: schema.nodeStart.stepY - 0.2,
            line: { color: this.colors.accent, width: 2 }
          })
        }

        // 文本
        slide.addText(item, {
          ...schema.nodeText,
          y: y,
          fontSize: schema.nodeStart.fontSize,
          color: this.colors.text,
          fontFace: this.fonts.body
        })
      })
    }
  }

  /**
   * 渲染对比布局
   */
  renderComparison(slide, data) {
    const schema = LAYOUT_SCHEMA.comparison.ppt

    // 标题
    this.addTitle(slide, data.title, schema.title)

    // 描述
    if (data.content) {
      slide.addText(data.content, {
        ...schema.content,
        color: this.colors.text,
        fontFace: this.fonts.body
      })
    }

    // 分割列表
    if (data.items && data.items.length) {
      const midPoint = Math.ceil(data.items.length / 2)
      const leftItems = data.items.slice(0, midPoint)
      const rightItems = data.items.slice(midPoint)

      // 左列
      slide.addText(data.leftTitle || '方案 A', {
        ...schema.leftTitle,
        color: this.colors.accent,
        fontFace: this.fonts.header,
        bold: true
      })

      leftItems.forEach((item, idx) => {
        slide.addText(item, {
          x: schema.leftItems.x,
          y: schema.leftItems.y + (idx * schema.leftItems.itemGap),
          w: schema.leftItems.w,
          fontSize: schema.leftItems.fontSize,
          color: this.colors.text,
          bullet: { code: '2022', color: this.colors.accent },
          fontFace: this.fonts.body
        })
      })

      // 分隔线
      slide.addShape('line', {
        ...schema.divider,
        line: { color: this.colors.accent, width: 2, dashType: 'dash' }
      })

      // 右列
      slide.addText(data.rightTitle || '方案 B', {
        ...schema.rightTitle,
        color: this.colors.accent,
        fontFace: this.fonts.header,
        bold: true
      })

      rightItems.forEach((item, idx) => {
        slide.addText(item, {
          x: schema.rightItems.x,
          y: schema.rightItems.y + (idx * schema.rightItems.itemGap),
          w: schema.rightItems.w,
          fontSize: schema.rightItems.fontSize,
          color: this.colors.text,
          bullet: { code: '2022', color: this.colors.accent },
          fontFace: this.fonts.body
        })
      })
    }
  }

  /**
   * 渲染图表布局
   */
  renderChart(slide, data) {
    const schema = LAYOUT_SCHEMA.chart.ppt

    // 标题
    this.addTitle(slide, data.title, schema.title)

    // 描述
    if (data.content) {
      slide.addText(data.content, {
        ...schema.content,
        color: this.colors.text,
        fontFace: this.fonts.body
      })
    }

    // 图表
    if (data.chartData && data.chartType) {
      const chartOptions = {
        ...schema.chart,
        showLegend: true,
        showTitle: false,
        chartColors: [this.colors.accent, this.colors.text, '6fffe9', 'ff6b6b']
      }

      // 深拷贝图表数据，避免pptxgen修改原始数据
      const chartDataCopy = JSON.parse(JSON.stringify(data.chartData))

      slide.addChart(data.chartType, chartDataCopy, chartOptions)
    }
  }

  /**
   * 添加标题
   */
  addTitle(slide, title, schema) {
    slide.addText(title, {
      ...schema,
      color: this.colors.text,
      fontFace: this.fonts.header,
      bold: true,
      valign: 'middle'
    })

    // 标题装饰线
    slide.addShape('rect', {
      x: 0.5,
      y: 0.95,
      w: 1.5,
      h: 0.02,
      fill: { color: this.colors.accent }
    })
  }

  /**
   * 添加页码
   */
  addPageNumber(slide, pageNum, totalPages) {
    const schema = LAYOUT_SCHEMA.classic.ppt.pageNumber
    slide.addText(`${pageNum} / ${totalPages}`, {
      ...schema,
      color: this.colors.text,
      align: 'right',
      fontFace: this.fonts.body,
      transparency: 50
    })
  }

  /**
   * 导出文件
   */
  export(filename) {
    return this.pptx.writeFile({ fileName: filename })
  }
}

/**
 * 便捷导出函数（保持向后兼容）
 */
export function exportToPPTX(topic, slides, theme, themeKey, pptConfig = {}) {
  const builder = new PPTBuilder(theme)

  builder
    .init()
    .setupMaster(themeKey, pptConfig.templateBg)
    .addCover(topic, pptConfig.templateBg)

  slides.forEach((slideData, index) => {
    builder.addSlide(slideData, index + 1, slides.length)
  })

  return builder.export(`${topic || 'Presentation'}.pptx`)
}
