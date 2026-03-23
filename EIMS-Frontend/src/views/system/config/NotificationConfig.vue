<template>
  <AppLayout>
    <div class="notification-config-page">
      <a-card title="通知配置">
        <div class="card-content">
          <a-form
            :model="form"
            :rules="rules"
            ref="formRef"
            layout="vertical"
          >
            <a-form-item label="是否启用系统通知" name="enableSystemNotification">
              <a-switch v-model:checked="form.enableSystemNotification" />
            </a-form-item>
            <a-form-item label="是否启用邮件通知" name="enableEmailNotification">
              <a-switch v-model:checked="form.enableEmailNotification" />
            </a-form-item>
            <a-form-item label="是否启用短信通知" name="enableSmsNotification">
              <a-switch v-model:checked="form.enableSmsNotification" />
            </a-form-item>
            <a-form-item label="通知标题前缀" name="notificationPrefix">
              <a-input v-model:value="form.notificationPrefix" placeholder="请输入通知标题前缀" />
            </a-form-item>
            <a-form-item label="通知模板" name="notificationTemplate">
              <a-textarea v-model:value="form.notificationTemplate" placeholder="请输入通知模板" rows="4" />
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
  enableSystemNotification: true,
  enableEmailNotification: false,
  enableSmsNotification: false,
  notificationPrefix: '【EIMS系统】',
  notificationTemplate: '尊敬的用户，您有一条新的系统通知：{content}'
})

const rules = {
  notificationPrefix: [
    { required: true, message: '请输入通知标题前缀', trigger: 'blur' }
  ],
  notificationTemplate: [
    { required: true, message: '请输入通知模板', trigger: 'blur' }
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
.notification-config-page {
  width: 100%;
  padding: 1.5%;
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