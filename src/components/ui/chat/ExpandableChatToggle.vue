<script setup lang="ts">
import { MessageCircle, X } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  icon?: unknown
  isOpen: boolean
  toggleChat: () => void
  class?: string
}>()
</script>

<template>
  <Button
    variant="default"
    :class="cn('w-14 h-14 rounded-full shadow-md flex items-center justify-center hover:shadow-lg hover:shadow-black/30 transition-all duration-300', props.class)"
    @click="toggleChat"
  >
    <X v-if="isOpen" class="h-6 w-6" />
    <component :is="icon ? icon : MessageCircle" v-else class="h-6 w-6" />
  </Button>
</template>
