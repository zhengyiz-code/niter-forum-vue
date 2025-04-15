<template>
  <div class="sidebar">

    <div class="card">
      <div class="card-title">广告招募</div>
      <div class="ad-content">
        <a href="https://github.com/yourkevin/NiterForum/" target="_blank" class="ad-link">
          NiterForum 2.0 - 尼特网 旗舰之作
        </a>
      </div>
    </div>
    
    <!-- 社区二维码 -->
    <div class="card">
      <div class="card-title">扫码加入社区官方交流群</div>
      <div class="qrcode-content">
        <img src="https://via.placeholder.com/200x200" alt="QR Code">
      </div>
    </div>
    
    <!-- 友情链接 -->
    <div class="card">
      <div class="card-title">友情链接</div>
      <div class="link-list">
        <div class="link-item">
          <a href="https://niter.cn/" target="_blank">NiterForum</a>
        </div>
        <div class="link-item">
          <a href="https://github.com/yourkevin/NiterForum/" target="_blank">社区源码</a>
        </div>
        <div class="link-item">
          <a href="#" target="_blank">申请友链</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

</script>

<style scoped lang="scss">
.sidebar {
  .card {
    margin-bottom: 20px;
  }
  
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .tag {
      display: inline-block;
      padding: 4px 8px;
      background-color: #f2f2f2;
      color: #666;
      border-radius: 3px;
      transition: all 0.3s ease;
      font-size: 13px;
      
      &:hover {
        background-color: #409EFF;
        color: white;
      }
    }
  }
  
  .visitor-list {
    .visitor-item {
      margin-bottom: 10px;
      
      .visitor-link {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #333;
        
        &:hover {
          .visitor-name {
            color: #409EFF;
          }
        }
      }
      
      .visitor-info {
        flex: 1;
        
        .visitor-name {
          font-size: 14px;
          margin-bottom: 2px;
        }
        
        .visit-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .ad-content {
    background-color: #5FB878;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
    
    .ad-link {
      color: white;
      font-weight: bold;
      display: block;
    }
  }
  
  .qrcode-content {
    text-align: center;
    padding: 10px 0;
    
    img {
      max-width: 100%;
    }
  }
  
  .link-list {
    .link-item {
      margin-bottom: 8px;
      
      a {
        color: #666;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
}
</style> 