<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="role">{{ user?.role }}</div>
      <div class="email">{{ user?.email }}</div>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-card" :style="{ height: sidebarHeight + 'px' }">
        <div class="sidebar-card-inner">
          <template v-for="(item, index) in menu" :key="item.key">
            <div class="sidebar-item" @click="handleClick(item)">
              <span>{{ item.label }}</span>
              <img
                src="../assets/icons/arrow_right.svg"
                class="arrow-icon"
                :class="{ rotated: openItem === item.key }"
              />
            </div>

            <TeachersList
              v-if="item.key === 'teachers' && openItem === 'teachers'"
              :teachers="teachers"
              :selectedTeacher="selectedTeacher"
              @select="selectTeacher"
            />

            <SubjectsList
              v-if="item.key === 'subjects' && openItem === 'subjects'"
              :subjects="subjects"
              :selectedSubject="selectedSubject"
              @select="selectSubject"
            />

            <HomeworkSection
              v-if="item.key === 'homework' && openItem === 'homework'"
              :role="role"
              :weekDays="weekDays"
              :selectedDay="selectedDay"
              :homeworkForSelectedDay="homeworkForSelectedDay"
              :currentWeekNumber="currentWeekNumber"
              @change-week="changeWeek"
              @update:selectedDay="selectedDay = $event"
              @create-homework="emit('create-homework')"
              @view-homework="emit('view-homework', $event)"
            />

            <LecturesSection
              v-if="item.key === 'lectures' && openItem === 'lectures'"
              :role="role"
              :weekDays="weekDays"
              :selectedLectureDay="selectedLectureDay"
              :lecturesForSelectedDay="lecturesForSelectedDay"
              :currentWeekNumber="currentWeekNumber"
              @change-week="changeWeek"
              @update:selectedLectureDay="selectedLectureDay = $event"
              @create-lecture="emit('create-lecture')"
              @view-lecture="emit('view-lecture')"
            />

            <div v-if="index !== menu.length - 1" class="sidebar-divider"></div>
          </template>
        </div>
        <div class="sidebar-fill"></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser'
import { useMenu } from '../composables/useMenu'
import { useSchedule } from '../composables/useSchedule'
import TeachersList from './TeacherList.vue'
import SubjectsList from './SubjectsList.vue'
import HomeworkSection from './HomeworkSection.vue'
import LecturesSection from './LecturesSection.vue'

const router = useRouter()
const props = defineProps({
  scheduleGridRef: Object
})
const emit = defineEmits(['create-homework', 'create-lecture', 'view-homework', 'view-lecture', 'toggle-admin'])

const { user, role, logout } = useUser()
const { menu } = useMenu(role)
const {
  teachers,
  subjects,
  selectedTeacher,
  selectedSubject,
  weekDays,
  selectedDay,
  selectedLectureDay,
  homeworkForSelectedDay,
  lecturesForSelectedDay,
  currentWeekNumber,
  changeWeek,
  selectTeacher,
  selectSubject
} = useSchedule()

const openItem = ref(null)

const handleClick = (item) => {
  if (item.key === 'logout') {
    logout()
    return
  }

  if (item.key === 'accounts') {
    emit('toggle-admin', 'accounts') // теперь передаем ключ
    return
  }

  if (item.key === 'groups') {
    emit('toggle-admin', 'groups') // 🔥 добавляем группы
    return
  }

  if (item.expandable) {
    openItem.value = openItem.value === item.key ? null : item.key
    return
  }

  if (item.route) {
    router.push(item.route)
  }
}

// Динамическая высота сайдбара
const sidebarHeight = ref('auto')
let resizeObserver = null

const syncSidebarHeight = () => {
  const gridEl = props.scheduleGridRef?.value   // <-- исправлено: берём .value
  if (gridEl && typeof gridEl.getBoundingClientRect === 'function') {
    const height = gridEl.getBoundingClientRect().height
    if (height > 0) {
      sidebarHeight.value = `${height}px`
    }
  }
}

onMounted(() => {
  syncSidebarHeight()
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => syncSidebarHeight())
    const gridEl = props.scheduleGridRef?.value
    if (gridEl) resizeObserver.observe(gridEl)
    resizeObserver.observe(document.body)
  } else {
    window.addEventListener('resize', syncSidebarHeight)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  } else {
    window.removeEventListener('resize', syncSidebarHeight)
  }
})
</script>

<style scoped>
.sidebar {
  width: 320px;
  background-color: rgba(240, 249, 248, 0.2);
  border-radius: 22px;
  padding-right: 22px;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sidebar .role,
.sidebar .email {
  margin: 0;
  line-height: 1.1;
}

.sidebar .role {
  font-family: 'Besley', serif;
  font-size: 32px;
  font-weight: 800;
  color: #1e8f84;
  padding-top: 10px;
}

.sidebar .email {
  font-size: 14px;
  color: #1e8f84;
}

.sidebar-content {
  margin-top: 10px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  height: 678px;
  flex-direction: column;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1);
}

.sidebar-card-inner {
  flex-shrink: 0;
  overflow-y: visible;
}

.sidebar-fill {
  flex: 1;
  background-color: #f0f9f8;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.18),
    inset -2px -2px 4px rgba(255, 255, 255, 1);
  pointer-events: none;
}

.sidebar-card::after {
  display: none;
}

.sidebar-item:last-child {
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 14px 16px;
  font-size: 14px;
  color: #2b3a3a;
  background: transparent;
  box-shadow: none;
}

.sidebar-divider {
  height: 1px;
  background: #e1e5ea;
}

.sidebar-item.sub {
  width: 286px;
  height: 45px;
  margin: 0px auto;
  margin-bottom: 0px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 10px;
  border-bottom: 1px solid rgba(248, 233, 214, 1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 6px 14px rgba(0,0,0,0.16),
    0 2px 4px rgba(0,0,0,0.08);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.arrow-icon.rotated {
  transform: rotate(90deg);
}
</style>