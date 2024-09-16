<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { HeaderLink } from '@nuxt/ui-pro/types'
import { get } from 'lodash-es'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const links: HeaderLink[] = [
  { label: 'Pricing', to: '/pricing' }
]

const authStore = useAuthStore()
await authStore.getMe()

const currentUser = computed(() => authStore.currentUser)
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <AppLogo />
    </template>

    <template #right>
      <template v-if="currentUser">
        <AuthDropdown />
      </template>
      <template v-else>
        <UButton
          label="Sign in"
          color="gray"
          to="/auth/login"
        />
        <UButton
          label="Sign up"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
          color="black"
          to="/auth/signup"
          class="hidden lg:flex"
        />
      </template>
    </template>

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      />
    </template>
  </UHeader>
</template>
