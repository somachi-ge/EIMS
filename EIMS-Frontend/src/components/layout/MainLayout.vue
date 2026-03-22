<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content">
      <Header />
      <Breadcrumb />
      <main class="content-area">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>