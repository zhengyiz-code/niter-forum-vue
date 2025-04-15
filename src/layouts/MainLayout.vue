<template>
  <div class="main-layout">
    <!-- 导航栏 -->
    <nav class="navbar" v-if="!isLoginOrRegister">
      <div class="navbar-container">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span>Simple Forum</span>
        </router-link>
        
        <div class="nav-links">
          <el-autocomplete
            v-model="searchQuery"
            class="search-input"
            placeholder="搜索"
            :prefix-icon="Search"
            :fetch-suggestions="handleSearch"
            :trigger-on-focus="false"
            clearable
            @select="handleSelect"
          >
            <template #default="{ item }">
              <div class="suggestion-item">
                <span v-if="item.type === 'post'">📝 {{ item.title }}</span>
                <span v-else>👤 {{ item.username }}</span>
              </div>
            </template>
          </el-autocomplete>
          <template v-if="userStore.isLoggedIn">
            <router-link :to="`/user/${userInfo.id}`" class="nav-link">
              <el-avatar :size="40" :src="userInfo.avatarUrl" />
              <span>{{ userInfo.name }}</span>
            </router-link>
            <el-button type="text" @click="handleLogout">退出</el-button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">登录</router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <div class="main-container">

      <aside class="sidebar" v-if="!(isLoginOrRegister||isShowSidebar)">
        <Sidebar />
      </aside>

      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <!-- 侧边栏 -->
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2024 Simple Forum. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { ElMessage } from 'element-plus'
import { ref,computed,onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')

import { mockSearch } from '@/api/search'
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')

const handleSearch = useDebounceFn(async (query: string, cb: (arg: any) => void) => {
  try {
    const result = await mockSearch(query)
    cb(result.map(item => ({
      ...item,
      value: item.type === 'post' ? item.title : item.username
    })))
  } catch (error) {
    console.error('搜索失败:', error)
    cb([])
  }
}, 300)

const isLoginOrRegister = computed(() => {
  if(route.name === 'user-profile' || route.name === 'user-settings' ) return true
  if(route.name === 'post-detail'  ) return true
  return route.path === '/login' || route.path === '/register'
})

const isShowSidebar = computed(() => {
  if(route.name === 'user-profile' || route.name === 'user-settings' ) return true
  if(route.name === 'post-detail'  ) return true
  return false;
})


const handleSelect = (item: any) => {
  if (!item?.id) {
    ElMessage.error('无效的搜索结果');
    return;
  }

  if (item.type === 'post') {
    router.push(`/post/${item.id}`);
  } else if (item.type === 'user') {
    router.push(`/user/${item.id}`);
  }

  searchQuery.value = '';
};

const handleLogout = async () => {
  try {
    await userStore.handleLogout()
    ElMessage.success('退出成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('退出失败')
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;

    img {
      height: 32px;
      margin-right: 8px;
    }

    span {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-link {
    text-decoration: none;
    color: #666;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 200px;

    &:hover {
      color: #409eff;
    }

    &.router-link-active {
      color: #409eff;
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  margin-top: v-bind('isLoginOrRegister ? "0" : "60px"');
  padding: 20px;
  gap: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  .content {
    flex: 1;
    min-width: 0;
  }

  .sidebar {
    width: 300px;
    flex-shrink: 0;
  }
}

.footer {
  background-color: #f5f7fa;
  padding: 20px 0;
  margin-top: auto;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    color: #666;
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>