import { useState, useEffect } from 'react'

/**
 * 陀螺仪Hook
 * 监听设备方向变化，返回倾斜角度
 *
 * @returns {Object} { beta: number, gamma: number, isSupported: boolean }
 */
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    beta: 0, // 前后倾斜角度（-180 到 180）
    gamma: 0, // 左右倾斜角度（-90 到 90）
    isSupported: false,
  })

  useEffect(() => {
    // 检测设备是否支持陀螺仪
    if (typeof DeviceOrientationEvent === 'undefined') {
      return
    }

    // iOS 13+ 需要请求权限
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            setOrientation((prev) => ({ ...prev, isSupported: true }))
            setupOrientationListener()
          }
        })
        .catch(() => {
          // 权限被拒绝，使用降级方案
        })
    } else {
      // Android 或其他支持陀螺仪的浏览器
      setOrientation((prev) => ({ ...prev, isSupported: true }))
      setupOrientationListener()
    }

    function setupOrientationListener() {
      const handleOrientation = (event) => {
        setOrientation({
          beta: event.beta || 0, // 前后倾斜
          gamma: event.gamma || 0, // 左右倾斜
          isSupported: true,
        })
      }

      window.addEventListener('deviceorientation', handleOrientation)

      // 页面不可见时停止监听（性能优化）
      const handleVisibilityChange = () => {
        if (document.hidden) {
          window.removeEventListener('deviceorientation', handleOrientation)
        } else {
          window.addEventListener('deviceorientation', handleOrientation)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    return setupOrientationListener()
  }, [])

  return orientation
}

