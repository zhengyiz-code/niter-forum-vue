// 通用API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginationData<T> {
  total: number
  page: number
  size: number
  totalPage: number
  data: T[]
}

// 用户类型
export interface User {
  id: number
  name: string
  avatarUrl: string
  vipRank: number
  groupId: number
  bio?: string
  gmtCreate?: string
  gmtModified?: string
}

// 用户资料类型
export interface UserProfile extends User {
  email: string
  phone?: string
  location?: string
  website?: string
  followers: number
  following: number
  posts: number
  comments: number
}

// 用户账号类型
export interface UserAccount {
  id: number
  userId: number
  groupId: number
  vipRank: number
}

// 用户账号类型
export interface NotificationData {
  id: number
  userId: number
  groupId: number
  vipRank: number
}

// 帖子类型
export interface Post {
  id: number
  title: string
  description: string
  tag: string
  creatorId: number
  commentCount: number
  viewCount: number
  likeCount: number
  status: number
  column2: number
  permission: number
  gmtCreate: string
  gmtModified: string
  gmtLatestComment: string
  gmtLatestCommentStr?: string
  user: User
  userAccount: UserAccount
  favorite?: boolean
  edited?: boolean
  sticky?: boolean
  essence?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canSticky?: boolean
  canEssence?: boolean
  canPromote?: boolean
  canClassify?: boolean
}

// 评论类型
export interface CommentData {
  id: number
  parentId: number
  type: number
  commentator: number
  content: string
  likeCount: number
  commentCount: number
  gmtCreate: string
  gmtModified: string
  gmtModifiedStr?: string
  user: User
}

// 帖子查询参数类型
export interface PostQueryParams {
  page?: number
  size?: number
  sort?: 'new' | 'hot' | 'hot7' | 'hot30' | 'good' | 'no'
  tag?: string
  column?: number
  keyword?: string
}

// 评论查询参数类型
export interface CommentQueryParams {
  page?: number
  pageSize?: number
  sort?: 'latest' | 'hot'
}

// 登录请求参数类型
export interface LoginParams {
  username: string
  password: string
}

// 注册请求参数类型
export interface RegisterParams extends LoginParams {
  email: string
}

// 发布帖子参数类型
export interface PublishPostParams {
  title: string
  description: string
  tag: string
  creatorId: number
  column2: number
}

// 发表评论参数类型
export interface CreateCommentParams {
  content: string
  parentId?: number
} 