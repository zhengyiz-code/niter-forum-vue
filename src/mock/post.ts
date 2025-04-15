import Mock from 'mockjs'
import type { Post, CommentData, PaginationData, ApiResponse } from '@/types/index.ts'

const Random = Mock.Random

// 生成一个随机头像
Random.extend({
  avatar: function() {
    const avatars = [
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
    ]
    return avatars[Math.floor(Math.random() * avatars.length)]
  }
})

// 生成帖子列表
function generatePosts(count: number): Post[] {
  const posts: Post[] = []
  
  for (let i = 0; i < count; i++) {
    const id = Random.integer(1, 1000)
    const creatorId = Random.integer(1, 100)
    const commentCount = Random.integer(0, 100)
    const viewCount = Random.integer(50, 1000)
    const likeCount = Random.integer(0, 200)
    const status = Random.integer(0, 1)
    const column2 = Random.integer(1, 6)
    const permission = Random.integer(0, 1)
    
    // 创建用户信息
    const user = {
      id: creatorId,
      name: Random.cname(),
      avatarUrl: Random.avatar(),
      vipRank: Random.integer(0, 1),
      groupId: Random.integer(1, 20)
    }
    
    // 创建用户账号信息
    const userAccount = {
      id: Random.integer(1, 1000),
      userId: creatorId,
      groupId: Random.integer(1, 20),
      vipRank: Random.integer(0, 1)
    }
    
    const post: Post = {
      id,
      title: Random.ctitle(10, 30),
      description: Random.cparagraph(5, 10),
      tag: [
        '讨论', '分享', '问答', '建议', '公告', 
        'Vue', 'React', 'JavaScript', 'TypeScript', 'CSS'
      ].slice(0, Random.integer(1, 5)).join(','),
      creatorId,
      commentCount,
      viewCount,
      likeCount,
      status,
      column2,
      permission,
      gmtCreate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtModified: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtLatestComment: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtLatestCommentStr: Random.date('yyyy-MM-dd') + ' ' + Random.time('HH:mm'),
      user,
      userAccount,
      favorite: Random.boolean(),
      edited: Random.boolean(),
      sticky: Random.boolean(),
      essence: status === 1,
      canEdit: Random.boolean(),
      canDelete: Random.boolean(),
      canSticky: false,
      canEssence: false,
      canPromote: false,
      canClassify: false
    }
    
    posts.push(post)
  }
  
  return posts
}

// 生成评论列表
function generateComments(postId: number, count: number): Comment[] {
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
    
    const comment: Comment = {
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

// 预生成一些置顶帖子
const topPosts = generatePosts(5).map(post => {
  post.sticky = true
  post.status = 2
  return post
})

// Mock帖子列表API
Mock.mock(/\/api\/posts(\?.+)?$/, 'get', (options) => {
  const url = new URL('http://example.com' + options.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  const sort = url.searchParams.get('sort') || 'new'
  const tag = url.searchParams.get('tag')
  const column = url.searchParams.get('column')
  
  // 根据不同的参数，可以返回不同的帖子列表
  let posts = generatePosts(size)
  
  if (tag) {
    posts = posts.filter(post => post.tag.includes(tag))
  }
  
  if (column) {
    const columnNum = parseInt(column)
    posts = posts.filter(post => post.column2 === columnNum)
  }
  
  // 根据排序参数进行排序
  if (sort === 'hot7' || sort === 'hot30') {
    posts.sort((a, b) => b.viewCount - a.viewCount)
  } else if (sort === 'good') {
    posts = posts.filter(post => post.essence)
  } else if (sort === 'no') {
    posts = posts.filter(post => post.commentCount === 0)
  }
  
  const totalCount = 100 // 假设总共有100条数据
  
  const paginationData: PaginationData<Post> = {
    total: totalCount,
    page,
    size,
    totalPage: Math.ceil(totalCount / size),
    data: posts
  }
  
  const response: ApiResponse<PaginationData<Post>> = {
    code: 200,
    message: '操作成功',
    data: paginationData
  }
  
  return response
})

// Mock获取帖子详情API
Mock.mock(/\/api\/posts\/(\d+)\?_t=(\d+)$/, 'get', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1))
  
  const post = {
    ...generatePosts(1)[0],
    id
  }
  
  const response: ApiResponse<Post> = {
    code: 200,
    message: '操作成功',
    data: post
  }
  
  return response
})

