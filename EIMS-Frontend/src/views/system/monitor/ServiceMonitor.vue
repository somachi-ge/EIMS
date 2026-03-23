<template>
  <div class="service-monitor">
    <a-card title="服务监控" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="serviceList"
        :pagination="false"
        row-key="id"
      >
        <template #status="{ record }">
          <a-tag :color="record.status === 'running' ? 'green' : 'red'">
            {{ record.status === 'running' ? '运行中' : '停止' }}
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
const serviceList = ref([
  {
    id: 1,
    name: 'API服务',
    status: 'running',
    version: '1.0.0',
    uptime: '100h'
  },
  {
    id: 2,
    name: '数据库服务',
    status: 'running',
    version: '1.0.0',
    uptime: '100h'
  }
]);

total.value = serviceList.value.length;

const columns = [
  {
    title: '服务名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '状态',
    key: 'status',
    slots: {
      customRender: 'status'
    }
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version'
  },
  {
    title: '运行时间',
    dataIndex: 'uptime',
    key: 'uptime'
  }
];

onMounted(() => {
  // 加载服务监控数据
  loadServiceMonitor();
});

const loadServiceMonitor = () => {
  // 这里应该调用实际的API接口
  // const response = await monitorApi.getServiceMonitor();
  // serviceList.value = response.data;
};
</script>

<style scoped>
.service-monitor {
  width: 100%;
  padding: 1.5%;
}
</style>