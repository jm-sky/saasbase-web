<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { timeAgo } from '@/lib/timeAgo'
import type { IComment } from '@/domains/comment/types/comment.type'

const authStore = useAuthStore()
const router = useRouter()

const md = new MarkdownIt()
const loading = ref(false)

const { comment } = defineProps<{
  comment: IComment
}>()

const emit = defineEmits<{
  edit: [comment: IComment]
  delete: [comment: IComment]
}>()

const renderedContent = computed(() => md.render(comment.content))

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div
    class="flex flex-row gap-4"
    :class="{ 'opacity-50': loading }"
  >
    <div class="w-28 flex flex-col items-center text-center justify-center gap-1">
      <Avatar size="base" class="cursor-pointer" @click="router.push(`/users/${comment.user?.id}`)">
        <AvatarImage :src="comment.user?.avatarUrl ?? ''" :alt="comment.user?.name" />
        <AvatarFallback>{{ comment.user?.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
      </Avatar>
    </div>

    <div class="w-full flex flex-col gap-1 border rounded-xl px-4 py-2" :class="{ 'border-primary/50': comment.user?.id === authStore.user?.id }">
      <div class="flex flex-row items-center justify-between gap-2">
        <div>
          <RouterLink :to="`/users/${comment.user?.id}`" class="font-medium text-sm mr-4 hover:underline">
            {{ comment.user?.name }}
          </RouterLink>
          <span v-tooltip="formatDate(comment.createdAt)" class="text-sm text-muted-foreground">
            {{ timeAgo(comment.createdAt) }}
          </span>
        </div>
        <div v-if="comment.meta?.canEdit || comment.meta?.canDelete" class="flex flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            :disabled="loading || !comment.meta?.canEdit"
            @click="emit('edit', comment)"
          >
            <Pencil class="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :disabled="loading || !comment.meta?.canDelete"
            @click="emit('delete', comment)"
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-muted-foreground pb-1" v-html="renderedContent" />
    </div>
  </div>
</template>
