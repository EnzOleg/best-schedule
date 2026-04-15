<template>
  <div class="schedule-page">
    <div class="app-shell">
      <section class="main">
        <template v-if="!isAdminView">
          <ScheduleHeader />
          <div class="schedule-area">
            <WeekSwitcher :weekOffset="weekOffset" @changeWeek="changeWeek" />
            <ScheduleGrid
              ref="scheduleGrid"
              :days="days"
              :timeSlots="timeSlots"
              :today="today"
              :getLesson="getLesson"
              :role="role"
              @drag-up="changeWeek(-1)"
              @drag-down="changeWeek(1)"
            />
          </div>
        </template>

        <template v-if="isAdminView">
          <AdminAccounts v-if="adminView === 'accounts'" />
          <AdminScheduleGenerator v-else-if="adminView === 'schedule'" />
        </template>
      </section>
    <Sidebar
      :scheduleGridRef="scheduleGrid"
      :isAdminView="isAdminView"
      :adminView="adminView"
      @create-homework="showCreateHomeworkModal = true"
      @create-lecture="showCreateLectureModal = true"
      @view-homework="openHomeworkModal"
      @view-lecture="showLecturesModal = true"
      @toggle-admin="toggleAdminView"
    />
    </div>

    <div v-if="showHomeworkModal" class="modal-overlay" @click.self="showHomeworkModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Домашние задания на {{ selectedDay }}</h3>
          <button class="modal-close" @click="showHomeworkModal = false">&times;</button>
        </div>
        <div class="modal-content">
          <div v-if="homeworkForSelectedDayView.length">
            <div v-for="hw in homeworkForSelectedDayView" :key="hw.id" class="modal-card">
              <div class="modal-subject">{{ hw.subject.name }}</div>
              <div class="modal-text">{{ hw.text }}</div>
            </div>
          </div>
          <div v-else class="modal-empty">Нет домашних заданий 🎉</div>
        </div>
      </div>
    </div>
    <!-- ... остальные модальные окна ... -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUser } from '../composables/useUser'
import { useSchedule } from '../composables/useSchedule'
import ScheduleHeader from '../components/ScheduleHeader.vue'
import ScheduleGrid from '../components/ScheduleGrid.vue'
import Sidebar from '../components/Sidebar.vue'
import WeekSwitcher from '../components/WeekSwitcher.vue'
import AdminAccounts from '../components/AdminAccounts.vue'
import AdminScheduleGenerator from '../components/AdminScheduleGenerator.vue'

const isAdminView = ref(false)
const adminView = ref('accounts')
const adminComponent = computed(() => {
  if (adminView.value === 'accounts') return AdminAccounts
  // Если в будущем понадобится AdminGroups – раскомментируйте и импортируйте
  // if (adminView.value === 'groups') return AdminGroups
  return null
})

const { user, role, loadUser } = useUser()
const {
  days,
  timeSlots,
  getLesson,
  changeWeek,
  loadSchedule,
  loadTeachers,
  loadGroups,
  loadLectures,
  weekDays,
  selectedDay,
  selectedLectureDay,
  lecturesForSelectedDay,
  subjects,
  groups,
  weekOffset,
  newHomeworkScheduleItem,
  newHomeworkText,
  newLectureGroup,
  newLectureDay,
  newLectureSubject,
  newLectureTitle,
  newLectureText,
  createHomework,
  createLecture,
  scheduleForSelectedHomeworkDay,
  homeworkForSelectedDayView,
  setSelectedDay,
  teachers
} = useSchedule()

const today = new Date().toISOString().slice(0, 10)
const scheduleGrid = ref(null)

const showHomeworkModal = ref(false)
const showLecturesModal = ref(false)
const showCreateHomeworkModal = ref(false)
const showCreateLectureModal = ref(false)

// Функция переключения админ-панели (открыть/закрыть)
const toggleAdminView = (viewKey) => {
  if (isAdminView.value && adminView.value === viewKey) {
    isAdminView.value = false
  } else {
    isAdminView.value = true
    adminView.value = viewKey
  }
}

const openHomeworkModal = (hw) => {
  if (hw && hw.date) {
    const dateIndex = days.value.findIndex(d => hw.date.slice(0,10) === d)
    if (dateIndex !== -1) {
      const dayName = weekDays[dateIndex]
      setSelectedDay(dayName)
    } else {
      setSelectedDay(selectedDay.value)
    }
  } else {
    setSelectedDay(selectedDay.value)
  }
  showHomeworkModal.value = true
}

onMounted(async () => {
  await loadUser()
  await loadTeachers()
  await loadGroups()
  await loadSchedule()
  await loadLectures()
  console.log('Teachers loaded:', teachers.value)
  console.log('Subjects from schedule:', subjects.value)
})
</script>

<style scoped>
.schedule-page {
  min-height: 90vh;
  padding-top: 4vh;
  display: flex;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
}

.app-shell {
  display: flex;
  gap: 4px;
  background-color: rgba(240, 249, 248, 0.2);
  border-radius: 28px;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1),
    inset 2px 2px 4px rgba(255, 255, 255, 1);
}

.main {
  flex: 1;
  width: 1164px;
  background-color: rgba(240, 249, 248, 0.2);
  border-radius: 22px;
  padding: 18px;
}

.schedule-area {
  position: relative;
  padding-left: 20px;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #ffffff;
  border-radius: 28px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5ea;
  background: #f0f9f8;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e8f84;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7b7b;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1e8f84;
}

.modal-content {
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 4px 4px 6px rgba(0,0,0,0.1), -4px -4px 6px rgba(255,255,255,0.8);
  border: 1px solid #f0f9f8;
}

.modal-subject {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #1e8f84;
  background: #e6f7f5;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 14px;
  line-height: 1.4;
  color: #2b3a3a;
  margin-bottom: 8px;
}

.modal-teacher {
  font-size: 12px;
  color: #6b7b7b;
  margin-top: 6px;
}

.modal-empty {
  text-align: center;
  padding: 30px;
  color: #6b7b7b;
  font-size: 14px;
}

.create-btn {
  background: #1e8f84;
  color: white;
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,1);
  transition: all 0.2s;
}

.create-btn:hover {
  background: #166b62;
  transform: scale(0.95);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #2b3a3a;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e1e5ea;
  background: #fff;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e8f84;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-btn {
  background: #1e8f84;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:hover {
  background: #166b62;
}

.cancel-btn {
  background: #e1e5ea;
  color: #2b3a3a;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background: #cbd0d6;
}
</style>