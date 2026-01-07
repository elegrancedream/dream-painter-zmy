import React from 'react'
import StyleDropdown from './StyleDropdown'
import ClearButton from './ClearButton'
import MainCTAButton from './MainCTAButton'

/**
 * ControlBar组件
 *
 * 功能：控制栏组件，整合风格选择和操作按钮
 *
 * @param {Object} props
 * @param {string|null} props.selectedStyle - 当前选中的风格ID
 * @param {Function} props.onStyleChange - 风格变化回调函数
 * @param {Function} props.onClear - 清除回调函数
 * @param {Function} props.onSubmit - 提交回调函数
 * @param {boolean} props.isSubmitting - 是否正在提交
 * @param {string} props.userInput - 用户输入内容，用于判断disabled状态
 */
export default function ControlBar({
  selectedStyle,
  onStyleChange,
  onClear,
  onSubmit,
  isSubmitting,
  userInput
}) {
  const isDisabled = !userInput || !selectedStyle || isSubmitting

  return (
    <div className="border-t border-white/20 mt-5 pt-5">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Left Side: Style Dropdown */}
        <div className="flex-1 md:flex-none">
          <StyleDropdown
            value={selectedStyle}
            onChange={onStyleChange}
          />
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-row gap-3 justify-end">
          <ClearButton onClick={onClear} />
          <MainCTAButton
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  )
}



