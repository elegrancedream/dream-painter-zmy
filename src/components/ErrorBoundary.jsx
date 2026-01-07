import React from 'react'

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，并显示友好的错误界面
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('错误边界捕获:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // 可以在这里发送错误到日志服务
    // 例如：logErrorToService(error, errorInfo)
  }

  handleReload = () => {
    // 重新加载页面
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="aurora-bg min-h-screen w-full flex flex-col items-center justify-center p-4"
          style={{
            background: 'linear-gradient(to bottom right, #fbcfe8, #c4b5fd, #818cf8)'
          }}
        >
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4">
              页面加载出错
            </h1>
            <p className="text-indigo-800 mb-6">
              抱歉，页面遇到了问题。请尝试刷新页面，或检查网络连接。
            </p>

            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 mb-4 w-full"
            >
              刷新页面
            </button>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-indigo-700 font-medium mb-2">
                  错误详情（开发环境）
                </summary>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 overflow-auto max-h-60">
                  <pre className="text-xs text-indigo-900 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

