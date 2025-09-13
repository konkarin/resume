<template>
  <div class="skill-item">
    <img :src="logo" alt="" class="skill-logo" />
    <div class="skill-content">
      <h3 class="skill-name"><slot name="title" /></h3>
      <p class="skill-description"><slot /></p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logo: string;
}>();
</script>

<style scoped>
.skill-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 1rem 0;
}

.skill-logo {
  width: 50px;
}

.skill-content {
  display: flex;
  flex-direction: column;
}

.skill-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
}

.skill-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}
</style>
