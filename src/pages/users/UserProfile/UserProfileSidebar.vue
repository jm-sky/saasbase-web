<script setup lang="ts">
import { Calendar, Globe, Mail, Phone } from 'lucide-vue-next'
import UIIcon from '@/components/UIIcon.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IUserProfileLegacy } from '@/domains/user/types/user.type'

defineProps<{
  user?: IUserProfileLegacy
}>()
</script>

<template>
  <div class="col-span-full md:col-span-1 border rounded-lg shadow-lg p-5 flex flex-col gap-4 items-start">
    <div class="flex flex-row items-center gap-4">
      <Mail class="w-4 mr-2" />
      <a v-if="user?.email" :href="`mailto:${user?.email}`" class="hover:text-primary">
        {{ user?.email }}
      </a>
      <span v-else class="text-muted-foreground">-</span>
    </div>

    <div class="flex flex-row items-center gap-4">
      <Phone class="w-4 mr-2" />
      <a v-if="user?.phone" :href="`tel:${user?.phone}`" class="hover:text-primary">{{ user?.phone }}</a>
      <span v-else class="text-muted-foreground">-</span>
    </div>

    <div class="flex flex-row items-center gap-4">
      <Globe class="w-4 mr-2" />
      <a v-if="user?.website" :href="`${user?.website}`" class="hover:text-primary">{{ user?.website }}</a>
      <span v-else class="text-muted-foreground">-</span>
    </div>

    <div
      v-if="user?.location"
      class="flex flex-row items-center gap-4"
    >
      <UIIcon icon="fa-solid:map-pin" class="w-4 mr-2" />
      <a
        :href="`http://maps.google.com?q=${user?.location}`"
        target="_blank"
        class="hover:text-primary"
        rel="noopener noreferrer"
      >
        {{ user?.location }}
      </a>
    </div>

    <div class="flex flex-row items-center gap-4">
      <Calendar class="w-4 mr-2" />
      {{ user?.createdAt ? toDateTimeString(user?.createdAt) : '-' }}
    </div>
  </div>
</template>
