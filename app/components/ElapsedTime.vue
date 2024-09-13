<script lang="ts" setup>
const elapsedTime = ref(0)
const startTime = Date.now()
let intervalId: NodeJS.Timeout = null

// in seconds round to 2 decimals
const inSeconds = computed(() => (elapsedTime.value / 1000).toFixed(2))

const updateElapsedTime = () => {
  elapsedTime.value = Date.now() - startTime
}

// Starte den Timer, sobald die Komponente gemountet wird
onMounted(() => {
  intervalId = setInterval(updateElapsedTime, 10) // Aktualisierung jede Millisekunde
})

// Stoppe den Timer, wenn die Komponente unmountet wird
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <span>{{ inSeconds }} s</span>
</template>

<style></style>
