<template>
  <div class="schedule-page">
    <div class="app-shell">

      <!-- LEFT -->
      <section class="main">
        <header class="top-bar">
          <div class="header-left">
            <div class="avatar">
              <img src="../assets/icons/BigGreenB.png" alt="">
            </div>

            <div class="user-text">
              <div class="user-row">
                <div class="name">{{ user?.name || 'Безымянный герой' }}</div>
                <div class="pill">{{ formatToday() }}</div>
              </div>

              <div class="period">
                <img src="../assets/icons/calendar.svg" alt="">
                Расписание занятий · {{ formatPeriod() }}
              </div>
            </div>
          </div>


          <div class="pill">
            Неделя 2 · <strong>Текущая</strong>
          </div>
        </header>

        <div class="schedule-area">

          <div class="week-switcher">
            <img src="../assets/icons/other_eclipse.svg" alt="week 1">
            <img src="../assets/icons/current_eclipse.svg" class="current" alt="week 2">
            <img src="../assets/icons/other_eclipse.svg" alt="week 3">
          </div>


          <!-- Тут потом будет grid -->
          <div class="schedule-grid">

          <!-- HEADER -->
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

          <!-- BODY -->
          <template v-for="time in timeSlots" :key="time">

            <!-- Время слева -->
            <div class="cell time-cell">
              {{ time }}
            </div>

            <!-- Ячейки по дням -->
            <div
              v-for="day in days"
              :key="day + time"
              class="cell"
            >
              <LessonCard
                v-if="getLesson(day, time)"
                :title="getLesson(day, time).group.name"
                :subject="getLesson(day, time).subject.name"
                :place="getLesson(day, time).classroom"
                :teacher="role === 'STUDENT'
                  ? null
                  : getLesson(day, time).teacher?.name"
                :hasHomework="false"
                :isToday="day === today"
                :isNow="false"
              />
            </div>

          </template>

        </div>
        </div>
      </section>

      <!-- RIGHT -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="role">{{ user?.role }}</div>
          <div class="email">{{ user?.email }}</div>
        </div>
        <div class="sidebar-content">
        <div class="sidebar-card" ref="sidebarCard" :style="{ '--after-height': afterHeight + 'px' }">
          <template v-for="(item, index) in menu" :key="item.key">

            <div
              class="sidebar-item"
              @click="handleClick(item)"
            >
              <span>{{ item.label }}</span>

              <img
                src="../assets/icons/arrow_right.svg"
                class="arrow-icon"
                :class="{ rotated: openItem === item.key }"
              />
            </div>

            <!-- ВЛОЖЕННОЕ (преподаватели) -->
            <div v-if="item.key === 'teachers' && openItem === 'teachers'">
              <div class="teachers-grid">
                <div
                  v-for="teacher in teachers"
                  :key="teacher.id"
                  class="teacher-chip"
                  :class="{ active: selectedTeacher?.id === teacher.id }"
                  @click="selectTeacher(teacher)"
                >
                  {{ teacher.name }}
                </div>
              </div>
            </div>

            <div v-if="item.key === 'subjects' && openItem === 'subjects'">
              <div class="teachers-grid">
                <div
                  v-for="subject in subjects"
                  :key="subject.name"
                  class="teacher-chip"
                  :class="{ active: selectedSubject?.name === subject.name }"
                  @click="selectSubject(subject)"
                >
                  {{ subject.name }}
                </div>
              </div>
            </div>

            <div v-if="item.key === 'homework' && openItem === 'homework'" class="homework-block">
              <div class="week-selector">
                <button @click="prevWeek">&lt;</button>
                <span>Неделя {{ currentWeek }}</span>
                <button @click="nextWeek">&gt;</button>
              </div>

              <div class="days">
                <button
                  v-for="day in weekDays"
                  :key="day"
                  :class="{ active: day === selectedDay }"
                  @click="selectedDay = day"
                >
                  {{ dayShort(day) }}
                </button>
              </div>

              <div class="homework-card">
                <div class="subject">{{ homework.subject }}</div>
                <div class="text">{{ homework.text }}</div>
              </div>
            </div>

            <div
              v-if="index !== menu.length - 1"
              class="sidebar-divider"
            ></div>

          </template>
        </div>
        </div>
      </aside>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { graphqlRequest } from '../api'
import { useRouter } from 'vue-router'
import LessonCard from '../components/LessonCard.vue'

const router = useRouter()
const schedule = ref([])
const loading = ref(true)
const error = ref('')
const selectedTeacher = ref(null)
const selectedSubject = ref(null)

const selectTeacher = (teacher) => {
  selectedTeacher.value =
    selectedTeacher.value?.id === teacher.id ? null : teacher
}

