<template>
  <div class="list">
    <ScheduleCard
      v-for="item in schedule"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script setup>
import ScheduleCard from './ScheduleCard.vue'

const schedule = [
  {
    id: 1,
    title: 'Математика',
    time: '09:00 – 10:30',
    teacher: 'Иванов'
  },
  {
    id: 2,
    title: 'Программирование',
    time: '11:00 – 12:30',
    teacher: 'Петров'
  }
]
</script>

<style scoped>
.list {
  display: grid;
  gap: 16px;
}
</style>
