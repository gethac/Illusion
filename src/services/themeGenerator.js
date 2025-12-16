/**
 * AI主题配色生成器
 * 根据PPT主题和内容生成沉浸式界面配色方案
 */

import { createChatCompletion } from './openai.js';

/**
 * 生成沉浸式界面配色方案
 * @param {string} topic - PPT主题
 * @param {string} additionalInfo - 补充信息
 * @param {string} selectedThemeKey - 当前选择的主题key
 * @param {Object} config - API配置
 * @returns {Promise<Object>} 配色方案对象
 */
export async function generateImmersiveTheme(topic, additionalInfo, selectedThemeKey, config) {
    const prompt = `你是一个专业的UI设计师和配色专家。请为以下PPT生成一套沉浸式预览界面的配色方案。

PPT主题: ${topic}
补充信息: ${additionalInfo || '无'}
当前PPT风格: ${selectedThemeKey}

要求：
1. 配色方案要与PPT主题高度契合，营造沉浸式氛围
2. 考虑色彩心理学，选择能强化主题情感的颜色
3. 确保良好的对比度和可读性
4. 背景色可以是渐变或纯色
5. 强调色要醒目但不刺眼

请返回JSON格式的配色方案，包含以下字段：

{
  "name": "配色方案名称（2-4个字）",
  "description": "简短描述这套配色的设计理念（1句话）",
  "colors": {
    "primary": "#RRGGBB",          // 主色调 - 用于重要元素
    "secondary": "#RRGGBB",        // 辅助色 - 用于次要元素
    "accent": "#RRGGBB",           // 强调色 - 用于高亮、按钮等
    "background": "#RRGGBB或linear-gradient(...)",  // 背景色，可以是渐变
    "surface": "#RRGGBB",          // 表面色 - 卡片、面板背景
    "text": "#RRGGBB",             // 主要文字颜色
    "textSecondary": "#RRGGBB",    // 次要文字颜色
    "border": "#RRGGBB",           // 边框颜色
    "shadow": "rgba(R,G,B,A)"      // 阴影颜色
  },
  "cssVariables": {
    "--immersive-primary": "对应colors.primary",
    "--immersive-secondary": "对应colors.secondary",
    "--immersive-accent": "对应colors.accent",
    "--immersive-bg": "对应colors.background",
    "--immersive-surface": "对应colors.surface",
    "--immersive-text": "对应colors.text",
    "--immersive-text-secondary": "对应colors.textSecondary",
    "--immersive-border": "对应colors.border",
    "--immersive-shadow": "对应colors.shadow"
  }
}

配色建议：
- 商务/学术主题: 使用深蓝、灰色系，专业稳重
- 科技主题: 使用蓝紫、青色系，带有渐变效果
- 创意主题: 使用鲜艳对比色，活力四射
- 自然主题: 使用绿色、棕色系，温暖舒适
- 复古主题: 使用暖色调、低饱和度

直接返回JSON，不要有其他解释文字。`;

    const messages = [{ role: "user", content: prompt }];

    try {
        const response = await createChatCompletion(config, messages, 0.8);

        // 解析JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const theme = JSON.parse(jsonMatch[0]);

            // 验证必需字段
            if (!theme.colors || !theme.cssVariables) {
                throw new Error('配色方案格式不完整');
            }

            return theme;
        } else {
            throw new Error('无法解析AI返回的配色方案');
        }
    } catch (error) {
        console.error('生成配色方案失败:', error);
        // 返回默认配色方案
        return getDefaultImmersiveTheme(selectedThemeKey);
    }
}

/**
 * 获取默认沉浸式配色方案（根据现有主题）
 * @param {string} themeKey - 主题key
 * @returns {Object} 配色方案对象
 */
