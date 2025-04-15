<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="$router.push('/')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外的逻辑
</script>

<style scoped lang="scss">
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;

  .content {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 120px;
      color: #409EFF;
      margin: 0;
      line-height: 1;
      font-weight: bold;
    }

    h2 {
      font-size: 30px;
      color: #333;
      margin: 20px 0;
    }

    p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
  }
}
</style> 