<template>
  <div v-if="loadingStore.loading" class="global-loading">
    <div class="loading-mask"></div>
    <div class="loading-content">
      <el-icon class="loading-icon" :size="30">
        <Loading />
      </el-icon>
      <span class="loading-text">{{ loadingStore.loadingText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<style scoped lang="scss">
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
  }

  .loading-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .loading-icon {
      color: #409EFF;
      animation: rotate 1s linear infinite;
    }

    .loading-text {
      color: #409EFF;
      font-size: 14px;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 