/**
 * PPT 内容生成器模块
 */

import { createChatCompletion } from '../services/openai.js';
import { parseJsonSafe } from '../utils/helpers.js';

/**
 * 生成单页 PPT 内容
 * @param {string} topic - PPT 主题
 * @param {Object} slideOutline - 单页大纲 {title, desc}
 * @param {Object} config - API 配置
 * @param {AbortSignal} signal - 用于取消请求的信号
 * @returns {Promise<Object>} 幻灯片内容对象
 */
export async function generateSlideContent(topic, slideOutline, config, signal = null) {
    const prompt = `你是一个专业的 PPT 内容生成器。请为以下幻灯片生成详细、结构化的内容。

PPT 主题: ${topic}
本页标题: ${slideOutline.title}
本页说明: ${slideOutline.desc}

请严格按照 JSON 格式返回，不要包含任何其他文字说明。根据内容特点选择最合适的布局类型：

1. **classic** (经典布局): 适合一般内容介绍，包含段落文字 + 3-5 个要点列表
2. **big-data** (大数据布局): 适合强调某个关键数据指标，如 "89%"、"1.2亿"、"+35%"
3. **timeline** (时间线布局): 适合流程、步骤、发展历程，包含 3-5 个时间节点
4. **comparison** (对比布局): 适合两个方案/产品/观点的对比，左右各 3-4 个要点
5. **chart** (图表布局): 适合数据可视化，需要提供 chartType 和 chartData

返回格式示例：
{
  "layout": "classic",
  "content": "详细的段落描述，200-300字，包含具体数据、案例或论据。使用专业术语，逻辑清晰。",
  "items": [
    "要点1: 包含具体数据或案例",
    "要点2: 突出关键信息",
    "要点3: 强调优势或影响",
    "要点4: 提供实际应用场景"
  ],
  "dataValue": "89%",
  "dataLabel": "用户满意度",
  "leftTitle": "方案A",
  "rightTitle": "方案B",
  "chartType": "bar",
  "chartData": [
    {
      "name": "数据系列",
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "values": [65, 78, 82, 95]
    }
  ]
}

要求：
1. content 必须详实，包含具体数据、百分比、案例等
2. items 每项都应该是完整的陈述句，不只是标题
3. 如果选择 big-data 布局，必须提供真实合理的 dataValue 和 dataLabel
4. 如果选择 chart 布局，必须提供 chartType ("bar"/"pie"/"line"/"area") 和 chartData
5. 内容要符合"${slideOutline.title}"的主题，与"${slideOutline.desc}"的描述一致
6. 数据要真实可信，避免空洞内容

请直接返回 JSON，不要有其他说明文字。`;

    const messages = [{ role: "user", content: prompt }];

    const content = await createChatCompletion(config, messages, 0.7, signal);

    // 健壮解析 JSON
    const parsed = parseJsonSafe(content);

    // 返回默认结构或解析结果
    const defaultData = {
        layout: "classic",
        content: "生成失败",
        items: [],
        dataValue: "",
        dataLabel: "",
        leftTitle: "方案 A",
        rightTitle: "方案 B",
        chartType: "bar",
        chartData: null
    };

    return parsed && typeof parsed === 'object' ? { ...defaultData, ...parsed } : defaultData;
}

/**
 * 批量生成所有幻灯片内容 (串行)
 * @param {string} topic - PPT 主题
 * @param {Array} outlineArray - 大纲数组
 * @param {Object} config - API 配置
 * @param {Function} onProgress - 进度回调 (index, total) => void
 * @returns {Promise<Array>} 所有幻灯片内容数组
 */
export async function generateAllSlides(topic, outlineArray, config, onProgress = null) {
    const results = [];

    for (let i = 0; i < outlineArray.length; i++) {
        try {
            const slideData = await generateSlideContent(topic, outlineArray[i], config);
            results.push({
                ...slideData,
                title: outlineArray[i].title,
                imgLoading: false,
                isRegenerating: false
            });

            if (onProgress) {
                onProgress(i + 1, outlineArray.length);
            }
        } catch (e) {
            console.error(`Failed to generate slide ${i}:`, e);
            results.push({
                layout: "classic",
                title: outlineArray[i].title,
                content: "生成失败，请重试",
                items: [],
                imgLoading: false,
                isRegenerating: false
            });
        }
    }

    return results;
}
