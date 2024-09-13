<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import type { RealtimeChannel } from '@supabase/realtime-js'

const category = useRouteQuery('category', '')
const isRealtime = ref(true)

const client = useSupabaseClient()
const ssrKey = computed(() => `grid:${category.value}`)

const { data, refresh } = useAsyncData(unref(ssrKey), async () => {
  const q = client.from('images').select(`
    id,
    generation!inner(
      category!inner(
        slug
      )
    )
  `)
  if (category.value) {
    q.eq('generation.category.slug', category.value)
  }
  q.order('created_at', { ascending: false }).limit(15)

  const { data, error } = await q
  if (error) {
    throw error
  }
  return data
}, {
  default: () => [],
  watch: [ssrKey]
})

const realtime = ref<{ id: string }[]>([])
let channel: RealtimeChannel

const subscribe = () => {
  channel = client.channel(`realtime:grid:${Date.now()}`).on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'images' },
    (payload) => {
      if (payload.new) {
        const item = payload.new as { id: string }
        realtime.value.unshift(item)
      }
    }
  ).subscribe()
  console.log('Subscribed to realtime')
}

const unsubscribe = async () => {
  await channel.unsubscribe()
  console.log('Unsubscribed from realtime')
}

watch(isRealtime, async v => v ? subscribe() : await unsubscribe(), { immediate: !import.meta.env.SSR })

onBeforeUnmount(async () => {
  await channel.unsubscribe()
  await client.removeChannel(channel)
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-end gap-3">
      <UTooltip text="Refresh" :popper="{ placement: 'top' }">
        <UButton icon="i-heroicons-arrow-path-20-solid" class="rounded-full" variant="ghost" @click="refresh()" />
      </UTooltip>
      <div class="flex items-center gap-2">
        <UToggle v-model="isRealtime" label="Show Realtime" />
        <div class="text-xs">
          Realtime
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-1">
      <AppImage v-for="{id} in [...realtime, ...data]" :key="id" :src="`/api/image/${id}`" :width="320" />
    </div>
  </div>
</template>
