<template>
  <div class="card">
    <h3>{{ item.title }}</h3>
    <p>{{ item.time }}</p>
    <span>{{ item.teacher }}</span>
  </div>
</template>

<script setup>
defineProps({
  item: Object
})
</script>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background: #1e1e1e;
  border: 1px solid #2a2a2a;
}

h3 {
  margin: 0 0 8px;
}
</style>
