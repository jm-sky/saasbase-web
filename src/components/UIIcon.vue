<script setup lang="ts">
import { Icon, type IconProps } from '@iconify/vue'

const props = defineProps<IconProps>()
</script>

<template>
  <Icon v-bind="props" />
</template>
