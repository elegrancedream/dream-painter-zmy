import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import LandingCard from './components/LandingCard'
import Loading from './components/Loading'
import GuideBubble from './components/GuideBubble'
import DreamBook from './components/DreamBook'
import { generateDream } from './api/coze'
import { handleError } from './utils/errorHandler'
import { printDiagnostics } from './utils/apiDiagnostic'

/**
 * 主应用组件
 * 管理应用状态和页面流转
 * 调整：实现单页面布局，优化视图切换逻辑
 */
function App() {
  // 应用状态
  const [currentView, setCurrentView] = useState('landing') // 'landing' | 'loading' | 'guide' | 'result'
  const [userInput, setUserInput] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [generationResponse, setGenerationResponse] = useState(null)
  const [error, setError] = useState(null)

  // 开发环境下，初始化时打印诊断信息
  useEffect(() => {
    if (import.meta.env.DEV) {
      printDiagnostics()
    }
  }, [])

  // 处理提交（在LandingCard中调用）
  const handleSubmit = async (input, style) => {
    setUserInput(input)
    setSelectedStyle(style)
    setCurrentView('loading')
    setError(null)

    try {
      // 调用API生成梦境
      const response = await generateDream(input, style)
      setGenerationResponse(response)

      // 判断响应类型
      if (response.image_url === null && response.diagnosis === null) {
        // 非梦境 → 显示引导气泡
        setCurrentView('guide')
      } else if (response.image_url !== null && response.diagnosis !== null) {
        // 是梦境且已生成 → 显示立体绘本
        setCurrentView('result')
      } else {
        // 异常情况
        setError({
          message: 'API返回数据格式异常',
          type: 'VALIDATION_ERROR'
        })
        setCurrentView('landing')
      }
    } catch (err) {
      // 错误处理
      const errorInfo = handleError(err)
      // 统一错误对象结构
      setError({
        message: errorInfo.message,
        type: errorInfo.type,
      })
      setCurrentView('landing')

      // 开发环境下，打印详细错误信息
      if (import.meta.env.DEV) {
        console.error('API 调用错误:', {
          error: err,
          errorInfo: errorInfo,
          userInput: input,
          style: style,
        })
      }
    }
  }

  // 处理清除
  const handleClear = () => {
    setUserInput('')
    setSelectedStyle(null)
    setError(null)
    setGenerationResponse(null)
  }

  // 处理引导气泡关闭
  const handleGuideClose = () => {
    setCurrentView('landing')
    setUserInput('')
    setSelectedStyle(null)
    setGenerationResponse(null)
  }

  // 处理返回操作（清空所有状态）
  const handleBack = () => {
    // 清空所有状态
    setUserInput('')
    setSelectedStyle(null)
    setError(null)
    setGenerationResponse(null)
    // 切换回输入界面
    setCurrentView('landing')
  }

  // 渲染当前视图
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingCard
            userInput={userInput}
            selectedStyle={selectedStyle}
            onInputChange={setUserInput}
            onStyleChange={setSelectedStyle}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
        )

      case 'loading':
        return <Loading />

      case 'guide':
        return (
          generationResponse && (
            <GuideBubble
              advice={generationResponse.advice}
              onClose={handleGuideClose}
            />
          )
        )

      case 'result':
        return (
          generationResponse &&
          generationResponse.image_url &&
          generationResponse.diagnosis && (
            <DreamBook
              imageUrl={generationResponse.image_url}
              diagnosis={generationResponse.diagnosis}
              advice={generationResponse.advice}
              keywords={generationResponse.keywords}
              onBack={handleBack}
            />
          )
        )

      default:
        return (
          <LandingCard
            userInput={userInput}
            selectedStyle={selectedStyle}
            onInputChange={setUserInput}
            onStyleChange={setSelectedStyle}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
        )
    }
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {renderCurrentView()}
      </AnimatePresence>

      {/* 错误提示 */}
      {error && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 cloudmorphism p-4 max-w-md z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className="text-white text-center">
            {error?.message || (typeof error === 'string' ? error : '发生未知错误')}
          </p>
          {import.meta.env.DEV && error?.type && (
            <p className="text-white/60 text-xs text-center mt-1">
              错误类型: {error.type}
            </p>
          )}
          <button
            onClick={() => {
              setError(null)
              setCurrentView('landing')
            }}
            className="mt-2 w-full py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            返回
          </button>
        </motion.div>
      )}
    </Layout>
  )
}

export default App


