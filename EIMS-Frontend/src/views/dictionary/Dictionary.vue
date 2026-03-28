<template>
  <MainLayout>
    <div class="dictionary-page">
      <div class="dictionary-header">
        <h1>数据字典管理</h1>
        <p>统一管理系统中的基础数据和代码定义</p>
      </div>
      <div class="dictionary-content">
        <a-card class="dictionary-card">
          <template #title>
            <div class="card-title">
              <span>功能模块</span>
            </div>
          </template>
          <div class="module-grid">
            <div class="module-item">
              <a-card hoverable class="module-card">
                <div class="module-icon">
                  <FileTextOutlined />
                </div>
                <div class="module-name">字典分类</div>
                <div class="module-desc">管理数据字典的分类结构</div>
                <a-button type="primary" size="small" class="module-btn">
                  查看
                </a-button>
              </a-card>
            </div>
            <div class="module-item">
              <a-card hoverable class="module-card">
                <div class="module-icon">
                  <FormOutlined />
                </div>
                <div class="module-name">字典项管理</div>
                <div class="module-desc">管理具体的字典数据项</div>
                <a-button type="primary" size="small" class="module-btn">
                  查看
                </a-button>
              </a-card>
            </div>
            <div class="module-item">
              <a-card hoverable class="module-card">
                <div class="module-icon">
                  <SyncOutlined />
                </div>
                <div class="module-name">数据同步</div>
                <div class="module-desc">同步和更新字典数据</div>
                <a-button type="primary" size="small" class="module-btn">
                  查看
                </a-button>
              </a-card>
            </div>
            <div class="module-item">
              <a-card hoverable class="module-card">
                <div class="module-icon">
                  <SettingOutlined />
                </div>
                <div class="module-name">字典设置</div>
                <div class="module-desc">配置字典相关参数</div>
                <a-button type="primary" size="small" class="module-btn">
                  查看
                </a-button>
              </a-card>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../../components/layout/MainLayout.vue'
import { 
  FileTextOutlined, 
  FormOutlined, 
  SyncOutlined, 
  SettingOutlined 
} from '@ant-design/icons-vue'
</script>

<style scoped>
.dictionary-page {
  width: 100%;
  padding: 24px;
}

.dictionary-header {
  margin-bottom: 24px;
}

.dictionary-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.dictionary-header p {
  font-size: 14px;
  color: #666;
}

.dictionary-card {
  margin-bottom: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.module-item {
  transition: all 0.3s ease;
}

.module-item:hover {
  transform: translateY(-2px);
}

.module-card {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.module-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
  text-align: center;
}

.module-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.module-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.4;
}

.module-btn {
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .dictionary-page {
    padding: 16px;
  }
  
  .module-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .dictionary-header h1 {
    font-size: 20px;
  }
}
</style>