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
 * @param {number} pageCount - 幻灯片页数（可选，AI会根据主题自动确定）
 * @returns {Promise<Array>} 大纲数组 [{title, desc}, ...]
 */
export async function generateOutline(topic, additionalInfo, config, pageCount = null) {
    const systemPrompt = `你是一个专业的PPT内容策划专家。请根据给定的主题和要求，生成一个结构清晰、逻辑连贯的PPT大纲。

**核心要求：**
1. **智能确定章节数量**：根据主题的复杂度和内容量，自动决定最合适的章节数（通常5-12页）
   - 简单主题：5-7页
   - 中等主题：8-10页
   - 复杂主题：10-12页

2. **结构设计原则**：
   - 开场：引入主题、背景介绍（1-2页）
   - 主体：核心内容展开（3-8页）
   - 结尾：总结、展望或行动号召（1-2页）

3. **内容质量**：
   - 标题：简洁有力，5-12字
   - 描述：详细说明该页要点，20-60字，可包含关键数据、案例或方法

4. **格式灵活性**：
   - 如果需要数据展示，在desc中标注"[数据]"
   - 如果需要图表，在desc中标注"[图表]"
   - 如果需要时间线，在desc中标注"[时间线]"
   - 如果需要对比，在desc中标注"[对比]"

**返回格式**：
返回JSON数组，每项包含：
{
  "title": "章节标题",
  "desc": "详细描述，可包含标注"
}

请只返回JSON数组，不要有其他文字。`;

    const userPrompt = `**主题**：${topic}

**补充要求**：${additionalInfo || '无特殊要求，请根据主题内容自由发挥'}

${pageCount ? `**建议页数**：${pageCount}页（可根据实际情况适当调整）` : '**页数**：请根据主题复杂度智能确定最合适的页数（5-12页）'}

请生成大纲JSON数组。`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const content = await createChatCompletion(config, messages, 0.7); // 使用较高温度增加创意性

    // 健壮解析 JSON
    const parsed = parseJsonSafe(content);

    if (Array.isArray(parsed) && parsed.length > 0) {
        // 验证数组长度是否合理（5-15页）
        if (parsed.length < 5) {
            console.warn(`⚠️ 大纲页数过少（${parsed.length}页），可能不够充分`);
        } else if (parsed.length > 15) {
            console.warn(`⚠️ 大纲页数过多（${parsed.length}页），将截取前15页`);
            return parsed.slice(0, 15);
        }

        console.log(`✅ 成功生成大纲，共 ${parsed.length} 页`);
        return parsed;
    }

    // 解析失败时返回默认结构
    console.error('❌ 大纲生成失败，使用默认结构');
    return [{ title: "生成失败", desc: "请重试或检查 API 配置" }];
}
