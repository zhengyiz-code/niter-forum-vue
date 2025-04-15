<template>
  <div class="post-form">
    <el-card>
      <template #header>
        <div class="form-header">
          <h2>{{ isEdit ? '编辑帖子' : '发布新帖' }}</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-select v-model="form.tag" placeholder="请选择标签">
            <el-option
              v-for="tag in tags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="内容" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="10"
            placeholder="请输入帖子内容"
            :maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="submitting"
          >
            {{ isEdit ? '保存' : '发布' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 判断是否为编辑模式
const isEdit = computed(() => route.name === 'post-edit')

// 表单数据
const form = reactive({
  title: '',
  tag: '',
  description: '',
  creatorId: userStore.userInfo?.id || 0,
  column2: 1 // 默认分类
})

// 标签选项
const tags = [
  '提问',
  '分享',
  '建议',
  '讨论',
  '公告',
  '动态'
]

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2-100个字符之间', trigger: 'blur' }
  ],
  tag: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, max: 5000, message: '内容长度应在10-5000个字符之间', trigger: 'blur' }
  ]
}

// 获取帖子详情（编辑模式）
const fetchPostDetail = async (id: string) => {
  try {
    await postStore.fetchPostDetail(id)
    const post = postStore.currentPost
    if (post) {
      form.title = post.title
      form.tag = post.tag
      form.description = post.description
      form.column2 = post.column2
    }
  } catch (error) {
    ElMessage.error('获取帖子详情失败')
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (isEdit.value) {
      await postStore.updatePostAction(route.params.id as string, {
        title: form.title,
        tag: form.tag,
        description: form.description
      })
      ElMessage.success('更新成功')
    } else {
      await postStore.createPostAction({
        title: form.title,
        tag: form.tag,
        description: form.description,
        creatorId: form.creatorId,
        column2: form.column2
      })
      ElMessage.success('发布成功')
    }
    
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? '更新失败' : '发布失败'))
  } finally {
    submitting.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  if (isEdit.value) {
    fetchPostDetail(route.params.id as string)
  }
})
</script>

<style scoped lang="scss">
.post-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .form-header {
    h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: bold;
  }

  :deep(.el-textarea__inner) {
    font-family: inherit;
    line-height: 1.6;
  }
}
</style> 