const subjects = computed(() => {
  const map = new Map()

  schedule.value.forEach(lesson => {
    if (lesson.subject) {
      map.set(lesson.subject.name, lesson.subject)
    }
  })

  return Array.from(map.values())
})

const selectSubject = (subject) => {
  selectedSubject.value =
    selectedSubject.value?.name === subject.name ? null : subject
}

const menuByRole = {
  ADMIN: [
    { label: 'Группы', key: 'groups', expandable: true },
    { label: 'Преподаватели', key: 'teachers', expandable: true },
    { label: 'Аккаунты', key: 'accounts', route: '/search-list' },
    { label: 'Расписание', key: 'schedule', expandable: true }
  ],
  STUDENT: [
    { label: 'Предметы', key: 'subjects', expandable: true },
    { label: 'Преподаватели', key: 'teachers', expandable: true },
    { label: 'Домашнее задание', key: 'homework', expandable: true },
    { label: 'Лекции', key: 'lectures', expandable: true }
  ],
  TEACHER: [
    { label: 'Группы', key: 'groups', expandable: true },
    { label: 'Предметы', key: 'subjects', expandable: true },
    { label: 'Домашнее задание', key: 'homework', expandable: true },
    { label: 'Лекции', key: 'lectures', expandable: true }
  ]
}

const menu = computed(() => {
  return menuByRole[role.value] || []
})

const filteredSchedule = computed(() => {
  let result = schedule.value

  if (selectedTeacher.value) {
    result = result.filter(
      l => l.teacher?.name === selectedTeacher.value.name
    )
  }

  if (selectedSubject.value) {
    result = result.filter(
      l => l.subject?.name === selectedSubject.value.name
    )
  }

  return result
})

const openItem = ref(null)

const handleClick = (item) => {
  if (item.expandable) {
    openItem.value = openItem.value === item.key ? null : item.key
    return
  }

  if (item.route) {
    router.push(item.route)
  }
}

const getMonday = () => {
  const today = new Date()
  const day = today.getDay()

  const diff = day === 0 ? -6 : 1 - day

  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)

  return monday
}

const startDate = getMonday()
const today = new Date().toISOString().slice(0, 10)

const days = computed(() => {
  const arr = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    arr.push(d.toISOString().slice(0, 10))
  }
  return arr
})

const timeSlots = [
  "08:00",
  "09:30",
  "11:00",
  "12:40",
  "14:10",
  "15:30"
]

