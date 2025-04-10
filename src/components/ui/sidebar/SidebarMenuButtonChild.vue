<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { sidebarMenuButtonVariants } from '.'
import type { SidebarMenuButtonProps } from '@/components/ui/sidebar/SidebarMenuButtonProps.type'

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
})
</script>

<template>
  <Primitive
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    :data-size="size"
    :data-active="isActive"
    :class="cn(sidebarMenuButtonVariants({ variant, size }), props.class)"
    :as="as"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
