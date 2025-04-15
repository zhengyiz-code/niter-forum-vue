import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, logout ,getUserFollowing,getUserFollowers,followUser,unfollowUser,getUserProfile,updateUserProfile} from '@/api/user'
import { getUnreadCount, getNotifications } from '@/api/notification'
import type { UserData, NotificationData } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserData | null>(null)
  const unreadCount = ref(0)
  const notifications = ref<NotificationData[]>([])
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 登录
  const handleLogin = async (username: string, password: string) => {
    try {
      loading.value = true
      const response = await login({ username, password })
      token.value = response.token
      userInfo.value = response.user
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      localStorage.setItem('token', token.value)
      return response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 注册
  const handleRegister = async (username: string, password: string, email: string ) => {
    try {
      loading.value = true
      const response = await register({username,password,email})
      token.value = response.token
      userInfo.value = response.user
      localStorage.setItem('token', response.token)
      return response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async (userId:number | string) => {
    try {
      loading.value = true
      const response = await getUserProfile(userId)
      userInfo.value = response
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新用户信息
  const updateInfo = async (data: Partial<UserData>) => {
    try {
      loading.value = true
      const response = await updateUserProfile(data)
      userInfo.value = response.data
      return response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
//
//   // 修改密码
//   const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
//     try {
//       loading.value = true
//       await updatePassword(data)
//     } catch (error) {
//       throw error
//     } finally {
//       loading.value = false
//     }
//   }

  // 更新通知设置
  const updateSettings = async (data: {
    commentNotification: boolean
    followNotification: boolean
    systemNotification: boolean
  }) => {
    try {
      loading.value = true
      await updateNotificationSettings(data)
      if (userInfo.value) {
        userInfo.value = {
          ...userInfo.value,
          ...data
        }
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取未读通知数量
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount()
      unreadCount.value = response
    } catch (error) {
      console.error('获取未读通知数量失败:', error)
    }
  }

  // 获取通知列表
  const fetchNotifications = async (params?: {
    page?: number
    size?: number
    type?: 'comment' | 'follow' | 'system'
    read?: boolean
  }) => {
    try {
      const response = await getNotifications(params)
      notifications.value = response.data.content
      return response.data
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  const handleLogout = () => {
    token.value = null
    userInfo.value = null
    unreadCount.value = 0
    notifications.value = []
    localStorage.removeItem('token')
    try {
      logout()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  //初始化
  const init = async () => {
    if (token.value) {
      await fetchUnreadCount()
    }
  }

  // 获取关注列表
  const getFollowingList = async (userId: string) => {
    try {
      loading.value = true
      const response = await getUserFollowing(userId)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取粉丝列表
  const getFollowerList = async (userId: string) => {
    try {
      loading.value = true
      const response = await getUserFollowers(userId)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 关注用户
  const handleFollowUser = async (userId: string) => {
    try {
      loading.value = true
      await followUser(userId)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 取消关注
  const handleUnfollowUser = async (userId: string) => {
    try {
      loading.value = true
      await unfollowUser(userId)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    token,
    userInfo,
    unreadCount,
    notifications,
    loading,
    isLoggedIn,
    isAdmin,

    // 方法
    handleLogin,
    handleRegister,
    fetchUserInfo,
    updateInfo,
    updateSettings,
    fetchUnreadCount,
    fetchNotifications,
    handleLogout,
    init,
    getFollowingList,
    getFollowerList,
    handleFollowUser,
    handleUnfollowUser
  }
})