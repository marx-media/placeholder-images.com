<script lang="ts" setup>
import type { RealtimeChannel } from '@supabase/supabase-js'

const state = reactive({
  promt: ''
})

const loading = ref<'IDLE' | 'PROGRESSING' | 'COMPLETED' | 'ERROR'>('IDLE')
const isLoading = computed(() => loading.value === 'PROGRESSING')
const currentId = ref<string>('')
const error = ref(null)
const preview = ref([])

const client = useSupabaseClient()

let channel: RealtimeChannel | null = null

const onSubmit = async () => {
  preview.value = []
  error.value = null
  loading.value = 'PROGRESSING'
  const { data: { id }, error: e } = await client.from('generations').insert({ promt: state.promt }).select('id, status').single()

  if (e) {
    loading.value = 'ERROR'
    console.error(e)
    error.value = e
    return
  }

  currentId.value = id
  // if (channel) {
  //   channel.unsubscribe()
  //   client.removeChannel(channel)
  // }

  channel = client.channel(`images:${id}`).on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'images', filter: `generation=eq.${id}`
  }, (payload) => {
    preview.value.push(payload.new)
    if (preview.value.length === 2) {
      loading.value = 'COMPLETED'
      channel.unsubscribe()
      client.removeChannel(channel)
      channel = null
    }
  }).subscribe()
}
</script>

<template>
  <div>
    <div>
      <UForm :state="state" @submit="onSubmit">
        <UInput v-model="state.promt" size="xl" :ui="{ icon: { trailing: { pointer: 'pointer-events-auto' } } }">
          <template #trailing>
            <UButton type="submit" icon="i-heroicons-sparkles-20-solid" label="Generate" trailing :loading="isLoading" :disabled="state.promt.length === 0" />
          </template>
        </UInput>
      </UForm>
    </div>
    <div v-if="loading !== 'IDLE'" class="mt-10">
      <div v-if="loading === 'PROGRESSING'" class="flex gap-10 px-4">
        <ImagePlaceholder v-for="i in 2" :key="i" class="flex-1">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="absolute left-1 top-1 flex gap-2">
              <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin" />
              <div class="text-xs italic">
                <ElapsedTime :key="currentId" />
              </div>
            </div>
          </div>
        </ImagePlaceholder>
      </div>
      <div v-else-if="loading === 'ERROR'">
        <pre class="text-xs bg-gray-950 mt-5 p-0.5 text-red-500" v-text="error" />
      </div>
      <div v-else-if="loading === 'COMPLETED'">
        <div class="flex gap-4">
          <div v-for="image in preview" :key="image.id">
            <img :src="image.url" width="150" height="150" />
          </div>
        </div>
      </div>
    </div>
    <pre class="text-xs bg-gray-950 mt-5 p-0.5" v-text="loading" />
  </div>
</template>

<style></style>
