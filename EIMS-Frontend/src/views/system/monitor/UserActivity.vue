<template>
  <div class="user-activity">
    <a-card title="用户活动" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="activityList"
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
const activityList = ref([
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
    user: 'user1',
    action: '查看用户列表',
    ip: '127.0.0.1',
    status: 'success',
    created_at: '2024-01-01 10:05:00'
  }
]);

total.value = activityList.value.length;

const columns = [
  {
    title: '用户',
    dataIndex: 'user',
    key: 'user'
  },
  {
    title: '操作',
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
    title: '时间',
    dataIndex: 'created_at',
    key: 'created_at'
  }
];

onMounted(() => {
  // 加载用户活动数据
  loadUserActivity();
});

const loadUserActivity = () => {
  // 这里应该调用实际的API接口
  // const response = await monitorApi.getUserActivity({ page: current.value, page_size: pageSize.value });
  // activityList.value = response.data.list;
  // total.value = response.data.total;
};
</script>

<style scoped>
.user-activity {
  width: 100%;
  padding: 1.5%;
}
</style>