/**
 * 错误处理工具函数
 */

/**
 * API错误类
 * 继承自Error，包含状态码信息
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

/**
 * 统一错误处理函数
 * 将各种错误转换为用户友好的提示信息
 *
 * @param {Error} error - 错误对象
 * @returns {Object} { message: string, type: string }
 */
export function handleError(error) {
  let errorMessage = '发生未知错误，请稍后重试'
  let errorType = 'UNKNOWN_ERROR'

  // 识别配置错误（环境变量未配置）
  if (error.message && error.message.includes('API配置错误')) {
    errorType = 'CONFIG_ERROR'
    errorMessage = error.message // 直接显示原始错误信息
    // 生产环境也显示详细错误（便于调试）
    console.error('配置错误:', {
      message: error.message,
      hint: '请检查环境变量配置：VITE_COZE_BOT_ID 和 VITE_COZE_TOKEN',
      env: {
        mode: import.meta.env.MODE,
        botId: import.meta.env.VITE_COZE_BOT_ID ? '已配置' : '未配置',
        token: import.meta.env.VITE_COZE_TOKEN ? '已配置' : '未配置',
      }
    })
    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
    }
  }

  if (error instanceof ApiError) {
    // API错误
    errorType = 'API_ERROR'
    switch (error.statusCode) {
      case 400:
        errorMessage = '输入内容有误，请重新输入'
        break
      case 401:
      case 403:
        // 401 和 403 都可能是认证问题，4101 错误码也会返回这些状态码
        if (error.message && (error.message.includes('4101') || error.message.includes('token 不合法') || error.message.includes('Bearer token'))) {
          errorMessage = 'Token 认证失败：请检查 Token 是否正确、是否已过期，或是否需要在 Coze 平台重新生成 Token'
        } else {
          errorMessage = '认证失败：请检查 Token 是否正确或已过期'
        }
        // 开发环境提供更详细的错误信息
        if (import.meta.env.DEV) {
          console.error('认证错误详情:', {
            statusCode: error.statusCode,
            message: error.message,
            hint: '请检查 .env.development 文件中的 VITE_COZE_TOKEN 是否正确，确保没有多余空格',
            documentation: '参考 https://coze.cn/docs/developer_guides/authentication',
          })
        }
        break
      case 404:
        errorMessage = 'API 地址不存在：请检查 API URL 是否正确'
        break
      case 429:
        errorMessage = '请求过于频繁，请稍后再试'
        break
      case 500:
        errorMessage = '服务器异常，请稍后重试'
        break
      case 502:
      case 503:
        errorMessage = '服务暂时不可用，请稍后重试'
        break
      case 504:
        errorMessage = '生成时间较长，请稍候...'
        break
      default:
        errorMessage = error.message || `API错误 (${error.statusCode})`
    }
  } else if (error.message && error.message.includes('超时') || error.name === 'TimeoutError') {
    // 超时错误
    errorType = 'TIMEOUT_ERROR'
    errorMessage = error.message || '生成时间较长，请稍候...'
    // 开发环境提供更详细的提示
    if (import.meta.env.DEV) {
      console.error('超时错误详情:', {
        message: error.message,
        hint: '生成图片可能需要3-5分钟，请检查网络连接或增加超时时间',
      })
    }
  } else if (error.message && error.message.includes('格式') || error.name === 'ValidationError') {
    // 数据格式错误或验证错误
    errorType = 'VALIDATION_ERROR'
    errorMessage = error.message || '数据格式异常，请重试'
  } else if (error.message && error.message.includes('网络')) {
    // 网络错误（真正的网络连接问题）
    errorType = 'NETWORK_ERROR'
    errorMessage = '网络连接失败，请检查网络后重试'
  }

  // 开发环境记录详细错误信息
  if (import.meta.env.DEV) {
    console.error('错误详情:', {
      type: errorType,
      message: errorMessage,
      originalError: error,
    })
  }

  return {
    message: errorMessage,
    type: errorType,
    originalError: error,
  }
}

