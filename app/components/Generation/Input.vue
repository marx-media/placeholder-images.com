<script lang="ts" setup>
import { get } from 'lodash-es'

const state = reactive({
  prompt: '',
  human: false
})

const generationStore = useGenerationStore()
const item = toRef(generationStore, 'item')
// const generationService = useGeneration()
// const { currentImageIds, currentStatus } = toRefs(generationService)

const onSubmit = async () => {
  // trick bots :)
  if (state.human) return

  // generate image
  await generationStore.createSingle(state.prompt)
}
</script>

<template>
  <div>
    <div>
      <UForm :state="state" @submit="onSubmit">
        <UInput v-model="state.prompt" size="xl" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
          <template #trailing>
            <UButton type="submit" icon="i-heroicons-sparkles-20-solid" label="Generate" trailing :loading="item && item.status === 'PROGRESSING'" :disabled="state.prompt.length === 0" />
          </template>
        </UInput>
        <UCheckbox v-model="state.human" class="hidden" />
      </UForm>
    </div>
    <div v-if="item" class="mt-4">
      <div v-if="['PROGRESSING', 'COMPLETED'].includes(item.status)" class="grid grid-cols-2 gap-1">
        <!-- <ImageWrapper v-for="id in currentImageIds" :id="id" :key="id" show-timer is-link /> -->
      </div>
      <div v-else-if="item.status === 'ERROR'">
        <pre class="text-xs bg-gray-950 mt-5 p-0.5 text-red-500" v-text="item.error" />
      </div>
    </div>
  </div>
</template>
