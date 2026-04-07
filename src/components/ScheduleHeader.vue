<template>
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
</template>

<script setup>
import { useSchedule } from '../composables/useSchedule'
import { useUser } from '../composables/useUser'

const { formatToday, formatPeriod, currentWeekNumber } = useSchedule()
const { user } = useUser()
</script>

<style scoped>
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
    -1px -1px 4px rgba(247, 251, 248, 0.58),
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
</style>