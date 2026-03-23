<template>
  <div class="department-list-container">
    <h3>Department List</h3>
    <a-card title="部门管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          添加部门
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="departmentList"
        :pagination="false"
        row-key="id"
      >
        <template #action="{ record }">
          <a-button type="link" @click="handleEdit(record.id)">
            编辑
          </a-button>
          <a-popconfirm
            title="确定要删除此部门吗？"
            @confirm="handleDelete(record.id)"
          >
            <a-button type="link" danger>
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        style="margin-top: 16px"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const current = ref(1);
const pageSize = ref(10);
const total = ref(0);
const departmentList = ref([
  {
    id: 1,
    name: '技术部',
    parent_id: 0,
    leader: '张三',
    created_at: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '市场部',
    parent_id: 0,
    leader: '李四',
    created_at: '2024-01-01 10:00:00'
  }
]);

total.value = departmentList.value.length;

const columns = [
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '上级部门',
    dataIndex: 'parent_id',
    key: 'parent_id',
    slots: {
      customRender: 'parent'
    }
  },
  {
    title: '部门负责人',
    dataIndex: 'leader',
    key: 'leader'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: '操作',
    key: 'action',
    slots: {
      customRender: 'action'
    }
  }
];

const handleAdd = () => {
  // 处理添加部门
  console.log('添加部门');
};

const handleEdit = (id: number) => {
  // 处理编辑部门
  console.log('编辑部门:', id);
};

const handleDelete = (id: number) => {
  // 处理删除部门
  console.log('删除部门:', id);
};

onMounted(() => {
  // 加载部门列表
  loadDepartmentList();
});

const loadDepartmentList = () => {
  // 这里应该调用实际的API接口
  // const response = await departmentApi.getDepartmentList({ page: current.value, page_size: pageSize.value });
  // departmentList.value = response.data.list;
  // total.value = response.data.total;
};
</script>

<style scoped>
.department-list-container {
  width: 100%;
  padding: 1.5%;
}

h3 {
  margin-bottom: 20px;
  color: #1890ff;
}
</style>