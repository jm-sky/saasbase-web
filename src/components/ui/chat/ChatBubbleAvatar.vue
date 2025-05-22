<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const props = defineProps<{
  src?: string
  fallback?: string
  class?: string
}>()
</script>

<template>
  <Avatar :class="props.class">
    <AvatarImage :src="props.src ?? ''" :alt="props.fallback ?? 'Avatar'" />
    <AvatarFallback>{{ props.fallback ?? '' }}</AvatarFallback>
    <slot />
  </Avatar>
</template>
