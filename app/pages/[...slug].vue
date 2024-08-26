<script lang="ts" setup>
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})

const currentUser = useCurrentUser()
</script>

<template>
  <div v-if="page">
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      orientation="horizontal"
      :ui="{
        wrapper: 'bg-center bg-cover relative z-10 lg:pb-6',
        container: 'lg:grid-cols-4 z-20',
        base: 'text-center lg:col-span-4 lg:text-left',
        links: 'justify-center lg:justify-start',
        description: 'max-w-2xl ',
      }"
    >
      <div class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" />
      <template #title>
        <div class="relative group inline-flex">
          <h1 class="text-5xl font-black tracking-tight text-gray-900 dark:text-white sm:text-7xl relative ">
            <span class="relative z-[10]">
              <span class="absolute bg-gradient-to-l from-amber-500 blur-xl via-orange-500 to-yellow-500 text-transparent bg-clip-text box-content select-none opacity-30 group-hover:opacity-60" v-text="page.hero.title" />
              <span class="bg-gradient-to-l from-amber-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text" v-text="page.hero.title" />
            </span>
          </h1>
          <div class="absolute -right-16 -top-10 text-8xl grayscale rotate-12 transition group-hover:grayscale-0 group-hover:rotate-6 group-hover:scale-125 z-[1] group-hover:z-[15]">
            <UIcon name="i-heroicons-photo" />
          </div>
        </div>
      </template>
    </ULandingHero>
    <pre class="text-xs" v-text="{ currentUser }" />
  </div>
</template>
