<script lang="ts" setup>

const props = defineProps({
  src: { type: String, default: '' },
  showTimer: { type: Boolean, default: false },
  delay: { type: Number, default: 200 }
})

const { src, delay } = toRefs(props)

const el = ref<HTMLDivElement | null>(null)
const height = ref(0)

const isLoaded = ref(false)
const show = ref(false)

watch(src, (v) => {
  if (v) {
    setTimeout(() => {
      show.value = true
    }, unref(delay))
  }
})

onMounted(() => {
  if (!el.value) return
  const element = unref(el)
  height.value = element.clientWidth / 16 * 9
})
</script>

<template>
  <div ref="el" class="bg-gray-200 dark:bg-gray-950 relative w-full" :style="{height: `${height}px`}">
    <img v-if="show" :src="src" @load="isLoaded = true" />
    <div v-if="!show && !isLoaded" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center flex flex-col items-center gap-2">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin text-black dark:text-white text-xl" />
        <ElapsedTime v-if="showTimer" class="text-xs" />
      </div>
    </div>
  </div>
</template>
