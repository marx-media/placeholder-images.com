<script lang="ts" setup>
import { copyToClipboard } from '~/utils/copyToClipboard.js'

const { public: { siteUrl } } = useRuntimeConfig()
const imageStore = useImageStore()

const aspectRatios = [
  { label: '16/9', value: '16/9' },
  { label: '4/3', value: '4/3' },
  { label: '1/1', value: '1/1' },
  { label: '3/2', value: '3/2' },
  { label: '3/4', value: '3/4' },
  { label: '2/3', value: '2/3' }
]

const formats = [
  { label: 'webp', value: 'webp' },
  { label: 'jpeg', value: 'jpeg' },
  { label: 'png', value: 'png' },
  { label: 'avif', value: 'avif' },
  { label: 'tiff', value: 'tiff' }
]

const fit = [
  { label: 'cover', value: 'cover' },
  { label: 'contain', value: 'contain' },
  { label: 'fill', value: 'fill' },
  { label: 'inside', value: 'inside' },
  { label: 'outside', value: 'outside' }
]

const state = reactive({
  width: 300,
  aspect: '16/9',
  quality: 80,
  format: 'webp',
  fit: 'cover'
})

const cardUi = {
  body: {
    base: '',
    background: '',
    padding: 'p-0 sm:p-0'
  },
  header: {
    base: '',
    background: '',
    padding: 'p-4 sm:p-4'
  },
  footer: {
    base: '',
    background: '',
    padding: 'p-4 sm:p-4'
  }
}
const selectMenuUi = {
  ring: 'ring-0',
  input: 'dark:placeholder-primary'
}

const url = computed(() => {
  if (!imageStore.item) return ''

  const _url = new URL(`/api/image/${imageStore.item.id}`, siteUrl)
  _url.searchParams.set('w', state.width.toString())
  _url.searchParams.set('ar', state.aspect)
  _url.searchParams.set('q', state.quality.toString())
  _url.searchParams.set('format', state.format)
  _url.searchParams.set('fit', state.fit)
  return _url.toString()
})
</script>

<template>
  <UModal :model-value="!!imageStore.item" :ui="{width: 'lg:max-w-xl'}" prevent-close>
    <UCard v-if="imageStore.item" :ui="cardUi">
      <template #header>
        <div class="flex items-start">
          <div class="flex-1">
            <div v-if="imageStore.item.generation.prompt" class="font-bold" v-text="imageStore.item.generation.prompt" />
            <USkeleton v-else class="h-2 w-[250px]" />
            <div v-if="imageStore.item.created_at" class="text-xs" v-text="Intl.DateTimeFormat('en-Us', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(imageStore.item.created_at))" />
            <USkeleton v-else class="h-2 w-[150px]" />
          </div>
          <div><UButton icon="i-heroicons-x-mark-16-solid" class="rounded-full" variant="ghost" @click="() => imageStore.unsetCurrentItem()" /></div>
        </div>
      </template>
      <ImageWrapper :id="imageStore.item.id" />
      <div class="p-2">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1 flex gap-1">
            <UTooltip text="Upgrade your plan">
              <USelectMenu placeholder="Save to project" size="xs" icon="i-heroicons-cube" color="primary" disabled :ui="selectMenuUi" />
            </UTooltip>
            <UTooltip text="Upgrade your plan">
              <UButton label="Remove Background" size="xs" variant="ghost" icon="i-heroicons-cube-transparent" disabled />
            </UTooltip>
          </div>
          <div class="flex gap-1">
            <!-- <UButton size="sm" variant="ghost" class="rounded-full" icon="i-heroicons-heart" /> -->
            <UButton size="sm" variant="ghost" class="rounded-full" icon="i-heroicons-arrow-down-on-square" />
          </div>
        </div>
      </div>
      <UForm :state="state" class="space-y-3 p-4 pt-0">
        <div class="flex gap-2">
          <UFormGroup label="Width" class="flex-1" name="format">
            <UInput v-model="state.width" size="xs" type="number" />
          </UFormGroup>
          <UFormGroup label="Aspect Ratio" class="flex-1" name="fit">
            <USelectMenu v-model="state.aspect" :options="aspectRatios" size="xs" value-attribute="value" />
          </UFormGroup>
        </div>
        <div class="flex gap-2">
          <UFormGroup label="Format" class="flex-1" name="format">
            <USelectMenu v-model="state.format" :options="formats" size="xs" value-attribute="value" />
          </UFormGroup>
          <UFormGroup label="Fit" class="flex-1" name="fit">
            <USelectMenu v-model="state.fit" :options="fit" size="xs" value-attribute="value" option-attribute="label" />
          </UFormGroup>
        </div>
        <UFormGroup label="Quality" name="quality">
          <div class="flex items-center gap-2">
            <URange v-model="state.quality" :min="10" :max="100" size="xs" :step="10" />
            <div class="text-xs w-6 text-right" v-text="state.quality" />
          </div>
        </UFormGroup>
        <UFormGroup label="URL">
          <UInput :model-value="url" size="xs" readonly :ui="{ icon: { trailing: { pointer: '' } } }">
            <template #trailing>
              <UButton icon="i-heroicons-clipboard-document" size="xs" variant="ghost" @click="() => copyToClipboard(url)" />
            </template>
          </UInput>
        </UFormGroup>
      </UForm>
    </UCard>
  </UModal>
</template>

<style></style>
