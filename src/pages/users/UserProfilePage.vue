<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import { userService } from '@/domains/user/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { initials } from '@/lib/initials'
import UserProfileSidebar from './UserProfile/UserProfileSidebar.vue'
import type { IUserProfileLegacy } from '@/domains/user/types/user.type'

const { t } = useI18n()

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
          <Avatar class="size-24">
            <AvatarImage
              :src="user?.avatarUrl ?? ''"
              :alt="user?.name.slice(0, 2)"
            />
            <AvatarFallback>{{ initials(user?.name) }}</AvatarFallback>
          </Avatar>
          <div class="flex flex-col gap-1.5 ml-3">
            <div class="font-bold text-lg">
              {{ user?.name ?? '-' }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ user?.position ?? '-' }}
            </div>
            <div class="flex flex-row items-center gap-2">
              <Badge
                v-for="skill in user?.skills"
                :key="skill.id"
                variant="info-outline"
              >
                {{ skill.name }}
              </Badge>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2 items-center justify-end">
          <Button variant="outline" size="sm" disabled>
            <UIIcon icon="fa-regular:star" />
          </Button>
          <Button variant="outline" size="sm" :disabled="!user?.email">
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

      <UserProfileSidebar :user />

      <div class="col-span-full md:col-span-1 border rounded-lg shadow-lg p-5">
        <div class="font-bold text-lg">
          {{ t('user.profile.description') }}
        </div>
        <div class="text-muted-foreground">
          {{ user?.bio ?? '-' }}
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
