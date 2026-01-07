import { ApiError, handleError } from '../utils/errorHandler'
import { validateUserInput, validateStyle, validateApiResponse } from '../utils/dataValidator'

/**
 * 梦境生成接口（包含梦境判断）
 * 统一的API接口，包含梦境判断、Prompt优化、图片生成、心理分析等完整流程
 *
 * @param {string} userInput - 用户输入的梦境描述
 * @param {string} style - 用户选择的风格（Ghibli、Van Gogh、Cthulhu、Minimalist、Cyber_Xianxia）
 * @returns {Promise<Object>} 生成结果 { image_url, diagnosis, advice, keywords }
 * @throws {Error} 网络错误、超时错误、API错误
 */
export async function generateDream(userInput, style) {
  // 1. 参数验证
  const inputValidation = validateUserInput(userInput)
  if (!inputValidation.valid) {
    throw new Error(inputValidation.error)
  }

  const styleValidation = validateStyle(style)
  if (!styleValidation.valid) {
    throw new Error(styleValidation.error)
  }

  // 2. 获取环境变量
  // 使用 Bot (Agent) 对话接口，URL 固定为 chat 接口
  const apiUrl = import.meta.env.VITE_COZE_API_URL || 'https://api.coze.cn/open_api/v2/chat'
  const botId = import.meta.env.VITE_COZE_BOT_ID
  let token = import.meta.env.VITE_COZE_TOKEN

  if (!botId || !token) {
    throw new Error('API配置错误：请检查环境变量配置（需要 VITE_COZE_BOT_ID 和 VITE_COZE_TOKEN）')
  }

  // 清理 Token（移除前后空格和换行符）
  token = token.trim().replace(/\n/g, '').replace(/\r/g, '')

  // 根据 Token 格式确定认证方式
  // 注意：根据 Coze API 文档，即使使用 PAT Token，也可能需要使用 Bearer 前缀
  let authPrefix = 'Bearer' // 默认使用 Bearer
  // 某些 Coze API 版本可能需要 Pat 前缀，但大多数情况下使用 Bearer
  // 如果遇到 4101 错误，可以尝试切换认证方式
  if (token.startsWith('pat_')) {
    // PAT Token 通常也使用 Bearer 前缀（根据 Coze API 文档）
    authPrefix = 'Bearer'
    // 如果 Bearer 不工作，可以尝试 Pat（取消下面的注释）
    // authPrefix = 'Pat'
  } else if (token.startsWith('cztei_')) {
    authPrefix = 'Bearer' // cztei_ 格式使用 Bearer 前缀
  }

  // 开发环境下验证 Token 格式
  if (import.meta.env.DEV) {
    const isValidFormat = token.startsWith('pat_') || token.startsWith('cztei_')
    if (!isValidFormat) {
      console.warn('⚠️ 警告: Token 格式可能不正确，应该以 "pat_" 或 "cztei_" 开头')
    }
    if (token.length < 50) {
      console.warn('⚠️ 警告: Token 长度可能不正确，通常应该超过 50 个字符')
    }
    console.log('Token 信息:', {
      prefix: token.substring(0, 15) + '...',
      length: token.length,
      hasSpaces: token.includes(' '),
      hasNewlines: token.includes('\n') || token.includes('\r'),
      format: token.startsWith('pat_') ? 'PAT' : token.startsWith('cztei_') ? 'Bearer' : '未知',
      authPrefix: authPrefix,
    })
  }

  // 3. 构建请求
  // 根据 Coze Bot 对话接口文档，使用 bot_id 和 query 字段
  // 将用户输入和风格组合成完整的查询内容
  const queryText = `${userInput.trim()}\n风格: ${style}`

  const requestBody = {
    bot_id: botId,
    user: 'dream_painter_user', // 用户标识，可以根据需要修改
    query: queryText,
    stream: false, // 不使用流式响应
    // 如果需要传递额外参数，可以使用 extra 字段
    // extra: {
    //   style: style,
    //   user_input: userInput.trim(),
    // }
  }

  // 根据 Token 格式自动选择认证方式
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 根据 Token 格式自动选择认证前缀
      'Authorization': `${authPrefix} ${token}`,
    },
    body: JSON.stringify(requestBody),
  }

  // 开发环境下打印认证信息（不显示完整 Token）
  if (import.meta.env.DEV) {
    console.log('请求配置:', {
      url: apiUrl,
      headers: {
        'Content-Type': requestOptions.headers['Content-Type'],
        'Authorization': `${authPrefix} ${token.substring(0, 15)}...`,
      },
      bodyKeys: Object.keys(requestBody),
      authPrefix: authPrefix,
      tokenFormat: token.startsWith('pat_') ? 'PAT' : token.startsWith('cztei_') ? 'cztei' : '未知',
    })
  }

  // 4. 创建AbortController用于超时控制
  // 生成图片需要较长时间（包含判断、优化、生图、分析等），设置更长的超时时间
  const controller = new AbortController()
  const timeoutDuration = 180000 // 180秒（3分钟）超时，因为生成图片需要较长时间
  const timeoutId = setTimeout(() => {
    if (import.meta.env.DEV) {
      console.warn('请求超时:', {
        duration: timeoutDuration / 1000 + '秒',
        hint: '生成图片可能需要更长时间，请检查网络连接或增加超时时间',
      })
    }
    controller.abort()
  }, timeoutDuration)

  try {
    // 5. 发送请求
    const requestStartTime = Date.now()
    if (import.meta.env.DEV) {
      console.log('开始发送 API 请求:', {
        url: apiUrl,
        botId: botId,
        query: queryText.substring(0, 50) + '...',
        timeout: timeoutDuration / 1000 + '秒',
      })
    }

    const response = await fetch(apiUrl, {
      ...requestOptions,
      signal: controller.signal,
    })

    const requestDuration = Date.now() - requestStartTime
    clearTimeout(timeoutId)

    if (import.meta.env.DEV) {
      console.log('API 请求完成:', {
        duration: requestDuration + 'ms',
        status: response.status,
        statusText: response.statusText,
      })
    }

    // 6. 处理响应
    if (!response.ok) {
      let errorData = {}
      try {
        const text = await response.text()
        errorData = text ? JSON.parse(text) : {}
      } catch (e) {
        // 如果解析失败，使用空对象
        if (import.meta.env.DEV) {
          console.error('解析错误响应失败:', e)
        }
      }

      // 详细错误信息（开发环境）
      if (import.meta.env.DEV) {
        console.error('API 错误详情:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          requestUrl: apiUrl,
          requestBody: requestBody,
          tokenPrefix: token ? token.substring(0, 10) + '...' : '未设置',
          hint: '如果遇到401或4101错误，请检查Token是否正确；如果遇到400错误，请检查bot_id和请求参数格式',
        })
      }

      // 处理 Coze API 的错误码
      let errorMessage = errorData.msg || errorData.message || errorData.error || `API请求失败: ${response.status} ${response.statusText}`

      // 如果是 4101 错误（Token 不合法），提供更详细的提示
      if (errorData.code === 4101 || errorMessage.includes('Bearer token') || errorMessage.includes('token 不合法')) {
        errorMessage = 'Token 认证失败（4101）：请检查以下事项：\n1. Token 是否正确（确保没有多余空格）\n2. Token 是否已过期\n3. 是否需要在 Coze 平台重新生成 Token\n4. 参考文档：https://coze.cn/docs/developer_guides/authentication'

        // 开发环境下提供详细的诊断信息
        if (import.meta.env.DEV) {
          console.error('4101 认证错误诊断:', {
            tokenPrefix: token ? token.substring(0, 20) + '...' : '未设置',
            tokenLength: token ? token.length : 0,
            tokenFormat: token ? (token.startsWith('pat_') ? 'PAT' : token.startsWith('cztei_') ? 'cztei' : '未知') : '未设置',
            tokenStartsWithPat: token ? token.startsWith('pat_') : false,
            tokenStartsWithCztei: token ? token.startsWith('cztei_') : false,
            hasSpaces: token ? token.includes(' ') : false,
            authPrefix: authPrefix,
            authorizationHeader: `${authPrefix} ${token.substring(0, 15)}...`,
            hint: '如果 Token 格式正确但仍然失败，可能需要：\n1. 在 Coze 平台重新生成 Token\n2. 检查 Token 权限设置\n3. 确认使用的是正确的 API 端点\n4. 尝试使用 Pat 前缀而不是 Bearer（如果是 PAT Token）',
            suggestion: token && token.startsWith('pat_')
              ? 'PAT Token 检测到，如果 Bearer 不工作，可以尝试修改代码使用 Pat 前缀'
              : '请确认 Token 格式和认证方式是否正确',
          })
        }
      }

      throw new ApiError(
        response.status,
        errorMessage
      )
    }

    const data = await response.json()

    // 开发环境下打印实际返回的数据
    if (import.meta.env.DEV) {
      console.log('API 响应数据:', data)
      if (data.messages && Array.isArray(data.messages)) {
        console.log('Messages 详情:', {
          count: data.messages.length,
          types: data.messages.map(m => ({ type: m.type, role: m.role, hasContent: !!m.content })),
          contents: data.messages
            .filter(m => m.content)
            .map(m => ({ type: m.type, content: typeof m.content === 'string' ? m.content.substring(0, 200) : m.content })),
        })
      }
    }

    // 7. 处理 Bot 接口的响应格式
    // Bot 接口返回 Coze 标准格式：{ code, conversation_id, messages: [...], msg }
    // 需要从 messages 数组中提取数据
    let extractedData = null

    if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
      // 策略1: 查找 type 为 "answer" 的消息（主要回答内容）
      let answerMessage = data.messages.find(msg => msg.type === 'answer' && msg.content)

      // 策略2: 如果没找到 answer，查找所有包含 content 的消息（排除 function_call 和 tool_response）
      if (!answerMessage) {
        answerMessage = data.messages.find(msg =>
          msg.content &&
          msg.type !== 'function_call' &&
          msg.type !== 'tool_response' &&
          msg.type !== 'verbose'
        )
      }

      // 策略3: 遍历所有消息，查找包含 JSON 格式的内容
      if (answerMessage && answerMessage.content) {
        const content = answerMessage.content

        // 尝试解析为 JSON（Bot 可能返回 JSON 字符串）
        try {
          const parsedContent = JSON.parse(content)
          // 如果解析成功且包含预期字段，使用解析后的数据
          if (parsedContent && typeof parsedContent === 'object') {
            // 检查是否包含图片 URL（可能在 image_url 字段中，或者在其他字段中）
            if (parsedContent.image_url || parsedContent.diagnosis || parsedContent.advice) {
              extractedData = parsedContent
            }
          }
        } catch (e) {
          // 不是 JSON 格式，继续查找
        }
      }

      // 策略4: 如果还没有找到，遍历所有消息查找 JSON 格式的内容
      if (!extractedData) {
        for (const msg of data.messages) {
          if (msg.content && typeof msg.content === 'string') {
            // 尝试解析为 JSON
            try {
              const parsed = JSON.parse(msg.content)
              if (parsed && typeof parsed === 'object') {
                // 检查是否包含预期的字段（image_url, diagnosis, advice 等）
                if (parsed.image_url !== undefined ||
                    parsed.diagnosis !== undefined ||
                    parsed.advice !== undefined ||
                    parsed.keywords !== undefined) {
                  extractedData = parsed
                  if (import.meta.env.DEV) {
                    console.log('✅ 从消息中提取到数据:', {
                      messageType: msg.type,
                      messageRole: msg.role,
                      extractedFields: Object.keys(parsed),
                    })
                  }
                  break
                }
              }
            } catch (e) {
              // 不是 JSON，继续查找
              continue
            }
          }
        }
      }

      // 策略5: 如果仍然没有找到，尝试从消息内容中搜索图片 URL（可能是文本格式）
      if (!extractedData) {
        for (const msg of data.messages) {
          if (msg.content && typeof msg.content === 'string') {
            // 尝试查找图片 URL（http:// 或 https:// 开头的 URL）
            const urlMatch = msg.content.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i)
            if (urlMatch) {
              const imageUrl = urlMatch[0]
              // 尝试提取其他信息
              let diagnosis = null
              let advice = msg.content
              let keywords = []

              // 尝试从内容中提取 JSON（可能图片 URL 和其他信息在同一个消息中）
              try {
                const parsed = JSON.parse(msg.content)
                if (parsed && typeof parsed === 'object') {
                  extractedData = {
                    image_url: parsed.image_url || imageUrl,
                    diagnosis: parsed.diagnosis || null,
                    advice: parsed.advice || advice,
                    keywords: parsed.keywords || [],
                  }
                } else {
                  extractedData = {
                    image_url: imageUrl,
                    diagnosis: diagnosis,
                    advice: advice,
                    keywords: keywords,
                  }
                }
              } catch (e) {
                // 不是 JSON，使用提取的图片 URL
                extractedData = {
                  image_url: imageUrl,
                  diagnosis: diagnosis,
                  advice: advice,
                  keywords: keywords,
                }
              }

              if (import.meta.env.DEV) {
                console.log('✅ 从消息文本中提取到图片 URL:', {
                  messageType: msg.type,
                  imageUrl: imageUrl,
                })
              }
              break
            }
          }
        }
      }

      // 策略6: 如果仍然没有找到，构建默认响应
      if (!extractedData) {
        const lastMessage = data.messages[data.messages.length - 1]
        const content = lastMessage?.content || '生成完成，但未找到图片数据'

        extractedData = {
          advice: content,
          image_url: null,
          diagnosis: null,
          keywords: [],
        }

        if (import.meta.env.DEV) {
          console.warn('⚠️ 警告: 无法从响应中提取标准格式数据，使用默认格式', {
            messagesCount: data.messages.length,
            messageTypes: data.messages.map(m => m.type),
            lastMessageContent: content.substring(0, 200),
            suggestion: '请检查 Bot 的 Workflow 配置，确保输出 JSON 格式的数据',
          })
        }
      }
    } else {
      // 如果没有 messages 数组，尝试直接使用 data
      extractedData = data
    }

    // 开发环境下打印提取的数据
    if (import.meta.env.DEV) {
      console.log('提取的数据:', extractedData)
    }

    // 8. 数据验证
    const validation = validateApiResponse(extractedData)
    if (!validation.valid) {
      // 数据验证错误，抛出 ValidationError 而不是包装成网络错误
      const validationError = new Error(validation.error)
      validationError.name = 'ValidationError'
      throw validationError
    }

    // 9. 返回数据
    return validation.data
  } catch (error) {
    clearTimeout(timeoutId)

    // 9. 错误处理
    if (error.name === 'AbortError') {
      const timeoutError = new Error('请求超时：生成图片需要较长时间，请稍后重试或检查网络连接')
      timeoutError.name = 'TimeoutError'
      throw timeoutError
    }
    if (error instanceof ApiError) {
      throw error
    }
    // 数据验证错误不包装成网络错误
    if (error.name === 'ValidationError') {
      throw error
    }
    // 其他错误才包装成网络错误
    throw new Error(`网络错误: ${error.message}`)
  }
}

