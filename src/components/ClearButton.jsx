import React from 'react'

/**
 * ClearButton组件
 *
 * 功能：清除按钮，用于清空输入内容
 *
 * @param {Object} props
 * @param {Function} props.onClick - 点击回调函数
 */
export default function ClearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-lg md:text-xl"
      aria-label="清除输入内容"
    >
      清除
    </button>
  )
}



