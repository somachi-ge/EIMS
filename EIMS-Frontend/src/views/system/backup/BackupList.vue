<template>
  <div class="backup-list">
    <a-card title="备份列表" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleCreateBackup">
          <template #icon><PlusOutlined /></template>
          创建备份
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="backupList"
        :pagination="false"
        row-key="id"
      >
        <template #action="{ record }">
          <a-button type="link" @click="handleRestore(record.id)">
            恢复
          </a-button>
          <a-popconfirm
            title="确定要删除此备份吗？"
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
const backupList = ref([
  {
    id: 1,
    name: '手动备份-20240101',
    size: '100MB',
    created_at: '2024-01-01 10:00:00',
    status: 'success'
  },
  {
    id: 2,
    name: '自动备份-20240102',
    size: '120MB',
    created_at: '2024-01-02 00:00:00',
    status: 'success'
  }
]);

total.value = backupList.value.length;

const columns = [
  {
    title: '备份名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '备份大小',
    dataIndex: 'size',
    key: 'size'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: {
      customRender: 'status'
    }
  },
  {
    title: '操作',
    key: 'action',
    slots: {
      customRender: 'action'
    }
  }
];

const handleCreateBackup = () => {
  // 处理创建备份
  console.log('创建备份');
};

const handleRestore = (id: number) => {
  // 处理恢复备份
  console.log('恢复备份:', id);
};

const handleDelete = (id: number) => {
  // 处理删除备份
  console.log('删除备份:', id);
};

onMounted(() => {
  // 加载备份列表
  loadBackupList();
});

const loadBackupList = () => {
  // 这里应该调用实际的API接口
  // const response = await backupApi.getBackupList({ page: current.value, page_size: pageSize.value });
  // backupList.value = response.data.list;
  // total.value = response.data.total;
};
</script>

<style scoped>
.backup-list {
  padding: 20px;
}
</style>