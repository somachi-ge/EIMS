<template>
  <div class="system-log">
    <a-card title="系统日志" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="logList"
        :pagination="false"
        row-key="id"
      >
        <template #level="{ record }">
          <a-tag :color="getLevelColor(record.level)">
            {{ record.level }}
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
    level: 'info',
    message: '系统启动',
    created_at: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    level: 'error',
    message: '数据库连接失败',
    created_at: '2024-01-01 00:05:00'
  }
]);

total.value = logList.value.length;

const columns = [
  {
    title: '日志级别',
    key: 'level',
    slots: {
      customRender: 'level'
    }
  },
  {
    title: '日志内容',
    dataIndex: 'message',
    key: 'message'
  },
  {
    title: '记录时间',
    dataIndex: 'created_at',
    key: 'created_at'
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'error':
      return 'red';
    case 'warn':
      return 'orange';
    case 'info':
      return 'blue';
    default:
      return 'default';
  }
};

onMounted(() => {
  // 加载系统日志
  loadSystemLog();
});

const loadSystemLog = () => {
  // 这里应该调用实际的API接口
  // const response = await logApi.getSystemLogList({ page: current.value, page_size: pageSize.value });
  // logList.value = response.data.list;
  // total.value = response.data.total;
};
</script>

<style scoped>
.system-log {
  padding: 20px;
}
</style>