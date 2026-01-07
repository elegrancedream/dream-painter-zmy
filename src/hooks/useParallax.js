import { useState, useEffect, useCallback } from 'react'
import { throttle } from '../utils/throttle'
import { useDeviceOrientation } from './useDeviceOrientation'

/**
 * 视差Hook
 * 支持桌面端鼠标视差和移动端陀螺仪视差
 *
 * @returns {Object} { rotateX: number, rotateY: number }
 */
export function useParallax() {
  const [parallax, setParallax] = useState({ rotateX: 0, rotateY: 0 })
  const { beta, gamma, isSupported: isGyroSupported } = useDeviceOrientation()

  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // 桌面端鼠标视差
  useEffect(() => {
    if (isMobile && isGyroSupported) {
      // 移动端使用陀螺仪，不监听鼠标事件
      return
    }

    const handleMouseMove = throttle((e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // 计算鼠标相对位置（-1 到 1）
      const rotateY = ((clientX / innerWidth) - 0.5) * 2
      const rotateX = ((clientY / innerHeight) - 0.5) * -2

      setParallax({ rotateX, rotateY })
    }, 100) // 桌面端100ms节流

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile, isGyroSupported])

  // 移动端陀螺仪视差
  useEffect(() => {
    if (!isMobile || !isGyroSupported) {
      return
    }

    // 将陀螺仪角度转换为视差值（-1 到 1）
    // beta: -180 到 180，gamma: -90 到 90
    const rotateX = Math.max(-1, Math.min(1, beta / 45)) // 限制范围
    const rotateY = Math.max(-1, Math.min(1, gamma / 45)) // 限制范围

    // 使用节流处理（移动端200ms）
    const throttledUpdate = throttle(() => {
      setParallax({ rotateX, rotateY })
    }, 200)

    throttledUpdate()
  }, [beta, gamma, isMobile, isGyroSupported])

  return parallax
}

