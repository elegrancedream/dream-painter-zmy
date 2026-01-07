/**
 * 节流函数
 * 限制函数调用频率，在指定时间间隔内最多执行一次
 *
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒），默认100ms
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, delay = 100) {
  let lastCallTime = 0
  let timeoutId = null

  return function (...args) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    // 如果距离上次调用已经超过延迟时间，立即执行
    if (timeSinceLastCall >= delay) {
      lastCallTime = now
      fn.apply(this, args)
    } else {
      // 否则，清除之前的定时器，设置新的定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        fn.apply(this, args)
      }, delay - timeSinceLastCall)
    }
  }
}

