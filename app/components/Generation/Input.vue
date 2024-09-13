<script lang="ts" setup>
import { get } from 'lodash-es'

const state = reactive({
  prompt: '',
  human: false
})
const generationService = useGeneration()
const { currentImageIds, currentStatus, error } = toRefs(generationService)

const onSubmit = async () => {
  // trick bots :)
  if (state.human) return

  // generate image
  await generationService.createGeneration(state.prompt)
}
</script>

<template>
  <div>
    <div>
      <UForm :state="state" @submit="onSubmit">
        <UInput v-model="state.prompt" size="xl" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
          <template #trailing>
            <UButton type="submit" icon="i-heroicons-sparkles-20-solid" label="Generate" trailing :loading="currentStatus === 'PROGRESSING'" :disabled="state.prompt.length === 0" />
          </template>
        </UInput>
        <UCheckbox v-model="state.human" class="hidden" />
      </UForm>
    </div>
    <div v-if="currentStatus !== 'IDLE'" class="mt-4">
      <div v-if="['PROGRESSING', 'COMPLETED'].includes(currentStatus)" class="grid grid-cols-2 gap-1">
        <ImageWrapper
          v-for="i in 1"
          :key="i"
          :src="get(currentImageIds, `[${i - 1}]`, undefined) ? `/api/image/${get(currentImageIds, `[${i - 1}]`, undefined)}` : undefined"
          show-timer
        />
      </div>
      <div v-else-if="currentStatus === 'ERROR'">
        <pre class="text-xs bg-gray-950 mt-5 p-0.5 text-red-500" v-text="error" />
      </div>
    </div>
  </div>
</template>
