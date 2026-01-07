import React, { useState, useEffect, memo, useCallback } from 'react'
import DreamInput from './DreamInput'
import ControlBar from './ControlBar'
import { validateUserInput, validateStyle } from '../utils/dataValidator'

/**
 * LandingCard组件
 *
 * 功能：主卡片容器组件，实现Glassmorphism效果，整合DreamInput和ControlBar
 * 使用React.memo优化，避免不必要的重渲染
 *
 * @param {Object} props
 * @param {string} props.userInput - 用户输入的梦境描述（外部状态）
 * @param {string|null} props.selectedStyle - 选中的艺术风格（外部状态）
 * @param {Function} props.onInputChange - 输入变化回调函数
 * @param {Function} props.onStyleChange - 风格变化回调函数
 * @param {Function} props.onSubmit - 提交回调函数
 * @param {Function} props.onClear - 清除回调函数
 */
const LandingCard = memo(function LandingCard({
  userInput,
  selectedStyle,
  onInputChange,
  onStyleChange,
  onSubmit,
  onClear
}) {
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 处理输入变化（使用useCallback优化）
  const handleInputChange = useCallback((value) => {
    onInputChange(value)
    // 输入变化时立即清除错误，提供更好的用户体验
    if (error) {
      setError(null)
    }
  }, [onInputChange, error])

  // 处理风格变化（使用useCallback优化）
  const handleStyleChange = useCallback((style) => {
    onStyleChange(style)
    // 风格变化时立即清除错误，提供更好的用户体验
    if (error) {
      setError(null)
    }
  }, [onStyleChange, error])

  // 处理清除（使用useCallback优化）
  const handleClear = useCallback(() => {
    onClear()
    setError(null)
    setIsSubmitting(false)
  }, [onClear])

  // 处理提交（使用useCallback优化）
  const handleSubmit = useCallback(async () => {
    // 验证输入
    const inputValidation = validateUserInput(userInput)
    if (!inputValidation.valid) {
      setError(inputValidation.error)
      return
    }

    // 验证风格
    const styleValidation = validateStyle(selectedStyle)
    if (!styleValidation.valid) {
      setError(styleValidation.error)
      return
    }

    // 清除错误，设置提交状态
    setError(null)
    setIsSubmitting(true)

    try {
      // 调用父组件回调
      await onSubmit(userInput.trim(), selectedStyle)
    } catch (err) {
      // 如果父组件回调抛出错误，显示错误信息
      setError(err.message || '提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }, [userInput, selectedStyle, onSubmit])

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl max-w-full md:max-w-[1176px] mx-auto p-8 md:p-10">
      {/* Dream Input Section */}
      <DreamInput
        userInput={userInput}
        error={error}
        onInputChange={handleInputChange}
      />

      {/* Control Bar */}
      <ControlBar
        selectedStyle={selectedStyle}
        onStyleChange={handleStyleChange}
        onClear={handleClear}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        userInput={userInput}
      />
    </div>
  )
})

export default LandingCard

