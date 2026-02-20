<template>
  <div class="schedule-page">
    <div class="app-shell">

      <!-- LEFT -->
      <section class="main">
<header class="top-bar">
  <div class="header-left">
  <div class="avatar">
    <img src="../assets/icons/BigGreenB.png" alt="">
  </div>

  <div class="user-text">
    <div class="user-row">
      <div class="name">Smith J.</div>
      <div class="pill">Сегодня, вт, 7 окт.</div>
    </div>

    <div class="period">
      <img src="../assets/icons/calendar.svg" alt="">
      Расписание занятий · 27.10.2025 – 1.11.2025
    </div>
  </div>
</div>


  <div class="pill">
    Неделя 2 · <strong>Текущая</strong>
  </div>
</header>

        <div class="schedule-area">

          <div class="week-switcher">
            <img src="../assets/icons/other_eclipse.svg" alt="week 1">
            <img src="../assets/icons/current_eclipse.svg" class="current" alt="week 2">
            <img src="../assets/icons/other_eclipse.svg" alt="week 3">
          </div>


          <!-- Тут потом будет grid -->
          <div class="schedule-grid">

          <!-- HEADER ROW -->
          <div class="cell time-head">Время</div>
          <div class="cell day-head">Пн 27.10</div>
          <div class="cell day-head">Вт 28.10</div>
          <div class="cell day-head today">Ср 29.10<br /><span>Сегодня</span></div>
          <div class="cell day-head">Чт 30.10</div>
          <div class="cell day-head">Пт 31.10</div>
          <div class="cell day-head">Сб 1.11</div>

          <!-- ROW 1 -->
          <div class="cell time-cell now">8:00–9:20</div>
          <div class="cell">
          <LessonCard
              title="КВТ-22-9"
              subject="физика"
              place="А-301"
              :hasHomework="true"
              :isToday="false"
              :isNow="false"
          />
          </div>

          <div class="cell empty">
          <LessonCard
              title="КВТ-22-9"
              subject="физика"
              place="А-301"
              :hasHomework="false"
              :isToday="false"
              :isNow="false"
          />
          </div>
          <div class="cell empty">        <LessonCard
              title="КВТ-22-9"
              subject="физика"
              place="А-301"
              :hasHomework="false"
              :isToday="true"
              :isNow="true"
          /></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

          <!-- ROW 2 -->
          <div class="cell time-cell">9:30–10:50</div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty">
                      <LessonCard
              title="КВТ-22-9"
              subject="физика"
              place="А-301"
              :hasHomework="true"
              :isToday="true"
              :isNow="false"
          />
          </div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

          <!-- ROW 3 -->
          <div class="cell time-cell">11:00–12:20</div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

          <!-- ROW 4 -->
          <div class="cell time-cell">12:40–14:00</div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

          <!-- ROW 5 -->
          <div class="cell time-cell">14:10–15:30</div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

          <!-- ROW 6 -->
          <div class="cell time-cell">15:30–16:50</div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>
          <div class="cell empty"></div>

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
import LessonCard from '../components/LessonCard.vue';
</script>

<style scoped>
.schedule-page {
  min-height: 90vh;
  padding-top: 4vh;
  
  display: flex;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
}

.app-shell {
  display: flex;
  gap: 4px;

  background-color: rgba(240, 249, 248, 0.2);

  border-radius: 28px;

  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1),
    inset 2px 2px 4px rgba(255, 255, 255, 1);;
}

/* ---------- HEADER ---------- */
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
    /* светлый верхний ореол */
    -1px -1px 4px rgba(247, 251, 248, 0.58),

    /* тёмная нижняя тень */
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

/* ---------- MAIN ---------- */
.main {
  flex: 1;
  background-color: rgba(240, 249, 248, 0.2);

  border-radius: 22px;
  padding: 18px;

}

/* ---------- GRID PLACEHOLDER ---------- */
.schedule-placeholder {
  height: 600px;
  border-radius: 18px;
  background: #E6EBF1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;

  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    -4px -4px 4px rgba(253, 240, 222, 1),
    inset 2px 2px 4px rgba(255, 255, 255, 1);;
}

/* ---------- SIDEBAR ---------- */
/* ---------- SIDEBAR CONTAINER ---------- */
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

/* ---------- SCHEDULE GRID ---------- */
.schedule-area {
  position: relative;
  padding-left: 20px;
}

.week-switcher {
  position: absolute;
  left: -5px;            
  top: 50%;             
  transform: translateY(-30%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  pointer-events: auto;
}

.week-switcher img {
  width: 10px;
  height: 10px;
  opacity: 0.7;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.week-switcher img.current {
  width: 16px;
  height: 16px;
  opacity: 1;
}

.week-switcher img:hover {
  transform: scale(1.2);
  opacity: 1;
}

.schedule-grid {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 120px repeat(6, 1fr);

  /* ПЕРВАЯ строка — под заголовки */
  grid-template-rows: 55px repeat(6, 100px);
  gap: 4px;

  border-radius: 22px;
  padding: 0;
  overflow: hidden; /* ВАЖНО: чтобы линии и тени не вылезали */

  background:
    /* базовый фон */
    rgba(255, 255, 255, 0.55);

  background-size:
    calc((100% - 120px) / 6) 100%,
    100% 96px,
    100% 100%;

  background-position:
    120px 0,
    0 0,
    0 0;

  background-repeat: repeat;

  /* GLASS + ТЕНИ ИЗ FIGMA */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    -2px -2px 4px rgba(253, 240, 222, 1),
     1px  2px 4px rgba(0, 0, 0, 0.25),
    inset 2px 2px 4px #FFFFFF;
}



/* ---------- BASE CELL ---------- */
.cell {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;
  color: #2b3a3a;
}


/* ---------- HEADER CELLS ---------- */
.time-head,
.day-head {
  background: #FAFCFF;
  border-radius: 14px;
  font-weight: 500;

  justify-content: center;

  height: 45px;
  width: 96px;

  box-shadow:
    3px 3px 3px rgba(0,0,0,0.18),
    -3px -3px 3px rgba(255,255,255,1);
}

.time-head,
.day-head,
.time-cell {
    padding: 0;
    align-items: center;
}

.day-head {
  flex-direction: column;
  line-height: 1.2;
  color: black;
}

.time-head {
    color:#4D0B22;
}

.day-head span {
  font-size: 13px;
  color: #6b7b7b;
}

.day-head.today {
  height: 55px;
  width: 126px;

  color: #1e8f84;
}


/* ---------- TIME COLUMN ---------- */
.time-cell {
  background: #FAFCFF;
  border-radius: 14px;
  height: 45px;
  width: 96px;
  font-size: 13px;
  font-weight: 500;
  color: #4D0B22;

  justify-content: center;
  box-shadow:
    4px 4px 4px rgba(0,0,0,0.25),
    4px 4px 4px rgba(255, 255, 255, 1);;

  font-family: Arial, Helvetica, sans-serif;
}

.time-cell.now {
  height: 55px;
  width: 120px;

  font-weight: 600;
}


/* ---------- EMPTY CELLS ---------- */
.cell.empty {
  border-radius: 14px;
  background: transparent;
}
</style>
