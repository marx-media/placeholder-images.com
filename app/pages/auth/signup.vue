<script lang="ts" setup>
import { useAuth } from '~/composables/useAuth'

const { getFields, getProviders, validate, signUpWithEmailAndPassword } = useAuth()

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up'
})

const onSubmit = async (state: any) => {
  console.log('state', state)
  // await signUpWithEmailAndPassword(state)
  // $nuxt.$router.push('/')
}
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="getFields('signup')"
      :validate="(state: any) => validate(state, 'signup')"
      :providers="getProviders()"
      align="top"
      title="Create an account"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Create account' }"
      @submit="onSubmit"
    >
    </UAuthForm>
  </UCard>
</template>
