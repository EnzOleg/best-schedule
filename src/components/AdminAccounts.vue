<template>
  <div class="admin-users">
    <div class="columns">

      <!-- ПРЕПОДАВАТЕЛИ -->
      <div class="column">
        <div class="column-header">
          <div class="header-left">
            <button class="collapse-btn" @click="toggleTeachersList" :title="showTeachersList ? 'Свернуть список' : 'Развернуть список'">
              <span class="arrow-icon" :class="{ rotated: !showTeachersList }">▼</span>
            </button>
            <span class="column-title">Преподаватели</span>
          </div>
          <button class="add-btn" @click="showCreateTeacher = !showCreateTeacher">
            <span>+</span>
          </button>
        </div>

        <div v-if="showCreateTeacher" class="create-form slide-fade">
          <input v-model="newTeacher.name" placeholder="ФИО преподавателя" />
          <input v-model="newTeacher.email" placeholder="Email" type="email" />
          <input v-model="newTeacher.password" placeholder="Пароль" type="password" />
          <button class="btn btn-primary" @click="createNewTeacher">Создать преподавателя</button>
        </div>

        <template v-if="showTeachersList">
          <div class="search-bar">
            <img :src="searchIcon" class="search-icon" alt="search" />
            <input v-model="teacherSearch" placeholder="Поиск преподавателя..." type="text" />
          </div>

          <div class="list">
            <div v-for="user in filteredTeachers"
                 :key="user.id"
                 class="list-item teacher-item"
                 :class="{ expanded: expandedTeacher === user.id }">

              <div class="item-content">
                <div class="user-row">
                  <img :src="teacherIcon" class="role-icon" alt="teacher" />

                  <div v-if="expandedTeacher !== user.id" class="user-info">
                    <div class="name">{{ user.name }}</div>
                    <div class="email">{{ user.email }}</div>
                  </div>

                  <div v-else class="edit-form">
                    <input v-model="teacherEdit.name" placeholder="Имя" />
                    <input v-model="teacherEdit.email" placeholder="Email" />
                  </div>
                </div>

                <button class="icon-btn edit-btn" @click="toggleTeacher(user)">
                  <img :src="editIcon" alt="edit" />
                </button>
              </div>

              <div v-if="expandedTeacher === user.id" class="action-buttons">
                <button class="btn btn-primary" @click="saveTeacher(user.id)">Сохранить</button>
                <button class="btn btn-secondary" @click="expandedTeacher = null">Отмена</button>
              </div>
            </div>
            <div v-if="filteredTeachers.length === 0" class="empty-state">
              Преподаватели не найдены
            </div>
          </div>
        </template>
      </div>

      <!-- ГРУППЫ -->
      <div class="column">
        <div class="column-header">
          <div class="header-left">
            <button class="collapse-btn" @click="toggleGroupsList" :title="showGroupsList ? 'Свернуть список' : 'Развернуть список'">
              <span class="arrow-icon" :class="{ rotated: !showGroupsList }">▼</span>
            </button>
            <span class="column-title">Группы</span>
          </div>
          <button class="add-btn" @click="showCreateGroup = !showCreateGroup">
            <span>+</span>
          </button>
        </div>

        <div v-if="showCreateGroup" class="create-form slide-fade">
          <input v-model="newGroup.name" placeholder="Название группы" />
          <input v-model.number="newGroup.course" placeholder="Курс" type="number" />
          <input v-model="newGroup.specialty" placeholder="Специальность" />
          <input v-model="newGroup.faculty" placeholder="Факультет" />
          <button class="btn btn-primary" @click="createNewGroup">Создать группу</button>
        </div>

        <template v-if="showGroupsList">
          <div class="search-bar">
            <img :src="searchIcon" class="search-icon" alt="search" />
            <input v-model="groupSearch" placeholder="Поиск групп..." type="text" />
          </div>

          <div class="list">
            <div v-for="group in filteredGroups"
                 :key="group.id"
                 class="list-item group-item"
                 :class="{ expanded: expandedGroup === group.id }">

              <div class="item-content group-header" @click="toggleGroup(group.id)">
                <div class="user-row">
                  <img :src="teacherIcon" class="role-icon" alt="group" />
                  <div class="user-info">
                    <div class="name">{{ group.name }}</div>
                    <div class="email">
                      {{ group.faculty }} | {{ group.specialty }} ({{ group.course }} курс)
                    </div>
                  </div>
                </div>
                <span class="arrow-icon" :class="{ rotated: expandedGroup === group.id }">▼</span>
              </div>

              <div v-if="expandedGroup === group.id" class="group-details">
                <!-- Кнопка показа/скрытия формы добавления студента -->
                <div class="add-student-toggle" @click.stop="toggleAddStudentForm(group.id)">
                  <div class="toggle-header">
                    <span class="arrow-icon" :class="{ rotated: showAddStudentForms[group.id] }">▼</span>
                    <span class="toggle-label">Добавить студента</span>
                  </div>
                </div>

                <!-- Форма добавления студента (показывается при showAddStudentForms[group.id]) -->
                <div v-if="showAddStudentForms[group.id]" class="create-form add-student-form slide-fade">
                  <input v-model="newStudent.name" placeholder="ФИО студента" />
                  <input v-model="newStudent.email" placeholder="Email" type="email" />
                  <input v-model="newStudent.password" placeholder="Пароль" type="password" />
                  <button class="btn btn-success" @click="addNewStudentToGroup(group.id)">+ Добавить студента</button>
                </div>

                <!-- Список студентов -->
                <div class="students-list">
                  <div v-for="student in group.students"
                       :key="student.id"
                       class="list-item student-item"
                       :class="{ expanded: expandedStudent === student.id }">

                    <div class="item-content">
                      <div class="user-row">
                        <img :src="studentIcon" class="role-icon" alt="student" />

                        <div v-if="expandedStudent !== student.id" class="user-info">
                          <div class="name">{{ student.name }}</div>
                          <div class="email">{{ student.email }}</div>
                        </div>

                        <div v-else class="edit-form">
                          <input v-model="studentEdit.name" placeholder="Имя" />
                          <input v-model="studentEdit.email" placeholder="Email" />
                        </div>
                      </div>

                      <button class="icon-btn edit-btn" @click="toggleStudent(student)">
                        <img :src="editIcon" alt="edit" />
                      </button>
                    </div>

                    <div v-if="expandedStudent === student.id" class="action-buttons">
                      <button class="btn btn-primary" @click="saveStudent(student.id)">Сохранить</button>
                      <button class="btn btn-secondary" @click="expandedStudent = null">Отмена</button>
                    </div>
                  </div>

                  <div v-if="group.students.length === 0" class="empty-state small">
                    В группе пока нет студентов
                  </div>
                </div>
              </div>
            </div>
            <div v-if="filteredGroups.length === 0" class="empty-state">
              Группы не найдены
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { graphqlRequest } from '../api'

