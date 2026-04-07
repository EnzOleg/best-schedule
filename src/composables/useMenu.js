import { computed } from 'vue'

export function useMenu(role) {
  const menuByRole = {
    ADMIN: [
      { label: 'Группы', key: 'groups'},
      { label: 'Преподаватели', key: 'teachers', expandable: true },
      { label: 'Аккаунты', key: 'accounts' },
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
  
  return {
    menu
  }
}