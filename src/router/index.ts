import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', guest: true }
  },
  {
    path: '/post/:id',
    name: 'post-detail',
    component: () => import('@/views/PostDetail.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/post/create',
    name: 'post-create',
    component: () => import('@/views/PostForm.vue'),
    meta: { title: '发布帖子', requiresAuth: true }
  },
  {
    path: '/post/edit/:id',
    name: 'post-edit',
    component: () => import('@/views/PostForm.vue'),
    meta: { title: '编辑帖子', requiresAuth: true }
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { title: '用户资料' }
  },
  {
    path: '/user/settings',
    name: 'user-settings',
    component: () => import('@/views/UserSettings.vue'),
    meta: { title: '用户设置', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 检查是否需要登录权限
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    ElMessage.error('没有权限访问此页面')
    next(from.path)
    return
  }

  // 检查是否已登录用户访问游客页面
  if (to.meta.guest && userStore.isLoggedIn) {
    next('/')
    return
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  ElMessage.error('页面加载失败，请刷新重试')
})

export default router 