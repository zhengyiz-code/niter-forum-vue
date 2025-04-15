import request from '@/utils/request'
import type { SearchResult } from '@/types/search'

export const search = (query: string) => {
  return request<SearchResult[]>({
    url: '/search',
    method: 'get',
    params: { q: query }
  })
}

export const mockSearch = (query: string) => {
  return new Promise<SearchResult[]>(resolve => {
    setTimeout(() => {
      resolve([
        { type: 'post', id: 1, title: '示例帖子1' },
        { type: 'user', id: 2, username: '测试用户' }
      ])
    }, 300)
  })
}