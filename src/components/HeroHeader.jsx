import React from 'react'
import { motion } from 'framer-motion'

/**
 * HeroHeader组件
 *
 * 功能：展示品牌Logo、副标题和功能徽章
 *
 * @component
 * @example
 * <HeroHeader />
 */
export default function HeroHeader() {
  const badges = ['免费分析', 'AI 绘图', '无需登录']

  return (
    <motion.div
      className="text-center mb-8 md:mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-indigo-900 mb-5 md:mb-6 drop-shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Dream Painter
      </motion.h1>

      {/* Subtitle */}
      <motion.div
        className="mb-7 md:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-xl md:text-2xl text-indigo-800 font-medium mb-1">
          捕捉潜意识的微光，绘制独属于你的梦境
        </p>
        <p className="text-base md:text-xl text-indigo-700/80 italic">
          Capture the glimmer of the subconscious, paint your unique dream
        </p>
      </motion.div>

      {/* Badges */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {badges.map((badge, index) => (
          <motion.span
            key={badge}
            className="px-4 py-2 rounded-full bg-white/30 text-indigo-900 text-base md:text-xl font-medium backdrop-blur-md border-2 border-white/50 shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          >
            {badge}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}



