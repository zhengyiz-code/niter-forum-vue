<template>
  <div class="user-profile">
    <el-row :gutter="20">
      <!-- 左侧用户信息 -->
      <el-col :span="8">
        <el-card class="user-info-card">
          <div class="user-info">
            <el-avatar :size="100" :src="userInfo.avatarUrl || '/default-avatar.png'" />
            <h2>{{ userInfo.name }}</h2>
            <p class="bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</p>
            <div class="stats">
              <div class="stat-item">
                <span class="label">发帖</span>
                <span class="value">{{ userInfo.postCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="label">关注</span>
                <span class="value">{{ userInfo.followingCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="label">粉丝</span>
                <span class="value">{{ userInfo.followerCount || 0 }}</span>
              </div>
            </div>
            <div class="actions" v-if="currentUserStore.isLoggedIn">
              <el-button
                v-if="loginUserInfo.id !== userInfo.id"
                type="primary"
                :loading="following"
                @click="handleFollow"
              >
                {{ isFollowing ? '取消关注' : '关注' }}
              </el-button>
              <el-button
                v-if="loginUserInfo.id === userInfo.id"
                type="primary"
                @click="$router.push('/user/settings')"
              >
                编辑资料
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="16">
        <el-tabs v-model="activeTab">
          <!-- 发帖历史 -->
          <el-tab-pane label="发帖历史" name="posts">
            <el-card v-if="posts.length > 0">
              <div v-for="post in posts" :key="post.id" class="post-item">
                <div class="post-title">
                  <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
                  <el-tag size="small" :type="getTagType(post.tag)">{{ post.tag }}</el-tag>
                </div>
                <div class="post-meta">
                  <span>{{ formatTime(post.createTime) }}</span>
                  <span>浏览 {{ post.viewCount }}</span>
                  <span>点赞 {{ post.likeCount }}</span>
                  <span>评论 {{ post.commentCount }}</span>
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-card>
            <el-empty v-else description="暂无发帖记录" />
          </el-tab-pane>

          <!-- 关注列表 -->
          <el-tab-pane label="关注" name="following">
            <el-card v-if="followingList.length > 0">
              <div v-for="user in followingList" :key="user.id" class="following-item">
                <el-avatar :size="40" :src="user.avatarUrl || '/default-avatar.png'" />
                <div class="user-info">
                  <router-link :to="`/user/${user.id}`">{{ user.username }}</router-link>
                  <p class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</p>
                </div>
                <el-button
                  v-if="loginUserInfo?.id === userInfo.id"
                  type="danger"
                  size="small"
                  @click="handleFollow(user.id)"
                >
                  取消关注
                </el-button>
              </div>
            </el-card>
            <el-empty v-else description="暂无关注" />
          </el-tab-pane>

          <!-- 粉丝列表 -->
          <el-tab-pane label="粉丝" name="followers">
            <el-card v-if="followerList.length > 0">
              <div v-for="user in followerList" :key="user.id" class="follower-item">
                <el-avatar :size="40" :src="user.avatar || '/default-avatar.png'" />
                <div class="user-info">
                  <router-link :to="`/user/${user.id}`">{{ user.username }}</router-link>
                  <p class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</p>
                </div>
              </div>
            </el-card>
            <el-empty v-else description="暂无粉丝" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch ,onUnmounted} from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { ElMessage } from 'element-plus'
import type { PostData, UserData } from '@/types'

const route = useRoute()
const currentUserStore = useUserStore()
const postStore = usePostStore()
const abortController = ref<AbortController>()
// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    // 取消之前的请求
    abortController.value?.abort()
    abortController.value = new AbortController()
    fetchUserInfo()
    fetchUserPosts()
    fetchFollowingList()
    fetchFollowerList()
  }
})

