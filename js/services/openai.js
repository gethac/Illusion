/**
 * OpenAI API 服务层
 * 统一处理所有 OpenAI API 调用
 */

/**
 * 调用 OpenAI Chat Completions API
 * @param {Object} config - API 配置 { baseUrl, apiKey, textModel }
 * @param {Array} messages - 消息数组
 * @param {number} temperature - 温度参数 (默认 0.7)
 * @param {AbortSignal} signal - 用于取消请求的信号
 * @returns {Promise<string>} API 返回的文本内容
 */
export async function createChatCompletion(config, messages, temperature = 0.7, signal = null) {
    const cleanBaseUrl = config.baseUrl.replace(/\/$/, '');

    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: config.textModel,
            messages,
            temperature
        }),
        signal // 添加 signal 支持请求取消
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'API Error');
    }

    if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid API response');
    }

    return data.choices[0].message.content;
}

/**
 * 调用 OpenAI Image Generation API (DALL-E)
 * @param {Object} config - API 配置 { baseUrl, apiKey, imageModel }
 * @param {string} prompt - 图片描述提示词
 * @param {string} size - 图片尺寸 (默认 "1024x1024")
 * @param {AbortSignal} signal - 用于取消请求的信号
 * @returns {Promise<string>} base64 格式的图片数据
 */
export async function createImageGeneration(config, prompt, size = "1024x1024", signal = null) {
    const cleanBaseUrl = config.baseUrl.replace(/\/$/, '');

    const response = await fetch(`${cleanBaseUrl}/images/generations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: config.imageModel,
            prompt,
            n: 1,
            size,
            response_format: "b64_json"
        }),
        signal // 添加 signal 支持请求取消
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'API Error');
    }

    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
        throw new Error('Invalid image generation response');
    }

    return data.data[0].b64_json;
}
