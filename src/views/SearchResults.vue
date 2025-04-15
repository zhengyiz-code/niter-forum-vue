<template>
  <div class="search-results">
    <h2 class="title">'{{ query }}' 的搜索结果</h2>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="帖子" name="posts">
        <div v-if="posts.length" class="result-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <router-link :to="`/post/${post.id}`">
              {{ post.title }}
            </router-link>
            <span class="meta">by {{ post.author }} · {{ post.date }}</span>
          </div>
        </div>
        <el-empty v-else description="暂无相关帖子" />
      </el-tab-pane>

      <el-tab-pane label="用户" name="users">
        <div v-if="users.length" class="result-list">
          <div v-for="user in users" :key="user.id" class="user-item">
            <el-avatar :size="40" :src="user.avatar" />
            <div class="info">
              <router-link :to="`/user/${user.id}`" class="username">
                {{ user.username }}
              </router-link>
              <span class="bio">{{ user.bio }}</span>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无相关用户" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { mockSearch } from '@/api/search'

const route = useRoute()
const query = ref('')
const activeTab = ref('posts')
const posts = ref<any[]>([])
const users = ref<any[]>([])

watchEffect(async () => {
  query.value = route.query.q as string
  const results = await mockSearch(query.value)
  
  posts.value = results.filter(i => i.type === 'post').map(p => ({
    id: p.id,
    title: p.title,
    author: '测试作者',
    date: '2024-03-15'
  }))
  
  users.value = results.filter(i => i.type === 'user').map(u => ({
    id: u.id,
    username: u.username,
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    bio: '示例用户简介'
  }))
})
</script>

<style scoped lang="scss">
.search-results {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;

  .title {
    margin-bottom: 30px;
    font-size: 24px;
    color: #333;
  }

  .result-list {
    margin-top: 20px;
  }

  .post-item {
    padding: 15px;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .meta {
      margin-left: 15px;
      color: #999;
      font-size: 0.9em;
    }
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    .info {
      margin-left: 15px;

      .username {
        font-weight: 500;
        color: #333;
        text-decoration: none;

        &:hover {
          color: #409eff;
        }
      }

      .bio {
        display: block;
        color: #666;
        font-size: 0.9em;
        margin-top: 5px;
      }
    }
  }
}
</style>