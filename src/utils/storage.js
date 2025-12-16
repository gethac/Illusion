/**
 * LocalStorage 数据持久化工具模块
 */

const CONFIG_KEY = 'illusion_ppt_config';

/**
 * 从 LocalStorage 加载配置
 * @returns {Object|null} 配置对象或 null
 */
export function loadConfig() {
    try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Failed to load config from localStorage:', e);
        return null;
    }
}

/**
 * 保存配置到 LocalStorage
 * @param {Object} config - 配置对象
 */
export function saveConfig(config) {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save config to localStorage:', e);
    }
}

/**
 * 清除保存的配置
 */
export function clearConfig() {
    try {
        localStorage.removeItem(CONFIG_KEY);
    } catch (e) {
        console.error('Failed to clear config from localStorage:', e);
    }
}
