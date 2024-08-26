<script lang="ts" setup>
import { collection, doc, getFirestore, query, where } from 'firebase/firestore'
import type { IGeneration, WithId } from '~~/shared/models'

const props = withDefaults(defineProps<{ generationId: string, loading: boolean }>(), {
  generationId: '',
  loading: false,
})
const emit = defineEmits(['update:lodaing', 'update:generationId'])

const { loading, generationId } = useVModels(props, emit)

const keyword = ref('')
const db = useFirestore()
const { data: generation } = useDocument<WithId<IGeneration>>(() => generationId.value ? doc(db, 'generations', generationId.value) : null, { ssrKey: generationId.value })
const { data: images } = useCollection(() =>
  generation.value && generation.value.status === 'COMPLETE'
    ? query(
      collection(db, 'images'),
      where('generation', '==', doc(db, 'generations', generationId.value)),
    ) 
    : null, { ssrKey: `${generationId.value}-images` }
)

const createGeneration = async () => {
  loading.value = true
  try {
    const response = await $fetch(`/api/generate`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ keyword: keyword.value }),
    })
    generationId.value = response.generationId
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div>
      <UInput v-model="keyword" type="text" size="xl" class="relative" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }" @keyup.enter="createGeneration">
        <template #trailing>
          <UButton type="submit" label="Generate" trailing :loading="loading" :disabled="keyword.length === 0" @click="createGeneration" />
        </template>
      </UInput>
    </div>
    <div>
      <div v-if="loading || (generation && generation.status === 'PENDING')" class="flex gap-4 mt-8">
        <div v-for="i in 2" :key="i">
          <div class="w-80 h-48 dark:bg-gray-800 border dark:border-gray-700 rounded-md flex items-center justify-center relative">
            <div class="absolute top-0 left-0 p-2">
              <UIcon name="i-heroicons-arrow-path-20-solid" class="text-gray-400 dark:text-gray-600 text-2xl animate-spin" />
            </div>
            <UIcon name="i-heroicons-photo" class="text-gray-400 dark:text-gray-700 text-8xl" />
          </div>
        </div>
      </div>
      <div v-if="generation && generation.status === 'COMPLETE' && images.length" class="flex gap-4">
        <div v-for="image in images" :key="image.id">
          <img :src="image.url" class="w-80 h-48 object-cover rounded-md" />
        </div>
      </div>
    </div>
    <pre class="text-xs text-gray-400 dark:text-gray-600" v-text="generationId" />
  </div>
</template>
