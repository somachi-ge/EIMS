<template>
  <div class="operation-log">
    <a-card title="操作日志" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="logList"
        :pagination="false"
        row-key="id"
      >
        <template #status="{ record }">
          <a-tag :color="record.status === 'success' ? 'green' : 'red'">
            {{ record.status === 'success' ? '成功' : '失败' }}
          </a-tag>
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

const current = ref(1);
const pageSize = ref(10);
const total = ref(0);
const logList = ref([
  {
    id: 1,
    user: 'admin',
    action: '登录系统',
    ip: '127.0.0.1',
    status: 'success',
    created_at: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    user: 'admin',
    action: '修改用户权限',
    ip: '127.0.0.1',
    status: 'success',
    created_at: '2024-01-01 10:05:00'
  }
]);

total.value = logList.value.length;

const columns = [
  {
    title: '操作人',
    dataIndex: 'user',
    key: 'user'
  },
  {
    title: '操作内容',
    dataIndex: 'action',
    key: 'action'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip'
  },
  {
    title: '状态',
    key: 'status',
    slots: {
      customRender: 'status'
    }
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
    key: 'created_at'
  }
];

onMounted(() => {
  // 加载操作日志
  loadOperationLog();
});

const loadOperationLog = () => {
  // 这里应该调用实际的API接口
  // const response = await logApi.getOperationLogList({ page: current.value, page_size: pageSize.value });
  // logList.value = response.data.list;
  // total.value = response.data.total;
};
</script>

<style scoped>
.operation-log {
  padding: 20px;
}
</style>