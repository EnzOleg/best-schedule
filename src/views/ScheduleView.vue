<template>
  <div class="schedule-page">
    <div class="app-shell">

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
            Неделя {{ currentWeekNumber }}
          </div>
        </header>

        <div class="schedule-area">

        <div class="week-switcher">
          <img
            src="../assets/icons/other_eclipse.svg"
            :class="{ current: weekOffset === -1 }"
            @click="changeWeek(-1)"
          />

          <img
            src="../assets/icons/current_eclipse.svg"
            :class="{ current: weekOffset === 0 }"
            @click="changeWeek(0 - weekOffset)"
          />

          <img
            src="../assets/icons/other_eclipse.svg"
            :class="{ current: weekOffset === 1 }"
            @click="changeWeek(1)"
          />
        </div>

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
              {{ time }}
            </div>

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
                :hasHomework="getLesson(day, time).homework?.length > 0"
                :isToday="day === today"
                :isNow="false"
              />
            </div>

          </template>

        </div>
        </div>
      </section>

      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="role">{{ user?.role }}</div>
          <div class="email">{{ user?.email }}</div>
        </div>
        <div class="sidebar-content">
          <div class="sidebar-card" ref="sidebarCard" :style="{ height: sidebarHeight + 'px' }">
            <div class="sidebar-card-inner">
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

                <!-- Предметы -->
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

                <!-- Домашнее задание -->
                <div v-if="item.key === 'homework' && openItem === 'homework'" class="homework-block">
                  <div class="hw-header">
                    <button class="nav-btn" @click="changeWeek(-1)">&lt;</button>
                    <div class="hw-center">
                      <div class="hw-current">Текущая</div>
                      <div class="hw-week-pill">Неделя {{ currentWeekNumber }}</div>
                    </div>
                    <button class="nav-btn" @click="changeWeek(1)">&gt;</button>
                    <button v-if="role === 'TEACHER'" class="nav-btn create-btn" @click="showCreateHomeworkModal = true">+</button>
                  </div>

                  <div class="hw-days">
                    <button
                      v-for="day in weekDays"
                      :key="day"
                      :class="['day-chip', { active: day === selectedDay }]"
                      @click="selectedDay = day"
                    >
                      {{ day }}
                    </button>
                  </div>

                  <template v-if="homeworkForSelectedDay.length">
                    <div
                      class="hw-card"
                      v-for="hw in homeworkForSelectedDay"
                      :key="hw.id"
                      @click="showHomeworkModal = true"
                    >
                      <div class="hw-subject">{{ hw.subject.name }}</div>
                      <div class="hw-text">{{ hw.text }}</div>
                    </div>
                  </template>
                  <div v-else class="hw-empty">
                    Ничего не задано 🎉
                  </div>
                </div>

                <!-- Лекции -->
                <div v-if="item.key === 'lectures' && openItem === 'lectures'" class="homework-block">
                  <div class="hw-header">
                    <button class="nav-btn" @click="changeWeek(-1)">&lt;</button>
                    <div class="hw-center">
                      <div class="hw-current">Текущая</div>
                      <div class="hw-week-pill">Неделя {{ currentWeekNumber }}</div>
                    </div>
                    <button class="nav-btn" @click="changeWeek(1)">&gt;</button>
                    <button v-if="role === 'TEACHER'" class="nav-btn create-btn" @click="showCreateLectureModal = true">+</button>
                  </div>

                  <div class="hw-days">
                    <button
                      v-for="day in weekDays"
                      :key="day"
                      :class="['day-chip', { active: day === selectedLectureDay }]"
                      @click="selectedLectureDay = day"
                    >
                      {{ day }}
                    </button>
                  </div>

                  <template v-if="lecturesForSelectedDay.length">
                    <div
                      class="hw-card"
                      v-for="lecture in lecturesForSelectedDay"
                      :key="lecture.id"
                      @click="showLecturesModal = true"
                    >
                      <div class="hw-subject">{{ lecture.subject.name }}</div>
                      <div class="hw-text">{{ lecture.title }}</div>
                      <div class="hw-text">{{ lecture.teacher?.name }}</div>
                    </div>
                  </template>

                  <div v-else class="hw-empty">Лекций нет 🎉</div>
                </div>

                <div
                  v-if="index !== menu.length - 1"
                  class="sidebar-divider"
                ></div>

              </template>
            </div>
            <div class="sidebar-fill"></div>
          </div>
        </div>
      </aside>

    </div>

    <!-- Модальное окно для просмотра домашних заданий -->
    <div v-if="showHomeworkModal" class="modal-overlay" @click.self="showHomeworkModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Домашние задания на {{ selectedDay }}</h3>
          <button class="modal-close" @click="showHomeworkModal = false">&times;</button>
        </div>
        <div class="modal-content">
          <div v-if="homeworkForSelectedDay.length">
            <div v-for="hw in homeworkForSelectedDay" :key="hw.id" class="modal-card">
              <div class="modal-subject">{{ hw.subject.name }}</div>
              <div class="modal-text">{{ hw.text }}</div>
            </div>
          </div>
          <div v-else class="modal-empty">Нет домашних заданий 🎉</div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра лекций -->
    <div v-if="showLecturesModal" class="modal-overlay" @click.self="showLecturesModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Лекции на {{ selectedLectureDay }}</h3>
          <button class="modal-close" @click="showLecturesModal = false">&times;</button>
        </div>
        <div class="modal-content">
          <div v-if="lecturesForSelectedDay.length">
            <div v-for="lecture in lecturesForSelectedDay" :key="lecture.id" class="modal-card">
              <div class="modal-subject">{{ lecture.subject.name }}</div>
              <div class="modal-text">{{ lecture.title }}</div>
              <div class="modal-text">{{ lecture.teacher?.name }}</div>
            </div>
          </div>
          <div v-else class="modal-empty">Нет лекций 🎉</div>
        </div>
      </div>
    </div>

      <!-- Модальное окно для создания домашнего задания -->
  <div v-if="showCreateHomeworkModal" class="modal-overlay" @click.self="showCreateHomeworkModal = false">
    <div class="modal">
      <div class="modal-header">
        <h3>Создать домашнее задание</h3>
        <button class="modal-close" @click="showCreateHomeworkModal = false">&times;</button>
      </div>
      <div class="modal-content">

        <!-- Выбор урока (ScheduleItem) -->
        <div class="form-group">
          <label>Урок</label>
          <select v-model="newHomeworkScheduleItem">
            <option
              v-for="lesson in scheduleForSelectedDay"
              :key="lesson.id"
              :value="lesson"
            >
              {{ lesson.subject.name }} · {{ lesson.group.name }} · {{ lesson.classroom }}
            </option>
          </select>
        </div>

        <!-- Текст домашки -->
        <div class="form-group">
          <label>Текст задания</label>
          <textarea v-model="newHomeworkText" rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button class="submit-btn" @click="createHomework">Создать</button>
          <button class="cancel-btn" @click="showCreateHomeworkModal = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Модальное окно для создания лекции -->
  <div v-if="showCreateLectureModal" class="modal-overlay" @click.self="showCreateLectureModal = false">
    <div class="modal">
      <div class="modal-header">
        <h3>Создать лекцию</h3>
        <button class="modal-close" @click="showCreateLectureModal = false">&times;</button>
      </div>
      <div class="modal-content">
        <div class="form-group">
          <label>Группа</label>
          <select v-model="newLectureGroup">
            <option v-for="group in groups" :key="group.id" :value="group">{{ group.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>День</label>
          <select v-model="newLectureDay">
            <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Предмет</label>
          <select v-model="newLectureSubject">
            <option v-for="subject in subjects" :key="subject.name" :value="subject">{{ subject.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Тема лекции</label>
          <input type="text" v-model="newLectureTitle" placeholder="Тема">
        </div>
        <div class="form-group">
          <label>Текст лекции (необязательно)</label>
          <textarea v-model="newLectureText" rows="4" placeholder="Подробный текст..."></textarea>
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="createLecture">Создать</button>
          <button class="cancel-btn" @click="showCreateLectureModal = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
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
    { label: 'Аккаунты', key: 'accounts', route: '/admin-dashboard' },
    { label: 'Расписание', key: 'schedule', expandable: true },
    { label: 'Выйти', key: 'logout' }
  ],
  STUDENT: [
    { label: 'Предметы', key: 'subjects', expandable: true },
    { label: 'Преподаватели', key: 'teachers', expandable: true },
    { label: 'Домашнее задание', key: 'homework', expandable: true },
    { label: 'Лекции', key: 'lectures', expandable: true },
    { label: 'Выйти', key: 'logout' }
  ],
  TEACHER: [
    { label: 'Группы', key: 'groups', expandable: true },
    { label: 'Предметы', key: 'subjects', expandable: true },
    { label: 'Домашнее задание', key: 'homework', expandable: true },
    { label: 'Лекции', key: 'lectures', expandable: true },
    { label: 'Выйти', key: 'logout' }
  ]
}

const menu = computed(() => {
  return menuByRole[role.value] || []
})

const filteredSchedule = computed(() => {
  let result = schedule.value
  if (selectedTeacher.value) {
    result = result.filter(l => l.teacher?.name === selectedTeacher.value.name)
  }
  if (selectedSubject.value) {
    result = result.filter(l => l.subject?.name === selectedSubject.value.name)
  }
  return result
})

const openItem = ref(null)

const handleClick = (item) => {
  if (item.key === 'logout') {
    logout()
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

const weekOffset = ref(0) 

const getMonday = (offset = 0) => {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff + offset * 7)
  return monday
}

const today = new Date().toISOString().slice(0, 10)

const days = computed(() => {
  const start = getMonday(weekOffset.value)
  const arr = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    arr.push(d.toISOString().slice(0, 10))
  }
  return arr
})

const currentWeekNumber = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = (now - start) / 86400000
  const week = Math.ceil((diff + start.getDay() + 1) / 7)
  return week + weekOffset.value
})

