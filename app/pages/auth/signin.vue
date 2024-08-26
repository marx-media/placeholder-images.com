<script lang="ts" setup>
const { getFields, getProviders, validate, signUpWithEmailAndPassword } = useAuthentication()

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign In'
})

const onSubmit = async ({ email, password }: { email: string, password: string }) => {
  // await signUpWithEmailAndPassword(name, email, password)
  // await signUpWithEmailAndPassword(state)
  // $nuxt.$router.push('/')
}
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="getFields('signin')"
      :validate="(state: any) => validate(state, 'signin')"
      :providers="getProviders()"
      align="top"
      title="Welcome back"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #description>
        Don't have an account? <NuxtLink
          to="/auth/signup"
          class="text-primary font-medium"
        >
          Sign up
        </NuxtLink>.
      </template>
      <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >
          Terms of Service
        </NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
