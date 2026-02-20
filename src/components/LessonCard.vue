<template>
  <div
    class="lesson-card"
    :class="{
      today: isToday,
      now: isNow,
      homework: hasHomework
    }"
  >
    <div class="title">
      <span class="title-text">{{ title }}</span>
      <span v-if="hasHomework" class="dz">ДЗ</span>
    </div>

    <div class="row">
        <img class="icon" src="../assets/icons/time.svg" alt="time" />
        <span>{{ subject }}</span>
    </div>

    <div class="row">
        <img class="icon" src="../assets/icons/geo.svg" alt="place" />
        <span>{{ place }}</span>
    </div>


    <div v-if="teacher" class="row">
      <span class="icon">👤</span>
      <span>{{ teacher }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,        // КВТ-22-9
  subject: String,      // физика / информатика
  place: String,        // А-301
  teacher: String,      // Сидоров С.С.
  hasHomework: Boolean, // ДЗ
  isToday: Boolean,     // сегодня
  isNow: Boolean        // текущая пара
})
</script>

<style scoped>
.lesson-card {
  background: #EEF7F7;
  border-radius: 18px;
  padding: 14px 14px 12px;
  font-size: 14px;
  color: #2b3a3a;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow:
    1px 4px 4px rgba(0,0,0,0.25),
    -2px -2px 4px rgba(255,255,255,1);

  min-width: 159px;
}

/* ---------- STATES ---------- */
.lesson-card.today {
  background: #6AB7B6;
  color: #ffffff;
}

.lesson-card.now {
  background: #45A5A4;
  color: #ffffff;
}

.lesson-card.now .icon {
  opacity: 0.9;
}

.dz {
  padding: 4px 10px;
  border-radius: 999px;

  font-size: 14px;
  font-weight: 500;
  line-height: 1;

  background: #6bbfba;
  color: #ffffff;

  flex-shrink: 0;
}


/* ---------- CONTENT ---------- */
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-weight: 500;
  font-size: 12px;
  margin-bottom: 6px;
}

.title-text {
  white-space: nowrap;
}


.row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.85;

  min-height: 24px;
}

.icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%);
  opacity: 0.85;
}

.lesson-card.today .icon {
  filter: brightness(0) invert(1);
}

.lesson-card.now .icon {
  filter: brightness(0) invert(1);
}

.lesson-card.today .dz,
.lesson-card.now .dz {
  position: relative;
  padding: 4px 10px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 500;
  line-height: 1;

  color: #ffffff;
  background: transparent;

  z-index: 0;
}

.lesson-card.today .dz::after,
.lesson-card.now .dz::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;

  background:
    /* свет слева сверху */
    radial-gradient(
      110% 110% at 0% 0%,
      rgba(255,255,255,1) 10%,
      rgb(255, 255, 255) 26%,
      rgba(255,255,255,0) 52%
    ),
    /* свет справа снизу */
    radial-gradient(
      110% 110% at 100% 100%,
      rgba(255,255,255,1) 10%,
      rgb(255, 255, 255) 26%,
      rgba(255,255,255,0) 52%
    );

  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;

  padding: 2px;
}


</style>
