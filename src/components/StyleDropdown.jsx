import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { STYLES as DEFAULT_STYLES } from '../config/styles'

/**
 * StyleDropdown组件
 *
 * 功能：风格下拉菜单组件，替代原有的StyleBubbles组件
 * 支持键盘导航：Enter选择、Escape关闭、方向键导航
 *
 * @param {Object} props
 * @param {string|null} props.value - 当前选中的风格ID
 * @param {Function} props.onChange - 风格变化回调函数
 * @param {Array} [props.styles] - 风格配置数组，可选，默认使用内置配置
 */
export default function StyleDropdown({ value, onChange, styles = DEFAULT_STYLES }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 键盘导航处理
  const handleKeyDown = (e) => {
    if (!isOpen) {
      // 下拉菜单关闭时，按Enter或Space打开
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
        setFocusedIndex(-1)
      }
      return
    }

    // 下拉菜单打开时的键盘操作
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        // 将焦点返回到触发按钮
        if (dropdownRef.current) {
          dropdownRef.current.querySelector('button').focus()
        }
        break

      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < styles.length) {
          handleSelect(styles[focusedIndex].id)
        } else if (focusedIndex === -1 && value) {
          // 如果当前有选中项，再次按Enter选择当前项（实际是关闭）
          setIsOpen(false)
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => {
          if (prev < styles.length - 1) {
            return prev + 1
          }
          return 0 // 循环到第一个
        })
        break

      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => {
          if (prev > 0) {
            return prev - 1
          }
          return styles.length - 1 // 循环到最后一个
        })
        break

      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break

      case 'End':
        e.preventDefault()
        setFocusedIndex(styles.length - 1)
        break

      default:
        break
    }
  }

  // 获取当前选中的风格
  const selectedStyle = styles.find(style => style.id === value)

  // 处理风格选择
  const handleSelect = (styleId) => {
    onChange(styleId)
    setIsOpen(false)
    setFocusedIndex(-1)
    // 将焦点返回到触发按钮
    if (dropdownRef.current) {
      dropdownRef.current.querySelector('button').focus()
    }
  }

  // 打开下拉菜单时重置焦点
  const handleToggle = () => {
    setIsOpen(!isOpen)
    setFocusedIndex(-1)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="px-4 py-2 rounded-lg border border-white/50 bg-white/30 backdrop-blur-sm hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-between gap-2 min-w-[160px]"
        aria-label="选择艺术风格"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <span className="text-lg md:text-xl text-indigo-900 font-medium text-left">
          {selectedStyle ? `艺术风格: ${selectedStyle.name}` : '艺术风格'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-indigo-700 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="absolute top-full left-0 mt-2 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/50 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label="艺术风格选项"
          >
            {styles.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                暂无可用风格
              </div>
            ) : (
              styles.map((style, index) => (
                <button
                  key={style.id}
                  onClick={() => handleSelect(style.id)}
                  onKeyDown={handleKeyDown}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors duration-150
                    flex items-center justify-start gap-3 focus:outline-none focus:bg-indigo-50
                    ${value === style.id ? 'bg-indigo-100' : ''}
                    ${focusedIndex === index ? 'bg-indigo-50' : ''}
                  `}
                  role="option"
                  aria-selected={value === style.id}
                  tabIndex={focusedIndex === index ? 0 : -1}
                >
                  <span className="text-xl flex-shrink-0 w-6 text-center">{style.icon}</span>
                  <span className="text-sm md:text-base text-indigo-900 font-medium text-left">
                    {style.name}
                  </span>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

