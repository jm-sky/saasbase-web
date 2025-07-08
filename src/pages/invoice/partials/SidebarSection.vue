<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref } from 'vue'

defineProps<{
  title: string
}>()

const collapsed = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-row items-center justify-between gap-2 border rounded bg-muted px-2 py-1 -mx-2">
      <div class="font-semibold text-sm">
        {{ title }}
      </div>
      <Button variant="ghost" size="icon" @click="collapsed = !collapsed">
        <ChevronDown v-if="collapsed" class="size-4" />
        <ChevronUp v-else class="size-4" />
      </Button>
    </div>
    <div v-if="!collapsed" class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
