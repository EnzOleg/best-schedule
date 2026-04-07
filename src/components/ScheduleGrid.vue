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
        v-if="getLesson(day, time)"
        :title="role === 'STUDENT' ? getLesson(day, time).subject.name : getLesson(day, time).group.name"
        :subject="role === 'STUDENT' ? getLesson(day, time).teacher?.name : getLesson(day, time).subject.name"
        :place="getLesson(day, time).classroom"
        :teacher="null"
        :hasHomework="getLesson(day, time).homework?.length > 0"
        :isToday="day === today"
        :isNow="false"
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
  getLesson: Function,
  role: String
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

const onMouseUp = async (e) => {
  if (!isDragging) return
  const diff = e.clientY - startY
  if (diff > 50) {
    emit('drag-up')
  } else if (diff < -50) {
    emit('drag-down')
  }
  isDragging = false
}

const { formatDay } = useSchedule()
</script>

<style scoped>
.schedule-grid {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 120px repeat(6, 1fr);
  transition: transform 0.3s ease, opacity 0.2s ease;
  cursor: grab;
  grid-template-rows: 55px repeat(6, 100px);
  gap: 4px;

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
</style>