const changeWeek = async (offset) => {
  weekOffset.value += offset
  await loadSchedule()
  await loadLectures()
}

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
          homework {
            id
            text
            subject { name }
          }
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

const loadLectures = async () => {
  try {
    const startISO = days.value[0]
    const endISO = days.value[5]
    const data = await graphqlRequest(`
      query {
        lecturesForMe(startDate: "${startISO}", endDate: "${endISO}") {
          id
          date
          title
          subject { name }
          teacher { name }
        }
      }
    `)
    lectures.value = data.lecturesForMe
  } catch (e) {
    console.error('Failed to load lectures', e)
  }
}

const getLesson = (date, startTime) => {
  return filteredSchedule.value.find(item => {
    const itemDate = item.date.slice(0, 10)
    const itemTime = item.startTime.slice(0,5) // берём только HH:MM
    return itemDate === date && itemTime === startTime
  })
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
const lectures = ref([])

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

const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб']
const selectedDay = ref('Пн')
const selectedLectureDay = ref('Пн')

const homeworkForSelectedDay = computed(() => {
  const index = weekDays.indexOf(selectedDay.value)
  const date = days.value[index]
  const dayLessons = schedule.value.filter(l => l.date === date)
  return dayLessons.flatMap(l => l.homework || [])
})

const lecturesForSelectedDay = computed(() => {
  const index = weekDays.indexOf(selectedLectureDay.value)
  const date = days.value[index]
  const dayLectures = lectures.value.filter(l => l.date === date)
  return dayLectures
})

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
    await changeWeek(-1) 
  } else if (diff < -50) {
    await changeWeek(1) 
  }
  isDragging = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  user.value = null 
  router.push('/login')
}

