<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
import { useTranslate } from '@/i18n/useTranslate'
import type { PublicUser } from '@/domains/user/models/publicUser.model'

const tr = useTranslate()

const isLoading = ref(false)
const users = ref<PublicUser[]>([])

const refresh = async () => {
  try {
    isLoading.value = true
    users.value = await userService.index({ limit: 5 })
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
        {{ tr('RecentSales') }}
        <button class="opacity-85 text-sm">
          <i
            class="fa-solid fa-refresh"
            :class="{ 'fa-spin': isLoading }"
            @click="refresh()"
          />
        </button>
      </CardTitle>
      <CardDescription>
        You made 265 sales this month.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- <pre class="text-sm border p-1">{{ users }}</pre> -->
      <div class="space-y-8">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center"
        >
          <RouterLink :to="`/users/${user.id}`">
            <Avatar class="size-9">
              <AvatarImage
                :src="user.avatarUrl ?? ''"
                :alt="user?.initials"
              />
              <AvatarFallback>{{ user.initials }}</AvatarFallback>
            </Avatar>
          </RouterLink>
          <div class="ml-4 space-y-1">
            <RouterLink
              :to="`/users/${user.id}`"
              class="text-sm font-medium hover:text-primary leading-none"
            >
              {{ user.fullName }}
            </RouterLink>
            <p class="text-sm text-muted-foreground">
              {{ user.email }}
            </p>
          </div>
          <div class="ml-auto font-medium">
            +$1,999.00
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
