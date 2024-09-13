<script lang="ts" setup>
const props = defineProps({
  src: { type: String, required: true },
  width: { type: Number, default: 300 },
  quality: { type: Number, default: 50 }
})

const { src, width, quality } = toRefs(props)
const show = ref(false)

const height = ref(0)

const _src = (q: number = quality.value) => computed(() => {
  const url = new URL(src.value, 'http://localhost')

  url.searchParams.set('quality', q.toString())
  url.searchParams.set('width', width.value.toString())

  return url.pathname + url.search
})

const isLoaded = ref(false)
const handleLoad = () => {
  isLoaded.value = true
}
const imgEl = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (!imgEl.value) return
  height.value = imgEl.value.clientWidth / 16 * 9

  setTimeout(() => {
    show.value = true
  }, 200)
})
</script>

<template>
  <div ref="imgEl" class="bg-gray-950 relative w-full aspect-video" :style="{height: `${height}px`}" :height="height">
    <img v-if="show" :src="_src(80).value" class="absolute inset-0 w-full h-full object-cover" @load="handleLoad" />
    <div v-if="!isLoaded" class="absolute inset-0 flex items-center justify-center">
      <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin text-white" />
    </div>
  </div>
</template>
