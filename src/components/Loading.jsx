import React from 'react'
import { motion } from 'framer-motion'

/**
 * Loading组件
 * 显示加载状态，包含趣味文案和动画
 *
 * @param {Object} props
 * @param {string} [props.message] - 自定义Loading文案（可选）
 */
export default function Loading({ message }) {
  // Loading文案库
  const loadingMessages = [
    '正在收集独角兽的眼泪...',
    '正在缝补云朵...',
    '正在调色梦境...',
    '正在唤醒沉睡的画笔...',
    '正在编织梦境碎片...',
    '正在捕捉星光...',
    '正在绘制你的梦境...',
  ]

  // 随机选择文案
  const displayMessage = message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* 云朵动画 */}
      <motion.div
        className="cloudmorphism p-8 mb-6"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="text-6xl mb-4">☁️</div>
      </motion.div>

      {/* Loading文案 */}
      <motion.p
        className="text-2xl md:text-3xl font-baloo text-white text-glow text-center"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {displayMessage}
      </motion.p>
    </div>
  )
}

