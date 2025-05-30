<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { userService } from '@/domains/user/services/userService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { initials } from '@/lib/initials'
import type { IUserPreview } from '@/domains/user/types/user.type'

const { t } = useI18n()

const isLoading = ref(false)
const users = ref<IUserPreview[]>([])

const refresh = async () => {
  try {
    isLoading.value = true
    users.value = await userService.index({ limit: 5 })
  } catch (error: unknown) {
    console.error('[RecentSalesError]', error)
    handleErrorWithToast('Error loading recent sales', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => refresh())
</script>

<template>
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle class="flex flex-row gap-2 justify-between">
        {{ t('dashboard.recentUsers.title') }}
        <button class="opacity-85 text-sm">
          <i class="fa-solid fa-refresh" :class="{ 'fa-spin': isLoading }" @click="refresh()" />
        </button>
      </CardTitle>
      <CardDescription>
        {{ t('dashboard.recentUsers.description', { count: users.length }) }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-8">
        <div v-for="user in users" :key="user.id" class="flex items-center">
          <RouterLink :to="`/users/${user.id}`" class="flex items-center">
            <Avatar class="size-9">
              <AvatarImage
                :src="user.avatarUrl ?? ''"
                :alt="initials(user.name)"
              />
              <AvatarFallback>{{ initials(user.name) }}</AvatarFallback>
            </Avatar>
          </RouterLink>
          <div class="ml-4 space-y-1">
            <RouterLink
              :to="`/users/${user.id}`"
              class="text-sm font-medium hover:text-primary leading-none"
            >
              {{ user.name }}
            </RouterLink>
            <p class="text-sm text-muted-foreground">
              {{ user.email }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
