<template>
  <div class="department-edit">
    <h2>编辑部门</h2>
    <FormModal
      :visible="modalVisible"
      :title="'编辑部门'"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <DepartmentForm @submit="formData = $event" :initial-data="formData" />
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
const formData = reactive({
  id: '',
  name: '',
  code: '',
  parentId: '',
  description: '',
  status: '1'
});

const handleClose = () => {
  modalVisible.value = false;
  // 可以添加路由跳转逻辑
};

const handleSubmit = async () => {
  try {
    await departmentStore.updateDepartment(formData.id, formData);
    modalVisible.value = false;
    // 可以添加成功提示和路由跳转逻辑
  } catch (error) {
    console.error('编辑部门失败:', error);
  }
};

onMounted(async () => {
  const departmentId = route.params.id as string;
  if (departmentId) {
    try {
      const department = await departmentStore.getDepartmentById(departmentId);
      Object.assign(formData, department);
    } catch (error) {
      console.error('获取部门信息失败:', error);
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