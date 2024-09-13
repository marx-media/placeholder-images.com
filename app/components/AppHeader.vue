<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { HeaderLink } from '@nuxt/ui-pro/types'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const links: HeaderLink[] = [
  { label: 'Pricing', to: '/pricing' }
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-gradient-to-b from-amber-600 via-orange-600 to-yellow-600 flex items-center justify-center rounded">
          <UIcon name="i-heroicons-photo" class="text-2xl" />
        </div>
        <div class="text-sm leading-none">
          <div class="font-bold">
            Placeholder
          </div>
          <div class="font-light text-primary tracking-wider">
            Images.com
          </div>
        </div>
      </div>
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