// Mock获取帖子评论API
Mock.mock(/\/api\/post\/\d+\/comments$/, 'get', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.indexOf('/post/') + 6, url.lastIndexOf('/')))
  
  const comments = generateComments(id, Random.integer(3, 10))
  
  const response: ApiResponse<Comment[]> = {
    code: 200,
    message: '操作成功',
    data: comments
  }
  
  return response
})

// Mock发布帖子API
Mock.mock('/api/posts', 'post', (options) => {
  const newPost = JSON.parse(options.body)
  
  // 生成一个新的帖子
  const post: Post = {
    ...newPost,
    id: Random.integer(1001, 2000),
    commentCount: 0,
    viewCount: 0,
    likeCount: 0,
    status: 0,
    gmtCreate: new Date().toISOString(),
    gmtModified: new Date().toISOString(),
    gmtLatestComment: new Date().toISOString(),
    gmtLatestCommentStr: new Date().toLocaleString(),
    user: {
      id: newPost.creatorId,
      name: '当前用户',
      avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      vipRank: 0,
      groupId: 10
    },
    userAccount: {
      id: Random.integer(1, 1000),
      userId: newPost.creatorId,
      groupId: 10,
      vipRank: 0
    }
  }
  
  const response: ApiResponse<Post> = {
    code: 200,
    message: '发布成功',
    data: post
  }
  
  return response
})

// Mock获取置顶帖子列表
Mock.mock('/api/posts/top', 'get', () => {
  const response: ApiResponse<Post[]> = {
    code: 200,
    message: '操作成功',
    data: topPosts
  }
  
  return response
})

// Mock获取热门标签
Mock.mock('/api/tags', 'get', () => {
  const tags = [
    '前端', '后端', 'Vue', 'React', 'Spring', 
    'JavaScript', 'TypeScript', 'Java', 'Python', 'Node.js',
    'CSS', 'HTML', '问答', '分享', '讨论'
  ]
  
  const response: ApiResponse<string[]> = {
    code: 200,
    message: '操作成功',
    data: tags
  }
  
  return response
})

// Mock发表评论API
Mock.mock(/\/api\/posts\/\d+\/comments$/, 'post', (options) => {
  const url = options.url
  const postId = parseInt(url.substring(url.indexOf('/post/') + 6, url.lastIndexOf('/')))
  const commentData = JSON.parse(options.body)
  
  const newComment: Comment = {
    id: Random.integer(1001, 2000),
    parentId: postId,
    type: 1,
    commentator: commentData.commentator,
    content: commentData.content,
    likeCount: 0,
    commentCount: 0,
    gmtCreate: new Date().toISOString(),
    gmtModified: new Date().toISOString(),
    gmtModifiedStr: new Date().toLocaleString(),
    user: {
      id: commentData.commentator,
      name: '当前用户',
      avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      vipRank: 0,
      groupId: 10
    }
  }
  
  const response: ApiResponse<Comment> = {
    code: 200,
    message: '评论成功',
    data: newComment
  }
  
  return response
})

// Mock点赞帖子API
Mock.mock(/\/api\/posts\/\d+\/like$/, 'post', (options) => {
 
  const url = options.url

  const response: ApiResponse<null> = {
    code: 200,
    message: '评论成功',
    data: null
  }
  
  return response
})

// Mock收藏API
Mock.mock(/\/api\/posts\/\d+\/favorite$/, 'post', (options) => {
 
  const url = options.url
  
  const response: ApiResponse<null> = {
    code: 200,
    message: '评论成功',
    data: null
  }
  
  return response
})