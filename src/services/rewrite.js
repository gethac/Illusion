import { callOpenAI } from './openai'

/**
 * AI重写服务 - 提供三种重写模式
 * 1. 精简 (Simplify): 压缩内容，保留核心要点
 * 2. 扩写 (Expand): 增加细节和例子
 * 3. 换个说法 (Rephrase): 改变表达方式
 */

/**
 * 重写模式配置
 */
const REWRITE_MODES = {
  simplify: {
    name: '精简',
    icon: 'minimize-2',
    prompt: `请将以下文字精简到原来的50-70%长度，保留核心要点和关键信息。要求：
1. 删除冗余表达和重复内容
2. 使用更简洁的词汇
3. 保持原意不变
4. 保持专业性

原文：
{text}

请直接返回精简后的文字，不要添加任何解释或说明。`
  },
  expand: {
    name: '扩写',
    icon: 'maximize-2',
    prompt: `请将以下文字扩写到原来的150-200%长度，增加细节和深度。要求：
1. 添加具体例子或数据支撑
2. 增加背景说明或延伸思考
3. 保持逻辑连贯
4. 保持专业性和可读性

原文：
{text}

请直接返回扩写后的文字，不要添加任何解释或说明。`
  },
  rephrase: {
    name: '换个说法',
    icon: 'refresh-cw',
    prompt: `请用不同的表达方式重写以下文字，保持相同的意思和信息量。要求：
1. 改变句式结构
2. 使用同义词替换
3. 调整语气和表达角度
4. 保持专业性和准确性
5. 长度与原文基本相当

原文：
{text}

请直接返回重写后的文字，不要添加任何解释或说明。`
  }
}

/**
 * 重写文本
 * @param {string} text - 原始文本
 * @param {string} mode - 重写模式: 'simplify' | 'expand' | 'rephrase'
 * @param {Object} config - API配置
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<string>} 重写后的文本
 */
export async function rewriteText(text, mode, config, signal = null) {
  if (!text || !text.trim()) {
    throw new Error('文本内容不能为空')
  }

  const modeConfig = REWRITE_MODES[mode]
  if (!modeConfig) {
    throw new Error(`无效的重写模式: ${mode}`)
  }

  // 生成提示词
  const prompt = modeConfig.prompt.replace('{text}', text)

  try {
    // 调用OpenAI API
    const result = await callOpenAI({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.textModel,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的文本编辑专家，擅长优化和改写各类文本内容。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, signal)

    // 清理返回结果
    let rewrittenText = result.trim()

    // 移除可能的引号包裹
    if ((rewrittenText.startsWith('"') && rewrittenText.endsWith('"')) ||
        (rewrittenText.startsWith("'") && rewrittenText.endsWith("'"))) {
      rewrittenText = rewrittenText.slice(1, -1)
    }

    return rewrittenText
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    console.error(`${modeConfig.name}失败:`, error)
    throw new Error(`${modeConfig.name}失败: ${error.message}`)
  }
}

/**
 * 批量重写多个文本
 * @param {Array<{text: string, mode: string}>} items - 待重写的文本列表
 * @param {Object} config - API配置
 * @param {Function} onProgress - 进度回调
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<Array<string>>} 重写后的文本列表
 */
export async function rewriteBatch(items, config, onProgress = null, signal = null) {
  const results = []

  for (let i = 0; i < items.length; i++) {
    if (signal?.aborted) {
      throw new Error('批量重写已取消')
    }

    const { text, mode } = items[i]

    try {
      const rewritten = await rewriteText(text, mode, config, signal)
      results.push(rewritten)

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: items.length,
          text: rewritten
        })
      }
    } catch (error) {
      console.error(`第 ${i + 1} 项重写失败:`, error)
      results.push(text) // 失败时返回原文
    }
  }

  return results
}

/**
 * 智能重写 - 根据文本特征自动选择最佳重写模式
 * @param {string} text - 原始文本
 * @param {Object} config - API配置
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<{mode: string, text: string}>} 重写模式和结果
 */
export async function smartRewrite(text, config, signal = null) {
  const textLength = text.trim().length

  let selectedMode
  if (textLength > 200) {
    // 长文本优先精简
    selectedMode = 'simplify'
  } else if (textLength < 50) {
    // 短文本优先扩写
    selectedMode = 'expand'
  } else {
    // 中等长度换个说法
    selectedMode = 'rephrase'
  }

  const rewritten = await rewriteText(text, selectedMode, config, signal)

  return {
    mode: selectedMode,
    text: rewritten
  }
}

/**
 * 获取所有重写模式配置
 * @returns {Object} 重写模式配置对象
 */
export function getRewriteModes() {
  return REWRITE_MODES
}

/**
 * 获取重写模式信息
 * @param {string} mode - 模式标识
 * @returns {Object} 模式配置
 */
export function getRewriteMode(mode) {
  return REWRITE_MODES[mode]
}