const formatDay = (isoDate) => {
  const date = new Date(isoDate)

  const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  const dayName = weekdays[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${dayName} ${day}.${month}`
}

const formatToday = () => {
  const date = new Date()

  const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

  const dayName = weekdays[date.getDay()]
  const day = date.getDate()

  return `Сегодня ${dayName}, ${day}`
}

const formatPeriod = () => {
  const start = new Date(days.value[0])
  const end = new Date(days.value[5])

  const format = (d) => {
    const day = d.getDate()             
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
  }

  return `${format(start)} – ${format(end)}`
}

const loadSchedule = async () => {
  loading.value = true
  error.value = ''

  try {
    const startISO = days.value[0]
    const endISO = days.value[5]

    const data = await graphqlRequest(`
      query {
        scheduleForMe(
          startDate: "${startISO}",
          endDate: "${endISO}"
        ) {
          date
          startTime
          endTime
          classroom
          subject { name }
          teacher { name }
          group { name }
        }
      }
    `)

    schedule.value = data.scheduleForMe

  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const getLesson = (date, startTime) => {
  return filteredSchedule.value.find(
    item => item.date === date && item.startTime === startTime
  )
}

const getTeacherForLesson = (lesson) => {
  if (!lesson) return null
  if (role.value === 'ADMIN') return null
  return lesson.teacher?.name
}

const role = ref(null)
const user = ref(null)

const loadUser = async () => {
  const data = await graphqlRequest(`
    query {
      me {
        name
        email
        role
      }
    }
  `)

  user.value = data.me
  role.value = data.me.role
}

const teachers = ref([])

const loadTeachers = async () => {
  const data = await graphqlRequest(`
    query {
      users {
        id
        name
        role
      }
    }
  `)

  teachers.value = data.users.filter(u => u.role === 'TEACHER')
}

const currentWeek = ref(2)
const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб']
const selectedDay = ref('Пн')

const homework = ref({
  subject: 'Математика',
  text: 'Решить задачи из учебника по теме "Пределы функций"'
})

const prevWeek = () => {
  if(currentWeek.value > 1) currentWeek.value--
}

const nextWeek = () => {
  currentWeek.value++
}

const dayShort = (day) => day

onMounted(async () => {
  await loadUser()
  await loadTeachers()
  await loadSchedule()
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
    inset 2px 2px 4px rgba(255, 255, 255, 1);;
}

/* ---------- HEADER ---------- */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  padding: 12px 18px;
  margin-bottom: 18px;

  background-color: rgba(240, 249, 248, 0.2);

  border-radius: 999px;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.08),
    inset -2px -2px 4px rgba(255, 255, 255, 1),
    inset 3px 3px 4px rgba(0, 0, 0, 0.25);
}

.top-bar > .pill {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}


.user-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;

  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    /* светлый верхний ореол */
    -1px -1px 4px rgba(247, 251, 248, 0.58),

    /* тёмная нижняя тень */
    1px 4px 4px rgba(0, 0, 0, 0.25);
}

.avatar img {
  width: 40px;
  height: 40px;
  display: block;
}

.name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  color: #1f2d2d;
}

.pill {
  padding: 4px 10px;
  border-radius: 999px;
  
  font-size: 12px;
  font-weight: 500;

  color: #1e8f84;
  background: transparent;
  border: 1.5px solid rgba(30, 143, 132, 0.6);

  white-space: nowrap;
}

.period {
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 13px;
  color: #5c6b6b;
}
.period img {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ---------- MAIN ---------- */
.main {
  flex: 1;
  background-color: rgba(240, 249, 248, 0.2);

  border-radius: 22px;
  padding: 18px;

}

/* ---------- GRID PLACEHOLDER ---------- */
.schedule-placeholder {
  height: 600px;
  border-radius: 18px;
  background: #E6EBF1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;

  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1),
    inset 2px 2px 4px rgba(255, 255, 255, 1);;
}

/* ---------- SIDEBAR ---------- */
/* ---------- SIDEBAR CONTAINER ---------- */
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

/* ---------- HEADER ---------- */
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

.sidebar-card > * {
  position: relative;
  z-index: 1;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 0;
  padding-bottom: 315px;
  
  height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 1;

  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1);
}

.sidebar-card::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  min-height: 490px;
  background-color: #f0f9f8;

  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;

  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.18),
    inset -2px -2px 4px rgba(255, 255, 255, 1);

  pointer-events: none;
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

  margin: 0px auto;          /* центрируем и даём одинаковый отступ */
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

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  padding: 0px 16px 16px;
}

.teacher-chip {
  width: 110px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 12px;

  font-size: 13px;
  font-weight: 500;
  color: #364153;

  background: rgba(255, 255, 255, 0.65);

  border-radius: 10px;
  border: 1px solid rgba(248, 233, 214, 1); 

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  box-shadow:
    /* свет сверху-слева */
    -2px -2px 4px rgba(255, 255, 255, 1),

    /* тень снизу-справа */
    1px 2px 4px rgba(0, 0, 0, 0.25);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.teacher-chip.active {
  background: rgba(255, 255, 255, 0.6);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  box-shadow:
    /* inner highlight */
    inset -2px -2px 4px rgba(255, 255, 255, 1),

    /* inner shadow */
    inset 1px 2px 4px rgba(0, 0, 0, 0.25);
}

/* ---------- SCHEDULE GRID ---------- */
.schedule-area {
  position: relative;
  padding-left: 20px;
}

.week-switcher {
  position: absolute;
  left: -5px;            
  top: 50%;             
  transform: translateY(-30%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  pointer-events: auto;
}

.week-switcher img {
  width: 10px;
  height: 10px;
  opacity: 0.7;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.week-switcher img.current {
  width: 16px;
  height: 16px;
  opacity: 1;
}

.week-switcher img:hover {
  transform: scale(1.2);
  opacity: 1;
}

.schedule-grid {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 120px repeat(6, 1fr);

  /* ПЕРВАЯ строка — под заголовки */
  grid-template-rows: 55px repeat(6, 100px);
  gap: 4px;

  border-radius: 22px;
  padding: 0;
  overflow: hidden; /* ВАЖНО: чтобы линии и тени не вылезали */

  background:
    /* базовый фон */
    rgba(255, 255, 255, 0.55);

  background-size:
    calc((100% - 120px) / 6) 100%,
    100% 96px,
    100% 100%;

  background-position:
    120px 0,
    0 0,
    0 0;

  background-repeat: repeat;

  /* GLASS + ТЕНИ ИЗ FIGMA */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    -2px -2px 4px rgba(253, 240, 222, 1),
     1px  2px 4px rgba(0, 0, 0, 0.25),
    inset 2px 2px 4px #FFFFFF;
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
    color:#4D0B22;
}

.day-head span {
  font-size: 13px;
  color: #6b7b7b;
}

.day-head.today {
  height: 55px;
  width: 126px;

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
    4px 4px 4px rgba(255, 255, 255, 1);;

  font-family: Arial, Helvetica, sans-serif;
}

.time-cell.now {
  height: 55px;
  width: 120px;

  font-weight: 600;
}


/* ---------- EMPTY CELLS ---------- */
.cell.empty {
  border-radius: 14px;
  background: transparent;
}
</style>
