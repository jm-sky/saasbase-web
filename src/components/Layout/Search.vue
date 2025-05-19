<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { Input } from '@/components/ui/input'
import Button from '../ui/button/Button.vue'

defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      :disabled
      class="md:hidden"
    >
      <Icon icon="lucide:search" />
    </Button>
    <Input
      type="search"
      placeholder="Search..."
      class="hidden md:flex md:w-[100px] lg:w-[300px]"
      :disabled
    />
  </div>
</template>
