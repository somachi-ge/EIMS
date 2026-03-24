<template>
  <div class="department-edit">
    <h2>编辑部门</h2>
    <FormModal
      :visible="modalVisible"
      :title="'编辑部门'"
      :loading="loading"
      @cancel="handleClose"
      @ok="handleSubmit"
    >
      <DepartmentForm ref="departmentForm" :departments="departments" :initialValues="formData" />
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FormModal from '@/components/common/FormModal.vue';
import DepartmentForm from '@/components/system/DepartmentForm.vue';
import { useDepartmentStore } from '@/stores/department';

const route = useRoute();
const departmentStore = useDepartmentStore();
const modalVisible = ref(true);
const loading = ref(false);
const departmentForm = ref<any>(null);
const departments = ref<Array<{ id: number; name: string }>>([]);
const formData = reactive({
  id: 0,
  name: '',
  parentId: 0,
  description: '',
  status: true
});

const handleClose = () => {
  modalVisible.value = false;
  // 可以添加路由跳转逻辑
};

const handleSubmit = async () => {
  try {
    if (departmentForm.value) {
      const valid = await departmentForm.value.validateForm();
      if (valid) {
        loading.value = true;
        const formData = departmentForm.value.getFormData();
        // 这里应该调用API更新部门
        console.log('更新部门:', formData);
        // 模拟API请求
        setTimeout(() => {
          modalVisible.value = false;
          // 可以添加成功提示和路由跳转逻辑
        }, 1000);
      }
    }
  } catch (error) {
    console.error('编辑部门失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // 获取部门列表
  await departmentStore.fetchDepartments();
  departments.value = departmentStore.departments.map(dept => ({ id: dept.id, name: dept.name }));
  
  const departmentId = Number(route.params.id);
  if (departmentId) {
    const department = departmentStore.getDepartmentById(departmentId);
    if (department) {
      Object.assign(formData, department);
    }
  }
});
</script>

<style scoped>
.department-edit {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
    color: #1890ff;
  }
}
</style>