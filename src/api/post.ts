import request from '@/utils/request'
import type { Post, ApiResponse } from '@/types/index.ts'

/**
 * 获取帖子列表
 * @param params 查询参数
 */
export const getPosts = (params?: {
  page?: number
  size?: number
  tag?: string
  userId?: string
  keyword?: string
}) => {
  return request.get<ApiResponse<{ content: Post[]; total: number }>>('/posts', { params })
}

/**
 * 获取帖子详情
 * @param id 帖子ID
 */
export const getPostDetail = (id: string | number) => {
  return request.get<ApiResponse<Post>>(`/posts/${id}`)
}

/**
 * 创建帖子
 * @param data 帖子数据
 */
export const createPost = (data: {
  title: string
  content: string
  tag: string
}) => {
  return request.post<ApiResponse<Post>>('/posts', data)
}

/**
 * 更新帖子
 * @param id 帖子ID
 * @param data 更新数据
 */
export const updatePost = (id: string | number, data: {
  title?: string
  content?: string
  tag?: string
}) => {
  return request.put<ApiResponse<Post>>(`/posts/${id}`, data)
}

/**
 * 删除帖子
 * @param id 帖子ID
 */
export const deletePost = (id: string | number) => {
  return request.delete<ApiResponse<null>>(`/posts/${id}`)
}

/**
 * 获取帖子评论
 * @param postId 帖子ID
 */
export function getPostComments(postId: number) {
  return request.get<Comment[]>(`/post/${postId}/comments`)
}

/**
 * 发布帖子
 * @param postData 帖子数据
 */
export function publishPost(postData: {
  title: string
  description: string
  tag: string
  creatorId: number
  column2: number
}) {
  return request.post<Post>('/post/publish', postData)
}

/**
 * 发表评论
 * @param postId 帖子ID
 * @param commentData 评论数据
 */
export function postComment(postId: number, commentData: {
  content: string
  commentator: number
}) {
  return request.post<Comment>(`/post/${postId}/comment`, commentData)
}

/**
 * 获取置顶帖子
 */
export function getTopPosts() {
  return request.get<Post[]>('/posts/top')
}

/**
 * 获取热门标签
 */
export const getTags = () => {
  return request.get<ApiResponse<string[]>>('/posts/tags')
}

/**
 * 点赞帖子
 * @param id 帖子ID
 */
export const likePost = (id: string | number) => {
  return request.post<ApiResponse<null>>(`/posts/${id}/like`)
}

/**
 * 收藏帖子
 * @param id 帖子ID
 */
export const favoritePost = (id: string | number) => {
  return request.post<ApiResponse<null>>(`/posts/${id}/favorite`)
}

/**
 * 增加浏览量
 * @param id 帖子ID
 */
export const incrementViewCount = (id: string | number) => {
  return request.post<ApiResponse<null>>(`/posts/${id}/view`)
}

/**
 * 点赞评论
 * @param commentId 评论ID
 */
export function likeComment(commentId: number) {
  return request.post<{ likeCount: number }>(`/comment/${commentId}/like`)
} 