// 状态
const userInfo = ref<UserData>({} as UserData)
const posts = ref<PostData[]>([])
const followingList = ref<UserData[]>([])
const followerList = ref<UserData[]>([])
const activeTab = ref('posts')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const following = ref(false)
// 定义 isFollowing 变量
const isFollowing = ref(false)

const loginUserInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userId = route.params.id 
    const response = await currentUserStore.fetchUserInfo(userId, { signal: abortController.value?.signal })
    userInfo.value = response
    // 初始化关注状态
    if (loginUserInfo?.id) {
      isFollowing.value = userInfo.value.followers?.some(f => f.id === loginUserInfo.id) || false
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 获取用户发帖列表
const fetchUserPosts = async () => {
  try {
    const response = await postStore.fetchPosts( {
      page: currentPage.value,
      size: pageSize.value,
      userId: route.params.id as string,
    }, { signal: abortController.value?.signal })
    posts.value = postStore.posts
    total.value = postStore.total
  } catch (error) {
    ElMessage.error('获取发帖列表失败')
  }
}

// 获取关注列表
const fetchFollowingList = async () => {
  try {
    const userId = route.params.id as string
    const response = await currentUserStore.getFollowingList(userId, { signal: abortController.value?.signal })
    followingList.value = response
  } catch (error) {
    ElMessage.error('获取关注列表失败')
  }
}

// 获取粉丝列表
const fetchFollowerList = async () => {
  try {
    const userId = route.params.id as string
    const response = await currentUserStore.getFollowerList(userId, { signal: abortController.value?.signal })
    followerList.value = response
  } catch (error) {
    ElMessage.error('获取粉丝列表失败')
  }
}

// 处理关注/取消关注
const handleFollow = async (userId:number|string) => {
  try {
    following.value = true
    if (isFollowing.value) {
      await currentUserStore.handleUnfollowUser(userId)
      ElMessage.success('取消关注成功')
    } else {
      await currentUserStore.handleFollowUser(userId)
      ElMessage.success('关注成功')
    }
    isFollowing.value = !isFollowing.value
    await fetchFollowingList()
  } catch (error) {
    ElMessage.error(isFollowing.value ? '取消关注失败' : '关注失败')
  } finally {
    following.value = false
  }
}
// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchUserPosts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUserPosts()
}

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

const getTagType = (tag: string) => {
  const types: Record<string, string> = {
    '提问': 'warning',
    '分享': 'success',
    '建议': 'info',
    '讨论': 'primary',
    '公告': 'danger',
    '动态': ''
  }
  return types[tag] || ''
}

// 监听标签页切换
watch(activeTab, (newVal) => {
  if (newVal === 'following') {
    fetchFollowingList()
  } else if (newVal === 'followers') {
    fetchFollowerList()
  }
})

onMounted(() => {
  abortController.value = new AbortController()
  fetchUserInfo()
  fetchUserPosts()
})

// 组件卸载时取消所有请求
onUnmounted(() => {
  abortController.value?.abort()
})
</script>

<style scoped lang="scss">
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 50px;

  .user-info-card {
    .user-info {
      text-align: center;
      padding: 20px;

      h2 {
        margin: 15px 0;
        font-size: 24px;
        color: #333;
      }

      .bio {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .label {
            display: block;
            color: #666;
            font-size: 14px;
          }

          .value {
            display: block;
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
          }
        }
      }

      .actions {
        margin-top: 20px;
      }
    }
  }

  .post-item {
    padding: 15px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .post-title {
      margin-bottom: 10px;

      a {
        color: #333;
        text-decoration: none;
        font-size: 16px;
        margin-right: 10px;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .post-meta {
      color: #999;
      font-size: 14px;

      span {
        margin-right: 15px;
      }
    }
  }

  .following-item,
  .follower-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .user-info {
      flex: 1;
      margin-left: 15px;

      a {
        color: #333;
        text-decoration: none;
        font-size: 16px;

        &:hover {
          color: #409EFF;
        }
      }

      .bio {
        color: #666;
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>