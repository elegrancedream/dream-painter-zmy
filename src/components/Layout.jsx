import React from 'react'
import HeroHeader from './HeroHeader'
import '../styles/index.css'
import '../styles/textures.css'

/**
 * 布局组件
 * 提供全局背景、纹理叠加和响应式容器
 * 增强：添加HeroHeader区域，调整主容器宽度
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
export default function Layout({ children }) {
  return (
    <div className="aurora-bg min-h-screen w-full relative overflow-hidden">
      {/* 纹理叠加层 */}
      <div className="texture-overlay noise-texture" />

      {/* Hero Header */}
      <div className="relative z-10 max-w-full md:max-w-[1176px] mx-auto px-4 pt-8 md:pt-12">
        <HeroHeader />
      </div>

      {/* 主内容容器 */}
      <div className="relative z-10 max-w-full md:max-w-[1176px] mx-auto px-4 py-8 md:py-12">
        {children}
      </div>
    </div>
  )
}

