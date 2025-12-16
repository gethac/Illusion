/**
 * AI自定义排版生成器
 * 根据幻灯片内容智能生成全新的自定义布局方案
 */

import { createChatCompletion } from './openai.js';

/**
 * 生成AI自定义排版方案
 * @param {Object} slideData - 幻灯片数据
 * @param {Object} config - API配置
 * @returns {Promise<Object>} 自定义排版方案
 */
export async function generateCustomLayout(slideData, config) {
    const { title, content, items, images, imgData } = slideData;
    const imageCount = images?.length || (imgData ? 1 : 0);

    const prompt = `你是一个专业的PPT排版设计师。请为以下幻灯片内容设计一个全新的自定义排版方案。

**幻灯片信息：**
- 标题: ${title || '无'}
- 内容长度: ${content?.length || 0}字
- 内容: ${content || '无'}
- 列表项数量: ${items?.length || 0}
- 列表项: ${items?.join('; ') || '无'}
- 图片数量: ${imageCount}

**画布尺寸 - 非常重要：**
- 宽度: 960px (可用范围: 40-920)
- 高度: 540px (可用范围: 40-500)
- 所有元素必须在可用范围内，留出边距

**设计原则：**
1. **避免重叠**：确保所有元素之间有足够的间距，不要重叠
2. **视觉层次**：标题最突出(顶部或居中)，内容和列表次之
3. **左右分栏**：如果有图片，建议使用左文右图或上文下图布局
4. **留白**：保持适当的留白，不要填满整个画布
5. **阅读顺序**：从上到下，从左到右

**布局建议：**
- 标题：通常放在顶部，x=60-120, y=40-80, width=600-800
- 内容/列表：如果有图片，占据画布左侧或顶部2/3，width不超过500
- 图片：如果有，放在右侧或底部，x=500-600开始，width=300-350
- 装饰线：放在标题下方或作为分隔，width=100-200

**请设计以下元素的布局：**

1. **标题区域**（必需）
   - x: 横坐标 (建议60-120)
   - y: 纵坐标 (建议40-80)
   - width: 宽度 (建议600-800)
   - fontSize: 字体大小 (28-40)
   - align: 对齐方式 (left/center)

2. **内容区域**（如果有内容）
   - x: 横坐标 (建议60-120)
   - y: 纵坐标 (在标题下方，建议120-150)
   - width: 宽度 (如果有图片建议400-500，无图片600-800)
   - height: 高度 (建议100-200，根据内容长度调整)
   - fontSize: 字体大小 (14-16)
   - lineHeight: 行高倍数 (1.6)

3. **列表区域**（如果有列表项）
   - x: 横坐标 (建议60-120)
   - y: 纵坐标 (在内容下方，建议250-300)
   - width: 宽度 (如果有图片建议400-500，无图片600-800)
   - itemHeight: 每项高度 (30-40)
   - fontSize: 字体大小 (14-16)
   - style: 列表样式 (bullet)
   - columns: 列数 (1)

4. **图片区域**（如果有图片）
   - x: 横坐标 (建议550-600，在右侧)
   - y: 纵坐标 (建议120-150)
   - width: 宽度 (建议300-350)
   - height: 高度 (建议300-350)
   - borderRadius: 圆角 (8-12)
   - shadow: 是否添加阴影 (true)

5. **装饰元素**（可选，1-2个即可）
   - type: line (推荐使用线条)
   - x: 横坐标
   - y: 纵坐标 (建议在标题下方，y=标题y+标题字号+10)
   - width: 宽度 (120-180)
   - height: 高度 (2-3)
   - color: "accent"

请返回JSON格式（不要有其他文字）：
{
  "layoutName": "自定义布局名称（2-4个字，如"中心聚焦"、"左右分栏"）",
  "description": "布局特点描述（1句话）",
  "elements": {
    "title": {
      "x": 数值,
      "y": 数值,
      "width": 数值,
      "fontSize": 数值,
      "align": "left/center/right"
    },
    "content": {
      "x": 数值,
      "y": 数值,
      "width": 数值,
      "height": 数值,
      "fontSize": 数值,
      "lineHeight": 数值
    },
    "list": {
      "x": 数值,
      "y": 数值,
      "width": 数值,
      "itemHeight": 数值,
      "fontSize": 数值,
      "style": "bullet/number/icon",
      "columns": 数值
    },
    "images": [
      {
        "x": 数值,
        "y": 数值,
        "width": 数值,
        "height": 数值,
        "borderRadius": 数值,
        "shadow": boolean
      }
    ],
    "decorations": [
      {
        "type": "line/circle/rect",
        "x": 数值,
        "y": 数值,
        "width": 数值,
        "height": 数值,
        "color": "primary/accent"
      }
    ]
  }
}

**设计建议：**
- 标题通常放在顶部或左上，但也可以居中或创新位置
- 图片可以作为背景、边栏、或与文字交错
- 装饰元素用于引导视线或分隔区域
- 考虑"黄金分割"和"三分法则"
- 为重要信息留出足够的"呼吸空间"`;

    const messages = [{ role: 'user', content: prompt }];

    try {
        const response = await createChatCompletion(config, messages, 0.7); // 使用较高温度增加创意性

        // 解析JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const customLayout = JSON.parse(jsonMatch[0]);

            // 验证必需字段
            if (!customLayout.layoutName || !customLayout.elements) {
                throw new Error('自定义布局格式不完整');
            }

            // 添加元数据
            customLayout.isCustom = true;
            customLayout.createdAt = new Date().toISOString();

            return {
                success: true,
                layout: customLayout
            };
        } else {
            throw new Error('无法解析AI返回的布局方案');
        }
    } catch (error) {
        console.error('AI自定义排版生成失败:', error);

        // 返回后备的自动布局
        return {
            success: false,
            error: error.message,
            layout: generateFallbackLayout(slideData)
        };
    }
}

