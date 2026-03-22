<template>
  <AppLayout>
    <div class="backup-config-page">
      <a-card title="备份配置">
        <div class="card-content">
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
            <div class="form-actions">
              <a-button @click="handleCancel">取消</a-button>
              <a-button type="primary" @click="handleSubmit">保存</a-button>
            </div>
          </a-form>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppLayout from '../../../components/layout/AppLayout.vue'

const formRef = ref()

const form = reactive({
  backupPath: '/backup',
  backupFrequency: 'daily',
  backupTime: '00:00',
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
  console.log('取消操作')
}

const handleSubmit = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate()
      // 提交表单
      console.log('提交表单', form)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
}
</script>

<style scoped>
.backup-config-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>