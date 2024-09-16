<script lang="ts" setup>

const props = defineProps({
  id: { type: String, default: '' },
  showTimer: { type: Boolean, default: false },
  delay: { type: Number, default: 200 },
  isLink: { type: Boolean, default: false }
})

const { delay, id } = toRefs(props)
const { public: { siteUrl } } = useRuntimeConfig()
const imageStore = useImageStore()

const isLoaded = ref(false)
const show = ref(false)

const imageSource = computed(() => {
  const url = new URL(`/api/image/${unref(id)}`, siteUrl)

  return url.pathname + url.search
})

watch(id, (v) => {
  if (v) {
    setTimeout(() => {
      show.value = true
    }, unref(delay))
  }
}, { immediate: true })
</script>

<template>
  <div
    ef="el"
    class="bg-gray-200 dark:bg-gray-950 relative w-full cursor-pointer aspect-16-9 "
    @click="() => imageStore.setCurrentItem(id)"
  >
    <div>
      <img v-if="show" :src="imageSource" @load="isLoaded = true" />
      <div v-if="!show && !isLoaded" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center flex flex-col items-center gap-2">
          <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin text-black dark:text-white text-xl" />
          <ElapsedTime v-if="showTimer" class="text-xs" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-16-9 {
  position: relative;
  padding-bottom:56.25%; /* 16:9 Verhältnis */
  height: 0;
  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
