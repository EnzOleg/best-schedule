<template>
  <div class="admin-groups">
    <div class="search-section">
      <div class="column-title">
        Группы
        <button class="add-group-btn" @click="toggleCreateGroup">
          <span :class="{ rotated: showCreateGroup }">+</span>
        </button>
      </div>
      <div class="search-bar">
        <img :src="searchIcon" class="search-icon" />
        <input v-model="groupSearch" type="text" placeholder="Поиск групп" />
      </div>
    </div>

    <transition name="slide">
      <div v-if="showCreateGroup" class="create-group-form">
        <h3>Создать новую группу</h3>
        <input v-model="newGroup.name" type="text" placeholder="Название группы" />
        <input v-model.number="newGroup.course" type="number" placeholder="Курс" />
        <input v-model="newGroup.specialty" type="text" placeholder="Специальность" />
        <input v-model="newGroup.faculty" type="text" placeholder="Факультет" />
        <button @click="createNewGroup" class="add-btn">Создать группу</button>
      </div>
    </transition>

    <div class="groups-list">
      <div v-for="group in filteredGroups" :key="group.id" 
           class="group-card" :class="{ 'is-expanded': expandedGroup === group.id }">
        
        <div class="group-header" @click="toggleGroup(group.id)">
          <div class="group-info">
            <img :src="teacherIcon" class="role-icon" /> <div class="text-content">
              <div class="name">{{ group.name }}</div>
              <div class="details">{{ group.faculty }} | {{ group.specialty }} ({{ group.course }} курс)</div>
            </div>
          </div>
          <div class="expand-arrow" :class="{ 'rotated': expandedGroup === group.id }">▼</div>
        </div>

        <transition name="slide">
          <div v-if="expandedGroup === group.id" class="group-details">
            <div class="students-sublist">
              <div class="sub-title">Студенты группы:</div>
              
              <div v-for="student in group.students" :key="student.id" class="student-item">
                <div class="student-main">
                  <img :src="studentIcon" class="student-icon" />
                  <div class="student-info">
                    <span class="st-name">{{ student.name }}</span>
                    <span class="st-email">{{ student.email }}</span>
                  </div>
                </div>
                <button class="action-btn-box">
                  <img :src="editIcon" class="inner-icon" />
                </button>
              </div>

              <div class="add-student-form">
                <p>Добавить нового студента:</p>
                <input v-model="newStudent.name" type="text" placeholder="ФИО студента" />
                <input v-model="newStudent.email" type="text" placeholder="Email" />
                <input v-model="newStudent.password" type="password" placeholder="Пароль" />
                <button @click="addNewStudentToGroup(group.id)" class="add-btn">Создать и добавить</button>
              </div>
            </div>
          </div>
        </transition>
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

const groups = ref([])
const groupSearch = ref('')
const expandedGroup = ref(null)
const showCreateGroup = ref(false)

// Новая группа
const newGroup = ref({
  name: '',
  course: null,
  specialty: '',
  faculty: ''
})

