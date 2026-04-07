<template>
  <div class="teachers-grid">
    <div
      v-for="subject in subjects"
      :key="subject.name"
      class="teacher-chip"
      :class="{ active: selectedSubject?.name === subject.name }"
      @click="emit('select', subject)"
    >
      {{ subject.name }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  subjects: Array,
  selectedSubject: Object
})
const emit = defineEmits(['select'])
</script>

<style scoped>
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
    -2px -2px 4px rgba(255, 255, 255, 1),
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
    inset -2px -2px 4px rgba(255, 255, 255, 1),
    inset 1px 2px 4px rgba(0, 0, 0, 0.25);
}
</style>