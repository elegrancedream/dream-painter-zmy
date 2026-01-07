import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 引导气泡组件
 * 非梦境场景下的引导提示
 *
 * @param {Object} props
 * @param {string} props.advice - 引导文案（来自API返回的advice字段）
 * @param {Function} props.onClose - 关闭回调（返回input状态）
 */
export default function GuideBubble({ advice, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* 背景遮罩 */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* 引导气泡 */}
        <motion.div
          className="cloudmorphism p-6 md:p-8 max-w-md relative z-10 cursor-pointer"
          initial={{ x: -300, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 浮动动画 */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* 引导文案 */}
            <p className="text-lg md:text-xl font-nunito text-white text-glow text-center mb-4">
              {advice}
            </p>

            {/* 关闭提示 */}
            <p className="text-sm text-white/70 text-center">
              点击任意位置继续
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

