<template>
  <div class="app-layout">
    <Header />
    <div class="app-body">
      <Sidebar />
      <div class="app-content">
        <div class="breadcrumb-wrapper">
          <Breadcrumb />
        </div>
        <main class="main-content">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from '../../../components/layout/Header.vue'
import Breadcrumb from './Breadcrumb.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #D9D9D9;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #D9D9D9;
  transition: all 0.3s ease;
  overflow: hidden;
}

.breadcrumb-wrapper {
  flex-shrink: 0;
  background-color: #D9D9D9;
}

.main-content {
  flex: 1;
  padding: 0.3%;
  overflow-y: auto;
}
</style>