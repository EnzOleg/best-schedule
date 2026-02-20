<template>
  <div class="container">
    <h1>Расписание</h1>
    <ScheduleList />
  </div>
</template>

<script setup>
import ScheduleList from '../components/ScheduleList.vue'
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>
