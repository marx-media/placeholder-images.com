<script lang="ts" setup>
import { get } from 'lodash-es'

const authStore = useAuthStore()
const currentUser = toRef(authStore, 'currentUser')

const dropDownLabel = computed(() => get(currentUser.value, 'user_metadata.display_name', ''))

const items = [
  [{
    label: 'Profile',
    to: '/profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]
</script>

<template>
  <UDropdown :items="items" :popper="{ offsetDistance: 0, placement: 'bottom-end' }">
    <UButton color="white" :label="dropDownLabel" trailing-icon="i-heroicons-chevron-down-20-solid" />
  </UDropdown>
</template>

<style></style>
