<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <el-result
        icon="error"
        title="出错了"
        :sub-title="error.message || '发生了一些错误'"
      >
        <template #extra>
          <el-button type="primary" @click="handleRetry">重试</el-button>
          <el-button @click="handleGoHome">返回首页</el-button>
        </template>
      </el-result>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { handleError } from '@/utils/errorHandler'

const router = useRouter()
const error = ref<Error | null>(null)

// 错误捕获
onErrorCaptured((err: Error) => {
  error.value = err
  handleError(err)
  return false // 阻止错误继续传播
})

// 重试
const handleRetry = () => {
  error.value = null
}

// 返回首页
const handleGoHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-boundary {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .error-content {
    max-width: 500px;
    width: 100%;
  }
}
</style> 