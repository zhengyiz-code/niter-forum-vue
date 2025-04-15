<template>
  <div class="home">
    <!-- 帖子列表 -->
    <div class="post-list">
      <el-card v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="post-title">
            <router-link :to="`/post/${post.id}`" class="title-link">
              {{ post.title }}
            </router-link>
            <el-tag size="small" :type="getTagType(post.tag)">{{ post.tag }}</el-tag>
          </div>
          <div class="post-meta">
            <span class="author">
              <el-avatar :size="24" :src="post.user.avatarUrl" />
              <span>{{ post.user.name }}</span>
            </span>
            <span class="time">{{ formatTime(post.gmtCreate) }}</span>
          </div>
        </div>
        
        <div class="post-content">
          <p>{{ post.description }}</p>
        </div>
        
        <div class="post-footer">
          <div class="post-stats">
            <span>
              <el-icon><View /></el-icon>
              {{ post.viewCount }}
            </span>
            <span>
              <el-icon><ChatDotRound /></el-icon>
              {{ post.commentCount }}
            </span>
            <span>
              <el-icon><Star /></el-icon>
              {{ post.likeCount }}
            </span>
          </div>
          <div class="post-actions">
            <el-button 
              type="primary" 
              link 
              :icon="post.favorite ? 'StarFilled' : 'Star'"
              @click="handleFavorite(post)"
            >
              {{ post.favorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 分页 -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { View, ChatDotRound, Star, StarFilled } from '@element-plus/icons-vue'
import { usePostStore } from '@/stores/post'
import { ElMessage } from 'element-plus'

const postStore = usePostStore()
const currentPage = ref(1)
const pageSize = ref(10)
const posts = computed(() => postStore.posts)
const total = ref(postStore.total || 0)

// 获取帖子列表
const fetchPosts = async () => {
  try {
    await postStore.fetchPosts({
      page: currentPage.value,
      size: pageSize.value
    })
    total.value = postStore.total
  } catch (error) {
    ElMessage.error('获取帖子列表失败')
  }
}

// 处理收藏
const handleFavorite = async (post: any) => {
  try {
    await postStore.favoritePostAction(post.id)
    ElMessage.success(post.favorite ? '收藏成功' : '取消收藏成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchPosts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPosts()
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

// 获取标签类型
const getTagType = (tag: string) => {
  const types: Record<string, string> = {
    '提问': 'danger',
    '分享': 'success',
    '建议': 'warning',
    '讨论': 'info',
    '公告': 'primary',
    '动态': ''
  }
  return types[tag] || ''
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped lang="scss">
.home {
  .post-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .post-card {
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;

      .post-title {
        display: flex;
        align-items: center;
        gap: 12px;

        .title-link {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          text-decoration: none;

          &:hover {
            color: #409eff;
          }
        }
      }

      .post-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        color: #999;
        font-size: 14px;

        .author {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }

    .post-content {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 14px;

      .post-stats {
        display: flex;
        gap: 16px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>