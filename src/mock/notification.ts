import Mock from 'mockjs'
import type { NotificationData, ApiResponse } from '@/types/index.ts'

const Random = Mock.Random

// 生成通知列表
function generateNotifications(count: number): NotificationData[] {
  const notifications: NotificationData[] = []
  
  const types = ['comment', 'follow', 'like', 'system', 'mention']
  const contents = [
    '评论了你的帖子',
    '关注了你',
    '点赞了你的帖子',
    '系统通知：新版本已发布',
    '提到了你'
  ]
  
  for (let i = 0; i < count; i++) {
    const typeIndex = Random.integer(0, types.length - 1)
    const contentIndex = Random.integer(0, contents.length - 1)
    
    notifications.push({
      id: Random.integer(1, 1000),
      type: types[typeIndex],
      content: `用户${Random.cname()}${contents[contentIndex]}`,
      createTime: Random.datetime('yyyy-MM-ddTHH:mm:ss'),
      read: Random.boolean()
    })
  }
  
  return notifications
}

// 预生成一些通知数据
const mockNotifications = generateNotifications(50)

// Mock获取通知列表API
Mock.mock(/\/api\/notifications(\?.+)?$/, 'get', (options) => {
  const url = new URL('http://example.com' + options.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  const type = url.searchParams.get('type')
  const read = url.searchParams.get('read')
  
  let filtered = [...mockNotifications]
  if (type) filtered = filtered.filter(n => n.type === type)
  if (read !== undefined) filtered = filtered.filter(n => n.read === (read === 'true'))
  
  const start = (page - 1) * size
  const end = start + size
  const paginated = filtered.slice(start, end)
  
  const response: ApiResponse<{ content: NotificationData[]; total: number }> = {
    code: 200,
    message: 'success',
    data: {
      content: paginated,
      total: filtered.length
    }
  }
  
  return response
})

// Mock获取未读通知数量API
Mock.mock(/\/api\/notifications\/unread\/count\?_t=(\d+)$/, 'get', () => {
  const response: ApiResponse<number> = {
    code: 200,
    message: 'success',
    data: mockNotifications.filter(n => !n.read).length
  }
  return response
})

// Mock标记通知为已读API
Mock.mock(/\/notifications\/\d+\/read$/, 'put', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  const notification = mockNotifications.find(n => n.id === id)
  if (notification) notification.read = true
  
  const response: ApiResponse<null> = {
    code: 200,
    message: 'success',
    data: null
  }
  return response
})

// Mock标记所有通知为已读API
Mock.mock('/notifications/read/all', 'put', () => {
  mockNotifications.forEach(n => n.read = true)
  const response: ApiResponse<null> = {
    code: 200,
    message: 'success',
    data: null
  }
  return response
})

// Mock删除通知API
Mock.mock(/\/notifications\/\d+$/, 'delete', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1))
  const index = mockNotifications.findIndex(n => n.id === id)
  if (index > -1) mockNotifications.splice(index, 1)
  
  const response: ApiResponse<null> = {
    code: 200,
    message: 'success',
    data: null
  }
  return response
})

// Mock清空所有通知API
Mock.mock('/notifications/all', 'delete', () => {
  mockNotifications.length = 0
  const response: ApiResponse<null> = {
    code: 200,
    message: 'success',
    data: null
  }
  return response
})