/**
 * 验证 OpenAI API 密钥是否有效
 */
export async function validateAPIKey(baseUrl, apiKey, textModel) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API 密钥不能为空')
  }

  if (!baseUrl || !baseUrl.trim()) {
    throw new Error('Base URL 不能为空')
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: textModel || 'gpt-4',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      }),
      signal: AbortSignal.timeout(10000) // 10秒超时
    })

    if (response.status === 401) {
      throw new Error('API 密钥无效，请检查密钥是否正确')
    }

    if (response.status === 404) {
      throw new Error('Base URL 或模型不存在，请检查配置')
    }

    if (response.status === 429) {
      // 速率限制也说明密钥有效
      return { valid: true, message: 'API 密钥有效（已达速率限制）' }
    }

    if (!response.ok && response.status !== 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `验证失败 (${response.status})`)
    }

    return { valid: true, message: 'API 密钥验证成功' }
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      throw new Error('验证超时，请检查网络连接和 Base URL')
    }
    throw err
  }
}
