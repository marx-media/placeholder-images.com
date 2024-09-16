<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'
import { get } from 'lodash-es'

const authStore = useAuthStore()
const currentUser = toRef(authStore, 'currentUser')
const username = computed(() => get(currentUser.value, 'user_metadata.display_name', ''))

const state = reactive({
  email: 'dmarx@marxulm.de',
  username: 'domsen123',
  password_current: '',
  password_new: ''
})

const toast = useToast()

function validate(state: any): FormError[] {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Please enter your username.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter your email.' })
  if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new)) errors.push({ path: 'password', message: 'Please enter a valid password.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  toast.add({ title: 'Profile updated', icon: 'i-heroicons-check-circle' })
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="username">
      </UDashboardNavbar>
      <UDashboardPanelContent class="pb-24">
        <UDashboardSection
          title="Theme"
          description="Customize the look and feel of your dashboard."
        >
          <template #links>
            <UColorModeSelect color="gray" />
          </template>
        </UDashboardSection>

        <UDivider class="mb-4" />

        <UForm
          :state="state"
          :validate="validate"
          :validate-on="['submit']"
          @submit="onSubmit"
        >
          <UDashboardSection
            title="Profile"
            description="Update your personal information."
          >
            <template #links>
              <UButton
                type="submit"
                label="Save changes"
                color="black"
              />
            </template>

            <UFormGroup
              name="username"
              label="Username"
              description="Will appear on every public placeholder you create."
              required
              class="grid grid-cols-2 gap-2 items-center"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.username"
                autocomplete="off"
                icon="i-heroicons-user"
                size="md"
              />
            </UFormGroup>

            <UFormGroup
              name="email"
              label="Email"
              description="Used to sign in, for email receipts and product updates."
              required
              class="grid grid-cols-2 gap-2"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.email"
                type="email"
                autocomplete="off"
                icon="i-heroicons-envelope"
                size="md"
              />
            </UFormGroup>

            <UFormGroup
              name="password"
              label="Password"
              description="Confirm your current password before setting a new one."
              class="grid grid-cols-2 gap-2"
              :ui="{ container: '' }"
            >
              <UInput
                id="password"
                v-model="state.password_current"
                type="password"
                placeholder="Current password"
                size="md"
              />
              <UInput
                id="password_new"
                v-model="state.password_new"
                type="password"
                placeholder="New password"
                size="md"
                class="mt-2"
              />
            </UFormGroup>
          </UDashboardSection>
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style></style>
