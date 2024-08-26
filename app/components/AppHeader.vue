<script setup lang="ts">
const links = [
  { label: 'Pricing', to: '/pricing' },
]

const currentUser = await getCurrentUser()
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center">
        <div class="text-sm text-primary">
          placeholder-images
        </div>
        <div class="text-xs">
          .com
        </div>
      </div>
    </template>
    <template v-if="currentUser" #right>
      <template v-if="currentUser.isAnonymous">
        <UButton label="Sign Up" to="/auth/signup" color="gray" icon="i-heroicons-arrow-right-20-solid" class="hidden lg:flex glow-on-hover always rounded-full" trailing />
      </template>
    </template>
  </UHeader>
</template>
