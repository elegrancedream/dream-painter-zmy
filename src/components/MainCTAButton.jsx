import React from 'react'
import { Sparkles } from 'lucide-react'

/**
 * MainCTAButton组件
 *
 * 功能：主CTA按钮，用于提交生成请求
 *
 * @param {Object} props
 * @param {Function} props.onClick - 点击回调函数
 * @param {boolean} [props.loading=false] - 是否处于加载状态
 * @param {boolean} [props.disabled=false] - 是否禁用
 * @param {React.ReactNode} [props.children] - 自定义内容，默认为"Paint Dream"
 */
export default function MainCTAButton({ onClick, loading = false, disabled = false, children }) {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        bg-gradient-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        active:from-purple-700 active:to-pink-700
        transition-all duration-200
        flex items-center justify-center gap-2
        shadow-lg hover:shadow-xl
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={loading ? '生成中...' : '绘制梦境'}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 12 5.373 12 12H4z"
            />
          </svg>
          <span>生成中...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span className="text-lg md:text-xl">{children || 'Paint Dream'}</span>
        </>
      )}
    </button>
  )
}



