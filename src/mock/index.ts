// 导入Mock
import Mock from 'mockjs'
import './post'
import './user'
import './notification'
import './comment'

// 设置延时
Mock.setup({
  timeout: '200-600'
})

export default Mock 