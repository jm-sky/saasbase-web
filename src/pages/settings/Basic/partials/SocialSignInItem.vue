<script setup lang="ts">
import { Trash } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'

defineProps<{
  provider: string
  email: string
  isEnabled?: boolean
  image: string
  disabled?: boolean
}>()
</script>

<template>
  <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5" :class="{ 'opacity-50 bg-muted pointer-events-none': disabled }">
    <div class="flex items-center flex-wrap gap-3.5">
      <img alt="" class="size-6 shrink-0" :src="image">
      <div class="flex flex-col gap-0.5">
        <a class="text-sm font-medium text-mono hover:text-primary" href="#">
          {{ provider }}
        </a>
        <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
          {{ email }}
        </a>
      </div>
    </div>
    <div class="flex items-center gap-5">
      <Checkbox :checked="isEnabled" :disabled="disabled" />
      <Button variant="ghost" size="icon" :disabled="!isEnabled || disabled">
        <Trash class="size-4" />
      </Button>
    </div>
  </div>
</template>