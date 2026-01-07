/**
 * 风格配置数据
 *
 * 统一管理所有艺术风格的配置信息，包括ID、名称、图标和颜色
 * 便于其他组件复用和维护
 */

/**
 * 风格配置类型定义
 * @typedef {Object} StyleConfig
 * @property {string} id - 风格唯一标识符
 * @property {string} name - 风格显示名称
 * @property {string} icon - 风格图标（emoji或字符）
 * @property {string} color - 风格主题颜色（十六进制）
 */

/**
 * 所有可用的艺术风格配置
 * @type {StyleConfig[]}
 */
export const STYLES = [
  {
    id: 'Ghibli',
    name: '治愈童话风',
    icon: '🌿',
    color: '#90EE90'
  },
  {
    id: 'Van Gogh',
    name: '油画笔触风',
    icon: '⭐',
    color: '#FFD700'
  },
  {
    id: 'Cthulhu',
    name: '神秘低语风',
    icon: '🐙',
    color: '#4B0082'
  },
  {
    id: 'Minimalist',
    name: '抽象极简风',
    icon: '◯',
    color: '#000000'
  },
  {
    id: 'Cyber_Xianxia',
    name: '科幻仙侠风',
    icon: '⚡',
    color: '#00FFFF'
  }
]

/**
 * 获取风格配置
 * @param {string} styleId - 风格ID
 * @returns {StyleConfig|undefined} 风格配置对象，如果不存在则返回undefined
 */
export function getStyleById(styleId) {
  return STYLES.find(style => style.id === styleId)
}

/**
 * 验证风格ID是否有效
 * @param {string} styleId - 风格ID
 * @returns {boolean} 是否为有效的风格ID
 */
export function isValidStyleId(styleId) {
  return STYLES.some(style => style.id === styleId)
}



