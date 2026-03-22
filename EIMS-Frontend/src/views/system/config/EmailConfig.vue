<template>
  <AppLayout>
    <div class="email-config-page">
      <a-card title="邮件配置">
        <div class="card-content">
          <a-form
            :model="form"
            :rules="rules"
            ref="formRef"
            layout="vertical"
          >
            <a-form-item label="SMTP服务器" name="smtpServer">
              <a-input v-model:value="form.smtpServer" placeholder="请输入SMTP服务器地址" />
            </a-form-item>
            <a-form-item label="SMTP端口" name="smtpPort">
              <a-input-number v-model:value="form.smtpPort" :min="1" :max="65535" />
            </a-form-item>
            <a-form-item label="发件人邮箱" name="senderEmail">
              <a-input v-model:value="form.senderEmail" placeholder="请输入发件人邮箱" />
            </a-form-item>
            <a-form-item label="发件人名称" name="senderName">
              <a-input v-model:value="form.senderName" placeholder="请输入发件人名称" />
            </a-form-item>
            <a-form-item label="SMTP用户名" name="smtpUsername">
              <a-input v-model:value="form.smtpUsername" placeholder="请输入SMTP用户名" />
            </a-form-item>
            <a-form-item label="SMTP密码" name="smtpPassword">
              <a-input-password v-model:value="form.smtpPassword" placeholder="请输入SMTP密码" />
            </a-form-item>
            <a-form-item label="是否启用SSL" name="enableSsl">
              <a-switch v-model:checked="form.enableSsl" />
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
  smtpServer: 'smtp.example.com',
  smtpPort: 465,
  senderEmail: 'noreply@example.com',
  senderName: 'EIMS系统',
  smtpUsername: 'username',
  smtpPassword: 'password',
  enableSsl: true
})

const rules = {
  smtpServer: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  senderEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  smtpUsername: [
    { required: true, message: '请输入SMTP用户名', trigger: 'blur' }
  ],
  smtpPassword: [
    { required: true, message: '请输入SMTP密码', trigger: 'blur' }
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
.email-config-page {
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