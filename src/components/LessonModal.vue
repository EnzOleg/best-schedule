<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="lesson-modal">
      <div class="modal-header">
        <h3>{{ lesson.subject?.name }} ({{ formatTimeRange(lesson) }})</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="card-block">
          <div class="info-item">
            <div class="icon">
              <img :src="subjectIcon" alt="subject" class="icon-img icon-black" />
            </div>
            <div>
              <div class="label">Предмет:</div>
              <div class="value">{{ lesson.subject?.name }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="icon">
              <img :src="teachersIcon" alt="teacher" class="icon-img icon-black" />
            </div>
            <div>
              <div class="label">Преподаватель:</div>
              <div class="value">{{ lesson.teacher?.name }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="icon">
              <img :src="geoIcon" alt="classroom" class="icon-img icon-black" />
            </div>
            <div>
              <div class="label">Аудитория:</div>
              <div class="value">{{ lesson.classroom?.name }}</div>
            </div>
          </div>
        </div>

        <div class="card-block">
          <div class="block-header">
            <span>Домашнее задание</span>
            <button
              v-if="canManageHomework && homeworks.length === 0"
              class="add-btn"
              @click="showAddHomework = true"
            >
              Создать
            </button>
          </div>

          <div v-if="homeworks.length" class="homework-list">
            <div v-for="hw in homeworks" :key="hw.id" class="homework-card">
              <div class="hw-text">{{ hw.text }}</div>
              <div class="hw-date">до {{ formatDate(hw.date) }}</div>

              <div v-if="canManageHomework" class="card-actions">
                <button class="icon-btn" @click="editHomework(hw)">✎</button>
                <button class="icon-btn" @click="deleteHomework(hw.id)">🗑</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">Нет домашних заданий</div>

          <div v-if="showAddHomework" class="add-form">
            <textarea v-model="newHomeworkText" placeholder="Текст задания" rows="3"></textarea>
            <input type="date" v-model="newHomeworkDate" />
            <div class="form-actions">
              <button class="submit-btn" @click="createHomework">Сохранить</button>
              <button class="cancel-btn" @click="showAddHomework = false">Отмена</button>
            </div>
          </div>
        </div>

        <div class="card-block">
          <div class="block-header">
            <span>Лекция</span>
            <button
              v-if="canManageLectures && lectures.length === 0"
              class="add-btn"
              @click="showAddLecture = true"
            >
              Создать
            </button>
          </div>

          <div v-if="lectures.length" class="lecture-list">
            <div v-for="lec in lectures" :key="lec.id" class="lecture-card">
              <div class="lec-title">{{ lec.title }}</div>
              <div class="lec-text">{{ lec.text }}</div>   
              <div class="lec-date">на {{ formatDate(lec.date) }}</div>

              <div v-if="canManageLectures" class="card-actions">
                <button class="icon-btn" @click="editLecture(lec)">✎</button>
                <button class="icon-btn" @click="deleteLecture(lec.id)">🗑</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">Нет лекций</div>

          <div v-if="showAddLecture" class="add-form">
            <input v-model="newLectureTitle" placeholder="Тема лекции" />
            <textarea v-model="newLectureText" placeholder="Содержание" rows="3"></textarea>
            <div class="form-actions">
              <button class="submit-btn" @click="createLecture">Сохранить</button>
              <button class="cancel-btn" @click="showAddLecture = false">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { graphqlRequest } from '../api'
import geoIcon from '../assets/icons/geo.svg'
import teachersIcon from '../assets/icons/teachers.svg'
import subjectIcon from '../assets/icons/subject.svg'

const props = defineProps({
  isOpen: Boolean,
  lesson: Object,      // ScheduleItem
  role: String,
  homeworkItems: Array,
  lectureItems: Array,
})

const emit = defineEmits(['close', 'updated'])

// Права
const canManageHomework = computed(() => props.role === 'TEACHER')
const canManageLectures = computed(() => props.role === 'TEACHER')

// Локальное состояние для ДЗ
const homeworks = ref([])
const showAddHomework = ref(false)
const newHomeworkText = ref('')
const newHomeworkDate = ref('')

const editingHomeworkId = ref(null)
const editingLectureId = ref(null)

// Локальное состояние для лекций
const lectures = ref([])
const showAddLecture = ref(false)
const newLectureTitle = ref('')
const newLectureText = ref('')

// При открытии модалки инициализируем данные
watch(() => props.isOpen, (open) => {
  if (open) {
    homeworks.value = [...(props.homeworkItems || [])]
    lectures.value = [...(props.lectureItems || [])]
    newHomeworkDate.value = props.lesson?.date || ''
    showAddHomework.value = false
    showAddLecture.value = false
  }
})

const closeModal = () => {
  emit('close')
}

const formatTimeRange = (lesson) => {
  if (!lesson) return ''
  return `${lesson.startTime?.slice(0,5)} – ${lesson.endTime?.slice(0,5)}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU')
}

// --- Домашние задания ---
const createHomework = async () => {
  if (!newHomeworkText.value.trim()) {
    alert('Введите текст задания')
    return
  }
  try {
    let mutation, variables
    if (editingHomeworkId.value) {
      mutation = `
        mutation UpdateHomework($id: ID!, $text: String, $date: String) {
          updateHomework(id: $id, text: $text, date: $date) { id text date }
        }
      `
      variables = {
        id: editingHomeworkId.value,
        text: newHomeworkText.value,
        date: newHomeworkDate.value
      }
    } else {
      mutation = `
        mutation CreateHomework($input: CreateHomeworkInput!) {
          createHomework(input: $input) { id text date }
        }
      `
      variables = {
        input: {
          text: newHomeworkText.value,
          date: newHomeworkDate.value,
          scheduleItemId: props.lesson.id
        }
      }
    }
    const result = await graphqlRequest(mutation, variables)
    const savedHomework = editingHomeworkId.value ? result.updateHomework : result.createHomework
    if (editingHomeworkId.value) {
      const index = homeworks.value.findIndex(h => h.id === editingHomeworkId.value)
      if (index !== -1) homeworks.value[index] = savedHomework
    } else {
      homeworks.value.push(savedHomework)
    }
    // Сброс формы
    newHomeworkText.value = ''
    newHomeworkDate.value = props.lesson?.date || ''
    showAddHomework.value = false
    editingHomeworkId.value = null
    emit('updated')
  } catch (e) {
    alert('Ошибка: ' + e.message)
  }
}

const editHomework = (hw) => {
  newHomeworkText.value = hw.text
  newHomeworkDate.value = hw.date
  editingHomeworkId.value = hw.id
  showAddHomework.value = true
}

const deleteHomework = async (id) => {
  if (!confirm('Удалить задание?')) return
  try {
    await graphqlRequest(`mutation DeleteHomework($id: ID!) { deleteHomework(id: $id) }`, { id })
    homeworks.value = homeworks.value.filter(h => h.id !== id)
    emit('updated')
  } catch (e) {
    alert('Ошибка при удалении: ' + e.message)
  }
}

// --- Лекции ---
const createLecture = async () => {
  if (!newLectureTitle.value.trim()) {
    alert('Введите тему лекции')
    return
  }
  try {
    let mutation, variables
    if (editingLectureId.value) {
      mutation = `
        mutation UpdateLecture($id: ID!, $input: CreateLectureInput!) {
          updateLecture(id: $id, input: $input) { id title text date }
        }
      `
      variables = {
        id: editingLectureId.value,
        input: {
          date: props.lesson.date,
          startTime: props.lesson.startTime,
          endTime: props.lesson.endTime,
          groupId: props.lesson.group?.id,
          subjectId: props.lesson.subject?.id,
          teacherId: props.lesson.teacher?.id,
          title: newLectureTitle.value,
          text: newLectureText.value || null
        }
      }
    } else {
      mutation = `
        mutation CreateLecture($input: CreateLectureInput!) {
          createLecture(input: $input) { id title text date }
        }
      `
      variables = {
        input: {
          date: props.lesson.date,
          startTime: props.lesson.startTime,
          endTime: props.lesson.endTime,
          groupId: props.lesson.group?.id,
          subjectId: props.lesson.subject?.id,
          teacherId: props.lesson.teacher?.id,
          title: newLectureTitle.value,
          text: newLectureText.value || null
        }
      }
    }
    const result = await graphqlRequest(mutation, variables)
    const savedLecture = editingLectureId.value ? result.updateLecture : result.createLecture
    if (editingLectureId.value) {
      const index = lectures.value.findIndex(l => l.id === editingLectureId.value)
      if (index !== -1) lectures.value[index] = savedLecture
    } else {
      lectures.value.push(savedLecture)
    }
    // Сброс формы
    newLectureTitle.value = ''
    newLectureText.value = ''
    showAddLecture.value = false
    editingLectureId.value = null
    emit('updated')
  } catch (e) {
    alert('Ошибка при сохранении лекции: ' + e.message)
  }
}

const editLecture = (lec) => {
  newLectureTitle.value = lec.title
  newLectureText.value = lec.text || ''
  editingLectureId.value = lec.id
  showAddLecture.value = true
}

const deleteLecture = async (id) => {
  if (!confirm('Удалить лекцию?')) return
  try {
    await graphqlRequest(`mutation DeleteLecture($id: ID!) { deleteLecture(id: $id) }`, { id })
    lectures.value = lectures.value.filter(l => l.id !== id)
    emit('updated')
  } catch (e) {
    alert('Ошибка при удалении: ' + e.message)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.lesson-modal {
  background: #fff;
  border-radius: 24px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 35px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #f0f9f8;
  border-bottom: 1px solid #e1e5ea;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #1e8f84;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7b7b;
  transition: color 0.2s;
}
.modal-close:hover { color: #1e8f84; }

/* ===== Новый стиль modal-body ===== */
.modal-body {
  background: #f6f8f7;
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

/* Карточки */
.card-block {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

/* Инфо блок */
.info-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.info-item:last-child {
  margin-bottom: 0;
}
.icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 18px;
}
.label {
  font-size: 0.85rem;
  color: #6b7280;
}
.value {
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
}

/* Заголовки блоков */
.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 12px;
  color: #065f46;
}

/* Домашка / лекция */
.homework-list, .lecture-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.homework-card, .lecture-card {
  margin-top: 10px;
  position: relative;
}
.hw-text, .lec-title {
  font-weight: 500;
  color: #111827;
}
.hw-date, .lec-date {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

.lec-text {
  font-size: 0.9rem;
  color: #4b5563;
  margin: 8px 0;
  line-height: 1.4;
}

/* Файлы */
.materials {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}
.file-item {
  width: 70px;
  height: 70px;
  background: #f3f4f6;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #374151;
}

/* Кнопки действий (редактировать/удалить) */
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #e2e8f0;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 0.9rem;
}

/* Форма добавления */
.add-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.add-form textarea, .add-form input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.9rem;
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

.add-btn {
  background: #1e8f84;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #166b62;
}

.icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  color: black;
}

.icon-black {
  filter: brightness(0) saturate(100%);
}
</style>