<script setup lang="ts">
import { Calendar, Mail, Phone, RefreshCcw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import { userService } from '@/domains/user/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { initials } from '@/lib/initials'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IUserProfileLegacy } from '@/domains/user/types/user.type'

const route = useRoute()

const isLoading = ref(false)
const user = ref<undefined | IUserProfileLegacy>()

const refresh = async () => {
  try {
    isLoading.value = true
    user.value = await userService.get(route.params.id as string)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => refresh())
</script>

<template>
  <AuthenticatedLayout>
    <div class="m-4 md:m-8 grid grid-cols-1 md:grid-cols-[20rem_2fr] gap-6">
      <div class="col-span-full border rounded-lg shadow-lg p-4 flex flex-row items-center justify-between gap-4">
        <div class="flex flex-row items-center gap-2">
          <Avatar class="size-12">
            <AvatarImage
              :src="user?.avatarUrl ?? ''"
              :alt="user?.name.slice(0, 2)"
            />
            <AvatarFallback>{{ initials(user?.name) }}</AvatarFallback>
          </Avatar>
          <div class="flex flex-col gap-1 ml-3">
            <div class="font-bold text-lg">
              {{ user?.name ?? '-' }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ user?.position ?? '-' }}
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2 items-center justify-end">
          <Button
            variant="outline"
            size="sm"
          >
            <UIIcon icon="fa-regular:star" />
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <UIIcon icon="fa-regular:envelope" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="refresh()"
          >
            <RefreshCcw :class="{ 'animate-spin': isLoading }" />
          </Button>
        </div>
      </div>

      <div class="col-span-full md:col-span-1 border rounded-lg shadow-lg p-5 flex flex-col gap-4 items-start">
        <div class="flex flex-row items-center gap-4">
          <Mail class="w-4 mr-2" />
          <a
            :href="`mailto:${user?.email}`"
            class="hover:text-primary"
          >
            {{ user?.email ?? '-' }}
          </a>
        </div>
        <div class="flex flex-row items-center gap-4">
          <Phone class="w-4 mr-2" />
          <a
            :href="`tel:${user?.phone}`"
            class="hover:text-primary"
          >{{ user?.phone ?? '-' }}</a>
        </div>
        <div
          v-if="user?.location"
          class="flex flex-row items-center gap-4"
        >
          <UIIcon
            icon="fa-solid:map-pin"
            class="w-4"
          />
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

      <div class="col-span-full md:col-span-1 border rounded-lg shadow-lg p-5">
        {{ user?.description ?? '-' }}
      </div>
    </div>
  </AuthenticatedLayout>
</template>
