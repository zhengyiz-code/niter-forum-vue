import request from '@/utils/request'
import type { ApiResponse, User, UserProfile } from '@/types/index.ts'

/**
 * 用户登录
 * @param data 登录数据
 */
export function login(data: { username: string; password: string }) {
  return request<ApiResponse<{ token: string; user: User }>>({
    method: 'post',
    url: '/user/login',
    data
  })
}

/**
 * 用户注册
 * @param data 注册数据
 */
export function register(data: { username: string; password: string; email: string }) {
  return request<ApiResponse<{ token: string; user: User }>>({
    method: 'post',
    url: '/user/register',
    data
  })
}

/**
 * 获取用户资料
 * @param id 用户ID
 */
export function getUserProfile(id: number | string) {
  return request<ApiResponse<UserProfile>>({
    url: `/user/${id}/profile`,
    method: 'get'
  })
}

/**
 * 更新用户资料
 * @param id 用户ID
 * @param data 更新数据
 */
export function updateUserProfile(id: number | string, data: Partial<UserProfile>) {
  return request<ApiResponse<UserProfile>>({
    url: `/user/${id}/profile`,
    method: 'put',
    data
  })
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return request<ApiResponse<User>>({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request<ApiResponse<null>>({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 获取最近访客
 */
export function getRecentUsers() {
  return request<ApiResponse<User[]>>({
    url: '/users/recent',
    method: 'get'
  })
}

/**
 * 关注用户
 * @param id 用户ID
 */
export function followUser(id: number | string) {
  return request<ApiResponse<null>>({
    url: `/user/${id}/follow`,
    method: 'post'
  })
}

/**
 * 取消关注用户
 * @param id 用户ID
 */
export function unfollowUser(id: number | string) {
  return request<ApiResponse<null>>({
    url: `/user/${id}/unfollow`,
    method: 'post'
  })
}

/**
 * 获取用户关注列表
 * @param userId 用户ID
 */
export function getUserFollowing(userId: number | string) {
  return request<ApiResponse<User[]>>({
    url: `/user/${userId}/following`,
    method: 'get'
  })
}

/**
 * 获取用户粉丝列表
 * @param userId 用户ID
 */
export function getUserFollowers(userId: number | string) {
  return request<ApiResponse<User[]>>({
    url: `/user/${userId}/followers`,
    method: 'get'
  })
}