// Поля для создания нового студента
const newStudent = ref({
  name: '',
  email: '',
  password: ''
})

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
          students {
            id
            name
            email
          }
        }
      }
    `)
    if (data?.groups) groups.value = data.groups
  } catch (e) { console.error(e) }
}

const toggleGroup = (id) => {
  expandedGroup.value = expandedGroup.value === id ? null : id
}

const toggleCreateGroup = () => {
  showCreateGroup.value = !showCreateGroup.value
}

const filteredGroups = computed(() => {
  return groups.value.filter(g => 
    g.name.toLowerCase().includes(groupSearch.value.toLowerCase())
  )
})

const addNewStudentToGroup = async (groupId) => {
  if (!newStudent.value.name || !newStudent.value.email) return alert('Заполните данные')

  try {
    const regData = await graphqlRequest(`
      mutation Register($input: RegisterInput!) {
        register(input: $input) { id name email }
      }
    `, {
      input: {
        name: newStudent.value.name,
        email: newStudent.value.email,
        password: newStudent.value.password,
        role: "STUDENT"
      }
    })

    const studentId = regData?.register?.id

    if (studentId) {
      await graphqlRequest(`
        mutation AddToGroup($groupId: ID!, $studentId: ID!) {
          addStudentToGroup(groupId: $groupId, studentId: $studentId) { id }
        }
      `, { groupId, studentId })

      alert('Студент создан и добавлен!')
      newStudent.value = { name: '', email: '', password: '' }
      loadGroups()
    }
  } catch (e) {
    alert('Ошибка: ' + e.message)
  }
}

const createNewGroup = async () => {
  if (!newGroup.value.name) return alert('Введите название группы')

  try {
    const res = await graphqlRequest(`
    mutation CreateGroup($name: String!, $course: Int, $specialty: String, $faculty: String) {
        createGroup(
        name: $name,
        course: $course,
        specialty: $specialty,
        faculty: $faculty
        ) {
        id name course specialty faculty students { id name email }
        }
    }
    `, {
    name: newGroup.value.name,
    course: newGroup.value.course,
    specialty: newGroup.value.specialty,
    faculty: newGroup.value.faculty
    })

    if (res?.createGroup) {
      alert('Группа создана!')
      newGroup.value = { name: '', course: null, specialty: '', faculty: '' }
      showCreateGroup.value = false
      loadGroups()
    }
  } catch (e) {
    alert('Ошибка: ' + e.message)
  }
}

onMounted(loadGroups)
</script>

<style scoped>
.admin-groups { padding: 30px; max-width: 900px; margin: 0 auto; }

.search-section { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; }

.column-title {
  height: 50px; display: flex; align-items: center; justify-content: center;
  background: #F3F4F6; border-radius: 15px; font-weight: 700; position: relative;
  box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff;
}

.add-group-btn {
  position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
  background: #008080; color: white; border: none; border-radius: 50%;
  width: 28px; height: 28px; font-size: 20px; line-height: 28px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform 0.3s;
}

.add-group-btn span.rotated { transform: rotate(45deg); }

.search-bar { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 15px; width: 18px; opacity: 0.4; }
.search-bar input {
  width: 100%; height: 48px; padding: 0 15px 0 45px;
  border-radius: 12px; border: none; outline: none; background: #F3F4F6;
  box-shadow: inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff;
}

.create-group-form {
  background: #fff; padding: 20px; border-radius: 15px; 
  box-shadow: 5px 5px 15px rgba(0,0,0,0.1); margin-bottom: 20px;
  display: flex; flex-direction: column; gap: 10px;
}
.create-group-form input { height: 36px; border-radius: 8px; border: 1px solid #ddd; padding: 0 10px; }
.create-group-form .add-btn { background: #008080; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; }

.groups-list { display: flex; flex-direction: column; gap: 20px; }

/* Карточка группы */
.group-card {
  background: #F3F4F6; border-radius: 20px;
  box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
  overflow: hidden; transition: 0.3s;
}

.group-header {
  padding: 20px; display: flex; align-items: center; justify-content: space-between;
  cursor: pointer;
}

.group-info { display: flex; align-items: center; gap: 15px; }
.role-icon { width: 35px; opacity: 0.7; }
.name { font-weight: 700; font-size: 18px; color: #333; }
.details { font-size: 13px; color: #888; }

/* Карточка студента */
.student-item {
  background: #ffffff; border-radius: 15px; padding: 12px 20px;
  margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.05);
}

.student-main { display: flex; align-items: center; gap: 15px; }
.student-icon { width: 24px; filter: grayscale(1); opacity: 0.6; }
.st-name { font-weight: 500; font-size: 15px; margin-right: 10px; }
.st-email { font-size: 14px; text-decoration: underline; color: #2D3748; }

/* Кнопка в рамке */
.action-btn-box {
  width: 34px; height: 34px; border: 1.5px solid #008080; 
  border-radius: 8px; background: transparent;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.inner-icon { width: 18px; }

/* Панель добавления студентов */
.group-details { padding: 0 20px 20px 20px; background: rgba(0,0,0,0.02); }
.students-sublist { padding-top: 15px; }
.sub-title { font-weight: 600; margin-bottom: 15px; color: #555; }

.add-student-form {
  margin-top: 20px; padding: 15px; background: #fff; border-radius: 12px;
  display: flex; flex-direction: column; gap: 10px;
}
.add-student-form input { height: 35px; border-radius: 8px; border: 1px solid #ddd; padding: 0 10px; }
.add-btn { background: #008080; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; }

.expand-arrow { transition: 0.3s; color: #aaa; }
.expand-arrow.rotated { transform: rotate(180deg); }

.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; }
</style>