// Модальные окна
const showHomeworkModal = ref(false)
const showLecturesModal = ref(false)
const showCreateHomeworkModal = ref(false)
const showCreateLectureModal = ref(false)

// Поля для создания
const newHomeworkDay = ref('Пн')
const newHomeworkSubject = ref(null)
const newHomeworkText = ref('')
const newLectureDay = ref('Пн')
const newLectureSubject = ref(null)
const newLectureTitle = ref('')
const groups = ref([])          
const newHomeworkGroup = ref(null)
const newLectureGroup = ref(null)
const newLectureText = ref('')

const loadGroups = async () => {
  try {
    const data = await graphqlRequest(`
      query {
        groups {
          id
          name
          course
          specialty
          faculty
        }
      }
    `)
    groups.value = data.groups
    if (groups.value.length && !newHomeworkGroup.value) {
      newHomeworkGroup.value = groups.value[0]
    }
    if (groups.value.length && !newLectureGroup.value) {
      newLectureGroup.value = groups.value[0]
    }
  } catch (e) {
    console.error('Failed to load groups', e)
  }
}

const getDateFromDay = (dayName) => {
  const index = weekDays.indexOf(dayName)
  return days.value[index]
}

const createHomework = async () => {
  if (!newHomeworkGroup.value || !newHomeworkSubject.value || !newHomeworkText.value) {
    alert('Заполните все поля')
    return
  }
  try {
    const date = getDateFromDay(newHomeworkDay.value)
    await graphqlRequest(`
      mutation CreateHomework($input: CreateHomeworkInput!) {
        createHomework(input: $input) {
          id
        }
      }
    `, {
      input: {
        text: newHomeworkText.value,
        date: date,
        scheduleItemId: selectedScheduleItemId.value 
      }
    })
    await loadSchedule()  // ДЗ входят в расписание
    showCreateHomeworkModal.value = false
    // Сброс полей
    newHomeworkText.value = ''
    newHomeworkSubject.value = groups.value.length ? groups.value[0] : null
    newHomeworkDay.value = 'Пн'
  } catch (e) {
    console.error('Failed to create homework', e)
    alert('Ошибка при создании: ' + e.message)
  }
}

