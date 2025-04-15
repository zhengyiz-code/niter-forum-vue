import Mock from 'mockjs'
import type { CommentData, ApiResponse } from '@/types/index.ts'

const Random = Mock.Random

// 生成随机评论数据
function generateComments(postId: number, count: number): CommentData[] {
  const comments: CommentData[] = []
  
  for (let i = 0; i < count; i++) {
    const id = Random.integer(1, 1000)
    const commentator = Random.integer(1, 100)
    
    // 创建用户信息
    const user = {
      id: commentator,
      name: Random.cname(),
      avatarUrl: Random.avatar(),
      vipRank: Random.integer(0, 1),
      groupId: Random.integer(1, 20)
    }
    
    const comment: CommentData = {
      id,
      parentId: postId,
      type: 1,
      commentator,
      content: Random.cparagraph(1, 3),
      likeCount: Random.integer(0, 50),
      commentCount: Random.integer(0, 10),
      gmtCreate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtModified: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtModifiedStr: Random.date('yyyy-MM-dd') + ' ' + Random.time('HH:mm'),
      user
    }
    
    comments.push(comment)
  }
  
  return comments
}

// Mock获取评论列表API
Mock.mock(/\/api\/posts\/(\d+)\/comments(\?.+)?$/, 'get', (options) => {
  const url = new URL('http://example.com' + options.url)
  const postId = parseInt(url.pathname.split('/')[3])
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  
  const comments = generateComments(postId, size)
  const response: ApiResponse<{ content: CommentData[]; total: number }> = {
    code: 200,
    message: '操作成功',
    data: {
      content: comments,
      total: 100 // 假设总共有100条评论
    }
  }
  
  return response
})

// Mock发表评论API
Mock.mock(/\/api\/posts\/(\d+)\/comments$/, 'post', (options) => {
  const url = new URL('http://example.com' + options.url)
  const postId = parseInt(url.pathname.split('/')[3])
  const data = JSON.parse(options.body)
  
  const newComment: CommentData = {
    id: Random.integer(1001, 2000),
    parentId: postId,
    type: 1,
    commentator: data.commentator || 1,
    content: data.content,
    likeCount: 0,
    commentCount: 0,
    gmtCreate: new Date().toISOString(),
    gmtModified: new Date().toISOString(),
    gmtModifiedStr: new Date().toLocaleString(),
    user: {
      id: data.commentator || 1,
      name: '当前用户',
      avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      vipRank: 0,
      groupId: 10
    }
  }
  
  const response: ApiResponse<CommentData> = {
    code: 200,
    message: '评论成功',
    data: newComment
  }
  
  return response
})

// Mock点赞评论API
Mock.mock(/\/api\/posts\/(\d+)\/comments\/(\d+)\/like$/, 'post', (options) => {
  const response: ApiResponse<null> = {
    code: 200,
    message: '点赞成功',
    data: null
  }
  return response
})

// Mock取消点赞评论API
Mock.mock(/\/api\/posts\/(\d+)\/comments\/(\d+)\/like$/, 'delete', (options) => {
  const response: ApiResponse<null> = {
    code: 200,
    message: '取消点赞成功',
    data: null
  }
  return response
})

// Mock获取评论回复列表API
Mock.mock(/\/api\/posts\/(\d+)\/comments\/(\d+)\/replies(\?.+)?$/, 'get', (options) => {
  const url = new URL('http://example.com' + options.url)
  const postId = parseInt(url.pathname.split('/')[3])
  const commentId = parseInt(url.pathname.split('/')[5])
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  
  const replies = generateComments(commentId, size)
  
  const response: ApiResponse<{ content: CommentData[]; total: number }> = {
    code: 200,
    message: '操作成功',
    data: {
      content: replies,
      total: 50 // 假设总共有50条回复
    }
  }
  
  return response
})