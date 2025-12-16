/**
 * PPT 大纲生成器模块
 */

import { createChatCompletion } from '../services/openai.js';
import { parseJsonSafe } from '../utils/helpers.js';

/**
 * 生成 PPT 大纲
 * @param {string} topic - PPT 主题
 * @param {string} additionalInfo - 补充信息/要求
 * @param {Object} config - API 配置
 * @param {number} pageCount - 幻灯片页数
 * @returns {Promise<Array>} 大纲数组 [{title, desc}, ...]
 */
export async function generateOutline(topic, additionalInfo, config, pageCount = 8) {
    const systemPrompt = `生成PPT大纲JSON数组(长度${pageCount}): [{"title":"...","desc":"..."}]`;
    const userPrompt = `主题:${topic}\n要求:${additionalInfo}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const content = await createChatCompletion(config, messages);

    // 健壮解析 JSON
    const parsed = parseJsonSafe(content);

    if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
    }

    // 解析失败时返回默认结构
    return [{ title: "生成失败", desc: "请重试或检查 API 配置" }];
}
