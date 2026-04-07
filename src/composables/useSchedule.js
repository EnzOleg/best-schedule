import { ref, computed, watch } from 'vue'
import { graphqlRequest } from '../api'

export function useSchedule() {
  const schedule = ref([])
  const loading = ref(false)
  const error = ref('')
  const weekOffset = ref(0)
  const teachers = ref([])
  const subjects = computed(() => {
    const map = new Map()
    schedule.value.forEach(lesson => {
      if (lesson.subject) {
        map.set(lesson.subject.name, lesson.subject)
      }
    })
    return Array.from(map.values())
  })
  const selectedTeacher = ref(null)
  const selectedSubject = ref(null)
  const lectures = ref([])
  const groups = ref([])
  
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const selectedDay = ref('Пн')
  const selectedLectureDay = ref('Пн')
  
  // Переменные для форм создания
  const newHomeworkScheduleItem = ref(null)
  const newHomeworkText = ref('')
  const newLectureGroup = ref(null)
  const newLectureDay = ref('Пн')
  const newLectureSubject = ref(null)
  const newLectureTitle = ref('')
  const newLectureText = ref('')
  
  const getMonday = (offset = 0) => {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + offset * 7)
    return monday
  }
  
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
  
  const timeSlots = ['08:00', '09:30', '11:00', '12:40', '14:10', '15:30']
  
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
  
  const getLesson = (date, startTime) => {
    return filteredSchedule.value.find(item => {
      const itemDate = item.date.slice(0, 10)
      const itemTime = item.startTime.slice(0, 5)
      return itemDate === date && itemTime === startTime
    })
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
            id
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
    const startISO = days.value[0]
    const endISO = days.value[5]
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
    } catch (e) {
      console.error('Failed to load groups', e)
    }
  }
  
  const changeWeek = async (offset) => {
    weekOffset.value += offset
    await loadSchedule()
    await loadLectures()
  }
  
  const selectTeacher = (teacher) => {
    selectedTeacher.value = selectedTeacher.value?.id === teacher.id ? null : teacher
  }
  
  const selectSubject = (subject) => {
    selectedSubject.value = selectedSubject.value?.name === subject.name ? null : subject
  }
  
  const homeworkForSelectedDay = computed(() => {
    const index = weekDays.indexOf(selectedDay.value)
    const date = days.value[index]
    const dayLessons = schedule.value.filter(l => l.date.slice(0, 10) === date)
    return dayLessons.flatMap(lesson => {
        return (lesson.homework || []).map(hw => ({
        ...hw,
        subject: lesson.subject
        }))
    })
  })
  
  const lecturesForSelectedDay = computed(() => {
    const index = weekDays.indexOf(selectedLectureDay.value)
    const date = days.value[index]
    return lectures.value.filter(l => l.date === date)
  })
  
  const scheduleForSelectedDay = computed(() => {
    const index = weekDays.indexOf(selectedDay.value)
    const date = days.value[index]
    return schedule.value.filter(l => l.date === date)
  })
  
  const getDateFromDay = (dayName) => {
    const index = weekDays.indexOf(dayName)
    return days.value[index]
  }
  
  const createHomework = async () => {
    if (!newHomeworkScheduleItem.value || !newHomeworkText.value) {
      alert('Выберите урок и введите текст задания')
      return
    }
    console.log('Creating homework:', {
    text: newHomeworkText.value,
    date: newHomeworkScheduleItem.value.date,
    scheduleItemId: newHomeworkScheduleItem.value.id
    })
    try {
      await graphqlRequest(`
        mutation CreateHomework($input: CreateHomeworkInput!) {
          createHomework(input: $input) {
            id
          }
        }
      `, {
        input: {
          text: newHomeworkText.value,
          date: newHomeworkScheduleItem.value.date,
          scheduleItemId: newHomeworkScheduleItem.value.id
        }
      })
      await loadSchedule()
      if (newHomeworkScheduleItem.value) {
        const createdLesson = newHomeworkScheduleItem.value
        const dayName = weekDays[days.value.indexOf(createdLesson.date)]
        if (dayName) {
            selectedDay.value = dayName
        }
      }
      // Сброс
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
      // Сброс
      newLectureTitle.value = ''
      newLectureText.value = ''
      newLectureSubject.value = subjects.value.length ? subjects.value[0] : null
      newLectureDay.value = 'Пн'
      newLectureGroup.value = groups.value.length ? groups.value[0] : null
    } catch (e) {
      console.error('Failed to create lecture', e)
      alert('Ошибка при создании: ' + e.message)
    }
  }
  
  // добавим computed, который возвращает уроки на выбранный для ДЗ день
    const scheduleForSelectedHomeworkDay = computed(() => {
    const index = weekDays.indexOf(selectedDay.value)
    const date = days.value[index]
    console.log('Selected day for homework:', selectedDay.value, 'date:', date)
    console.log('All lessons:', schedule.value.map(l => ({ id: l.id, date: l.date, subject: l.subject?.name })))
    const filtered = schedule.value.filter(l => l.date.slice(0, 10) === date)
    console.log('Filtered lessons:', filtered)
    return filtered
    })
  
  // Инициализация значений по умолчанию после загрузки
  watch(subjects, (newSubjects) => {
    if (newSubjects.length && !newLectureSubject.value) {
      newLectureSubject.value = newSubjects[0]
    }
  }, { immediate: true })
  
  watch(groups, (newGroups) => {
    if (newGroups.length && !newLectureGroup.value) {
      newLectureGroup.value = newGroups[0]
    }
  }, { immediate: true })
  
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
  
  const homeworkForSelectedDayView = computed(() => {
    const index = weekDays.indexOf(selectedDay.value)
    const date = days.value[index]
    const dayLessons = schedule.value.filter(l => l.date.slice(0, 10) === date)
    return dayLessons.flatMap(lesson => {
      return (lesson.homework || []).map(hw => ({
        ...hw,
        subject: lesson.subject
      }))
    })
  })
  const setSelectedDay= (day) => {
    selectedDay.value = day
  }

  return {
    schedule,
    loading,
    error,
    weekOffset,
    teachers,
    subjects,
    selectedTeacher,
    selectedSubject,
    lectures,
    groups,
    weekDays,
    selectedDay,
    selectedLectureDay,
    days,
    currentWeekNumber,
    timeSlots,
    filteredSchedule,
    getLesson,
    loadSchedule,
    loadLectures,
    loadTeachers,
    loadGroups,
    changeWeek,
    selectTeacher,
    selectSubject,
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
    scheduleForSelectedHomeworkDay,
    homeworkForSelectedDayView,
    setSelectedDay
  }
}