<template>
  <div class="schedule-grid" ref="scheduleGrid" @mousedown="onMouseDown" @mouseup="onMouseUp">
    <div class="cell time-head">Время</div>
    <div
      v-for="day in days"
      :key="day"
      class="cell day-head"
      :class="{ today: day === today }"
    >
      {{ formatDay(day) }}
      <span v-if="day === today">Сегодня</span>
    </div>

    <template v-for="time in timeSlots" :key="time">
      <div class="cell time-cell">
        {{ formatTimeRange(time) }}
      </div>
      <div
        v-for="day in days"
        :key="day + time"
        class="cell"
      >
        <LessonCard
          v-if="gridData[day]?.[time]?.original"
          :title="role === 'STUDENT' ? gridData[day][time].original.subject.name : gridData[day][time].original.group.name"
          :subject="role === 'STUDENT' ? gridData[day][time].original.teacher?.name : gridData[day][time].original.subject.name"
          :place="gridData[day][time].original.classroom?.name"
          :hasHomework="gridData[day][time].original.homework?.length > 0"
          @click="emit('lesson-click', gridData[day][time].original)"
          :isToday="day === today"
          :class="{ 'filtered-out': gridData[day][time].isFilteredOut }"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LessonCard from './LessonCard.vue'
import { useSchedule } from '../composables/useSchedule'

const props = defineProps({
  days: Array,
  timeSlots: Array,
  today: String,
  gridData: Object,   
  formatDay: Function,
  role: String,
})

const formatTimeRange = (start) => {
  const [hours, minutes] = start.split(':').map(Number)

  let endHours = hours
  let endMinutes = minutes + 80

  if (endMinutes >= 60) {
    endHours += Math.floor(endMinutes / 60)
    endMinutes = endMinutes % 60
  }

  const pad = (n) => String(n).padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)} - ${pad(endHours)}:${pad(endMinutes)}`
}

const emit = defineEmits(['drag-up', 'drag-down'])

const scheduleGrid = ref(null)
let startY = 0
let isDragging = false

const onMouseDown = (e) => {
  isDragging = true
  startY = e.clientY
}

let hasTriggered = false

const onMouseUp = (e) => {
  if (!isDragging || hasTriggered) return
  const diff = e.clientY - startY
  if (diff > 50) {
    emit('drag-up')
    hasTriggered = true
  } else if (diff < -50) {
    emit('drag-down')
    hasTriggered = true
  }
  isDragging = false
  setTimeout(() => {
    hasTriggered = false
  }, 200)
}
</script>

<style scoped>
.schedule-grid {
  display: grid;
  justify-items: center;
  align-items: center;
  width: 100%;
  min-width: 1098px;
  grid-template-columns: 120px repeat(6, 1fr);
  transition: transform 0.3s ease, opacity 0.2s ease;
  cursor: grab;
  grid-template-rows: 55px repeat(6, 100px);
  gap: 4px;
  overflow-x: auto;

  border-radius: 22px;
  padding: 0;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.55);
  background-size: calc((100% - 120px) / 6) 100%, 100% 96px, 100% 100%;
  background-position: 120px 0, 0 0, 0 0;
  background-repeat: repeat;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    -2px -2px 4px rgba(253, 240, 222, 1),
    1px 2px 4px rgba(0, 0, 0, 0.25),
    inset 2px 2px 4px #FFFFFF;
}

.schedule-grid:active {
  cursor: grabbing;
}

/* ---------- BASE CELL ---------- */
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 166px;
  font-size: 15px;
  color: #2b3a3a;
}

/* ---------- HEADER CELLS ---------- */
.time-head,
.day-head {
  background: #FAFCFF;
  border-radius: 14px;
  font-weight: 500;
  justify-content: center;
  height: 45px;
  width: 96px;
  box-shadow:
    3px 3px 3px rgba(0,0,0,0.18),
    -3px -3px 3px rgba(255,255,255,1);
}

.time-head,
.day-head,
.time-cell {
  padding: 0;
  align-items: center;
}

.day-head {
  flex-direction: column;
  line-height: 1.2;
  color: black;
}

.time-head {
  color: #4D0B22;
}

.day-head span {
  font-size: 13px;
  color: #6b7b7b;
}

.day-head.today {
  height: 55px;
  width: 126px;
  z-index: 999;
  color: #1e8f84;
}

/* ---------- TIME COLUMN ---------- */
.time-cell {
  background: #FAFCFF;
  border-radius: 14px;
  height: 45px;
  width: 96px;
  font-size: 13px;
  font-weight: 500;
  color: #4D0B22;
  justify-content: center;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    4px 4px 4px rgba(255, 255, 255, 1);
  font-family: Arial, Helvetica, sans-serif;
}

.time-cell.now {
  height: 55px;
  width: 120px;
  font-weight: 600;
}

.cell.empty {
  border-radius: 14px;
  background: transparent;
}

/* ---------- MEDIA QUERIES ---------- */
@media (max-width: 1098px) {
  /* Сетка остаётся, но можно уменьшить padding/шрифты внутри карточек */
  .cell {
    font-size: 14px; /* чуть меньше, чтобы помещалось */
    padding: 2px;
  }
}

@media (max-width: 768px) {
  .cell {
    font-size: 13px;
    padding: 1px;
  }
}

@media (max-width: 480px) {
  .cell {
    font-size: 12px;
    padding: 1px;
  }
}
</style>