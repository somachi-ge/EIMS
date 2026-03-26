<template>
  <div class="breadcrumb-container">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
        <span v-else>{{ item.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  title: string;
  path?: string;
}

const route = useRoute();

const breadcrumbItems = computed(() => {
    const items: BreadcrumbItem[] = [];
    items.push({ title: '编码概览', path: '/coding-rule' });
    
    const currentPath = route.path;
    // 特殊处理规则编辑和新增页面，添加规则列表
    if (currentPath.startsWith('/coding-rule/rule-management/edit/') || currentPath === '/coding-rule/rule-management/add') {
        items.push({ title: '规则列表', path: '/coding-rule/rule-management/list' });
    }
    
    route.matched.forEach((record) => {
      if (record.meta.title) {
        items.push({
          title: record.meta.title as string,
          path: record.path
        });
      }
    });
    
    return items;
  });
</script>

<style scoped>
.breadcrumb-container {
  background-color: #fff;
  padding: 12px 20px;
  margin-bottom: 0.3%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}
</style>