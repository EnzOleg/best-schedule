import { ref, computed, watch, nextTick } from 'vue'
import { graphqlRequest } from '../api'

export function useSchedule() {
  const schedule = ref([])
  const loading = ref(false)
  const error = ref('')
  const weekOffset = ref(0)
  
  // Полные списки с сервера
  const allTeachers = ref([])
  const allSubjects = ref([])
  const allGroups = ref([])
  const lectures = ref([])
  
  // Выбранные для фильтрации
  const selectedTeacher = ref(null)
  const selectedSubject = ref(null)
  const selectedGroup = ref(null)
  
  const selectedDay = ref('Пн')
  const selectedLectureDay = ref('Пн')  
  const setSelectedLectureDay = (day) => {
    selectedLectureDay.value = day
  }
  
  const newHomeworkScheduleItem = ref(null)
  const newHomeworkText = ref('')
  const newLectureGroup = ref(null)
  const newLectureDay = ref('Пн')
  const newLectureSubject = ref(null)
  const newLectureTitle = ref('')
  const newLectureText = ref('')
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  const getMonday = (offset = 0) => {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + offset * 7)
    return monday
  }
  
  // Функция для получения массива дней без реактивных вычислений
  const getWeekDaysArray = () => {
    const start = getMonday(weekOffset.value)
    const arr = []

    for (let i = 0; i < 6; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      arr.push(d.toISOString().slice(0, 10))
    }

    return arr
  }
  
  // Реактивный computed для отображения (только для шаблона)
  const days = computed(() => getWeekDaysArray())
  
  const currentWeekNumber = computed(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = (now - start) / 86400000
    const week = Math.ceil((diff + start.getDay() + 1) / 7)
    return week + weekOffset.value
  })
  
  const timeSlots = ['08:00', '09:30', '11:00', '12:40', '14:10', '15:30']
  
  const filteredSchedule = computed(() => {
    let result = schedule.value
    if (selectedTeacher.value) {
      result = result.filter(l => l.teacher?.id === selectedTeacher.value.id)
    }
    if (selectedSubject.value) {
      result = result.filter(l => l.subject?.id === selectedSubject.value.id)
    }
    if (selectedGroup.value) {
      result = result.filter(l => l.group?.id === selectedGroup.value.id)
    }
    return result
  })
  
  const getLesson = (date, startTime) => {
    return filteredSchedule.value.find(item => {
      const itemDate = item.date.slice(0, 10)
      const itemTime = item.startTime.slice(0, 5)
      return itemDate === date && itemTime === startTime
    })
  }
  
  const getOriginalLesson = (date, startTime) => {
    return schedule.value.find(item => {
      const itemDate = item.date.slice(0, 10)
      const itemTime = item.startTime.slice(0, 5)
      return itemDate === date && itemTime === startTime
    })
  }
  
  // Данные для сетки (без вызова функций в шаблоне)
  const gridData = computed(() => {
    const result = {}
    const currentDays = days.value
    currentDays.forEach(day => {
      result[day] = {}
      timeSlots.forEach(slot => {
        const original = schedule.value.find(item => {
          const itemDate = item.date.slice(0, 10)
          const itemTime = item.startTime.slice(0, 5)
          return itemDate === day && itemTime === slot
        })
        const filtered = filteredSchedule.value.find(item => {
          const itemDate = item.date.slice(0, 10)
          const itemTime = item.startTime.slice(0, 5)
          return itemDate === day && itemTime === slot
        })
        result[day][slot] = {
          original: original || null,
          isFilteredOut: original && !filtered
        }
      })
    })
    return result
  })
  
  // Загрузка расписания (использует getWeekDaysArray, а не days.value)
  const loadSchedule = async () => {
    loading.value = true
    error.value = ''
    try {
      const week = getWeekDaysArray()
      const startISO = week[0]
      const endISO = week[5]
      const data = await graphqlRequest(`
        query {
          scheduleForMe(
            startDate: "${startISO}",
            endDate: "${endISO}"
          ) {
            id
            date
            startTime
            endTime
            classroom {
              id
              name
            }
            subject { id name }
            teacher { id name }
            group { id name }
            homework {
              id
              text
            }
          }
        }
      `)
      schedule.value = data.scheduleForMe
      if (!weekDays.includes(selectedDay.value)) {
        selectedDay.value = 'Пн'
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  const loadLectures = async () => {
    try {
      const week = getWeekDaysArray()
      const startISO = week[0]
      const endISO = week[5]
      const data = await graphqlRequest(`
        query {
          lecturesForMe(startDate: "${startISO}", endDate: "${endISO}") {
            id
            date
            startTime
            endTime
            classroom
            title
            text
            subject { id name }
            teacher { id name }
          }
        }
      `)
      lectures.value = data.lecturesForMe
      console.log('lectures loaded:', data.lecturesForMe)
    } catch (e) {
      console.error('Failed to load lectures', e)
    }
  }
  
  const loadTeachers = async () => {
    try {
      const data = await graphqlRequest(`{ users { id name role } }`)
      allTeachers.value = data.users.filter(u => u.role === 'TEACHER')
    } catch (e) {
      console.error('Failed to load teachers', e)
    }
  }
  
  const loadGroups = async () => {
    try {
      const data = await graphqlRequest(`{ groups { id name course specialty faculty } }`)
      allGroups.value = data.groups
    } catch (e) {
      console.error('Failed to load groups', e)
    }
  }
  
  const loadAllSubjects = async () => {
    try {
      const data = await graphqlRequest(`{ subjects { id name } }`)
      allSubjects.value = data.subjects
    } catch (e) {
      console.error('Failed to load subjects', e)
    }
  }
  
  // Блокировка для changeWeek
  const isChangingWeek = ref(false)
  
  const changeWeek = async (offset) => {
    if (isChangingWeek.value) return
    isChangingWeek.value = true
    weekOffset.value += offset
    await nextTick()
    await loadSchedule()
    await loadLectures()
    isChangingWeek.value = false
  }
  
  // Функции выбора (без изменений)
  const selectTeacher = (teacher) => {
    if (selectedTeacher.value?.id === teacher.id) {
      selectedTeacher.value = null
    } else {
      selectedTeacher.value = teacher
    }
  }
  
  const selectSubject = (subject) => {
    if (selectedSubject.value?.id === subject.id) {
      selectedSubject.value = null
    } else {
      selectedSubject.value = subject
    }
  }
  
  const selectGroup = (group) => {
    if (selectedGroup.value?.id === group.id) {
      selectedGroup.value = null
    } else {
      selectedGroup.value = group
    }
  }
  
  const homeworkForSelectedDay = computed(() => {
    const date = getDateFromDay(selectedDay.value)

    const dayLessons = schedule.value.filter(l =>
      l.date.slice(0, 10) === date
    )

    return dayLessons.flatMap(lesson =>
      (lesson.homework || []).map(hw => ({
        ...hw,
        subject: lesson.subject
      }))
    )
  })
  
  const lecturesForSelectedDay = computed(() => {
    const date = getDateFromDay(selectedLectureDay.value)

    return lectures.value.filter(l =>
      l.date.slice(0, 10) === date
    )
  })
  
  const scheduleForSelectedDay = computed(() => {
    const date = getDateFromDay(selectedDay.value)

    return schedule.value.filter(l =>
      l.date.slice(0, 10) === date
    )
  })
  
  const getDateFromDay = (dayName) => {
    const index = weekDays.indexOf(dayName)
    return days.value[index] || ''
  }
  
  const createHomework = async () => {
    if (!newHomeworkScheduleItem.value || !newHomeworkText.value) {
      alert('Выберите урок и введите текст задания')
      return
    }
    try {
      await graphqlRequest(`
        mutation CreateHomework($input: CreateHomeworkInput!) {
          createHomework(input: $input) { id }
        }
      `, {
        input: {
          text: newHomeworkText.value,
          date: newHomeworkScheduleItem.value.date,
          scheduleItemId: newHomeworkScheduleItem.value.id
        }
      })
      await loadSchedule()
      newHomeworkText.value = ''
      newHomeworkScheduleItem.value = null
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
          createLecture(input: $input) { id }
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
      newLectureTitle.value = ''
      newLectureText.value = ''
      newLectureSubject.value = allSubjects.value.length ? allSubjects.value[0] : null
      newLectureDay.value = 'Пн'
      newLectureGroup.value = allGroups.value.length ? allGroups.value[0] : null
    } catch (e) {
      console.error('Failed to create lecture', e)
      alert('Ошибка при создании: ' + e.message)
    }
  }
  
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

    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
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
  
  const setSelectedDay = (day) => {
    selectedDay.value = day
  }
  
  watch(allSubjects, (newSubjects) => {
    if (newSubjects.length && !newLectureSubject.value) {
      newLectureSubject.value = newSubjects[0]
    }
  }, { immediate: true })
  
  watch(allGroups, (newGroups) => {
    if (newGroups.length && !newLectureGroup.value) {
      newLectureGroup.value = newGroups[0]
    }
  }, { immediate: true })
  
  return {
    schedule,
    loading,
    error,
    weekOffset,
    teachers: allTeachers,
    subjects: allSubjects,
    groups: allGroups,
    selectedTeacher,
    selectedSubject,
    selectedGroup,
    lectures,
    selectedDay,
    selectedLectureDay,
    days,
    currentWeekNumber,
    timeSlots,
    filteredSchedule,
    getLesson,
    getOriginalLesson,
    gridData,
    weekDays,
    loadSchedule,
    loadLectures,
    loadTeachers,
    loadGroups,
    loadAllSubjects,
    setSelectedLectureDay,
    changeWeek,
    selectTeacher,
    selectSubject,
    selectGroup,
    homeworkForSelectedDay,
    lecturesForSelectedDay,
    formatDay,
    formatToday,
    formatPeriod,
    newHomeworkScheduleItem,
    newHomeworkText,
    newLectureGroup,
    newLectureDay,
    newLectureSubject,
    newLectureTitle,
    newLectureText,
    scheduleForSelectedDay,
    createHomework,
    createLecture,
    setSelectedDay
  }
}