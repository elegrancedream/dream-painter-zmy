/**
 * 数据验证工具函数
 */

/**
 * 验证用户输入的梦境描述
 * @param {string} input - 用户输入
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateUserInput(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: '请输入梦境描述' }
  }

  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: '请输入梦境描述' }
  }

  if (trimmed.length < 3) {
    return { valid: false, error: '梦境描述至少需要3个字符' }
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: '梦境描述不能超过1000个字符' }
  }

  return { valid: true }
}

/**
 * 验证风格选择
 * @param {string} style - 风格标识
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateStyle(style) {
  const validStyles = ['Ghibli', 'Van Gogh', 'Cthulhu', 'Minimalist', 'Cyber_Xianxia']

  if (!style || typeof style !== 'string') {
    return { valid: false, error: '请选择艺术风格' }
  }

  if (!validStyles.includes(style)) {
    return { valid: false, error: '无效的艺术风格' }
  }

  return { valid: true }
}

/**
 * 验证API响应数据
 * @param {any} data - API响应数据
 * @returns {Object} { valid: boolean, error?: string, data?: GenerationResponse }
 */
export function validateApiResponse(data) {
  // 基础类型检查
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'API响应数据格式错误：不是对象' }
  }

  // 检查必需字段
  if (!('advice' in data) || typeof data.advice !== 'string') {
    return { valid: false, error: 'API响应数据格式错误：缺少advice字段' }
  }

  if (!('keywords' in data) || !Array.isArray(data.keywords)) {
    return { valid: false, error: 'API响应数据格式错误：keywords字段必须是数组' }
  }

  // 检查可选字段类型
  if ('image_url' in data && data.image_url !== null && typeof data.image_url !== 'string') {
    return { valid: false, error: 'API响应数据格式错误：image_url字段类型错误' }
  }

  if ('diagnosis' in data && data.diagnosis !== null && typeof data.diagnosis !== 'string') {
    return { valid: false, error: 'API响应数据格式错误：diagnosis字段类型错误' }
  }

  // 构建标准响应对象
  const response = {
    image_url: data.image_url ?? null,
    diagnosis: data.diagnosis ?? null,
    advice: data.advice,
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
  }

  return { valid: true, data: response }
}

