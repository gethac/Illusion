/**
 * AI 配图生成器模块
 */

import { createChatCompletion, createImageGeneration } from '../services/openai.js';

/**
 * 为幻灯片生成配图（两步法：先生成提示词，再生成图片）
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Object} theme - 当前主题配置
 * @param {Object} config - API 配置
 * @returns {Promise<string>} base64 格式的图片数据
 */
export async function generateSlideImage(slideTitle, slideContent, theme, config) {
    // Step 1: 生成图片提示词
    const promptGenerationMessages = [{
        role: "user",
        content: `你是一个专业的 AI 图片提示词生成器。请根据以下幻灯片内容，生成一个详细的英文图片生成提示词（prompt），用于 DALL-E 3 图片生成。

幻灯片标题：${slideTitle}
幻灯片内容：${slideContent}
PPT 主题风格：${theme.name}

要求：
1. 提示词必须用英文，简洁精确
2. 描述图片的主要元素、风格、氛围
3. 适合作为 PPT 配图，专业且美观
4. 与幻灯片内容高度相关
5. 避免包含文字内容
6. 控制在 100 词以内

直接返回提示词，不要包含任何其他解释。`
    }];

    const imagePrompt = await createChatCompletion(config, promptGenerationMessages, 0.7);

    console.log('生成的图片提示词:', imagePrompt.trim());

    // Step 2: 使用生成的提示词生成图片
    return await createImageGeneration(config, imagePrompt.trim(), "1024x1024");
}

/**
 * 分析内容并建议最佳布局（带配图）
 * @param {string} content - 幻灯片内容
 * @param {Array} items - 列表项
 * @param {string} currentLayout - 当前布局
 * @returns {string} 建议的布局类型
 */
export function suggestLayoutWithImage(content, items, currentLayout) {
    const hasItems = items && items.length > 0;
    const hasLongContent = content && content.length > 200;

    // 如果当前是特殊布局（big-data, timeline, comparison, chart），保持不变
    if (['big-data', 'timeline', 'comparison', 'chart'].includes(currentLayout)) {
        return currentLayout;
    }

    // 有列表项且内容不太长 -> classic (文字左，图片右)
    if (hasItems && !hasLongContent) {
        return 'classic';
    }

    // 内容很长但没有列表 -> classic-vertical (上文字，下图片)
    if (hasLongContent && !hasItems) {
        return 'classic-vertical';
    }

    // 内容较短，列表也少 -> classic-center (居中图片)
    if (!hasLongContent && (!hasItems || items.length <= 2)) {
        return 'classic-center';
    }

    // 默认使用经典左右布局
    return 'classic';
}
