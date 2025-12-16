/**
 * PPT 主题配置模块
 * 包含所有可用的 PPT 风格模板
 */

export const PPT_THEMES = {
    'business': {
        name: "商务精英",
        previewBg: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        colors: { bg: "#ffffff", text: "#333333", accent: "#0056b3", border: "#d1d5db" },
        fonts: { header: "'Montserrat', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "corporate office, minimalist, bright, clean, professional",
        pptBg: "FFFFFF", pptFont: "Arial"
    },
    'cyberpunk': {
        name: "赛博幻境",
        previewBg: "radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)",
        colors: { bg: "#050505", text: "#e0e0e0", accent: "#d4b778", border: "#333333" },
        fonts: { header: "'Cinzel', serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "cyberpunk, neon lights, futuristic, dark background, data visualization",
        pptBg: "000000", pptFont: "Arial Black"
    },
    'minimal': {
        name: "极简主义",
        previewBg: "#fdfbf7",
        colors: { bg: "#fdfbf7", text: "#1a1a1a", accent: "#555555", border: "#e5e5e5" },
        fonts: { header: "'Noto Sans SC', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "minimalist art, zen, line drawing, simple, white background",
        pptBg: "FDFBF7", pptFont: "Calibri"
    },
    'creative': {
        name: "灵感极光",
        previewBg: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
        colors: { bg: "#fff0f5", text: "#2d3748", accent: "#ff6b6b", border: "rgba(255,107,107,0.2)" },
        fonts: { header: "'Playfair Display', serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "abstract fluid art, colorful, vibrant, 3d render, creative",
        pptBg: "FFF0F5", pptFont: "Georgia"
    },
    'tech': {
        name: "科技未来",
        previewBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        colors: { bg: "#1a1a2e", text: "#f1f1f1", accent: "#667eea", border: "#4a4a6a" },
        fonts: { header: "'Roboto', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "futuristic technology, digital interface, holographic display, blue purple theme, innovation",
        pptBg: "1A1A2E", pptFont: "Arial"
    },
    'academic': {
        name: "学术论文",
        previewBg: "linear-gradient(to bottom, #e8eaf6 0%, #c5cae9 100%)",
        colors: { bg: "#ffffff", text: "#1a237e", accent: "#3f51b5", border: "#9fa8da" },
        fonts: { header: "'Merriweather', serif", body: "'Noto Serif SC', serif" },
        imagePrompt: "academic research, library, books, scholarly, professional diagram, clean background",
        pptBg: "FFFFFF", pptFont: "Times New Roman"
    },
    'nature': {
        name: "自然清新",
        previewBg: "linear-gradient(135deg, #e0f7e0 0%, #a8d8a8 100%)",
        colors: { bg: "#f1f8f4", text: "#2d5f3f", accent: "#4caf50", border: "#81c784" },
        fonts: { header: "'Nunito', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "nature scenery, green leaves, fresh air, sustainable, eco-friendly, natural light",
        pptBg: "F1F8F4", pptFont: "Verdana"
    },
    'vintage': {
        name: "复古怀旧",
        previewBg: "radial-gradient(circle, #f4e8d0 0%, #d4a574 100%)",
        colors: { bg: "#f5f0e8", text: "#4a3f35", accent: "#8b6f47", border: "#c9b896" },
        fonts: { header: "'Libre Baskerville', serif", body: "'Noto Serif SC', serif" },
        imagePrompt: "vintage style, retro design, old paper texture, sepia tone, classic elegance",
        pptBg: "F5F0E8", pptFont: "Georgia"
    },
    'gradient': {
        name: "渐变梦幻",
        previewBg: "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)",
        colors: { bg: "#ffffff", text: "#0d3b52", accent: "#13547a", border: "rgba(19,84,122,0.3)" },
        fonts: { header: "'Poppins', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "dreamy gradient background, soft colors, ethereal atmosphere, modern abstract",
        pptBg: "FFFFFF", pptFont: "Calibri"
    },
    'corporate': {
        name: "深蓝商务",
        previewBg: "linear-gradient(180deg, #003366 0%, #004d99 100%)",
        colors: { bg: "#003366", text: "#ffffff", accent: "#66b3ff", border: "#004d99" },
        fonts: { header: "'Montserrat', sans-serif", body: "'Noto Sans SC', sans-serif" },
        imagePrompt: "corporate business, professional office, blue theme, executive, formal presentation",
        pptBg: "003366", pptFont: "Arial"
    }
};

/**
 * 获取主题配置
 * @param {string} key - 主题 key
 * @returns {Object} 主题配置对象
 */
export const getTheme = (key) => PPT_THEMES[key] || PPT_THEMES['business'];
