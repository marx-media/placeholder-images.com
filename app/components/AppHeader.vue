<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { HeaderLink } from '@nuxt/ui-pro/types'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const links: HeaderLink[] = [
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Nuxt UI Pro <UBadge
        label="SaaS"
        variant="subtle"
        class="mb-0.5"
      />
    </template>

    <template #right>
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

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      />
    </template>
  </UHeader>
</template>
