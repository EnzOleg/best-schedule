<template>
  <div class="homework-block">
    <div class="hw-header">
      <button class="nav-btn" @click="emit('change-week', -1)">&lt;</button>
      <div class="hw-center">
        <div class="hw-week-pill">Неделя {{ currentWeekNumber }}</div>
      </div>
      <button class="nav-btn" @click="emit('change-week', 1)">&gt;</button>
      <button v-if="role === 'TEACHER'" class="nav-btn create-btn" @click="emit('create-homework')">+</button>
    </div>

    <div class="hw-days">
      <button
        v-for="day in weekDays"
        :key="day"
        :class="['day-chip', { active: day === selectedDay }]"
        @click="emit('update:selectedDay', day)"
      >
        {{ day }}
      </button>
    </div>

    <template v-if="homeworkForSelectedDay.length">
      <div
        class="hw-card"
        v-for="hw in homeworkForSelectedDay"
        :key="hw.id"
        @click="emit('view-homework', hw)"
      >
        <div class="hw-subject">{{ hw.subject.name }}</div>
        <div class="hw-text">{{ hw.text }}</div>
      </div>
    </template>
    <div v-else class="hw-empty">
      Ничего не задано 🎉
    </div>
  </div>
</template>

<script setup>
defineProps({
  role: String,
  weekDays: Array,
  selectedDay: String,
  homeworkForSelectedDay: Array,
  currentWeekNumber: Number
})
const emit = defineEmits(['change-week', 'update:selectedDay', 'view-homework', 'create-homework'])
</script>

<style scoped>
.homework-block {
  padding: 12px 16px 16px;
}

.hw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #fff;
  cursor: pointer;
  box-shadow:
    2px 2px 4px rgba(0,0,0,0.2),
    -2px -2px 4px rgba(255,255,255,1);
}

.hw-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hw-current {
  font-size: 13px;
  color: #6b7b7b;
}

.hw-week-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #1e8f84;
  border: 1px solid #1e8f84;
}

.hw-days {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.day-chip {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: #fff;
  box-shadow:
    2px 2px 4px rgba(0,0,0,0.2),
    -2px -2px 4px rgba(255,255,255,1);
}

.day-chip.active {
  color: #1e8f84;
  box-shadow:
    inset 2px 2px 4px rgba(0,0,0,0.2),
    inset -2px -2px 4px rgba(255,255,255,1);
}

.hw-card {
  padding: 12px;
  border-radius: 14px;
  background: #fff;
  margin-bottom: 10px;
  box-shadow:
    4px 4px 6px rgba(0,0,0,0.2),
    -4px -4px 6px rgba(255,255,255,1);
}

.hw-empty {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #6b7b7b;
  border-radius: 14px;
  background: rgba(255,255,255,0.6);
  box-shadow:
    inset 2px 2px 4px rgba(0,0,0,0.1),
    inset -2px -2px 4px rgba(255,255,255,1);
}

.hw-subject {
  display: inline-block;
  margin-bottom: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #1e8f84;
  border: 1px solid #1e8f84;
}

.hw-text {
  font-size: 14px;
  color: #2b3a3a;
}
</style>