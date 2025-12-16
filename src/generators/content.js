/**
 * PPT 内容生成器模块 - 增强版
 * 支持演讲者备注生成
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
    const prompt = `你是一个专业的 PPT 内容生成器和版式设计师。请为以下幻灯片生成详细、结构化的内容，并智能选择最佳布局。

PPT 主题: ${topic}
本页标题: ${slideOutline.title}
本页说明: ${slideOutline.desc}

**重要**: 请根据内容特点智能选择最合适的布局，不要总是使用 classic 布局。尽可能使用多样化的布局类型来提升演示效果。

布局选择指南：

1. **big-data** (大数据布局) - **优先考虑**
   - 当内容包含关键数据指标时使用（如增长率、市场份额、用户数等）
   - 适合: "89%增长"、"1.2亿用户"、"+35%提升"、"TOP 1"
   - 视觉冲击力强，适合强调成果

2. **chart** (图表布局) - **优先考虑**
   - 当需要展示数据趋势、对比、分布时使用
   - 必须提供真实的 chartData 和 chartType
   - 适合: 季度营收、用户增长、市场占比、性能对比
   - chartType 选择: bar(对比)、pie(占比)、line(趋势)、area(累积)

3. **timeline** (时间线布局)
   - 当内容涉及流程、步骤、发展历程时使用
   - 适合: 产品路线图、项目阶段、历史发展、实施步骤
   - 包含 3-5 个时间节点

4. **comparison** (对比布局)
   - 当需要对比两个方案、产品或观点时使用
   - 适合: 方案选择、优劣分析、新旧对比
   - 左右各 3-4 个要点

5. **image-full** (全图布局) - **新增**
   - 适合视觉冲击型内容，图片占据大部分空间
   - 文字简洁，图片为主
   - 适合: 产品展示、场景介绍、视觉设计

6. **image-grid** (多图网格布局) - **新增**
   - 需要展示多个相关图片时使用
   - 适合: 产品系列、案例展示、多场景对比
   - 需配置 imageCount (2-4张)

7. **classic** (经典布局) - **仅作为后备选择**
   - 只在以上布局都不适合时使用
   - 包含段落文字 + 3-5 个要点列表

返回格式示例：
{
  "layout": "chart",
  "content": "详细的段落描述，200-300字，包含具体数据、案例或论据。使用专业术语，逻辑清晰。",
  "items": [
    "要点1: 包含具体数据或案例",
    "要点2: 突出关键信息",
    "要点3: 强调优势或影响",
    "要点4: 提供实际应用场景"
  ],
  "speakerNotes": "这是演讲者备注，约200字的演讲稿。包含：1）如何引入本页话题 2）需要强调的关键数据或观点 3）可以举的例子或类比 4）如何过渡到下一页。语气专业但不失亲和力。",
  "imageCount": 1,
  "imageKeywords": ["technology", "innovation", "digital transformation"],
  "dataValue": "89%",
  "dataLabel": "用户满意度",
  "leftTitle": "方案A",
  "rightTitle": "方案B",
  "chartType": "bar",
  "chartData": [
    {
      "name": "季度营收",
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "values": [65, 78, 82, 95]
    }
  ]
}

字段说明：
- **layout**: 必填，根据内容选择最合适的布局类型
- **content**: 必填，200-300字的详细描述
- **items**: 可选，要点列表（classic/timeline/comparison 布局需要）
- **speakerNotes**: 必填，给演讲者的演讲稿（200字左右）
- **imageCount**: 可选，需要的图片数量（1-4张），image-grid 布局时必须指定 2-4
- **imageKeywords**: 可选，图片搜索关键词数组（英文），帮助生成更准确的配图
- **dataValue**: big-data 布局必填
- **dataLabel**: big-data 布局必填
- **leftTitle/rightTitle**: comparison 布局必填
- **chartType/chartData**: chart 布局必填

图表布局的 chartData 要求：
- **chartType**: 必须是 "bar"(柱状图)、"pie"(饼图)、"line"(折线图)、"area"(面积图) 之一
- **chartData**: 数组格式，包含一个或多个数据系列对象
  - name: 数据系列名称（如"季度营收"、"用户增长"）
  - labels: 横轴标签数组（如["Q1", "Q2", "Q3", "Q4"]或["产品A", "产品B", "产品C"]）
  - values: 对应的数值数组（如[65, 78, 82, 95]），必须与labels长度一致
- 数据必须真实可信，符合主题内容

要求：
1. content 必须详实，包含具体数据、百分比、案例等
2. items 每项都应该是完整的陈述句，不只是标题
3. 如果选择 big-data 布局，必须提供真实合理的 dataValue 和 dataLabel
4. **如果选择 chart 布局，必须提供：**
   - chartType: "bar"(柱状图-适合对比)、"pie"(饼图-适合占比)、"line"(折线图-适合趋势)、"area"(面积图-适合累积)
   - chartData: 包含真实数据的数组，数据要有逻辑性和可信度
   - 数据标签(labels)要清晰明确，数值(values)要符合实际业务场景
5. 内容要符合"${slideOutline.title}"的主题，与"${slideOutline.desc}"的描述一致
6. 数据要真实可信，避免空洞内容
7. **重要**: 必须提供 speakerNotes 字段，这是给演讲者的200字左右的演讲稿，帮助演讲者更好地讲解这一页。包含：
   - 如何开场引入这一页
   - 需要强调的关键点（特别是图表数据的关键洞察）
   - 可以补充的数据或例子
   - 如何与观众互动
   - 如何过渡到下一页

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
        speakerNotes: "本页内容生成失败，请重新生成。",
        imageCount: 1,
        imageKeywords: [],
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
                speakerNotes: "本页内容生成失败，请重新生成。",
                imgLoading: false,
                isRegenerating: false
            });
        }
    }

    return results;
}
