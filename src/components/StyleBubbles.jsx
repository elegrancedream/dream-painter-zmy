import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
import { throttle } from '../utils/throttle'

/**
 * 风格选择组件
 * 提供5种画风选择，支持桌面端鼠标交互和移动端陀螺仪交互
 *
 * @param {Object} props
 * @param {Function} props.onStyleSelect - 风格选择回调
 */
export default function StyleBubbles({ onStyleSelect }) {
  const [selectedStyle, setSelectedStyle] = useState(null)
  const { beta, gamma, isSupported: isGyroSupported } = useDeviceOrientation()
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // 风格配置
  const styles = [
    { id: 'Ghibli', name: 'Ghibli-治愈童话风', scene: '🌿', color: '#90EE90' },
    { id: 'Van Gogh', name: 'Van Gogh-油画笔触风', scene: '⭐', color: '#FFD700' },
    { id: 'Cthulhu', name: 'Cthulhu-神秘低语风', scene: '🐙', color: '#4B0082' },
    { id: 'Minimalist', name: 'Minimalist-抽象极简风', scene: '◯', color: '#000000' },
    { id: 'Cyber_Xianxia', name: 'Cyber_Xianxia-科幻仙侠风', scene: '⚡', color: '#00FFFF' },
  ]

  // 气泡初始位置（随机）
  const [positions] = useState(() =>
    styles.map(() => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }))
  )

  // 桌面端鼠标交互
  useEffect(() => {
    if (isMobile && isGyroSupported) {
      return // 移动端使用陀螺仪
    }

    const handleMouseMove = throttle((e) => {
      const { clientX, clientY } = e
      const bubbles = document.querySelectorAll('.style-bubble')

      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = clientX - centerX
        const dy = clientY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          // 鼠标靠近，气泡躲避
          const angle = Math.atan2(dy, dx)
          const force = (150 - distance) / 150
          const newX = Math.cos(angle) * force * 20
          const newY = Math.sin(angle) * force * 20

          bubble.style.transform = `translate(${newX}px, ${newY}px)`
        } else {
          // 鼠标远离，气泡恢复
          bubble.style.transform = 'translate(0, 0)'
        }
      })
    }, 100)

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isGyroSupported])

  // 移动端陀螺仪交互
  useEffect(() => {
    if (!isMobile || !isGyroSupported) {
      return
    }

    const handleGyro = throttle(() => {
      const bubbles = document.querySelectorAll('.style-bubble')
      const tiltX = Math.max(-1, Math.min(1, gamma / 45)) * 30
      const tiltY = Math.max(-1, Math.min(1, beta / 45)) * 30

      bubbles.forEach((bubble) => {
        bubble.style.transform = `translate(${tiltX}px, ${tiltY}px)`
      })
    }, 200)

    if (beta !== 0 || gamma !== 0) {
      handleGyro()
    }
  }, [beta, gamma, isMobile, isGyroSupported])

  const handleBubbleClick = (styleId) => {
    setSelectedStyle(styleId)
    setTimeout(() => {
      onStyleSelect(styleId)
    }, 500) // 等待动画完成
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {styles.map((style, index) => (
        <motion.div
          key={style.id}
          className="style-bubble absolute cursor-pointer"
          initial={{
            x: positions[index].x,
            y: positions[index].y + 400, // 从底部升起
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: positions[index].x,
            y: positions[index].y,
            opacity: selectedStyle === style.id ? 0 : selectedStyle ? 0.3 : 1,
            scale: selectedStyle === style.id ? 2 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: index * 0.1,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleBubbleClick(style.id)}
        >
          <div
            className="cloudmorphism p-6 text-center min-w-[120px]"
            style={{
              backgroundColor: `${style.color}40`,
            }}
          >
            <div className="text-4xl mb-2">{style.scene}</div>
            <div className="text-white text-sm font-nunito">{style.name}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

