<script lang="ts" setup>
import type { DashboardSidebarLink } from '@nuxt/ui-pro/types'

// const route = useRoute()

const links = computed<DashboardSidebarLink[]>(() => [
  { label: 'Profile', icon: 'i-heroicons-user', to: '/profile', exact: true },
  { label: 'Subscription', icon: 'i-heroicons-rocket-launch', to: '/profile/subscription' },
  { label: 'Projects', icon: 'i-heroicons-cube', to: '/profile/projects' }
])
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{min: 200, max: 300}" collapsible>
      <UDashboardNavbar>
        <template #left>
          <NuxtLink to="/">
            <AppLogo />
          </NuxtLink>
        </template>
      </UDashboardNavbar>
      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>
