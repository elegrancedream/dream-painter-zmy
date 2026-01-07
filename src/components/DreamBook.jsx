import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useParallax } from '../hooks/useParallax'

/**
 * 立体绘本组件
 * 展示生成的梦境画作和心理分析
 *
 * @param {Object} props
 * @param {string} props.imageUrl - 生成的图片URL
 * @param {string} props.diagnosis - 心理分析诊断文案
 * @param {string} props.advice - 建议文案
 * @param {string[]} props.keywords - 关键词标签数组
 * @param {Function} props.onBack - 返回按钮点击回调函数
 */
export default function DreamBook({ imageUrl, diagnosis, advice, keywords, onBack }) {
  const { rotateX, rotateY } = useParallax()

  return (
    <div className="w-full max-w-[1029px] mx-auto relative">
      {/* 返回按钮 - 位于左上角 */}
      <motion.button
        onClick={onBack}
        className="fixed top-4 md:top-8 left-4 md:left-8 flex items-center gap-2 text-xl md:text-2xl text-indigo-800 font-medium transition-all duration-200 hover:text-indigo-900 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-lg px-2 py-1 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.3 }}
        aria-label="返回梦境输入界面"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onBack()
          }
        }}
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        <span>返回</span>
      </motion.button>

      {/* 翻书动画容器 */}
      <motion.div
        className="relative"
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* 书本容器 */}
        <div className="cloudmorphism p-[28px] md:p-[35px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
            {/* 左侧页面：心理分析 */}
            <motion.div
              className="p-[28px] bg-white/20 rounded-lg backdrop-blur-sm"
              style={{
                perspective: '1000px',
              }}
            >
              <h3
                className="text-[27.5625px] md:text-[36.75px] font-baloo text-indigo-900 mb-4"
                style={{
                  textShadow: '0 2px 8px rgba(99, 102, 241, 0.2), 0 0 20px rgba(139, 92, 246, 0.15)',
                  filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.1))'
                }}
              >
                梦境诊断书
              </h3>
              <div className="text-indigo-900 font-nunito leading-relaxed whitespace-pre-wrap text-[18.28px] md:text-[20.32px]">
                {diagnosis}
              </div>
              {advice && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-indigo-600/90 text-[18.28px] md:text-[20.32px]">
                    ✨ {advice}
                  </p>
                </div>
              )}
            </motion.div>

            {/* 右侧页面：生成图片 */}
            <motion.div
              className="relative"
              style={{
                perspective: '1000px',
                transform: `perspective(1000px) rotateX(${rotateX * 10}deg) rotateY(${rotateY * 10}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.img
                src={imageUrl}
                alt="生成的梦境画作"
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ccc" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                }}
              />
            </motion.div>
          </div>

          {/* 底部书签：关键词标签 */}
          {keywords && keywords.length > 0 && (
            <motion.div
              className="mt-[28px] flex flex-wrap gap-[10.5px] justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {keywords.map((keyword, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md rounded-full text-indigo-800 text-[18.29px] md:text-[20.57px] font-nunito border border-indigo-400/30 shadow-md hover:bg-indigo-500/30 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  #{keyword}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

