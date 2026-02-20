<template>
  <div class="schedule-page">
    <div class="app-shell">

      <!-- LEFT -->
      <section class="main">
        <div class="search-card">

          <!-- TABS -->
          <div class="search-tabs">
            <button class="tab active">Преподаватели</button>
            <button class="tab">Студенты</button>
          </div>

          <!-- CONTENT -->
          <div class="search-columns">

          <!-- COLUMN -->
          <div class="search-column">
            <div class="search-input">
              <img src="../assets/icons/search.svg" />
              <input placeholder="Поиск" />
            </div>

            <div class="results-list stacked">
              <div
                v-for="(item, index) in teachers"
                :key="item.id"
                class="stack-card"
                :style="getStackStyle(index)"
              >
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                  <div class="email">{{ item.email }}</div>
                </div>
                <button class="action">≡</button>
              </div>
            </div>
          </div>

          <!-- COLUMN -->
          <div class="search-column">
            <div class="search-input">
              <img src="../assets/icons/search.svg" />
              <input placeholder="Поиск" />
            </div>

            <div class="results-list stacked">
              <div
                v-for="(item, index) in students"
                :key="item.id"
                class="stack-card"
                :style="getStackStyle(index)"
              >
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                  <div class="email">{{ item.email }}</div>
                </div>
                <button class="action">≡</button>
              </div>
            </div>
          </div>

          </div>
        </div>
      </section>



      <!-- RIGHT -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="role">admin</div>
          <div class="email">n.grebennikov@aues.kz</div>
        </div>
        <div class="sidebar-content">
        <div class="sidebar-card">
          <div class="sidebar-item">
            <span>Группы</span>
            <img
              src="../assets/icons/arrow_right.svg"
              alt=""
              class="arrow-icon"
            />
          </div>

          <div class="sidebar-divider"></div>

          <div class="sidebar-item expandable">
          <div class="sidebar-item sub">
            <span>Преподаватели</span>
            <img src="../assets/icons/arrow_right.svg" class="arrow-icon">
          </div>
          </div>

          <div class="teachers-grid">
            <div class="teacher-chip">Иванов А.И.</div>
            <div class="teacher-chip">Петров В.В.</div>
            <div class="teacher-chip">Сидоров С.С.</div>
            <div class="teacher-chip">Козлов К.К.</div>
            <div class="teacher-chip active">Smith J.</div>
            <div class="teacher-chip">Голушко В.И.</div>
          </div>

          <div class="sidebar-divider"></div>

          <div class="sidebar-item">
            <span>Аккаунты</span>
              <img
              src="../assets/icons/arrow_right.svg"
              alt=""
              class="arrow-icon"
            />
          </div>

          <div class="sidebar-divider"></div>

          <div class="sidebar-item">
            <span>Расписание</span>
              <img
              src="../assets/icons/arrow_right.svg"
              alt=""
              class="arrow-icon"
            />
          </div>
        </div>
        </div>
      </aside>


    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const groupByLetter = (list) => {
  const map = {}
  list.forEach(item => {
    if (!map[item.letter]) map[item.letter] = []
    map[item.letter].push(item)
  })
  return map
}

const groupedTeachers = computed(() => groupByLetter(teachers))
const groupedStudents = computed(() => groupByLetter(students))

const getStackStyle = (index) => {
  const scale = 1 - index * 0.05
  const translateY = index * 18
  const zIndex = 100 - index
  const shadow = 0.28 - index * 0.04

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    zIndex,
    boxShadow: `
      4px 6px 10px rgba(0,0,0,${shadow}),
      -4px -4px 8px rgba(255,255,255,1)
    `
  }
}

// Тут логика типа с бека пришло потому что пока не связано ага угу
const teachers = [
  { id: 1, name: 'Армаева З.', email: 'n.grebennikov@aues.kz', letter: 'А' },
  { id: 2, name: 'Болатов В.В.', email: 'n.grebennikov@aues.kz', letter: 'Б' },
  { id: 3, name: 'Болатов Н.В.', email: 'n.grebennikov@aues.kz', letter: 'Б' },
  { id: 4, name: 'Валяев А.В.', email: 'n.grebennikov@aues.kz', letter: 'В' },
  { id: 5, name: 'Гребенников Н.В.', email: 'n.grebennikov@aues.kz', letter: 'Г' },
]

const students = [
  { id: 11, name: 'Армаева З.', email: 'n.grebennikov@aues.kz', letter: 'А' },
  { id: 12, name: 'Болатов В.В.', email: 'n.grebennikov@aues.kz', letter: 'Б' },
  { id: 13, name: 'Валяев А.В.', email: 'n.grebennikov@aues.kz', letter: 'В' },
  { id: 14, name: 'Гребенников Н.В.', email: 'n.grebennikov@aues.kz', letter: 'Г' },
]
</script>

<style scoped>
.schedule-page {
  min-height: 90vh;
  padding-top: 4vh;
  display: flex;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
  background: #eef5f4;
}

.app-shell {
  display: flex;
  gap: 12px;
  background: #eef6f6;
  border-radius: 28px;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(255,255,255,1);
}

/* ---------- MAIN ---------- */
.main {
  flex: 1;
  border-radius: 22px;
  padding: 18px;
}

/* ---------- SEARCH CARD ---------- */
.search-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(255,255,255,1);
}

/* ---------- TABS ---------- */
.search-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 16px;
}

.tab {
  height: 44px;
  border: none;
  background: transparent;
  border-radius: 14px;
  font-weight: 500;
  cursor: pointer;
}

.tab.active {
  background: #ffffff;
  box-shadow:
    inset 2px 2px 4px rgba(0,0,0,0.25),
    inset -2px -2px 4px rgba(255,255,255,1);
}

/* ---------- COLUMNS ---------- */
.search-columns {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  position: relative;
}

.search-columns::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  opacity: 0.25;
  background: #cfd8d7;
}

/* ---------- COLUMN ---------- */
.search-column {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---------- SEARCH INPUT ---------- */
.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    inset 2px 2px 4px rgba(0,0,0,0.25),
    inset -2px -2px 4px rgba(255,255,255,1);
}

.search-input input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: transparent;
}

/* ---------- RESULTS ---------- */
.results-list {
  margin-top: 16px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 6px;
}

.results-list.stacked {
  position: relative;
  padding-top: 10px;
}

.stack-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-thumb {
  background: rgba(30,143,132,0.3);
  border-radius: 8px;
}

/* ---------- LETTER GROUP ---------- */
.letter-group {
  position: relative;
  padding-left: 20px;
}

.letter-marker {
  position: absolute;
  left: -8px;
  top: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1e8f84;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(255,255,255,1);
}

/* ---------- ACCOUNT CARD ---------- */
.account-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 24px;
  align-items: center;
  padding: 14px 16px 14px 44px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(255,255,255,1);
}

.account-card:not(:first-child) {
  margin-top: 6px;
}

.avatar {
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e8f84;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(255,255,255,1);
}

.name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email {
  font-size: 12px;
  color: #6b7c7c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action {
  border: none;
  background: transparent;
  font-size: 18px;
  opacity: 0.6;
  cursor: pointer;
}

/* ---------- SIDEBAR ---------- */
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

.sidebar-card > * {
  position: relative;
  z-index: 1;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 0;
  padding-bottom: 315px;

  position: relative;
  overflow: hidden;
  z-index: 1;

  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1);
}

.sidebar-card::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 315px;

  background-color: #f0f9f8;

  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;

  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.18),
    inset -2px -2px 4px rgba(255, 255, 255, 1);

  pointer-events: none;
}

.sidebar-item:last-child {
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

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

</style>
