<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
      <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
      <span v-else>{{ item.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
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
  items.push({ title: '首页', path: '/' });
  
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
</style>