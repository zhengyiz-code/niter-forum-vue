import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, PostQueryParams } from '@/types'
import { getComments } from '@/api/comment'
import {
  getPosts,
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  likePost,
  favoritePost
} from '@/api/post'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const comments = ref<CommentData[]>([])

  // 获取帖子列表
  async function fetchPosts(params?: PostQueryParams) {
    try {
      loading.value = true
      const { data, total: totalCount } = await getPosts(params)
      posts.value = data
      total.value = totalCount
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取帖子详情
  async function fetchPostDetail(id: number | string) {
    try {
      loading.value = true
      const post = await getPostDetail(id)
      currentPost.value = post
      await fetchCommentList(id)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCommentList(postId: number | string) {
    try {
      const  res  = await getComments(postId)
      // 假设添加一个comments状态
      comments.value = res.content
      return comments.value
    } catch (error) {
      throw error
    }
  }

  // 创建帖子
  async function createPostAction(data: {
    title: string
    description: string
    tag: string
    creatorId: number
    column2: number
  }) {
    try {
      const post = await createPost(data)
      posts.value.unshift(post)
      return post
    } catch (error) {
      throw error
    }
  }

  // 更新帖子
  async function updatePostAction(id: number | string, data: {
    title?: string
    description?: string
    tag?: string
  }) {
    try {
      const post = await updatePost(id, data)
      const index = posts.value.findIndex(p => p.id === Number(id))
      if (index !== -1) {
        posts.value[index] = post
      }
      if (currentPost.value?.id === Number(id)) {
        currentPost.value = post
      }
      return post
    } catch (error) {
      throw error
    }
  }

  // 删除帖子
  async function deletePostAction(id: number | string) {
    try {
      await deletePost(id)
      posts.value = posts.value.filter(p => p.id !== Number(id))
      if (currentPost.value?.id === Number(id)) {
        currentPost.value = null
      }
    } catch (error) {
      throw error
    }
  }

  // 点赞帖子
  async function likePostAction(id: number | string) {
    try {
      await likePost(id)
      const post = posts.value.find(p => p.id === Number(id))
      if (post) {
        post.likeCount++
      }
      if (currentPost.value?.id === Number(id)) {
        currentPost.value.likeCount++
      }
    } catch (error) {
      throw error
    }
  }

  // 收藏帖子
  async function favoritePostAction(id: number | string) {
    try {
      await favoritePost(id)
      const post = posts.value.find(p => p.id === Number(id))
      if (post) {
        post.favorite = !post.favorite
      }
      if (currentPost.value?.id === Number(id)) {
        currentPost.value.favorite = !currentPost.value.favorite
      }
    } catch (error) {
      throw error
    }
  }

  return {
    posts,
    currentPost,
    total,
    loading,
    comments,
    fetchPosts,
    fetchPostDetail,
    createPostAction,
    updatePostAction,
    deletePostAction,
    likePostAction,
    favoritePostAction,
    fetchCommentList
  }
})