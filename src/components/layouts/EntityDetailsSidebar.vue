<script setup lang="ts">
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Separator from '@/components/ui/separator/Separator.vue'

defineProps<{
  name: string
  email?: string
  logo?: string
}>()
</script>

<template>
  <Avatar size="lg" class="mx-auto">
    <AvatarImage :src="logo ?? ''" :alt="name" />
    <AvatarFallback>{{ name.slice(0, 2) ?? 'X' }}</AvatarFallback>
  </Avatar>

  <div class="font-bold">
    {{ name ?? '...' }}
  </div>

  <div v-if="email" class="text-sm text-muted-foreground">
    {{ email ?? '...' }}
  </div>

  <Separator class="my-2" />

  <div class="flex flex-col gap-3 text-left">
    <slot name="info-sections" />
  </div>
</template>