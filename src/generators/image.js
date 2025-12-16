/**
 * AI 配图生成器模块 - 双源支持版本
 * 支持 AI生成 和 网络搜图 两种方式
 */

import { createChatCompletion, createImageGeneration } from '../services/openai.js';
import {
  generateSearchKeywords,
  searchWebImages,
  imageUrlToBase64Browser,
  hasApiKey
} from '../services/imageSearch.js';

/**
 * 为幻灯片生成配图（AI生成方式）
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Object} theme - 当前主题配置
 * @param {Object} config - API 配置
 * @returns {Promise<string>} base64 格式的图片数据
 */
export async function generateSlideImageAI(slideTitle, slideContent, theme, config) {
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
 * 为幻灯片搜索网络图片
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Object} config - API 配置
 * @param {string} source - 图片源 ('auto', 'unsplash', 'pexels')
 * @returns {Promise<Array>} 图片列表（包含URL和缩略图）
 */
export async function searchSlideImages(slideTitle, slideContent, config, source = 'auto') {
    // 生成搜索关键词
    const keywords = await generateSearchKeywords(slideTitle, slideContent, config);
    console.log('生成的搜索关键词:', keywords);

    // 准备API密钥
    const apiKeys = {
        unsplashApiKey: config.unsplashApiKey,
        pexelsApiKey: config.pexelsApiKey
    };

    // 搜索图片
    const images = await searchWebImages(keywords, apiKeys, source);
    return images;
}

/**
 * 下载网络图片并转换为Base64
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<string>} base64 格式的图片数据
 */
export async function downloadImageAsBase64(imageUrl) {
    return await imageUrlToBase64Browser(imageUrl);
}

/**
 * 统一的配图生成接口（支持双源）
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Object} theme - 当前主题配置
 * @param {Object} config - API 配置
 * @param {string} imageSource - 图片源 ('ai', 'web')
 * @returns {Promise<Object>} { type, data } - type: 'base64' | 'url', data: 图片数据
 */
export async function generateSlideImage(slideTitle, slideContent, theme, config, imageSource = 'ai') {
    if (imageSource === 'ai') {
        // AI生成模式：直接返回base64
        const base64 = await generateSlideImageAI(slideTitle, slideContent, theme, config);
        return {
            type: 'base64',
            data: base64
        };
    } else if (imageSource === 'web') {
        // 网络搜图模式：返回图片列表供用户选择
        const images = await searchSlideImages(slideTitle, slideContent, config);
        if (images.length === 0) {
            throw new Error('未找到相关图片，请尝试AI生成模式');
        }
        // 返回第一张图片的URL
        return {
            type: 'url',
            data: images[0].url,
            images: images // 返回所有图片供选择
        };
    } else {
        throw new Error(`不支持的图片源: ${imageSource}`);
    }
}

/**
 * 批量生成多张图片（用于多图布局）
 * @param {string} slideTitle - 幻灯片标题
 * @param {string} slideContent - 幻灯片内容
 * @param {Array<string>} imageKeywords - 每张图片的关键词数组
 * @param {Object} theme - 当前主题配置
 * @param {Object} config - API 配置
 * @param {string} imageSource - 图片源 ('ai', 'web')
 * @param {number} count - 需要生成的图片数量
 * @param {Function} onProgress - 进度回调函数 (current, total, success, failed)
 * @returns {Promise<Object>} { images: Array<string>, failedIndexes: Array<number> }
 */
export async function generateMultipleImages(slideTitle, slideContent, imageKeywords, theme, config, imageSource = 'ai', count = 2, onProgress = null) {
    const images = [];
    const failedIndexes = [];
    let successCount = 0;

    for (let i = 0; i < count; i++) {
        try {
            // 使用不同的关键词或内容片段
            const keywords = imageKeywords && imageKeywords[i] ? imageKeywords[i] : slideContent;
            const promptSuffix = count > 1 ? ` (视角 ${i + 1})` : '';

            if (imageSource === 'ai') {
                const base64 = await generateSlideImageAI(
                    slideTitle + promptSuffix,
                    keywords,
                    theme,
                    config
                );
                images.push(base64);
                successCount++;
            } else if (imageSource === 'web') {
                const searchResults = await searchSlideImages(slideTitle, keywords, config);
                if (searchResults.length > i) {
                    // 下载并转换为 base64
                    const base64 = await downloadImageAsBase64(searchResults[i].url);
                    images.push(base64);
                    successCount++;
                } else {
                    // 没有足够的图片
                    console.warn(`未找到第 ${i + 1} 张图片`);
                    images.push(null);
                    failedIndexes.push(i);
                }
            }

            // 调用进度回调
            if (onProgress) {
                onProgress(i + 1, count, successCount, failedIndexes.length);
            }
        } catch (error) {
            console.error(`生成第 ${i + 1} 张图片失败:`, error);
            images.push(null);
            failedIndexes.push(i);

            // 调用进度回调
            if (onProgress) {
                onProgress(i + 1, count, successCount, failedIndexes.length);
            }
        }
    }

    return {
        images: images.filter(img => img !== null), // 过滤掉失败的图片
        failedIndexes, // 返回失败的索引
        successCount,
        totalCount: count
    };
}

/**
 * 检查图片源是否可用
 * @param {string} source - 图片源
 * @param {Object} config - API配置
 * @returns {boolean}
 */
export function isImageSourceAvailable(source, config) {
    if (source === 'ai') {
        return true; // AI生成总是可用（需要API Key）
    }
    if (source === 'web') {
        const apiKeys = {
            unsplashApiKey: config?.unsplashApiKey,
            pexelsApiKey: config?.pexelsApiKey
        };
        return hasApiKey(apiKeys, 'unsplash') || hasApiKey(apiKeys, 'pexels');
    }
    return false;
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