import searchIcon from '../assets/icons/search.svg'
import editIcon from '../assets/icons/edit.svg'
import teacherIcon from '../assets/icons/teachers.svg'
import studentIcon from '../assets/icons/student.svg'

const users = ref([])
const groups = ref([])

const teacherSearch = ref('')
const groupSearch = ref('')

const expandedTeacher = ref(null)
const expandedStudent = ref(null)
const expandedGroup = ref(null)

const teacherEdit = ref({})
const studentEdit = ref({})

const newGroup = ref({ name: '', course: null, specialty: '', faculty: '' })
const newStudent = ref({ name: '', email: '', password: '' })
const newTeacher = ref({ name: '', email: '', password: '' })

const showCreateGroup = ref(false)
const showCreateTeacher = ref(false)
const showTeachersList = ref(true)
const showGroupsList = ref(true)

// Состояние видимости формы добавления студента для каждой группы
const showAddStudentForms = ref({})

const loadUsers = async () => {
  const data = await graphqlRequest(`query { users { id name email role } }`)
  users.value = data.users
}

const loadGroups = async () => {
  const data = await graphqlRequest(`
    query {
      groups {
        id name course specialty faculty
        students { id name email }
      }
    }
  `)
  groups.value = data.groups
  // Инициализируем состояние форм добавления для каждой группы (по умолчанию скрыты)
  groups.value.forEach(group => {
    if (showAddStudentForms.value[group.id] === undefined) {
      showAddStudentForms.value[group.id] = false
    }
  })
}

const toggleTeachersList = () => {
  showTeachersList.value = !showTeachersList.value
}

const toggleGroupsList = () => {
  showGroupsList.value = !showGroupsList.value
}

const toggleAddStudentForm = (groupId) => {
  showAddStudentForms.value[groupId] = !showAddStudentForms.value[groupId]
}

const toggleTeacher = (u) => {
  expandedTeacher.value = expandedTeacher.value === u.id ? null : u.id
  teacherEdit.value = { name: u.name, email: u.email }
}

const toggleStudent = (s) => {
  expandedStudent.value = expandedStudent.value === s.id ? null : s.id
  studentEdit.value = { name: s.name, email: s.email }
}