export function getDefaultImmersiveTheme(themeKey) {
    const themes = {
        'cyberpunk': {
            name: "赛博夜幕",
            description: "深邃的夜色与霓虹光影交织",
            colors: {
                primary: "#d4b778",
                secondary: "#6fffe9",
                accent: "#ff6b9d",
                background: "radial-gradient(circle at center, #0a0e27 0%, #000000 100%)",
                surface: "rgba(26, 26, 46, 0.8)",
                text: "#e0e0e0",
                textSecondary: "#8a9a9a",
                border: "rgba(212, 183, 120, 0.3)",
                shadow: "rgba(212, 183, 120, 0.2)"
            }
        },
        'business': {
            name: "商务蓝调",
            description: "专业稳重的现代商务风格",
            colors: {
                primary: "#0056b3",
                secondary: "#4a90e2",
                accent: "#2ecc71",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                surface: "rgba(255, 255, 255, 0.95)",
                text: "#ffffff",
                textSecondary: "#b0c4de",
                border: "rgba(74, 144, 226, 0.3)",
                shadow: "rgba(0, 86, 179, 0.3)"
            }
        },
        'tech': {
            name: "科技紫光",
            description: "未来感十足的科技氛围",
            colors: {
                primary: "#667eea",
                secondary: "#764ba2",
                accent: "#f093fb",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                surface: "rgba(102, 126, 234, 0.1)",
                text: "#f1f1f1",
                textSecondary: "#a0aec0",
                border: "rgba(102, 126, 234, 0.3)",
                shadow: "rgba(118, 75, 162, 0.4)"
            }
        },
        'nature': {
            name: "自然绿意",
            description: "清新自然的生态美学",
            colors: {
                primary: "#4caf50",
                secondary: "#81c784",
                accent: "#ffd54f",
                background: "linear-gradient(135deg, #1e4620 0%, #2d5f3f 100%)",
                surface: "rgba(76, 175, 80, 0.1)",
                text: "#f1f8f4",
                textSecondary: "#a8d8a8",
                border: "rgba(76, 175, 80, 0.3)",
                shadow: "rgba(76, 175, 80, 0.3)"
            }
        },
        'creative': {
            name: "创意极光",
            description: "充满活力的创意火花",
            colors: {
                primary: "#ff6b6b",
                secondary: "#ff9a9e",
                accent: "#fad0c4",
                background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #feada6 100%)",
                surface: "rgba(255, 255, 255, 0.9)",
                text: "#2d3748",
                textSecondary: "#718096",
                border: "rgba(255, 107, 107, 0.3)",
                shadow: "rgba(255, 107, 107, 0.2)"
            }
        },
        'academic': {
            name: "学术深蓝",
            description: "严谨专注的学术氛围",
            colors: {
                primary: "#3f51b5",
                secondary: "#5c6bc0",
                accent: "#ff9800",
                background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                surface: "rgba(63, 81, 181, 0.1)",
                text: "#e8eaf6",
                textSecondary: "#9fa8da",
                border: "rgba(63, 81, 181, 0.3)",
                shadow: "rgba(63, 81, 181, 0.3)"
            }
        }
    };

    const theme = themes[themeKey] || themes['business'];

    // 生成CSS变量映射
    theme.cssVariables = {
        '--immersive-primary': theme.colors.primary,
        '--immersive-secondary': theme.colors.secondary,
        '--immersive-accent': theme.colors.accent,
        '--immersive-bg': theme.colors.background,
        '--immersive-surface': theme.colors.surface,
        '--immersive-text': theme.colors.text,
        '--immersive-text-secondary': theme.colors.textSecondary,
        '--immersive-border': theme.colors.border,
        '--immersive-shadow': theme.colors.shadow
    };

    return theme;
}

/**
 * 应用配色方案到页面
 * @param {Object} theme - 配色方案对象
 */
export function applyImmersiveTheme(theme) {
    if (!theme || !theme.cssVariables) {
        console.warn('无效的主题配置');
        return;
    }

    const root = document.documentElement;

    // 应用所有CSS变量
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    console.log('✨ 沉浸式主题已应用:', theme.name);
}

/**
 * 移除沉浸式主题，恢复默认样式
 */
export function removeImmersiveTheme() {
    const root = document.documentElement;
    const variables = [
        '--immersive-primary',
        '--immersive-secondary',
        '--immersive-accent',
        '--immersive-bg',
        '--immersive-surface',
        '--immersive-text',
        '--immersive-text-secondary',
        '--immersive-border',
        '--immersive-shadow'
    ];

    variables.forEach(key => {
        root.style.removeProperty(key);
    });
}
