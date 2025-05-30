<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import ExpandableChatToggle from '@/components/ui/chat/ExpandableChatToggle.vue'
import { cn } from '@/lib/utils'

export type ChatPosition = 'bottom-right' | 'bottom-left'
export type ChatSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const chatConfig = {
  dimensions: {
    sm: 'sm:max-w-sm sm:max-h-[500px]',
    md: 'sm:max-w-md sm:max-h-[600px]',
    lg: 'sm:max-w-lg sm:max-h-[700px]',
    xl: 'sm:max-w-xl sm:max-h-[800px]',
    full: 'sm:w-full sm:h-full',
  },
  positions: {
    'bottom-right': 'bottom-3 right-5',
    'bottom-left': 'bottom-3 left-5',
  },
  chatPositions: {
    'bottom-right': 'sm:bottom-[calc(100%+10px)] sm:right-0',
    'bottom-left': 'sm:bottom-[calc(100%+10px)] sm:left-0',
  },
  states: {
    open: 'pointer-events-auto opacity-100 visible scale-100 translate-y-0',
    closed: 'pointer-events-none opacity-0 invisible scale-100 sm:translate-y-5',
  },
}

const props = withDefaults(defineProps<{
  position?: ChatPosition
  size?: ChatSize
  icon?: unknown
  class?: string
}>(), {
  position: 'bottom-right',
  size: 'md',
})

const emit = defineEmits<{
  opened: []
  closed: []
}>()

const isOpen = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('opened')
  } else {
    emit('closed')
  }
}
</script>

<template>
  <div :class="cn(`fixed ${chatConfig.positions[props.position]} z-50`, props.class)">
    <div
      class="flex flex-col bg-background border sm:rounded-lg shadow-md overflow-hidden transition-all duration-250 ease-out sm:absolute sm:w-[90vw] sm:h-[80vh] fixed inset-0 w-full h-full sm:inset-auto"
      :class="[
        chatConfig.chatPositions[props.position],
        chatConfig.dimensions[props.size],
        isOpen ? chatConfig.states.open : chatConfig.states.closed,
        props.class,
      ]"
    >
      <slot />
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-2 right-2 sm:hidden"
        @click="toggleChat"
      >
        <X class="size-4" />
      </Button>
    </div>
    <ExpandableChatToggle
      :icon="props.icon"
      :is-open="isOpen"
      :toggle-chat="toggleChat"
    />
  </div>
</template>
