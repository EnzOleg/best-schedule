<template>
  <div class="admin-schedule-generator">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- Управление кабинетами -->
      <div v-if="activeTab === 'classrooms'" class="classrooms-panel">
        <div class="panel-header">
          <h3>Кабинеты</h3>
          <button class="add-btn" @click="openClassroomModal()">+ Добавить</button>
        </div>

        <div class="classrooms-grid">
          <div v-for="room in classrooms" :key="room.id" class="classroom-card">
            <div class="classroom-name">{{ room.name }}</div>
            <div class="classroom-details">
              <span>Вместимость: {{ room.capacity || '—' }}</span>
              <span>Тип: {{ translateType(room.type) }}</span>
            </div>
            <div class="classroom-actions">
              <button class="icon-btn" @click="openClassroomModal(room)">✎</button>
              <button class="icon-btn" @click="deleteClassroom(room.id)">🗑</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Управление предметами -->
      <div v-if="activeTab === 'subjects'" class="subjects-panel">
        <div class="panel-header">
          <h3>Предметы</h3>
          <button class="add-btn" @click="openSubjectModal()">+ Добавить</button>
        </div>

        <div class="subjects-list">
          <div v-for="subject in subjects" :key="subject.id" class="subject-card">
            <div class="subject-header">
              <span class="subject-name">{{ subject.name }}</span>
              <span v-if="subject.requiredClassroomType" class="subject-type">
                {{ translateType(subject.requiredClassroomType) }}
              </span>
            </div>
            <div class="subject-teachers">
              Преподаватели: {{ subject.teachers?.map(t => t.name).join(', ') || 'не назначены' }}
            </div>
            <div class="subject-classrooms">
              Кабинеты: {{ subject.allowedClassrooms?.map(c => c.name).join(', ') || 'не указаны' }}
            </div>
            <div class="subject-hours">
              Часы по группам:
              <span v-for="gh in subject.groupHours" :key="gh.group.id">
                {{ gh.group.name }}: {{ gh.hours }} ч.
              </span>
              <span v-if="!subject.groupHours?.length">не заданы</span>
            </div>
            <div class="subject-actions">
              <button class="icon-btn" @click="openSubjectModal(subject)">✎</button>
              <button class="icon-btn" @click="deleteSubject(subject.id)">🗑</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Генерация расписания -->
      <div v-if="activeTab === 'generate'" class="generate-panel">
        <h3>Генерация расписания</h3>

        <div class="form-group">
          <label>Выберите группы</label>
          <div class="groups-select">
            <label v-for="group in allGroups" :key="group.id" class="checkbox-label">
              <input type="checkbox" :value="group" v-model="selectedGroups" />
              {{ group.name }}
            </label>
          </div>
        </div>

        <div v-for="(group, idx) in selectedGroups" :key="group.id" class="group-hours-block">
          <h4>{{ group.name }}</h4>
          <table class="hours-table">
            <thead>
              <tr>
                <th>Предмет</th>
                <th>Часы</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in allSubjects" :key="subject.id">
                <td>{{ subject.name }}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    v-model.number="groupHours[group.id][subject.id]"
                    style="width: 80px"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Дата начала</label>
            <input type="date" v-model="startDate" />
          </div>
          <div class="form-group">
            <label>Количество дней</label>
            <input type="number" min="1" v-model.number="days" />
          </div>
        </div>

        <button class="generate-btn" @click="generateSchedule" :disabled="generating">
          {{ generating ? 'Генерация...' : 'Сгенерировать расписание' }}
        </button>

        <div v-if="generationResult" class="result-message">
          {{ generationResult }}
        </div>
      </div>
    </div>

    <!-- Модальное окно для кабинета -->
    <div v-if="classroomModalOpen" class="modal-overlay" @click.self="closeClassroomModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingClassroom ? 'Редактировать кабинет' : 'Новый кабинет' }}</h3>
          <button class="modal-close" @click="closeClassroomModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label>Название</label>
            <input v-model="classroomForm.name" />
          </div>
          <div class="form-group">
            <label>Вместимость</label>
            <input type="number" v-model.number="classroomForm.capacity" />
          </div>
          <div class="form-group">
            <label>Тип</label>
            <select v-model="classroomForm.type">
              <option value="AUDITORIUM">Аудитория</option>
              <option value="LABORATORY">Лаборатория</option>
              <option value="GYM">Спортзал</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="submit-btn" @click="saveClassroom">Сохранить</button>
            <button class="cancel-btn" @click="closeClassroomModal">Отмена</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для предмета (упрощённая версия) -->
    <div v-if="subjectModalOpen" class="modal-overlay" @click.self="closeSubjectModal">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>{{ editingSubject ? 'Редактировать предмет' : 'Новый предмет' }}</h3>
          <button class="modal-close" @click="closeSubjectModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label>Название</label>
            <input v-model="subjectForm.name" />
          </div>
          <div class="form-group">
            <label>Требуемый тип кабинета</label>
            <select v-model="subjectForm.requiredClassroomType">
              <option :value="null">Не указан</option>
              <option value="AUDITORIUM">Аудитория</option>
              <option value="LABORATORY">Лаборатория</option>
              <option value="GYM">Спортзал</option>
            </select>
          </div>
          <div class="form-group">
            <label>Преподаватели</label>
            <div class="checkbox-group">
              <label v-for="teacher in teachers" :key="teacher.id" class="checkbox-label">
                <input type="checkbox" :value="teacher.id" v-model="subjectForm.teacherIds" />
                {{ teacher.name }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Разрешённые кабинеты</label>
            <div class="checkbox-group">
              <label v-for="room in classrooms" :key="room.id" class="checkbox-label">
                <input type="checkbox" :value="room.id" v-model="subjectForm.allowedClassroomIds" />
                {{ room.name }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Часы по группам</label>
            <div v-for="group in allGroups" :key="group.id" class="group-hour-row">
              <span>{{ group.name }}</span>
              <input type="number" min="0" v-model.number="subjectForm.groupHours[group.id]" />
            </div>
          </div>
          <div class="form-actions">
            <button class="submit-btn" @click="saveSubject">Сохранить</button>
            <button class="cancel-btn" @click="closeSubjectModal">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { graphqlRequest } from '../api'

const tabs = [
  { key: 'classrooms', label: 'Кабинеты' },
  { key: 'subjects', label: 'Предметы' },
  { key: 'generate', label: 'Генерация' }
]
const activeTab = ref('classrooms')

// ------------------- Кабинеты -------------------
const classrooms = ref([])
const classroomModalOpen = ref(false)
const editingClassroom = ref(null)
const classroomForm = reactive({ name: '', capacity: null, type: 'AUDITORIUM' })

const loadClassrooms = async () => {
  const data = await graphqlRequest(`{ classrooms { id name capacity type } }`)
  classrooms.value = data.classrooms
}

const openClassroomModal = (room = null) => {
  if (room) {
    editingClassroom.value = room
    classroomForm.name = room.name
    classroomForm.capacity = room.capacity
    classroomForm.type = room.type
  } else {
    editingClassroom.value = null
    classroomForm.name = ''
    classroomForm.capacity = null
    classroomForm.type = 'AUDITORIUM'
  }
  classroomModalOpen.value = true
}

const closeClassroomModal = () => {
  classroomModalOpen.value = false
  editingClassroom.value = null
}

const saveClassroom = async () => {
  if (editingClassroom.value) {
    // Поскольку мутации updateClassroom нет, делаем удаление + создание
    await graphqlRequest(`mutation DeleteClassroom($id: ID!) { deleteClassroom(id: $id) }`, {
      id: editingClassroom.value.id
    })
  }
  await graphqlRequest(
    `mutation CreateClassrooms($input: [CreateClassroomInput!]!) {
      createClassrooms(input: $input) { id }
    }`,
    {
      input: [{
        name: classroomForm.name,
        capacity: classroomForm.capacity,
        type: classroomForm.type
      }]
    }
  )
  closeClassroomModal()
  await loadClassrooms()
}

const deleteClassroom = async (id) => {
  if (!confirm('Удалить кабинет?')) return
  await graphqlRequest(`mutation DeleteClassroom($id: ID!) { deleteClassroom(id: $id) }`, { id })
  await loadClassrooms()
}

// ------------------- Предметы -------------------
const subjects = ref([])
const allGroups = ref([])
const teachers = ref([])
const subjectModalOpen = ref(false)
const editingSubject = ref(null)
const subjectForm = reactive({
  name: '',
  requiredClassroomType: null,
  teacherIds: [],
  allowedClassroomIds: [],
  groupHours: {}
})

const loadSubjects = async () => {
  const data = await graphqlRequest(`
    query {
      subjects {
        id
        name
        requiredClassroomType
        teachers { id name }
        allowedClassrooms { id name }
        groupHours {
          group { id name }
          hours
        }
      }
    }
  `)
  subjects.value = data.subjects
}

const loadGroups = async () => {
  const data = await graphqlRequest(`{ groups { id name } }`)
  allGroups.value = data.groups
}

const loadTeachers = async () => {
  const data = await graphqlRequest(`{ users { id name role } }`)
  teachers.value = data.users.filter(u => u.role === 'TEACHER')
}

const openSubjectModal = (subject = null) => {
  if (subject) {
    editingSubject.value = subject
    subjectForm.name = subject.name
    subjectForm.requiredClassroomType = subject.requiredClassroomType
    subjectForm.teacherIds = subject.teachers?.map(t => t.id) || []
    subjectForm.allowedClassroomIds = subject.allowedClassrooms?.map(c => c.id) || []
    const gh = {}
    subject.groupHours?.forEach(item => { gh[item.group.id] = item.hours })
    subjectForm.groupHours = gh
  } else {
    editingSubject.value = null
    subjectForm.name = ''
    subjectForm.requiredClassroomType = null
    subjectForm.teacherIds = []
    subjectForm.allowedClassroomIds = []
    subjectForm.groupHours = {}
  }
  subjectModalOpen.value = true
}

const closeSubjectModal = () => {
  subjectModalOpen.value = false
  editingSubject.value = null
}

const saveSubject = async () => {
  const input = {
    name: subjectForm.name,
    requiredClassroomType: subjectForm.requiredClassroomType,
    allowedClassroomIds: subjectForm.allowedClassroomIds,
    groupHours: Object.entries(subjectForm.groupHours)
      .filter(([_, hours]) => hours > 0)
      .map(([groupId, hours]) => ({ groupId, hours })),
    teacherIds: subjectForm.teacherIds
  }

  if (editingSubject.value) {
    // Используем addSubjectDetails для обновления (добавит связи)
    await graphqlRequest(
      `mutation AddSubjectDetails($input: AddSubjectDetailsInput!) {
        addSubjectDetails(input: $input) { id }
      }`,
      {
        input: {
          subjectId: editingSubject.value.id,
          allowedClassroomIds: input.allowedClassroomIds,
          groupHours: input.groupHours,
          teacherIds: input.teacherIds
        }
      }
    )
    // Имя и тип кабинета пока не обновляются через эту мутацию, но для демо пропустим
  } else {
    await graphqlRequest(
      `mutation CreateSubjectWithDetails($input: CreateSubjectInput!) {
        createSubjectWithDetails(input: $input) { id }
      }`,
      { input }
    )
  }
  closeSubjectModal()
  await loadSubjects()
}

const deleteSubject = async (id) => {
  if (!confirm('Удалить предмет?')) return
  await graphqlRequest(`mutation DeleteSubject($id: ID!) { deleteSubject(id: $id) }`, { id })
  await loadSubjects()
}

// ------------------- Генерация -------------------
const allSubjects = ref([])
const selectedGroups = ref([])
const groupHours = ref({}) // groupId -> { subjectId: hours }
const startDate = ref(new Date().toISOString().slice(0, 10))
const days = ref(5)
const generating = ref(false)
const generationResult = ref('')

const loadAllSubjects = async () => {
  const data = await graphqlRequest(`{ subjects { id name } }`)
  allSubjects.value = data.subjects
}

// Инициализация groupHours при изменении выбранных групп или предметов
watch([selectedGroups, allSubjects], () => {
  const newHours = {}
  selectedGroups.value.forEach(group => {
    if (!groupHours.value[group.id]) {
      newHours[group.id] = {}
    } else {
      newHours[group.id] = { ...groupHours.value[group.id] }
    }
    allSubjects.value.forEach(subject => {
      if (newHours[group.id][subject.id] === undefined) {
        newHours[group.id][subject.id] = 0
      }
    })
  })
  groupHours.value = newHours
}, { deep: true, immediate: true })

const generateSchedule = async () => {
  const groupsInput = selectedGroups.value.map(group => ({
    groupId: group.id,
    subjectHours: allSubjects.value
      .map(subject => ({
        subjectId: subject.id,
        hours: groupHours.value[group.id]?.[subject.id] || 0
      }))
      .filter(sh => sh.hours > 0)
  })).filter(g => g.subjectHours.length > 0)

  if (groupsInput.length === 0) {
    alert('Выберите хотя бы одну группу и укажите часы по предметам')
    return
  }

  generating.value = true
  generationResult.value = ''
  try {
    const data = await graphqlRequest(
      `mutation GenerateSchedule($request: GenerateScheduleRequest!) {
        generateSchedule(request: $request) {
          id
        }
      }`,
      {
        request: {
          groups: groupsInput,
          startDate: startDate.value,
          days: days.value
        }
      }
    )
    const count = data.generateSchedule.length
    generationResult.value = `Успешно сгенерировано ${count} занятий`
  } catch (e) {
    generationResult.value = `Ошибка: ${e.message}`
  } finally {
    generating.value = false
  }
}

// ------------------- Инициализация -------------------
onMounted(async () => {
  await Promise.all([
    loadClassrooms(),
    loadGroups(),
    loadTeachers(),
    loadSubjects(),
    loadAllSubjects()
  ])
})

const translateType = (type) => {
  const map = { AUDITORIUM: 'Аудитория', LABORATORY: 'Лаборатория', GYM: 'Спортзал' }
  return map[type] || type
}
</script>

<style scoped>
.admin-schedule-generator {
  background: #f0f9f8;
  border-radius: 22px;
  padding: 20px;
  height: 100%;
  max-height: 700px;
  overflow-y: auto;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 10px;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.tab.active {
  background: #1e8f84;
  color: white;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-btn {
  background: #1e8f84;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
}

.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.classroom-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.classroom-name {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.classroom-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
  color: #475569;
}

.classroom-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #e2e8f0;
}

/* Стили для предметов */
.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.subject-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.subject-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.subject-type {
  background: #e6f7f5;
  color: #1e8f84;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.subject-teachers,
.subject-classrooms,
.subject-hours {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 4px;
}

.subject-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

/* Генерация */
.generate-panel {
  max-width: 800px;
}

.groups-select {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.group-hours-block {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.hours-table {
  width: 100%;
  border-collapse: collapse;
}

.hours-table th,
.hours-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 440px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
}

.generate-btn {
  background: #1e8f84;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #e6f7f5;
  color: #1e8f84;
}

/* Модалки */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
}

.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-content {
  padding: 20px;
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
  border-radius: 20px;
  cursor: pointer;
}

.cancel-btn {
  background: #e2e8f0;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.group-hour-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
}
</style>