const toggleGroup = (id) => {
  expandedGroup.value = expandedGroup.value === id ? null : id
}

const saveTeacher = async (id) => {
  const res = await graphqlRequest(`
    mutation ($id: ID!, $name: String, $email: String) {
      updateUser(id: $id, name: $name, email: $email) { id name email role }
    }
  `, { id, ...teacherEdit.value })

  const i = users.value.findIndex(u => u.id === id)
  users.value[i] = res.updateUser
  expandedTeacher.value = null
}

const saveStudent = async (id) => {
  const res = await graphqlRequest(`
    mutation ($id: ID!, $name: String, $email: String) {
      updateUser(id: $id, name: $name, email: $email) { id name email }
    }
  `, { id, ...studentEdit.value })

  groups.value.forEach(g => {
    const i = g.students.findIndex(s => s.id === id)
    if (i !== -1) g.students[i] = res.updateUser
  })

  expandedStudent.value = null
}

const addNewStudentToGroup = async (groupId) => {
  const reg = await graphqlRequest(`
    mutation ($input: RegisterInput!) {
      register(input: $input) { id }
    }
  `, { input: { ...newStudent.value, role: "STUDENT" } })

  await graphqlRequest(`
    mutation ($groupId: ID!, $studentId: ID!) {
      addStudentToGroup(groupId: $groupId, studentId: $studentId) { id }
    }
  `, { groupId, studentId: reg.register.id })

  newStudent.value = { name: '', email: '', password: '' }
  await loadGroups()
  // После добавления студента можно оставить форму открытой или закрыть — оставляем как есть
}

const createNewGroup = async () => {
  await graphqlRequest(`
    mutation ($name: String!, $course: Int, $specialty: String, $faculty: String) {
      createGroup(name: $name, course: $course, specialty: $specialty, faculty: $faculty) { id }
    }
  `, newGroup.value)

  newGroup.value = { name: '', course: null, specialty: '', faculty: '' }
  showCreateGroup.value = false
  await loadGroups()
}

const createNewTeacher = async () => {
  await graphqlRequest(`
    mutation ($input: RegisterInput!) {
      register(input: $input) { id }
    }
  `, { input: { ...newTeacher.value, role: "TEACHER" } })

  newTeacher.value = { name: '', email: '', password: '' }
  showCreateTeacher.value = false
  await loadUsers()
}

const filteredTeachers = computed(() =>
  users.value.filter(u =>
    u.role === 'TEACHER' &&
    (u.name.toLowerCase().includes(teacherSearch.value.toLowerCase()) ||
     u.email.toLowerCase().includes(teacherSearch.value.toLowerCase()))
  )
)

const filteredGroups = computed(() =>
  groups.value.filter(g =>
    g.name.toLowerCase().includes(groupSearch.value.toLowerCase())
  )
)

onMounted(() => {
  loadUsers()
  loadGroups()
})
</script>

<style scoped>
/* ----- Базовые переменные ----- */
.admin-users {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
  background: #f0f9f8;
  max-height: 80vh;
  min-width: 80vh;
  overflow-y: scroll;
  padding: 24px 16px;
}

.columns {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  min-width: 280px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ----- Заголовки колонок (обновлённые тени и радиус) ----- */
.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: -2px -2px 4px 0 #FDF0DE,
              1px 2px 4px 0 rgba(0, 0, 0, 0.25),
              inset 2px 2px 4px 0 #FFFFFF;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.column-title {
  font-weight: 600;
  font-size: 1.2rem;
  color: #1e293b;
  letter-spacing: -0.2px;
}

/* Кнопка сворачивания списка */
.collapse-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #1e8f84;
}

.collapse-btn:hover {
  background: #e6f7f5;
}

.collapse-btn .arrow-icon {
  font-size: 1rem;
  transition: transform 0.2s ease;
  display: inline-block;
}

.collapse-btn .arrow-icon.rotated {
  transform: rotate(180deg);
}

/* Кнопка добавления (зелёная) */
.add-btn {
  background: #1e8f84;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: #177a70;
  transform: scale(1.02);
}

/* ----- Строка поиска (теперь 100% ширина) ----- */
.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  opacity: 0.5;
  transition: opacity 0.2s;
  z-index: 1;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 12px;
  border: none;
  background: white;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: -2px -2px 4px 0 #FDF0DE,
              1px 2px 4px 0 rgba(0, 0, 0, 0.25),
              inset 2px 2px 4px 0 #FFFFFF;
  box-sizing: border-box;
}

