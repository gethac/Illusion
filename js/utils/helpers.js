/**
 * 通用工具函数模块
 */

/**
 * 清理十六进制颜色代码
 * @param {string} color - 带#的十六进制颜色
 * @returns {string} 不带#的十六进制颜色
 */
export function cleanHex(color) {
    return color ? color.replace('#', '') : '000000';
}

/**
 * 安全解析 JSON 字符串
 * 支持去除 Markdown 代码块标记
 * @param {string} str - JSON 字符串
 * @returns {Object|Array|null} 解析后的对象
 */
export function parseJsonSafe(str) {
    if (!str) return null;

    // 去除 Markdown 代码块标记
    const cleaned = str.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        // 尝试提取 JSON 数组或对象
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        const objectMatch = cleaned.match(/\{[\s\S]*\}/);

        if (arrayMatch) {
            try {
                return JSON.parse(arrayMatch[0]);
            } catch {}
        }

        if (objectMatch) {
            try {
                return JSON.parse(objectMatch[0]);
            } catch {}
        }

        return null;
    }
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
