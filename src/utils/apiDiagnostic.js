/**
 * API 诊断工具
 * 用于排查 API 调用问题
 */

/**
 * 诊断 API 配置和环境变量
 * @returns {Object} 诊断结果
 */
export function diagnoseApiConfig() {
  const apiUrl = import.meta.env.VITE_COZE_API_URL
  const botId = import.meta.env.VITE_COZE_BOT_ID
  const token = import.meta.env.VITE_COZE_TOKEN

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    config: {
      apiUrl: {
        value: apiUrl || '(未设置)',
        exists: !!apiUrl,
        valid: apiUrl && apiUrl.startsWith('http'),
      },
      botId: {
        value: botId ? `${botId.substring(0, 8)}...` : '(未设置)',
        exists: !!botId,
        valid: !!botId && botId.length > 0,
      },
      token: {
        value: token ? `${token.substring(0, 10)}...` : '(未设置)',
        exists: !!token,
        valid: !!token && token.length > 0,
      },
    },
    issues: [],
    recommendations: [],
  }

  // 检查问题
  if (!diagnostics.config.apiUrl.exists) {
    diagnostics.issues.push('API URL 未设置')
    diagnostics.recommendations.push('请在 .env.development 文件中设置 VITE_COZE_API_URL')
  } else if (!diagnostics.config.apiUrl.valid) {
    diagnostics.issues.push('API URL 格式不正确（应以 http:// 或 https:// 开头）')
  }

  if (!diagnostics.config.botId.exists) {
    diagnostics.issues.push('Bot ID 未设置')
    diagnostics.recommendations.push('请在 .env.development 文件中设置 VITE_COZE_BOT_ID')
  }

  if (!diagnostics.config.token.exists) {
    diagnostics.issues.push('Token 未设置')
    diagnostics.recommendations.push('请在 .env.development 文件中设置 VITE_COZE_TOKEN')
  }

  return diagnostics
}

/**
 * 测试 API 连接
 * @param {string} userInput - 测试输入
 * @param {string} style - 测试风格
 * @returns {Promise<Object>} 测试结果
 */
export async function testApiConnection(userInput = '测试', style = 'Ghibli') {
  const apiUrl = import.meta.env.VITE_COZE_API_URL
  const botId = import.meta.env.VITE_COZE_BOT_ID
  const token = import.meta.env.VITE_COZE_TOKEN

  const testResult = {
    timestamp: new Date().toISOString(),
    success: false,
    error: null,
    response: null,
    requestDetails: {
      url: apiUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token.substring(0, 10)}...` : '(未设置)',
      },
      body: {
        bot_id: botId,
        user_input: userInput,
        style: style,
      },
    },
  }

  if (!apiUrl || !botId || !token) {
    testResult.error = '环境变量未配置完整'
    return testResult
  }

  try {
    // 构建请求体 - 尝试两种可能的格式
    const requestBodyFormat1 = {
      bot_id: botId,
      user_input: userInput.trim(),
      style: style,
    }

    const requestBodyFormat2 = {
      bot_id: botId,
      parameters: {
        user_input: userInput.trim(),
        style: style,
      },
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }

    // 先尝试格式1
    try {
      const response = await fetch(apiUrl, {
        ...requestOptions,
        body: JSON.stringify(requestBodyFormat1),
      })

      testResult.response = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      }

      if (response.ok) {
        const data = await response.json()
        testResult.success = true
        testResult.response.data = data
      } else {
        const errorData = await response.json().catch(() => ({}))
        testResult.error = {
          status: response.status,
          message: errorData.message || errorData.error || response.statusText,
          data: errorData,
        }
      }
    } catch (format1Error) {
      // 如果格式1失败，尝试格式2
      try {
        const response = await fetch(apiUrl, {
          ...requestOptions,
          body: JSON.stringify(requestBodyFormat2),
        })

        testResult.response = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          format: 'format2 (with parameters)',
        }

        if (response.ok) {
          const data = await response.json()
          testResult.success = true
          testResult.response.data = data
          testResult.requestDetails.body = requestBodyFormat2
        } else {
          const errorData = await response.json().catch(() => ({}))
          testResult.error = {
            status: response.status,
            message: errorData.message || errorData.error || response.statusText,
            data: errorData,
          }
        }
      } catch (format2Error) {
        testResult.error = {
          message: '两种请求格式都失败',
          format1Error: format1Error.message,
          format2Error: format2Error.message,
        }
      }
    }
  } catch (error) {
    testResult.error = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return testResult
}

/**
 * 在控制台打印诊断信息
 */
export function printDiagnostics() {
  const config = diagnoseApiConfig()

  console.group('🔍 API 配置诊断')
  console.log('环境:', config.environment)
  console.log('时间:', config.timestamp)
  console.log('\n配置检查:')
  console.table(config.config)

  if (config.issues.length > 0) {
    console.warn('\n⚠️ 发现的问题:')
    config.issues.forEach((issue, index) => {
      console.warn(`${index + 1}. ${issue}`)
    })
  }

  if (config.recommendations.length > 0) {
    console.info('\n💡 建议:')
    config.recommendations.forEach((rec, index) => {
      console.info(`${index + 1}. ${rec}`)
    })
  }

  console.groupEnd()

  return config
}