.search-bar input:focus {
  outline: none;
  border-color: #1e8f84;
  box-shadow: -2px -2px 4px 0 #FDF0DE,
              1px 2px 4px 0 rgba(0, 0, 0, 0.25),
              inset 2px 2px 4px 0 #FFFFFF,
              0 0 0 2px rgba(30, 143, 132, 0.3);
}

/* ----- Общий список ----- */
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Элементы списка (преподаватели, группы, студенты) - те же тени и радиус */
.list-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  box-shadow: -2px -2px 4px 0 #FDF0DE,
              1px 2px 4px 0 rgba(0, 0, 0, 0.25),
              inset 2px 2px 4px 0 #FFFFFF;
}

.list-item:hover {
  transform: translateY(-1px);
  box-shadow: -2px -2px 6px 0 #FDF0DE,
              2px 3px 6px 0 rgba(0, 0, 0, 0.3),
              inset 2px 2px 4px 0 #FFFFFF;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.user-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.role-icon {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 6px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0; /* для корректного переноса текста */
}

.name {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
  word-break: break-word;
}

.email {
  font-size: 0.75rem;
  color: #475569;
  word-break: break-all;
}

/* Кнопка редактирования */
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 12px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-btn img {
  width: 18px;
  opacity: 0.6;
}

.icon-btn:hover {
  background: #f1f5f9;
}

.icon-btn:hover img {
  opacity: 1;
}

/* Формы редактирования (вертикальные инпуты) */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.edit-form input {
  width: 100%;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 0.85rem;
  background: #fefefe;
  box-sizing: border-box;
}

.edit-form input:focus {
  outline: none;
  border-color: #1e8f84;
  box-shadow: 0 0 0 2px rgba(30, 143, 132, 0.2);
}

/* Кнопки действий */
.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: #1e8f84;
  color: white;
}

.btn-primary:hover {
  background: #177a70;
  transform: scale(0.98);
}

.btn-secondary {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

.btn-success {
  background: #1e8f84;
  color: white;
}

.btn-success:hover {
  background: #177a70;
}

/* Стрелка для группы (внутри элемента) */
.group-header {
  cursor: pointer;
  user-select: none;
}

.arrow-icon {
  font-size: 1rem;
  transition: transform 0.25s ease;
  color: #1e8f84;
  display: inline-block;
  flex-shrink: 0;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* Детали группы (студенты) */
.group-details {
  margin-top: 18px;
  padding-top: 8px;
  border-top: 1px solid #eef2f6;
}

/* Блок переключения формы добавления студента */
.add-student-toggle {
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid #e2e8f0;
}

.add-student-toggle:hover {
  background: #f1f5f9;
}

.toggle-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #1e8f84;
}

.toggle-label {
  font-size: 0.9rem;
}

/* Форма добавления студента */
.add-student-form {
  margin-bottom: 20px;
}

/* Список студентов */
.students-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-item {
  margin-top: 0;
  background: #fafcff;
  border: 1px solid #eef2ff;
  padding: 12px;
}

/* Форма создания (группы / преподавателя) */
.create-form {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: -2px -2px 4px 0 #FDF0DE,
              1px 2px 4px 0 rgba(0, 0, 0, 0.25),
              inset 2px 2px 4px 0 #FFFFFF;
}

.create-form input {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 0.85rem;
}

.create-form input:focus {
  outline: none;
  border-color: #1e8f84;
}

/* Пустые состояния */
.empty-state {
  text-align: center;
  padding: 32px 20px;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
  font-size: 0.85rem;
  border: 1px dashed #cbd5e1;
}

.empty-state.small {
  padding: 20px;
  margin-top: 8px;
}

/* Анимация */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== Адаптивность (улучшенная) ===== */
@media (max-width: 768px) {
  .admin-users {
    padding: 16px 12px;
  }
  
  .columns {
    gap: 20px;
  }
  
  .column {
    min-width: 100%;
    max-width: 100%;
  }
  
  .column-header {
    padding: 10px 16px;
  }
  
  .column-title {
    font-size: 1rem;
  }
  
  .list-item {
    padding: 12px;
  }
  
  .user-row {
    gap: 8px;
  }
  
  .role-icon {
    width: 28px;
    height: 28px;
    padding: 4px;
  }
  
  .edit-form input {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
  
  .btn {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
  
  .add-btn {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
  }
  
  .collapse-btn {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .admin-users {
    padding: 12px 8px;
  }
  
  .item-content {
    flex-wrap: wrap;
  }
  
  .user-row {
    flex-wrap: wrap;
  }
  
  .edit-form {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    text-align: center;
  }
  
  .toggle-header {
    font-size: 0.85rem;
  }
}
</style>