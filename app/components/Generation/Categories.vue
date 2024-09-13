<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import type { NavigationLink } from '@nuxt/ui-pro/types'
import type { RealtimeChannel } from '@supabase/realtime-js'

const category = useRouteQuery('category', '')

const client = useSupabaseClient()
const { data } = useAsyncData('categories', async () => {
  const { data, error } = await client.from('categories').select('title, slug, items').order('title', { ascending: true })
  if (error) {
    throw error
  }
  return data
}, {
  default: () => []
})

const realtime = ref<{ id: string }[]>([])
const pushCategory = (category: { id: string, title: string, slug: string, items: number }) => {
  const index = realtime.value.findIndex(i => i.id === category.id)
  if (index !== -1) {
    realtime.value[index] = category
  } else {
    realtime.value.push(category)
  }
}

let channel: RealtimeChannel

const categories = computed(() => [...realtime.value, ...data.value].slice().sort((a, b) => a.title.localeCompare(b.title)))

const links = computed<NavigationLink[]>(() => [
  {
    label: 'All',
    badge: Intl.NumberFormat('en').format(categories.value.reduce((acc, c) => acc + c.items, 0)),
    active: !category.value,
    slug: '',
    click: () => {
      category.value = ''
    }
  },
  ...categories.value.map(c => ({
    label: c.title,
    badge: Intl.NumberFormat('en').format(c.items),
    active: category.value === c.slug,
    slug: c.slug,
    click: () => {
      category.value = c.slug
    }
  }))
])

onMounted(() => {
  channel = client.channel('realtime:grid').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'categories' },
    (payload) => {
      if (!['INSERT', 'UPDATE'].includes(payload.eventType)) {
        return
      }
      console.log(payload)
      const category = payload.new as { id: string, title: string, slug: string, items: number }
      pushCategory(category)
    }
  ).subscribe()
})

onBeforeUnmount(() => {
  channel.unsubscribe()
  client.removeChannel(channel)
})
</script>

<template>
  <div>
    <UDashboardSidebarLinks
      :links="links"
    />
  </div>
</template>

<style></style>
