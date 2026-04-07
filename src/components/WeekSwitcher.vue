<template>
  <div class="week-switcher">
    <img
      src="../assets/icons/other_eclipse.svg"
      :class="{ current: weekOffset === -1 }"
      @click="$emit('changeWeek', -1)"
    />
    <img
      src="../assets/icons/current_eclipse.svg"
      :class="{ current: weekOffset === 0 }"
      @click="$emit('changeWeek', 0 - weekOffset)"
    />
    <img
      src="../assets/icons/other_eclipse.svg"
      :class="{ current: weekOffset === 1 }"
      @click="$emit('changeWeek', 1)"
    />
  </div>
</template>

<script setup>
defineProps({
  weekOffset: Number
})
defineEmits(['changeWeek'])
</script>

<style scoped>
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
</style>