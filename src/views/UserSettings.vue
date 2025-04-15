<template>
  <div class="user-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h2>个人设置</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基本信息设置 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="100px"
            class="settings-form"
          >
            <el-form-item label="头像">
              <div class="avatar-upload">
                <el-avatar :size="100" :src="basicForm.avatar || '/default-avatar.png'" />
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button type="primary" size="small">更换头像</el-button>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="用户名" prop="username">
              <el-input v-model="basicForm.username" />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="basicForm.nickname" />
            </el-form-item>

            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="basicForm.bio"
                type="textarea"
                :rows="4"
                placeholder="介绍一下你自己吧~"
              />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="basicForm.email" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleBasicSubmit" :loading="basicLoading">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 密码修改 -->
        <el-tab-pane label="密码修改" name="password">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
            class="settings-form"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handlePasswordSubmit" :loading="passwordLoading">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notification">
          <el-form
            ref="notificationFormRef"
            :model="notificationForm"
            label-width="120px"
            class="settings-form"
          >
            <el-form-item label="新评论通知">
              <el-switch v-model="notificationForm.commentNotification" />
            </el-form-item>

            <el-form-item label="新关注通知">
              <el-switch v-model="notificationForm.followNotification" />
            </el-form-item>

            <el-form-item label="系统通知">
              <el-switch v-model="notificationForm.systemNotification" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleNotificationSubmit" :loading="notificationLoading">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const userStore = useUserStore()

// 状态
const activeTab = ref('basic')
const basicLoading = ref(false)
const passwordLoading = ref(false)
const notificationLoading = ref(false)

// 表单引用
const basicFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const notificationFormRef = ref<FormInstance>()

// 基本信息表单
const basicForm = ref({
  username: '',
  nickname: '',
  bio: '',
  email: '',
  avatar: ''
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 通知设置表单
const notificationForm = ref({
  commentNotification: true,
  followNotification: true,
  systemNotification: true
})

// 表单验证规则
const basicRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const loginUserInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')
    const response = await userStore.fetchUserInfo(loginUserInfo.id)
    const userData = response
    basicForm.value = {
      username: userData.name,
      nickname: userData.nickname,
      bio: userData.bio,
      email: userData.email,
      avatar: userData.avatarUrl
    }
    notificationForm.value = {
      commentNotification: userData.commentNotification,
      followNotification: userData.followNotification,
      systemNotification: userData.systemNotification
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 处理头像上传
const handleAvatarSuccess = (response: any) => {
  basicForm.value.avatar = response.data.url
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 提交基本信息
const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return
  
  try {
    await basicFormRef.value.validate()
    basicLoading.value = true
    await userStore.updateInfo(basicForm.value)
    ElMessage.success('基本信息更新成功')
  } catch (error) {
    ElMessage.error('更新失败，请检查输入')
  } finally {
    basicLoading.value = false
  }
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    await userStore.updatePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    ElMessage.error('密码修改失败，请检查输入')
  } finally {
    passwordLoading.value = false
  }
}

// 提交通知设置
const handleNotificationSubmit = async () => {
  try {
    notificationLoading.value = true
    await userStore.updateNotificationSettings(notificationForm.value)
    ElMessage.success('通知设置更新成功')
  } catch (error) {
    ElMessage.error('设置更新失败')
  } finally {
    notificationLoading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped lang="scss">
.user-settings {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
  margin-top: 50px;

  .settings-card {
    .card-header {
      h2 {
        margin: 0;
        font-size: 20px;
        color: #333;
      }
    }
  }

  .settings-form {
    max-width: 500px;
    margin: 20px auto;

    .avatar-upload {
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }
}
</style> 