/**
 * AI主题配色生成器
 * 根据PPT主题和内容生成沉浸式界面配色方案
 */

import { createChatCompletion } from './openai.js';
import { PPT_THEMES } from '../config/themes.js';

/**
 * 生成沉浸式界面配色方案
 * @param {string} topic - PPT主题
 * @param {string} additionalInfo - 补充信息
 * @param {string} selectedThemeKey - 当前选择的主题key
 * @param {Object} config - API配置
 * @returns {Promise<Object>} 配色方案对象
 */
export async function generateImmersiveTheme(topic, additionalInfo, selectedThemeKey, config) {
    // 获取当前PPT主题的实际颜色
    const pptTheme = PPT_THEMES[selectedThemeKey] || PPT_THEMES['business'];

    const prompt = `你是一个专业的UI设计师和配色专家。请为以下PPT生成一套沉浸式预览界面的配色方案。

PPT主题: ${topic}
补充信息: ${additionalInfo || '无'}
当前PPT风格: ${pptTheme.name} (${selectedThemeKey})

**PPT主题当前配色（必须参考）:**
- 背景色: ${pptTheme.colors.bg}
- 文字颜色: ${pptTheme.colors.text}
- 强调色: ${pptTheme.colors.accent}
- 边框色: ${pptTheme.colors.border}
- 预览背景: ${pptTheme.previewBg}

要求：
1. **必须基于上述PPT主题颜色生成配色**，保持视觉一致性
2. 可以使用PPT主题的强调色作为沉浸式界面的主色或强调色
3. 背景色应该比PPT背景更深/更暗，营造沉浸感
4. 文字颜色必须与背景色形成足够对比度（至少4.5:1）
5. 可以使用PPT颜色的深色或浅色变体，但要保持色相一致
6. 如果PPT是浅色系，沉浸式界面用深色背景；如果PPT是深色系，继续用深色但调整对比度

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

配色建议（请严格遵循PPT主题色）:
- 对于 "${pptTheme.name}" 主题，必须使用 ${pptTheme.colors.accent} 作为核心强调色
- primary/secondary 应该是 ${pptTheme.colors.accent} 的变体（深色或浅色版本）
- 背景渐变应该使用与 ${pptTheme.colors.bg} 和 ${pptTheme.colors.accent} 相近的色系
- 文字颜色应该与PPT文字色 ${pptTheme.colors.text} 相呼应
- 确保所有文字在背景上清晰可读

示例色彩策略：
- 如果强调色是蓝色(${pptTheme.colors.accent})，沉浸式背景用深蓝渐变，主色用该蓝色
- 如果强调色是金色，沉浸式主题应该保持金色系，配合深色背景
- 保持色温一致：冷色系配冷色，暖色系配暖色

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
