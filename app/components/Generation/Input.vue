<script lang="ts" setup>
const state = reactive({
  prompt: '',
  human: false
})

const generationStore = useGenerationStore()
const imageStore = useImageStore()
const item = toRef(generationStore, 'item')
// const generationService = useGeneration()
// const { currentImageIds, currentStatus } = toRefs(generationService)

const disable = ref(false)
const isLoading = computed(() => disable.value || (item.value && item.value.status === 'PROCESSING'))
const isDisabled = computed(() => isLoading.value || state.prompt.length === 0)

const resetPrompt = () => {
  state.prompt = ''
}

const onSubmit = async () => {
  // trick bots :)
  if (state.human) return
  disable.value = true
  // generate image
  await generationStore.createSingle(state.prompt)
  disable.value = false
}

</script>

<template>
  <div>
    <div>
      <UForm :state="state" @submit="onSubmit">
        <UInput v-model="state.prompt" size="xl" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }" type="text">
          <template #trailing>
            <div class="flex items-center gap-3">
              <UButton v-if="state.prompt.length" icon="i-heroicons-x-mark-16-solid" variant="ghost" class="rounded-full" color="gray" size="xs" @click="resetPrompt" />
              <UButton type="submit" icon="i-heroicons-sparkles-20-solid" label="Generate" trailing :loading="isLoading" :disabled="isDisabled" />
            </div>
          </template>
        </UInput>
        <UCheckbox v-model="state.human" class="hidden" />
      </UForm>
    </div>
    <div v-if="item" class="mt-4">
      <div v-if="['PROCESSING', 'COMPLETED'].includes(item.status)" class="grid grid-cols-2 gap-1">
        <ImageWrapper v-for="({id}, idx) in imageStore.getImagesByGenerationId(item.id).value" :id="id" :key="idx" show-timer is-link />
      </div>
      <div v-else-if="item.status === 'ERROR'">
        <pre class="text-xs bg-gray-950 mt-5 p-0.5 text-red-500" v-text="item.error" />
      </div>
    </div>
  </div>
</template>
