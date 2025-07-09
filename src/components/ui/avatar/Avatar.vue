<script setup lang="ts">
import { AvatarRoot } from 'reka-ui'
import { cn } from '@/lib/utils'
import { avatarVariant, type AvatarVariants } from '.'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>()
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :class="cn(avatarVariant({ size, shape }), props.class)"
  >
    <slot />
  </AvatarRoot>
</template>
