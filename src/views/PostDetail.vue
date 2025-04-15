<template>
  <div class="post-detail">
    <!-- 帖子内容 -->
    <el-card class="post-card">
      <template #header>
        <div class="post-header">
          <div class="post-title">
            <h1>{{ post?.title }}</h1>
            <el-tag size="small" :type="getTagType(post?.tag)">{{ post?.tag }}</el-tag>
          </div>
          <div class="post-meta">
            <span class="author">

            <router-link :to="`/user/${post?.user.id}`" class="nav-link">
              <el-avatar :size="24" :src="post?.user.avatarUrl" />
              <span>{{ post?.user.name }}</span>
            </router-link>
            </span>
            <span class="time">{{ formatTime(post?.gmtCreate) }}</span>
            <span class="views">
              <el-icon><View /></el-icon>
              {{ post?.viewCount }}
            </span>
          </div>
        </div>
      </template>

      <div class="post-content">
        <p>{{ post?.description }}</p>
      </div>

      <div class="post-footer">
        <div class="post-actions">
          <el-button 
            type="primary" 
            :icon="post?.favorite ? 'StarFilled' : 'Star'"
            @click="handleFavorite"
          >
            {{ post?.favorite ? '已收藏' : '收藏' }}
          </el-button>
          <el-button 
            type="primary" 
            @click="handleLike"
          >
            {{ post?.likeCount || 0 }} 点赞
          </el-button>
          <el-button 
            type="primary" 
            icon="ChatDotRound"
            @click="scrollToComment"
          >
            {{ post?.commentCount || 0 }} 评论
          </el-button>
        </div>
        <div class="post-edit" v-if="canEdit">
          <el-button type="primary" link @click="handleEdit">
            编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete">
            删除
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 评论区 -->
    <el-card class="comment-section" ref="commentSection">
      <template #header>
        <div class="comment-header">
          <h2>评论 ({{ post?.commentCount || 0 }})</h2>
        </div>
      </template>

      <!-- 评论输入框 -->
      <div class="comment-input" v-if="userStore.isLoggedIn">
        <el-input
          v-model="commentContent"
          type="textarea"
          :rows="3"
          placeholder="写下你的评论..."
          :maxlength="500"
          show-word-limit
        />
        <div class="comment-actions">
          <el-button type="primary" @click="handleComment" :loading="commenting">
            发表评论
          </el-button>
        </div>
      </div>
      <div v-else class="login-tip">
        <router-link to="/login">登录</router-link> 后参与评论
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-user">
            <el-avatar :size="40" :src="comment.user.avatarUrl" />
            <div class="comment-info">
              <span class="username">{{ comment.user.name }}</span>
              <span class="time">{{ formatTime(comment.gmtCreate) }}</span>
            </div>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <div class="comment-actions">
            <el-button type="primary" link @click="handleReply(comment)">
              回复
            </el-button>
            <el-button 
              type="primary" 
              link 
              :icon="comment.likeCount > 0 ? 'StarFilled' : 'Star'"
              @click="handleCommentLike(comment)"
            >
              {{ comment.likeCount || 0 }}
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { StarFilled,Star } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const userStore = useUserStore()
const commentSection = ref<HTMLElement>()
const commentContent = ref('')
const commenting = ref(false)

// 获取帖子详情
const post = computed(() => postStore.currentPost)

const comments = ref<any[]>([])

// 判断是否可以编辑
const canEdit = computed(() => {
  return userStore.isLoggedIn && userStore.userInfo?.id === post.value?.creatorId
})

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    await postStore.fetchPostDetail(route.params.id as string)
    let commentRes =  await postStore.fetchCommentList(route.params.id as string)
    comments.value = commentRes
  } catch (error) {
    ElMessage.error('获取帖子详情失败')
  }
}

// 处理收藏
const handleFavorite = async () => {
  if (!post.value) return
  try {
    await postStore.favoritePostAction(post.value.id)
    ElMessage.success(post.value.favorite ? '取消收藏成功' : '收藏成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 处理点赞
const handleLike = async () => {
  if (!post.value) return
  try {
    await postStore.likePostAction(post.value.id)
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 处理评论
const handleComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  try {
    commenting.value = true
    // TODO: 调用评论API
    ElMessage.success('评论成功')
    commentContent.value = ''
  } catch (error) {
    ElMessage.error('评论失败')
  } finally {
    commenting.value = false
  }
}

// 处理回复
const handleReply = (comment: any) => {
  commentContent.value = `@${comment.user.name} `
}

// 处理评论点赞
const handleCommentLike = async (comment: any) => {
  // TODO: 调用评论点赞API
  ElMessage.success('点赞成功')
}

// 滚动到评论区
const scrollToComment = () => {
  commentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 处理编辑
const handleEdit = () => {
  router.push(`/post/edit/${post.value?.id}`)
}

// 处理删除
const handleDelete = async () => {
  if (!post.value) return
  
  try {
    await ElMessageBox.confirm('确定要删除这个帖子吗？', '提示', {
      type: 'warning'
    })
    
    await postStore.deletePostAction(post.value.id)
    ElMessage.success('删除成功')
    router.push('/')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
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
  fetchPostDetail()
})
</script>

<style scoped lang="scss">
.post-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;

  .post-card {
    .post-header {
      .post-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
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

        .views {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .post-content {
      color: #666;
      line-height: 1.8;
      margin: 20px 0;
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #eee;

      .post-actions {
        display: flex;
        gap: 12px;
      }
    }
  }

  .comment-section {
    .comment-header {
      h2 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }
    }

    .comment-input {
      margin-bottom: 20px;

      .comment-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }
    }

    .login-tip {
      text-align: center;
      padding: 20px;
      color: #999;
      background-color: #f5f7fa;
      border-radius: 4px;

      a {
        color: #409eff;
        text-decoration: none;

        &:hover {
          color: #66b1ff;
        }
      }
    }

    .comment-list {
      .comment-item {
        padding: 16px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .comment-user {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .comment-info {
            display: flex;
            flex-direction: column;

            .username {
              font-weight: bold;
              color: #333;
            }

            .time {
              font-size: 12px;
              color: #999;
            }
          }
        }

        .comment-content {
          color: #666;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .comment-actions {
          display: flex;
          gap: 16px;
        }
      }
    }
  }
}
</style>