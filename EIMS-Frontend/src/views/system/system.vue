<template>
  <AppLayout>
    <div class="system-page">
      <a-card title="系统管理">
        <div class="card-content">
          <p>系统管理主页面</p>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/layout/AppLayout.vue'
</script>

<style scoped>
.system-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}
</style>