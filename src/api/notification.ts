import request from '@/utils/request'
import type { NotificationData, ApiResponse } from '@/types/index.ts'

// 获取通知列表
export const getNotifications = (params?: {
  page?: number
  size?: number
  type?: 'comment' | 'follow' | 'system'
  read?: boolean
}) => {
  return request.get<ApiResponse<{ content: NotificationData[]; total: number }>>(
    '/notifications',
    { params }
  )
}

// 获取未读通知数量
export const getUnreadCount = () => {
  return request.get<ApiResponse<number>>('/notifications/unread/count')
}

// 标记通知为已读
export const markAsRead = (notificationId: string | number) => {
  return request.put<ApiResponse<null>>(`/notifications/${notificationId}/read`)
}

// 标记所有通知为已读
export const markAllAsRead = () => {
  return request.put<ApiResponse<null>>('/notifications/read/all')
}

// 删除通知
export const deleteNotification = (notificationId: string | number) => {
  return request.delete<ApiResponse<null>>(`/notifications/${notificationId}`)
}

// 清空所有通知
export const clearAllNotifications = () => {
  return request.delete<ApiResponse<null>>('/notifications/all')
} 