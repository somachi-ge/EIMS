<template>
  <AppLayout>
    <div class="application-page">
      <a-card title="应用管理">
        <div class="card-content">
          <p>应用管理页面</p>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/layout/AppLayout.vue'
</script>

<style scoped>
.application-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}
</style>