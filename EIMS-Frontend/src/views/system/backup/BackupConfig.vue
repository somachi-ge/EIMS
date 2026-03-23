<template>
  <div class="backup-config-container">
    <a-config-provider :locale="zhCN">
      <div class="backup-config-page">
        <a-card class="backup-config-card">
          <div class="backup-config-content">
            <a-form
              :model="form"
              :rules="rules"
              ref="formRef"
              layout="vertical"
            >
              <a-form-item label="备份路径" name="backupPath">
                <a-input v-model:value="form.backupPath" placeholder="请输入备份路径" />
              </a-form-item>
              <a-form-item label="备份频率" name="backupFrequency">
                <a-select v-model:value="form.backupFrequency" placeholder="请选择备份频率">
                  <a-select-option value="daily">每天</a-select-option>
                  <a-select-option value="weekly">每周</a-select-option>
                  <a-select-option value="monthly">每月</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="备份时间" name="backupTime">
                <a-time-picker v-model:value="form.backupTime" format="HH:mm" style="width: 120px" />
              </a-form-item>
              <a-form-item label="保留备份数量" name="backupRetention">
                <a-input-number v-model:value="form.backupRetention" :min="1" :max="100" />
              </a-form-item>
              <a-form-item label="是否启用自动备份" name="enableAutoBackup">
                <a-switch v-model:checked="form.enableAutoBackup" />
              </a-form-item>
              <div class="backup-config-actions">
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" @click="handleSubmit">保存</a-button>
              </div>
            </a-form>
          </div>
        </a-card>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const formRef = ref()

const form = reactive({
  backupPath: '/backup',
  backupFrequency: 'daily',
  backupTime: null as Date | null,
  backupRetention: 7,
  enableAutoBackup: true
})

const rules = {
  backupPath: [
    { required: true, message: '请输入备份路径', trigger: 'blur' }
  ],
  backupFrequency: [
    { required: true, message: '请选择备份频率', trigger: 'blur' }
  ],
  backupTime: [
    { required: true, message: '请选择备份时间', trigger: 'blur' }
  ],
  backupRetention: [
    { required: true, message: '请输入保留备份数量', trigger: 'blur' }
  ]
}

const handleCancel = () => {
  // 取消操作
  message.info('取消配置')
}

const handleSubmit = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate()
      // 提交表单
      console.log('提交表单', form)
      message.success('备份配置保存成功')
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('表单验证失败，请检查输入')
    }
  }
}

onMounted(() => {
  // 设置默认备份时间为00:00
  const defaultTime = new Date()
  defaultTime.setHours(0, 0, 0, 0)
  form.backupTime = defaultTime
})
</script>

<style scoped>
.backup-config-container {
  width: 100%;
  padding: 1.5%;
}

.backup-config-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.backup-config-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.backup-config-content {
  padding: 24px;
}

.backup-config-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #d9d9d9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.backup-config-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.backup-config-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .backup-config-page {
    padding: 20px;
  }
  
  .backup-config-content {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .backup-config-page {
    padding: 16px;
  }
  
  .backup-config-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .backup-config-page {
    padding: 12px;
  }
  
  .backup-config-content {
    padding: 16px;
  }
  
  .backup-config-actions {
    flex-direction: column;
  }
  
  .backup-config-actions :deep(.ant-btn) {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .backup-config-page {
    padding: 12px;
  }
  
  .backup-config-content {
    padding: 12px;
  }
  
  .backup-config-actions {
    margin-top: 20px;
    padding-top: 12px;
  }
}
</style>