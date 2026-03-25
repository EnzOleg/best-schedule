<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- Шапка с информацией об админе -->
      <div class="dashboard-header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon">🎓</span>
            <span class="logo-text">Admin Panel</span>
          </div>
        </div>
        <div class="header-right">
          <div class="admin-info">
            <div class="admin-avatar">
              <span class="avatar-placeholder">{{ getInitials(me?.name) }}</span>
            </div>
            <div class="admin-details">
              <div class="admin-name">{{ me?.name }}</div>
              <div class="admin-role">{{ me?.role }}</div>
            </div>
            <div class="admin-email">
              <span class="email-text">{{ me?.email }}</span>
            </div>
            <button class="logout-btn" @click="logout" title="Выйти">
              <span>🚪</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Метрики -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-value">{{ users.length }}</div>
          <div class="metric-label">Пользователей</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📚</div>
          <div class="metric-value">{{ groups.length }}</div>
          <div class="metric-label">Групп</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📖</div>
          <div class="metric-value">{{ subjects.length }}</div>
          <div class="metric-label">Предметов</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📅</div>
          <div class="metric-value">{{ schedules.length }}</div>
          <div class="metric-label">Занятий</div>
        </div>
      </div>

      <!-- Сетка карточек -->
      <div class="dashboard-grid">
        <!-- Пользователи -->
        <section class="dashboard-card">
          <div class="card-header">
            <h2>Пользователи</h2>
            <button class="add-btn" @click="showCreateUser = !showCreateUser">
              {{ showCreateUser ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateUser" class="create-form">
                <div class="form-row">
                  <input v-model="newUser.name" placeholder="Имя" />
                  <input v-model="newUser.email" placeholder="Email" />
                </div>
                <div class="form-row">
                  <input v-model="newUser.password" type="password" placeholder="Пароль" />
                  <select v-model="newUser.role">
                    <option value="STUDENT">Студент</option>
                    <option value="TEACHER">Преподаватель</option>
                    <option value="ADMIN">Администратор</option>
                  </select>
                </div>
                <button class="btn-primary" @click="createUser">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="u in users" :key="u.id" class="list-item">
                <div v-if="editUserId !== u.id" class="item-content">
                  <div class="item-main">
                    <span class="item-name">{{ u.name }}</span>
                    <span :class="['role-badge', u.role.toLowerCase()]">{{ u.role }}</span>
                  </div>
                  <div class="item-detail">{{ u.email }}</div>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditUser(u)">✏️</button>
                    <button class="icon-btn delete" @click="deleteUserFn(u.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <input v-model="editedUser.name" placeholder="Имя" />
                  <input v-model="editedUser.email" placeholder="Email" />
                  <select v-model="editedUser.role">
                    <option value="STUDENT">Студент</option>
                    <option value="TEACHER">Преподаватель</option>
                    <option value="ADMIN">Администратор</option>
                  </select>
                  <select v-model="editedUser.groupId">
                    <option value="">Без группы</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateUser">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditUser">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Группы -->
        <section class="dashboard-card">
          <div class="card-header">
            <h2>Группы</h2>
            <button class="add-btn" @click="showCreateGroup = !showCreateGroup">
              {{ showCreateGroup ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateGroup" class="create-form">
                <input v-model="newGroup.name" placeholder="Название" />
                <div class="form-row">
                  <input v-model.number="newGroup.course" type="number" placeholder="Курс" />
                  <input v-model="newGroup.faculty" placeholder="Факультет" />
                </div>
                <input v-model="newGroup.specialty" placeholder="Специальность" />
                <button class="btn-primary" @click="createGroup">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="g in groups" :key="g.id" class="list-item">
                <div v-if="editGroupId !== g.id" class="item-content">
                  <div class="item-main">
                    <span class="item-name">{{ g.name }}</span>
                    <span class="badge">{{ g.course }} курс</span>
                  </div>
                  <div class="item-detail">{{ g.faculty }} · {{ g.specialty }}</div>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditGroup(g)">✏️</button>
                    <button class="icon-btn delete" @click="deleteGroupFn(g.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <input v-model="editedGroup.name" placeholder="Название" />
                  <input v-model.number="editedGroup.course" type="number" placeholder="Курс" />
                  <input v-model="editedGroup.faculty" placeholder="Факультет" />
                  <input v-model="editedGroup.specialty" placeholder="Специальность" />
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateGroupFn">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditGroup">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Предметы -->
        <section class="dashboard-card">
          <div class="card-header">
            <h2>Предметы</h2>
            <button class="add-btn" @click="showCreateSubject = !showCreateSubject">
              {{ showCreateSubject ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateSubject" class="create-form">
                <input v-model="newSubjectName" placeholder="Название предмета" />
                <button class="btn-primary" @click="createSubject">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="s in subjects" :key="s.id" class="list-item">
                <div v-if="editSubjectId !== s.id" class="item-content">
                  <span class="item-name">{{ s.name }}</span>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditSubject(s)">✏️</button>
                    <button class="icon-btn delete" @click="deleteSubjectFn(s.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <input v-model="editedSubjectName" placeholder="Название" />
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateSubjectFn">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditSubject">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Расписание -->
        <section class="dashboard-card wide">
          <div class="card-header">
            <h2>Расписание</h2>
            <button class="add-btn" @click="showCreateSchedule = !showCreateSchedule">
              {{ showCreateSchedule ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateSchedule" class="create-form">
                <div class="form-row">
                  <input type="date" v-model="newSchedule.date" />
                  <input type="time" v-model="newSchedule.startTime" />
                  <input type="time" v-model="newSchedule.endTime" />
                </div>
                <input v-model="newSchedule.classroom" placeholder="Аудитория" />
                <div class="form-row">
                  <select v-model="newSchedule.groupId">
                    <option value="">Группа</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                  <select v-model="newSchedule.subjectId">
                    <option value="">Предмет</option>
                    <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                  <select v-model="newSchedule.teacherId">
                    <option value="">Преподаватель</option>
                    <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
                  </select>
                </div>
                <button class="btn-primary" @click="createSchedule">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="s in schedules" :key="s.id" class="list-item">
                <div v-if="editScheduleId !== s.id" class="item-content">
                  <div class="item-main">
                    <span class="item-name">{{ s.subject?.name }}</span>
                    <span class="badge-date">{{ formatDate(s.date) }}</span>
                    <span class="time-badge">{{ s.startTime }}–{{ s.endTime }}</span>
                  </div>
                  <div class="item-detail">
                    🏛️ {{ s.classroom }} · 👥 {{ s.group?.name }} · 👨‍🏫 {{ s.teacher?.name }}
                  </div>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditSchedule(s)">✏️</button>
                    <button class="icon-btn delete" @click="deleteSchedule(s.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <div class="form-row">
                    <input type="date" v-model="editedSchedule.date" />
                    <input type="time" v-model="editedSchedule.startTime" />
                    <input type="time" v-model="editedSchedule.endTime" />
                  </div>
                  <input v-model="editedSchedule.classroom" placeholder="Аудитория" />
                  <div class="form-row">
                    <select v-model="editedSchedule.groupId">
                      <option value="">Группа</option>
                      <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                    <select v-model="editedSchedule.subjectId">
                      <option value="">Предмет</option>
                      <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                    <select v-model="editedSchedule.teacherId">
                      <option value="">Преподаватель</option>
                      <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
                    </select>
                  </div>
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateScheduleFn">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditSchedule">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Домашнее задание -->
        <section class="dashboard-card">
          <div class="card-header">
            <h2>Домашнее задание</h2>
            <button class="add-btn" @click="showCreateHomework = !showCreateHomework">
              {{ showCreateHomework ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateHomework" class="create-form">
                <textarea v-model="newHomework.text" placeholder="Текст задания" rows="3"></textarea>
                <div class="form-row">
                  <input type="date" v-model="newHomework.date" />
                  <select v-model="newHomework.subjectId">
                    <option value="">Предмет</option>
                    <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                  <select v-model="newHomework.groupId">
                    <option value="">Группа</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                </div>
                <button class="btn-primary" @click="createHomework">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="h in homeworks" :key="h.id" class="list-item">
                <div v-if="editHomeworkId !== h.id" class="item-content">
                  <div class="item-main">
                    <span class="item-name">{{ h.text }}</span>
                    <span class="badge-date">{{ formatDate(h.date) }}</span>
                  </div>
                  <div class="item-detail">{{ h.subject?.name }} · {{ h.group?.name }}</div>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditHomework(h)">✏️</button>
                    <button class="icon-btn delete" @click="deleteHomeworkFn(h.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <textarea v-model="editedHomework.text" placeholder="Текст" rows="2"></textarea>
                  <input type="date" v-model="editedHomework.date" />
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateHomeworkFn">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditHomework">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Лекции -->
        <section class="dashboard-card wide">
          <div class="card-header">
            <h2>Лекции</h2>
            <button class="add-btn" @click="showCreateLecture = !showCreateLecture">
              {{ showCreateLecture ? '✕' : '+ Создать' }}
            </button>
          </div>
          <div class="card-body">
            <transition name="slide-fade">
              <div v-if="showCreateLecture" class="create-form">
                <div class="form-row">
                  <input type="date" v-model="newLecture.date" />
                  <select v-model="newLecture.groupId">
                    <option value="">Группа</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                  <select v-model="newLecture.subjectId">
                    <option value="">Предмет</option>
                    <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <input v-model="newLecture.title" placeholder="Название лекции" />
                <textarea v-model="newLecture.text" placeholder="Текст лекции" rows="4"></textarea>
                <button class="btn-primary" @click="createLectureFn">Создать</button>
              </div>
            </transition>
            <ul class="data-list">
              <li v-for="l in lectures" :key="l.id" class="list-item">
                <div v-if="editLectureId !== l.id" class="item-content">
                  <div class="item-main">
                    <span class="item-name">{{ l.title }}</span>
                    <span class="badge-date">{{ formatDate(l.date) }}</span>
                  </div>
                  <div class="item-detail">{{ l.subject?.name }} · {{ l.group?.name }}</div>
                  <div class="item-detail preview">{{ l.text.slice(0, 60) }}{{ l.text.length > 60 ? '…' : '' }}</div>
                  <div class="item-actions">
                    <button class="icon-btn edit" @click="startEditLecture(l)">✏️</button>
                    <button class="icon-btn delete" @click="deleteLectureFn(l.id)">🗑️</button>
                  </div>
                </div>
                <div v-else class="edit-form">
                  <input type="date" v-model="editedLecture.date" />
                  <input v-model="editedLecture.title" placeholder="Название" />
                  <textarea v-model="editedLecture.text" placeholder="Текст" rows="3"></textarea>
                  <div class="edit-actions">
                    <button class="btn-primary small" @click="updateLectureFn">Сохранить</button>
                    <button class="btn-secondary small" @click="cancelEditLecture">Отмена</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { graphqlRequest } from '../api'
import { useRouter } from 'vue-router'

const router = useRouter()
const me = ref(null)
const users = ref([])
const groups = ref([])
const subjects = ref([])
const schedules = ref([])
const homeworks = ref([])
const lectures = ref([])

// UI
const showCreateUser = ref(false)
const showCreateGroup = ref(false)
const showCreateSubject = ref(false)
const showCreateSchedule = ref(false)
const showCreateHomework = ref(false)
const showCreateLecture = ref(false)

// Users
const newUser = ref({ name: '', email: '', password: '', role: 'STUDENT' })
const editUserId = ref(null)
const editedUser = ref({ name: '', email: '', role: 'STUDENT', groupId: '' })

// Groups
const newGroup = ref({ name: '', course: 1, faculty: '', specialty: '' })
const editGroupId = ref(null)
const editedGroup = ref({ name: '', course: 1, faculty: '', specialty: '' })

// Subjects
const newSubjectName = ref('')
const editSubjectId = ref(null)
const editedSubjectName = ref('')

// Schedule
const newSchedule = ref({ date: '', startTime: '', endTime: '', classroom: '', groupId: '', subjectId: '', teacherId: '' })
const editScheduleId = ref(null)
const editedSchedule = ref({ date: '', startTime: '', endTime: '', classroom: '', groupId: '', subjectId: '', teacherId: '' })

// Homework
const newHomework = ref({ text: '', date: '', subjectId: '', groupId: '' })
const editHomeworkId = ref(null)
const editedHomework = ref({ text: '', date: '', subjectId: '', groupId: '' })

// Lectures
const newLecture = ref({ date: '', groupId: '', subjectId: '', title: '', text: '' })
const editLectureId = ref(null)
const editedLecture = ref({ date: '', groupId: '', subjectId: '', title: '', text: '' })

const teachers = computed(() => users.value.filter(u => u.role === 'TEACHER'))

const getInitials = (name) => {
  if (!name) return 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  me.value = null 
  router.push('/login')
}

const checkAdmin = async () => {
  const data = await graphqlRequest(`query { me { id name email role } }`)
  me.value = data.me
  if (me.value.role !== 'ADMIN') router.push('/')
}

const loadAll = async () => {
  users.value = await graphqlRequest(`query { users { id name email role group { id name } } }`).then(r => r.users)
  groups.value = await graphqlRequest(`query { groups { id name course faculty specialty students { id name } } }`).then(r => r.groups)
  subjects.value = await graphqlRequest(`query { subjects { id name } }`).then(r => r.subjects)
  schedules.value = await graphqlRequest(`query { scheduleForWeek(groupId: 0, startDate: "2026-01-01", endDate: "2026-12-31") { id date startTime endTime classroom group { name } subject { name } teacher { name } } }`).then(r => r.scheduleForWeek)
  homeworks.value = await graphqlRequest(`query { homeworkForMe(startDate: "2026-01-01", endDate: "2026-12-31") { id text date subject { name } group { name } } }`).then(r => r.homeworkForMe)
  lectures.value = await graphqlRequest(`query { lecturesForMe(startDate: "2026-01-01", endDate: "2026-12-31") { id date title text subject { name } group { name } teacher { name } } }`).then(r => r.lecturesForMe)
}

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : ''

onMounted(async () => {
  await checkAdmin()
  await loadAll()
})

// --- CRUD (без изменений) ---
const createUser = async () => {
  await graphqlRequest(`mutation {
    register(input: { name: "${newUser.value.name}", email: "${newUser.value.email}", password: "${newUser.value.password}", role: "${newUser.value.role}" }) {
      id name role
    }
  }`)
  newUser.value = { name: '', email: '', password: '', role: 'STUDENT' }
  await loadAll()
}
const startEditUser = (u) => { editUserId.value = u.id; editedUser.value = { name: u.name, email: u.email, role: u.role, groupId: u.group?.id || '' } }
const cancelEditUser = () => editUserId.value = null
const updateUser = async () => {
  await graphqlRequest(`mutation {
    updateUser(input: { id: "${editUserId.value}", name: "${editedUser.value.name}", email: "${editedUser.value.email}", role: "${editedUser.value.role}", groupId: ${editedUser.value.groupId || null} }) { id }
  }`)
  editUserId.value = null
  await loadAll()
}
const deleteUserFn = async (id) => {
  if (!confirm('Удалить пользователя?')) return
  await graphqlRequest(`mutation { deleteUser(id: "${id}") }`)
  await loadAll()
}

const createGroup = async () => {
  await graphqlRequest(`mutation {
    createGroup(name: "${newGroup.value.name}", course: ${newGroup.value.course}, specialty: "${newGroup.value.specialty}", faculty: "${newGroup.value.faculty}") { id }
  }`)
  newGroup.value = { name: '', course: 1, faculty: '', specialty: '' }
  await loadAll()
}
const startEditGroup = (g) => { editGroupId.value = g.id; editedGroup.value = { name: g.name, course: g.course, faculty: g.faculty, specialty: g.specialty } }
const cancelEditGroup = () => editGroupId.value = null
const updateGroupFn = async () => {
  await graphqlRequest(`mutation {
    updateGroup(input: { id: "${editGroupId.value}", name: "${editedGroup.value.name}", course: ${editedGroup.value.course}, faculty: "${editedGroup.value.faculty}", specialty: "${editedGroup.value.specialty}" }) { id }
  }`)
  editGroupId.value = null
  await loadAll()
}
const deleteGroupFn = async (id) => {
  if (!confirm('Удалить группу?')) return
  await graphqlRequest(`mutation { deleteGroup(id: "${id}") }`)
  await loadAll()
}

const createSubject = async () => {
  await graphqlRequest(`mutation { createSubject(name: "${newSubjectName.value}") { id } }`)
  newSubjectName.value = ''
  await loadAll()
}
const startEditSubject = (s) => { editSubjectId.value = s.id; editedSubjectName.value = s.name }
const cancelEditSubject = () => editSubjectId.value = null
const updateSubjectFn = async () => {
  await graphqlRequest(`mutation { updateSubject(id: "${editSubjectId.value}", name: "${editedSubjectName.value}") { id } }`)
  editSubjectId.value = null
  await loadAll()
}
const deleteSubjectFn = async (id) => {
  if (!confirm('Удалить предмет?')) return
  await graphqlRequest(`mutation { deleteSubject(id: "${id}") }`)
  await loadAll()
}

const createSchedule = async () => {
  await graphqlRequest(`mutation {
    createSchedule(input: {
      date: "${newSchedule.value.date}",
      startTime: "${newSchedule.value.startTime}",
      endTime: "${newSchedule.value.endTime}",
      classroom: "${newSchedule.value.classroom}",
      groupId: "${newSchedule.value.groupId}",
      subjectId: "${newSchedule.value.subjectId}",
      teacherId: "${newSchedule.value.teacherId}"
    }) { id }
  }`)
  newSchedule.value = { date: '', startTime: '', endTime: '', classroom: '', groupId: '', subjectId: '', teacherId: '' }
  await loadAll()
}
const startEditSchedule = (s) => {
  editScheduleId.value = s.id
  editedSchedule.value = {
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    classroom: s.classroom,
    groupId: s.group?.id || '',
    subjectId: s.subject?.id || '',
    teacherId: s.teacher?.id || ''
  }
}
const cancelEditSchedule = () => editScheduleId.value = null
const updateScheduleFn = async () => {
  await graphqlRequest(`mutation {
    updateSchedule(input: {
      id: "${editScheduleId.value}",
      date: "${editedSchedule.value.date}",
      startTime: "${editedSchedule.value.startTime}",
      endTime: "${editedSchedule.value.endTime}",
      classroom: "${editedSchedule.value.classroom}",
      groupId: "${editedSchedule.value.groupId}",
      subjectId: "${editedSchedule.value.subjectId}",
      teacherId: "${editedSchedule.value.teacherId}"
    }) { id }
  }`)
  editScheduleId.value = null
  await loadAll()
}
const deleteSchedule = async (id) => {
  if (!confirm('Удалить занятие?')) return
  await graphqlRequest(`mutation { deleteSchedule(id: "${id}") }`)
  await loadAll()
}

const createHomework = async () => {
  await graphqlRequest(`mutation {
    createHomework(input: {
      text: "${newHomework.value.text}",
      date: "${newHomework.value.date}",
      subjectId: "${newHomework.value.subjectId}",
      groupId: "${newHomework.value.groupId}"
    }) { id }
  }`)
  newHomework.value = { text: '', date: '', subjectId: '', groupId: '' }
  await loadAll()
}
const startEditHomework = (h) => {
  editHomeworkId.value = h.id
  editedHomework.value = {
    text: h.text,
    date: h.date,
    subjectId: h.subject?.id || '',
    groupId: h.group?.id || ''
  }
}
const cancelEditHomework = () => editHomeworkId.value = null
const updateHomeworkFn = async () => {
  await graphqlRequest(`mutation {
    updateHomework(input: {
      id: "${editHomeworkId.value}",
      text: "${editedHomework.value.text}",
      date: "${editedHomework.value.date}"
    }) { id }
  }`)
  editHomeworkId.value = null
  await loadAll()
}
const deleteHomeworkFn = async (id) => {
  if (!confirm('Удалить домашнее задание?')) return
  await graphqlRequest(`mutation { deleteHomework(id: "${id}") }`)
  await loadAll()
}

const createLectureFn = async () => {
  await graphqlRequest(`mutation {
    createLecture(input: {
      date: "${newLecture.value.date}",
      groupId: "${newLecture.value.groupId}",
      subjectId: "${newLecture.value.subjectId}",
      title: "${newLecture.value.title}",
      text: "${newLecture.value.text}"
    }) { id }
  }`)
  newLecture.value = { date: '', groupId: '', subjectId: '', title: '', text: '' }
  await loadAll()
}
const startEditLecture = (l) => {
  editLectureId.value = l.id
  editedLecture.value = {
    date: l.date,
    groupId: l.group?.id || '',
    subjectId: l.subject?.id || '',
    title: l.title,
    text: l.text
  }
}
const cancelEditLecture = () => editLectureId.value = null
const updateLectureFn = async () => {
  await graphqlRequest(`mutation {
    updateLecture(input: {
      id: "${editLectureId.value}",
      date: "${editedLecture.value.date}",
      title: "${editedLecture.value.title}",
      text: "${editedLecture.value.text}"
    }) { id }
  }`)
  editLectureId.value = null
  await loadAll()
}
const deleteLectureFn = async (id) => {
  if (!confirm('Удалить лекцию?')) return
  await graphqlRequest(`mutation { deleteLecture(id: "${id}") }`)
  await loadAll()
}
</script>

<style scoped>
/* ----- Общие ----- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9f8 0%, #e8f3f0 100%);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #2b3a3a;
  padding: 32px 48px;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* ----- Шапка ----- */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  padding: 10px 24px;
  border-radius: 60px;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.05), -2px -2px 6px rgba(255,255,255,0.7);
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e8f84, #2b3a3a);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.header-right .admin-info {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  padding: 8px 20px 8px 12px;
  border-radius: 60px;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.05), -2px -2px 6px rgba(255,255,255,0.7);
}

.admin-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1e8f84, #2b3a3a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.admin-details {
  line-height: 1.3;
}

.admin-name {
  font-weight: 700;
  font-size: 15px;
  color: #1e8f84;
}

.admin-role {
  font-size: 11px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-email {
  font-size: 13px;
  color: #2b3a3a;
  border-left: 1px solid rgba(0,0,0,0.1);
  padding-left: 16px;
}

.logout-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.logout-btn:hover {
  opacity: 1;
  background: rgba(0,0,0,0.05);
  transform: scale(1.05);
}

/* ----- Метрики ----- */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 32px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.7);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 10px 10px 20px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.8);
}

.metric-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.metric-value {
  font-size: 40px;
  font-weight: 800;
  color: #1e8f84;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #5c6b6b;
  margin-top: 8px;
  letter-spacing: 0.3px;
}

/* ----- Сетка карточек ----- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 32px;
}

.dashboard-card {
  background: rgba(240, 249, 248, 0.35);
  backdrop-filter: blur(12px);
  border-radius: 36px;
  box-shadow: 10px 10px 20px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.6);
  overflow: hidden;
  transition: all 0.2s;
}

.dashboard-card.wide {
  grid-column: span 2;
}

@media (max-width: 1024px) {
  .dashboard-card.wide {
    grid-column: span 1;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 0 28px;
  margin-bottom: 12px;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1e8f84;
  border-left: 4px solid #1e8f84;
  padding-left: 16px;
}

.add-btn {
  background: rgba(255,255,255,0.8);
  border: none;
  padding: 8px 20px;
  border-radius: 40px;
  font-weight: 500;
  font-size: 13px;
  color: #1e8f84;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.05), -2px -2px 5px rgba(255,255,255,0.8);
  transition: all 0.2s;
}

.add-btn:hover {
  transform: scale(0.96);
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.05), inset -2px -2px 4px rgba(255,255,255,0.6);
}

.card-body {
  padding: 0 28px 28px 28px;
}

/* ----- Формы создания ----- */
.create-form {
  background: rgba(255,255,255,0.5);
  border-radius: 28px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8), 0 6px 12px rgba(0,0,0,0.05);
}

.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.create-form input, .create-form select, .create-form textarea {
  flex: 1;
  background: white;
  border: none;
  padding: 12px 18px;
  border-radius: 48px;
  font-size: 14px;
  font-family: inherit;
  box-shadow: inset 2px 2px 6px rgba(0,0,0,0.02), inset -2px -2px 6px rgba(255,255,255,0.8);
  transition: all 0.2s;
}

.create-form input:focus, .create-form select:focus, .create-form textarea:focus {
  outline: none;
  box-shadow: inset 3px 3px 8px rgba(0,0,0,0.05), inset -3px -3px 8px rgba(255,255,255,0.9);
}

.btn-primary {
  background: #1e8f84;
  color: white;
  border: none;
  padding: 10px 28px;
  border-radius: 48px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 3px 3px 6px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.6);
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: scale(0.97);
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.15), inset -2px -2px 5px rgba(255,255,255,0.4);
}

.btn-primary.small, .btn-secondary.small {
  padding: 6px 16px;
  font-size: 12px;
}

.btn-secondary {
  background: rgba(255,255,255,0.8);
  color: #2b3a3a;
  border: none;
  padding: 10px 28px;
  border-radius: 48px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.05), -2px -2px 5px rgba(255,255,255,0.7);
  transition: all 0.2s;
}