const createLecture = async () => {
  if (!newLectureGroup.value || !newLectureSubject.value || !newLectureTitle.value) {
    alert('Заполните все поля (группа, предмет, тема)')
    return
  }
  try {
    const date = getDateFromDay(newLectureDay.value)
    await graphqlRequest(`
      mutation CreateLecture($input: CreateLectureInput!) {
        createLecture(input: $input) {
          id
        }
      }
    `, {
      input: {
        date: date,
        groupId: newLectureGroup.value.id,
        subjectId: newLectureSubject.value.id,
        title: newLectureTitle.value,
        text: newLectureText.value || null
      }
    })
    await loadLectures()
    showCreateLectureModal.value = false
    // Сброс полей
    newLectureTitle.value = ''
    newLectureText.value = ''
    newLectureSubject.value = groups.value.length ? groups.value[0] : null
    newLectureDay.value = 'Пн'
  } catch (e) {
    console.error('Failed to create lecture', e)
    alert('Ошибка при создании: ' + e.message)
  }
}

// --- Динамическая высота сайдбара ---
const scheduleGrid = ref(null)
const sidebarCard = ref(null)
const sidebarHeight = ref('auto')
let resizeObserver = null

const syncSidebarHeight = () => {
  if (scheduleGrid.value) {
    const height = scheduleGrid.value.getBoundingClientRect().height
    if (height > 0) {
      sidebarHeight.value = `${height}px`
    }
  }
}

watch(subjects, (newSubjects) => {
  if (newSubjects.length && !newHomeworkSubject.value) {
    newHomeworkSubject.value = newSubjects[0]
  }
  if (newSubjects.length && !newLectureSubject.value) {
    newLectureSubject.value = newSubjects[0]
  }
}, { immediate: true })

onMounted(async () => {
  await loadUser()
  await loadTeachers()
  await loadGroups()
  await loadSchedule()
  console.log(schedule.value) // посмотри, что реально пришло
  await loadLectures()
  await new Promise(resolve => setTimeout(resolve, 50))
  syncSidebarHeight()
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => syncSidebarHeight())
    if (scheduleGrid.value) resizeObserver.observe(scheduleGrid.value)
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

/* Исправленный sidebar-card: фиксированная высота, прокрутка, отступ снизу для after */
.sidebar-card {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;          /* чтобы скругление работало */
  display: flex;
  height: 678px;
  flex-direction: column;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1);
  /* высота задаётся динамически через style */
}

.sidebar-card-inner {
  flex-shrink: 0;           /* не сжимается и не растягивается */
  overflow-y: visible;      /* чтобы контент не обрезался */
}

.sidebar-fill {
  flex: 1;                  /* занимает всё оставшееся пространство */
  background-color: #f0f9f8;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.18),
    inset -2px -2px 4px rgba(255, 255, 255, 1);
  pointer-events: none;
}

/* Убираем старый ::after, так как теперь есть .sidebar-fill */
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

.homework-block {
  padding: 12px 16px 16px;
}

/* HEADER */
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

/* DAYS */
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

/* CARD */
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
  transition: transform 0.3s ease, opacity 0.2s ease;
  cursor: grab;
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