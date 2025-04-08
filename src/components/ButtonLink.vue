<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import type { ButtonVariants } from '@/components/ui/button'

const { variant = 'link', disabled = undefined } = defineProps<{
  to: RouteLocationRaw
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  activeClass?: string
  exactActiveClass?: string
  disabled?: boolean | undefined
}>()
</script>

<template>
  <RouterLink
    v-slot="{ href, navigate, isActive, isExactActive }"
    :to
    custom
  >
    <Button
      as="a"
      :variant
      :href
      :size
      :class="[{ disabled }, isActive ? activeClass : '', isExactActive ? exactActiveClass : '']"
      class="[.disabled]:opacity-50 [.disabled]:pointer-events-none"
      @click="navigate"
    >
      <slot />
    </Button>
  </RouterLink>
</template>
