<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { timeAgo } from '@/lib/timeAgo'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IFeed } from '@/domains/feed/types/feed.type'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const { feed } = defineProps<{
  feed: IFeed
}>()

const emit = defineEmits<{
  publish: [feed: IFeed]
  edit: [feed: IFeed]
  delete: [feed: IFeed]
}>()

const canEdit = computed(() => feed.creator?.id === authStore.user?.id)
const canDelete = computed(() => feed.creator?.id === authStore.user?.id)
</script>

<template>
  <div class="flex flex-row gap-4 px-4 py-2">
    <div class="w-28 flex flex-col items-center text-center justify-center gap-1">
      <Avatar size="base" class="cursor-pointer" @click="router.push(`/users/${feed.creator?.id}`)">
        <AvatarImage :src="feed.creator?.avatarUrl ?? ''" :alt="feed.creator?.name" />
        <AvatarFallback>{{ feed.creator?.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
      </Avatar>
    </div>

    <div class="w-full flex flex-col gap-2">
      <div class="flex flex-row justify-between items-center gap-2">
        <h3 class="text-lg font-semibold">
          {{ feed.title }}
        </h3>
        <div v-if="canEdit || canDelete" class="flex flex-row gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="size-8">
                <Icon icon="lucide:more-horizontal" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                v-if="canEdit"
                class="cursor-pointer gap-2 hover:bg-accent"
                @click="emit('edit', feed)"
              >
                <Icon icon="lucide:edit" />
                {{ t('common.edit') }}
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="canDelete"
                class="cursor-pointer gap-2 hover:bg-accent"
                @click="emit('delete', feed)"
              >
                <Icon icon="lucide:trash" />
                {{ t('common.delete') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p class="text-muted-foreground">
        {{ feed.content }}
      </p>

      <div class="text-sm text-muted-foreground">
        {{ t('feed.by') }}
        <RouterLink
          :to="`/users/${feed.creator?.id}`"
          class="font-medium text-sm mr-1 hover:underline"
        >
          {{ feed.creator?.name }}
        </RouterLink>
        <span v-tooltip="toDateTimeString(feed.createdAt)" class="text-sm text-muted-foreground">
          {{ timeAgo(feed.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>