.btn-secondary:hover {
  transform: scale(0.97);
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.05), inset -2px -2px 4px rgba(255,255,255,0.6);
}

/* ----- Списки ----- */
.data-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 24px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.03), -2px -2px 6px rgba(255,255,255,0.6);
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-1px);
  box-shadow: 4px 4px 12px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.7);
}

.item-content {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.item-name {
  font-weight: 600;
  font-size: 16px;
  color: #1f2d2d;
}

.item-detail {
  font-size: 13px;
  color: #5c6b6b;
}

.item-detail.preview {
  font-style: italic;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 40px;
  transition: all 0.2s;
}

.icon-btn.edit:hover {
  background: rgba(30,143,132,0.15);
  transform: scale(1.1);
}

.icon-btn.delete:hover {
  background: rgba(255,100,100,0.15);
  transform: scale(1.1);
}

.edit-form {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-form input, .edit-form select, .edit-form textarea {
  background: white;
  border: none;
  padding: 10px 16px;
  border-radius: 40px;
  font-size: 13px;
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.02), inset -2px -2px 4px rgba(255,255,255,0.8);
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* ----- Бейджи ----- */
.role-badge {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 40px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.role-badge.student { background: #d4edda; color: #155724; }
.role-badge.teacher { background: #cce5ff; color: #004085; }
.role-badge.admin { background: #e2d5f1; color: #4a2c6d; }

.badge {
  background: rgba(0,0,0,0.06);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
}

.badge-date {
  background: rgba(30,143,132,0.15);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
  color: #1e8f84;
}

.time-badge {
  background: rgba(0,0,0,0.05);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
  font-family: monospace;
}

/* ----- Анимации ----- */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ----- Адаптивность ----- */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 20px 20px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    flex-direction: column;
  }
  .item-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .item-actions {
    align-self: flex-end;
  }
  .card-header {
    padding: 20px 20px 0 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .card-body {
    padding: 0 20px 20px 20px;
  }
  .header-right .admin-info {
    flex-wrap: wrap;
    gap: 8px;
  }
  .admin-email {
    border-left: none;
    padding-left: 0;
  }
}
</style>