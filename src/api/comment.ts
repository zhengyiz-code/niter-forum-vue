import request from '@/utils/request'
import type { CommentData, ApiResponse } from '@/types/index.ts'

/**
 * 获取帖子评论列表
 * @param postId 帖子ID
 * @param params 查询参数
 */
export const getComments = (postId: string | number, params?: {
  page?: number
  size?: number
}) => {
  return request.get<ApiResponse<{ content: CommentData[]; total: number }>>(
    `/posts/${postId}/comments`,
    { params }
  )
}

/**
 * 发表评论
 * @param postId 帖子ID
 * @param data 评论数据
 */
export const createComment = (postId: string | number, data: {
  content: string
  parentId?: string | number
}) => {
  return request.post<ApiResponse<CommentData>>(`/posts/${postId}/comments`, data)
}

/**
 * 更新评论
 * @param postId 帖子ID
 * @param commentId 评论ID
 * @param data 更新数据
 */
export const updateComment = (postId: string | number, commentId: string | number, data: {
  content: string
}) => {
  return request.put<ApiResponse<CommentData>>(
    `/posts/${postId}/comments/${commentId}`,
    data
  )
}

/**
 * 删除评论
 * @param postId 帖子ID
 * @param commentId 评论ID
 */
export const deleteComment = (postId: string | number, commentId: string | number) => {
  return request.delete<ApiResponse<null>>(`/posts/${postId}/comments/${commentId}`)
}

/**
 * 点赞评论
 * @param postId 帖子ID
 * @param commentId 评论ID
 */
export const likeComment = (postId: string | number, commentId: string | number) => {
  return request.post<ApiResponse<null>>(`/posts/${postId}/comments/${commentId}/like`)
}

/**
 * 取消点赞评论
 * @param postId 帖子ID
 * @param commentId 评论ID
 */
export const unlikeComment = (postId: string | number, commentId: string | number) => {
  return request.delete<ApiResponse<null>>(`/posts/${postId}/comments/${commentId}/like`)
}

/**
 * 获取评论回复列表
 * @param postId 帖子ID
 * @param commentId 评论ID
 * @param params 查询参数
 */
export const getCommentReplies = (
  postId: string | number,
  commentId: string | number,
  params?: {
    page?: number
    size?: number
  }
) => {
  return request.get<ApiResponse<{ content: CommentData[]; total: number }>>(
    `/posts/${postId}/comments/${commentId}/replies`,
    { params }
  )
} 