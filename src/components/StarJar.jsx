import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { validateUserInput } from '../utils/dataValidator'

/**
 * 捕星瓶组件
 * 梦境输入模块
 *
 * @param {Object} props
 * @param {Function} props.onInputSubmit - 输入提交回调
 */
export default function StarJar({ onInputSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleClick = () => {
    setIsExpanded(true)
  }

  const handleSubmit = () => {
    // 验证输入
    const validation = validateUserInput(input)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError('')
    onInputSubmit(input.trim())
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // 捕星瓶状态
          <motion.div
            key="jar"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="cursor-pointer"
            onClick={handleClick}
            whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            {/* SVG 玻璃瓶 */}
            <svg
              width="200"
              height="300"
              viewBox="0 0 200 300"
              className="drop-shadow-2xl"
            >
              {/* 瓶身 */}
              <path
                d="M 50 50 Q 50 30 70 30 L 130 30 Q 150 30 150 50 L 150 250 Q 150 270 130 270 L 70 270 Q 50 270 50 250 Z"
                fill="rgba(255, 255, 255, 0.2)"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              {/* 瓶盖 */}
              <rect
                x="70"
                y="20"
                width="60"
                height="15"
                fill="rgba(255, 255, 255, 0.3)"
                rx="5"
              />
              {/* 星星 */}
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={70 + i * 15}
                  cy={100 + i * 30}
                  r="3"
                  fill="#FFD700"
                  initial={{ opacity: 0.5 }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </svg>
            <p className="text-white text-center mt-4 text-glow">
              点击瓶子，描述你的梦境
            </p>
          </motion.div>
        ) : (
          // 输入框状态
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="cloudmorphism p-6 parchment">
              <h2 className="text-2xl font-baloo text-white mb-4 text-center">
                描述你的梦境
              </h2>

              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="例如：我梦见自己在云朵上飞翔，周围是粉色的天空..."
                className="w-full h-32 p-4 bg-white/80 rounded-lg border-2 border-white/50 focus:outline-none focus:border-white resize-none font-nunito"
                autoFocus
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-300 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                onClick={handleSubmit}
                className="w-full mt-4 py-3 bg-gradient-to-r from-dawn-pink to-quiet-purple text-white font-baloo text-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                入梦
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

