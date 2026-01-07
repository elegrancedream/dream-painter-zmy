import React from 'react'

/**
 * DreamInput组件
 *
 * 功能：梦境输入组件，包含输入区域标题、大型文本输入框、错误提示和帮助文本
 *
 * @param {Object} props
 * @param {string} props.userInput - 用户输入的梦境描述
 * @param {string|null} props.error - 错误信息，null表示无错误
 * @param {Function} props.onInputChange - 输入变化回调函数
 */
export default function DreamInput({ userInput, error, onInputChange }) {
  return (
    <div className="w-full">
      {/* Section Title */}
      <h3 className="text-[22.5px] md:text-[25px] font-bold text-indigo-900 -mt-[11.25px] md:-mt-[12.5px] mb-4">
        梦境输入
      </h3>

      {/* Text Area */}
      <textarea
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="在这里描述你的梦境..."
        className={`
          w-full px-5 py-4 rounded-xl border-2
          bg-white/50 backdrop-blur-sm
          border-white/50 focus:border-indigo-400
          focus:outline-none focus:ring-2 focus:ring-indigo-300/50
          text-slate-800 placeholder:text-gray-400
          text-base md:text-xl
          resize-none min-h-[150px] md:min-h-[180px]
          transition-all duration-200
          ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-300/50' : ''}
        `}
        aria-label="梦境描述输入框"
        aria-describedby={error ? 'error-message' : 'helper-text'}
      />

      {/* Error Message */}
      {error && (
        <p
          id="error-message"
          className="mt-2 text-sm text-red-600 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper Text */}
      <p
        id="helper-text"
        className="mt-2 text-base md:text-xl text-gray-500"
      >
        为了获得最佳效果，请描述你的梦境并选择艺术风格
      </p>
    </div>
  )
}



