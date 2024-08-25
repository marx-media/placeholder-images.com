<script setup lang="ts">
const links = [
  { label: 'Test', to: '/test' },
  { label: 'SignUp', to: '/auth/signup' }
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-end">
        <div class="text-sm text-amber-500">
          placeholder-images
        </div>
        <div class="text-xs">
          .com
        </div>
      </div>
    </template>
  </UHeader>
</template>
