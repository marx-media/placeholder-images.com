<script lang="ts" setup>
const user = useCurrentUser()
</script>

<template>
  <UContainer>
    <pre class="text-xs" v-text="user" />
  </UContainer>
</template>

<style></style>
