<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'
import ButtonLink from '@/components/ButtonLink.vue'

interface INavigationSection {
  title: string
  items: INavigationItem[]
}

interface INavigationItem {
  title: string
  path: string
  icon: string
  disabled?: boolean
}

const navigationSections: INavigationSection[] = [
  {
    title: 'Basic Settings',
    items: [
      { title: 'Profile', path: '/settings/profile', icon: 'heroicons:user' },
      { title: 'Account', path: '/settings/account', icon: 'heroicons:cog-6-tooth' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { title: 'Appearance', path: '/settings/appearance', icon: 'heroicons:eye' },
      { title: 'Notifications', path: '/settings/notifications', icon: 'heroicons:bell' },
    ]
  },
  {
    title: 'Authentication',
    items: [
      { title: 'API Keys', path: '/settings/api-keys', icon: 'heroicons:key' },
    ]
  },
  {
    title: 'Account',
    items: [
      { title: 'Logs', path: '/settings/logs', icon: 'heroicons:clock' },
      { title: 'Invitations', path: '/settings/invitations', icon: 'heroicons:user-plus' },
      { title: 'Sessions', path: '/settings/sessions', icon: 'heroicons:computer-desktop' },
      { title: 'Devices', path: '/settings/devices', icon: 'heroicons:device-phone-mobile' },
      { title: 'Delete Account', path: '/settings/delete-account', icon: 'heroicons:trash' },
    ]
  },
]

const isMobile = useMediaQuery('(max-width: 767px)')
const openSection = ref<number | null>(null)

function toggleSection(index: number) {
  openSection.value = openSection.value === index ? null : index
}
</script>

<template>
  <nav class="flex flex-wrap space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <div v-for="(section, index) in navigationSections" :key="index" class="relative">
      <div class="flex flex-col">
        <div
          class="px-2 py-2 text-sm font-semibold text-mono cursor-pointer lg:cursor-default"
          :class="{ 'text-primary': isMobile && openSection === index }"
          @click="isMobile ? toggleSection(index) : null"
        >
          {{ section.title }}
        </div>
        <div v-if="!isMobile || openSection === index" class="p-2 z-10 md:p-0 absolute bg-white left-0 bottom-0 translate-y-full md:relative md:translate-y-0 md:w-auto md:flex flex-col gap-1 border md:border-none rounded-md shadow md:shadow-none">
          <ButtonLink
            v-for="(item, itemIndex) in section.items"
            :key="itemIndex"
            :to="item.path"
            variant="ghost"
            class="font-normal w-full text-left justify-start"
            active-class="bg-primary-100/50 text-primary"
            :disabled="item.disabled"
            @click="openSection = null"
          >
            <Icon :icon="item.icon" class="size-4" />
            {{ item.title }}
          </ButtonLink>
        </div>
      </div>
    </div>
  </nav>
</template>
