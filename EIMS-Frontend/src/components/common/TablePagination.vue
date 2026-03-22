<template>
  <a-pagination
    :current="current"
    :page-size="pageSize"
    :total="total"
    :page-size-options="pageSizeOptions"
    show-size-changer
    show-quick-jumper
    :show-total="(total: number) => `共 ${total} 条记录`"
    @update:current="(val: number) => $emit('update:current', val)"
    @update:page-size="(val: number) => $emit('update:page-size', val)"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
  </a-pagination>
</template>

<script setup lang="ts">
defineProps({
  current: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array,
    default: () => ['10', '20', '50', '100']
  }
});

defineEmits(['update:current', 'update:page-size']);
</script>

<style scoped>
</style>