/**
 * 生成后备布局（当AI失败时使用）
 * @param {Object} slideData - 幻灯片数据
 * @returns {Object} 后备布局方案
 */
function generateFallbackLayout(slideData) {
    const { content, items, images, imgData } = slideData;
    const imageCount = images?.length || (imgData ? 1 : 0);
    const hasItems = items && items.length > 0;

    // 基础经典布局
    const layout = {
        layoutName: "经典分栏",
        description: "传统的左右分栏布局，平衡文字与图片",
        isCustom: true,
        elements: {
            title: {
                x: 80,
                y: 50,
                width: 800,
                fontSize: 36,
                align: "left"
            },
            content: {
                x: 80,
                y: 140,
                width: imageCount > 0 ? 450 : 800,
                height: 120,
                fontSize: 16,
                lineHeight: 1.6
            },
            list: hasItems ? {
                x: 80,
                y: 280,
                width: imageCount > 0 ? 450 : 800,
                itemHeight: 40,
                fontSize: 15,
                style: "bullet",
                columns: 1
            } : null,
            images: imageCount > 0 ? [{
                x: 580,
                y: 140,
                width: 300,
                height: 300,
                borderRadius: 8,
                shadow: true
            }] : [],
            decorations: [
                {
                    type: "line",
                    x: 80,
                    y: 120,
                    width: 150,
                    height: 2,
                    color: "accent"
                }
            ]
        }
    };

    return layout;
}

/**
 * 批量生成所有幻灯片的自定义布局
 * @param {Array} slides - 幻灯片数组
 * @param {Object} config - API配置
 * @returns {Promise<Array>} 布局方案数组
 */
export async function generateAllCustomLayouts(slides, config) {
    const layouts = [];

    for (let i = 0; i < slides.length; i++) {
        try {
            const result = await generateCustomLayout(slides[i], config);
            layouts.push({
                index: i,
                ...result
            });

            // 添加延迟避免API限流
            if (i < slides.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`生成第${i + 1}页自定义布局失败:`, error);
            layouts.push({
                index: i,
                success: false,
                error: error.message
            });
        }
    }

    return layouts;
}
