<template>
  <div class="homework-block">
    <div class="hw-header">
      <button class="nav-btn" @click="emit('change-week', -1)">&lt;</button>
      <div class="hw-center">
        <div class="hw-current">Текущая</div>
        <div class="hw-week-pill">Неделя {{ currentWeekNumber }}</div>
      </div>
      <button class="nav-btn" @click="emit('change-week', 1)">&gt;</button>
    </div>

    <div class="hw-days">
      <button
        v-for="day in weekDays"
        :key="day"
        :class="['day-chip', { active: day === selectedLectureDay }]"
        @click="emit('update:selectedLectureDay', day)"
      >
        {{ day }}
      </button>
    </div>

    <template v-if="lecturesForSelectedDay.length">
      <div
        class="hw-card"
        v-for="lecture in lecturesForSelectedDay"
        :key="lecture.id"
        @click="emit('view-lecture', lecture)"
      >
        <div class="hw-subject">{{ lecture.subject?.name || 'Без названия' }}</div>
        <div class="hw-text">{{ lecture.title }}</div>
        <div class="hw-text">{{ lecture.teacher?.name || '' }}</div>
      </div>
    </template>
    <div v-else class="hw-empty">Лекций нет 🎉</div>
  </div>
</template>

<script setup>
defineProps({
  role: String,
  weekDays: Array,
  selectedLectureDay: String,
  lecturesForSelectedDay: Array,
  currentWeekNumber: Number
})
const emit = defineEmits(['change-week', 'update:selectedLectureDay', 'view-lecture', 'create-lecture'])
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