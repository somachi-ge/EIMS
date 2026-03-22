<template>
  <AppLayout>
    <div class="restore-data-page">
      <a-card title="数据恢复">
        <div class="card-content">
          <a-form
            :model="form"
            :rules="rules"
            ref="formRef"
            layout="vertical"
          >
            <a-form-item label="备份文件" name="backupFile">
              <a-upload
                name="file"
                action="/api/upload"
                listType="text"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  选择备份文件
                </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item label="恢复选项" name="restoreOptions">
              <a-checkbox-group v-model:value="form.restoreOptions">
                <a-checkbox value="users">用户数据</a-checkbox>
                <a-checkbox value="roles">角色数据</a-checkbox>
                <a-checkbox value="departments">部门数据</a-checkbox>
                <a-checkbox value="configs">配置数据</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="是否覆盖现有数据" name="overwriteData">
              <a-switch v-model:checked="form.overwriteData" />
            </a-form-item>
            <div class="form-actions">
              <a-button @click="handleCancel">取消</a-button>
              <a-button type="primary" @click="handleRestore">恢复数据</a-button>
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
  backupFile: '',
  restoreOptions: ['users', 'roles', 'departments', 'configs'],
  overwriteData: true
})

const rules = {
  backupFile: [
    { required: true, message: '请选择备份文件', trigger: 'blur' }
  ],
  restoreOptions: [
    { required: true, message: '请选择恢复选项', trigger: 'blur' }
  ]
}

const handleCancel = () => {
  // 取消操作
  console.log('取消操作')
}

const handleRestore = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate()
      // 执行恢复操作
      console.log('执行恢复操作', form)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
}
</script>

<style scoped>
.restore-data-page {
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