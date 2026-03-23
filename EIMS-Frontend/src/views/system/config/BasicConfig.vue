<template>
  <AppLayout>
    <div class="basic-config-page">
      <a-card title="基础配置">
        <div class="card-content">
          <a-form
            :model="form"
            :rules="rules"
            ref="formRef"
            layout="vertical"
          >
            <a-form-item label="系统名称" name="systemName">
              <a-input v-model:value="form.systemName" placeholder="请输入系统名称" />
            </a-form-item>
            <a-form-item label="系统版本" name="systemVersion">
              <a-input v-model:value="form.systemVersion" placeholder="请输入系统版本" />
            </a-form-item>
            <a-form-item label="系统描述" name="systemDescription">
              <a-textarea v-model:value="form.systemDescription" placeholder="请输入系统描述" rows="4" />
            </a-form-item>
            <a-form-item label="系统Logo" name="systemLogo">
              <a-upload
                name="logo"
                action="/api/upload"
                listType="picture"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  上传Logo
                </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item label="是否启用验证码" name="enableCaptcha">
              <a-switch v-model:checked="form.enableCaptcha" />
            </a-form-item>
            <a-form-item label="是否启用多语言" name="enableMultiLanguage">
              <a-switch v-model:checked="form.enableMultiLanguage" />
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
import { UploadOutlined } from '@ant-design/icons-vue'
import AppLayout from '../../../components/layout/AppLayout.vue'

const formRef = ref()

const form = reactive({
  systemName: 'EIMS企业综合管理系统',
  systemVersion: '1.0.0',
  systemDescription: '企业综合管理系统',
  systemLogo: '',
  enableCaptcha: true,
  enableMultiLanguage: false
})

const rules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
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
.basic-config-page {
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