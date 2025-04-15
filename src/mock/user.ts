import Mock from 'mockjs'
import type { ApiResponse, User } from '@/types/index.ts'

const Random = Mock.Random

// 生成用户列表
function generateUsers(count: number): User[] {
  const users: User[] = []
  
  for (let i = 0; i < count; i++) {
    const id = Random.integer(10000, 20000)
    
    const user: User = {
      id,
      name: Random.cname(),
      avatarUrl: Random.avatar(),
      vipRank: Random.integer(0, 1),
      groupId: Random.integer(1, 20),
      bio: Random.cparagraph(1, 2),
      gmtCreate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      gmtModified: Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
    
    users.push(user)
  }
  
  return users
}

// 预设的用户列表，用于展示最近访客
const recentUsers = generateUsers(8)

// Mock 用户登录
Mock.mock('/api/user/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username && password) {
    const user: StoreUserInfo = {
      id: 1,
      name: username,
      avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      groupId: 10,
      vipRank: 0
    }
    
    const response: ApiResponse<StoreUserInfo> = {
      code: 200,
      message: '登录成功',
      data: {
        token: Random.string(32),
        user
      }
    }
    
    return response
  } else {
    return {
      code: 400,
      message: '用户名或密码错误',
      data: null
    }
  }
})

// Mock 用户注册
Mock.mock('/api/user/register', 'post', (options) => {
  const { username, password, email } = JSON.parse(options.body)
  if (username && password && email) {
    const user: StoreUserInfo = {
      id: Random.integer(101, 1000),
      name: username,
      avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      groupId: 1,
      vipRank: 0,
      email
    }
    const response: ApiResponse<StoreUserInfo> = {
      code: 200,
      message: '注册成功',
      data: user
    }
    
    return response
  } else {
    return {
      code: 400,
      message: '注册信息不完整',
      data: null
    }
  }
})

// Mock 获取用户信息
Mock.mock(/\/api\/user\/\d+$/, 'get', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1))
  
  // 随机生成一个用户信息
  const user = {
    ...generateUsers(1)[0],
    id
  }
  
  const response: ApiResponse<User> = {
    code: 200,
    message: '操作成功',
    data: user
  }
  
  return response
})

// Mock 获取最近访客
Mock.mock('/api/users/recent', 'get', () => {
  const response: ApiResponse<User[]> = {
    code: 200,
    message: '操作成功',
    data: recentUsers
  }
  
  return response
})

// Mock 获取当前用户信息
Mock.mock(/\/api\/user\/info(\?.+)?$/, 'get', () => {

  const user: User = {
    id: 1,
    name: 'Mock用户',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    vipRank: 0,
    groupId: 10,
    bio: '这是一个模拟用户',
    gmtCreate: '2023-01-01 00:00:00',
    gmtModified: '2023-01-01 00:00:00'
  }
  
  const response: ApiResponse<User> = {
    code: 200,
    message: '操作成功',
    data: user
  }
  return response
})

// Mock 关注用户
Mock.mock(/\/api\/user\/\d+\/follow$/, 'post', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  
  const response: ApiResponse<null> = {
    code: 200,
    message: '关注成功',
    data: null
  }
  
  return response
})

// Mock 取消关注用户
Mock.mock(/\/api\/user\/\d+\/unfollow$/, 'post', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  
  const response: ApiResponse<null> = {
    code: 200,
    message: '取消关注成功',
    data: null
  }
  
  return response
})

// Mock 获取用户关注列表
Mock.mock(/\/api\/user\/\d+\/following\?_t=(\d+)$/, 'get', (options) => {
  const url = options.url
  const userId = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  
  const response: ApiResponse<User[]> = {
    code: 200,
    message: '操作成功',
    data: generateUsers(5)
  }
  
  return response
})

// Mock 获取用户粉丝列表
Mock.mock(/\/api\/user\/\d+\/followers\?_t=(\d+)$/, 'get', (options) => {
  const url = options.url
  const userId = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  
  const response: ApiResponse<User[]> = {
    code: 200,
    message: '操作成功',
    data: generateUsers(5)
  }
  
  return response
})

// Mock 获取用户资料
Mock.mock(/\/api\/user\/\d+\/profile\?_t=(\d+)$/, 'get', (options) => {
  const url = options.url
  const id = parseInt(url.substring(url.lastIndexOf('/') - 1, url.lastIndexOf('/')))
  
  const user = {
    ...generateUsers(1)[0],
    id,
    email: Random.email(),
    phone: '1' + Random.string('number', 10),
    gender: Random.integer(0, 1),
    location: Random.city(true)
  }
  
  const response: ApiResponse<User> = {
    code: 200,
    message: '操作成功',
    data: user
  }
  
  return response
})