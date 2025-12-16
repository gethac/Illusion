/**
 * 文档解析工具模块
 * 支持 .md、.txt、.docx 格式文件解析
 */

import mammoth from 'mammoth'

/**
 * 解析 Markdown 文件
 * @param {string} text - Markdown文本
 * @returns {Object} 解析结果 { topic, content }
 */
export function parseMarkdown(text) {
  // 提取标题作为主题
  const titleMatch = text.match(/^#\s+(.+)$/m)
  const topic = titleMatch ? titleMatch[1].trim() : ''

  // 移除标题，保留其余内容
  let content = text
  if (titleMatch) {
    content = text.replace(/^#\s+.+$/m, '').trim()
  }

  // 移除 Markdown 语法标记，保留纯文本
  content = content
    .replace(/^#{2,6}\s+/gm, '') // 移除2-6级标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1') // 移除加粗
    .replace(/\*(.+?)\*/g, '$1') // 移除斜体
    .replace(/`(.+?)`/g, '$1') // 移除行内代码
    .replace(/^```[\s\S]*?^```/gm, '') // 移除代码块
    .replace(/^\*\s+/gm, '• ') // 转换列表项
    .replace(/^-\s+/gm, '• ') // 转换列表项
    .replace(/^\d+\.\s+/gm, '') // 移除有序列表编号
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .trim()

  return {
    topic,
    content,
    wordCount: content.length
  }
}

/**
 * 解析纯文本文件
 * @param {string} text - 纯文本
 * @returns {Object} 解析结果 { topic, content }
 */
export function parseText(text) {
  const lines = text.trim().split('\n').filter(line => line.trim())

  // 第一行作为主题（如果不超过50字）
  const firstLine = lines[0]?.trim() || ''
  const topic = firstLine.length <= 50 ? firstLine : ''

  // 如果第一行被用作主题，剩余内容从第二行开始
  const content = topic ? lines.slice(1).join('\n').trim() : text.trim()

  return {
    topic,
    content,
    wordCount: content.length
  }
}

/**
 * 解析 DOCX 文件
 * @param {ArrayBuffer} arrayBuffer - DOCX文件的ArrayBuffer
 * @returns {Promise<Object>} 解析结果 { topic, content }
 */
export async function parseDocx(arrayBuffer) {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer })
    const text = result.value.trim()

    // 使用与纯文本相同的逻辑
    return parseText(text)
  } catch (error) {
    console.error('DOCX解析失败:', error)
    throw new Error('DOCX文件解析失败，请确保文件格式正确')
  }
}

/**
 * 根据文件类型自动选择解析器
 * @param {File} file - 上传的文件对象
 * @returns {Promise<Object>} 解析结果 { topic, content, fileName, fileType }
 */
export async function parseDocument(file) {
  const fileName = file.name
  const fileType = file.name.split('.').pop().toLowerCase()

  try {
    let result

    switch (fileType) {
      case 'md':
      case 'markdown': {
        const text = await readFileAsText(file)
        result = parseMarkdown(text)
        break
      }

      case 'txt': {
        const text = await readFileAsText(file)
        result = parseText(text)
        break
      }

      case 'docx': {
        const arrayBuffer = await readFileAsArrayBuffer(file)
        result = await parseDocx(arrayBuffer)
        break
      }

      default:
        throw new Error(`不支持的文件格式: .${fileType}`)
    }

    return {
      ...result,
      fileName,
      fileType
    }
  } catch (error) {
    console.error('文件解析失败:', error)
    throw error
  }
}

/**
 * 读取文件为文本
 * @param {File} file - 文件对象
 * @returns {Promise<string>}
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('文件读取失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 读取文件为ArrayBuffer
 * @param {File} file - 文件对象
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 验证文件大小（最大5MB）
 * @param {File} file - 文件对象
 * @returns {boolean}
 */
export function validateFileSize(file, maxSizeMB = 5) {
  const maxSize = maxSizeMB * 1024 * 1024 // 转换为字节
  return file.size <= maxSize
}

/**
 * 验证文件类型
 * @param {File} file - 文件对象
 * @returns {boolean}
 */
export function validateFileType(file) {
  const allowedTypes = ['md', 'markdown', 'txt', 'docx']
  const fileType = file.name.split('.').pop().toLowerCase()
  return allowedTypes.includes(fileType)
}
