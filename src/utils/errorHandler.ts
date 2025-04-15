import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// 错误类型定义
export class ApiError extends Error {
  constructor(
    public code: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class AuthError extends ApiError {
  constructor(message = '认证失败，请重新登录') {
    super(401, message)
    this.name = 'AuthError'
  }
}

export class ValidationError extends ApiError {
  constructor(message = '输入数据验证失败') {
    super(400, message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = '请求的资源不存在') {
    super(404, message)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends ApiError {
  constructor(message = '服务器内部错误') {
    super(500, message)
    this.name = 'ServerError'
  }
}

// 错误处理函数
export const handleError = (error: AxiosError) => {
  if (error instanceof ApiError) {
    handleApiError(error)
  } else if (error instanceof Error) {
    handleGeneralError(error)
  } else {
    handleUnknownError(error)
  }
}

// API错误处理
const handleApiError = (error: ApiError) => {
  switch (error.code) {
    case 401:
      ElMessage.error('认证失败，请重新登录')
      // 可以在这里处理登出逻辑
      const userStore = useUserStore()
      userStore.logout()
      router.push({
        name: 'login',
        query: { redirect: router.currentRoute.value.fullPath }
      })

      break
    case 403:
      ElMessage.error('没有权限执行此操作')
      break
    case 404:
      ElMessage.error('请求的资源不存在')
      break
    case 422:
      ElMessage.error('输入数据验证失败')
      break
    case 500:
      ElMessage.error('服务器内部错误')
      break
    default:
      ElMessage.error(error.message || '操作失败')
  }
}

// 一般错误处理
const handleGeneralError = (error: Error) => {
  ElMessage.error(error.message || '操作失败')
}

// 未知错误处理
const handleUnknownError = (error: unknown) => {
  console.error('未知错误:', error)
  ElMessage.error('发生未知错误，请稍后重试')
}