import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useLoadingStore } from '@/stores/loading'
import { handleError } from '@/utils/errorHandler'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const userStore = useUserStore()
    const loadingStore = useLoadingStore()
  
    // 添加token
    if (userStore.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${userStore.token}`
      }
    }

    // 添加时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 显示加载状态
    if (!config.hideLoading) {
      loadingStore.startLoading(config.loadingText)
    }

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data
    const loadingStore = useLoadingStore()

    if (!response.config.hideLoading) {
      loadingStore.stopLoading()
    }

    // 请求成功
    if (code === 200) {
      return data
    }
    // 业务错误
    ElMessage.error(message || '操作失败')
    return Promise.reject(new Error(message || '操作失败'))
  },
  (error) => {
    const loadingStore = useLoadingStore()

    // 隐藏加载状态
    if (!error.config?.hideLoading) {
      loadingStore.stopLoading()
    }
    // 处理错误
    const apiError = handleError(error)

    return Promise.reject(apiError)
  }
)

// 封装请求方法
const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  },

  // 上传文件
  upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100
          onProgress(progress)
        }
      }
    })
  }
}

export default request