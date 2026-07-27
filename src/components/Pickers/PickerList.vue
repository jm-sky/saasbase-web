<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  CommandEmpty,
  CommandList,
} from '@/components/ui/command'

const { t } = useI18n()

const {
  maxHeight = '300px',
  loading,
  hasMoreData,
  showCreateButton,
  emptyMessage,
  loadMoreMessage,
  loadingMessage
} = defineProps<{
  maxHeight?: string
  loading?: boolean
  hasMoreData?: boolean
  showCreateButton?: boolean
  emptyMessage?: string
  loadMoreMessage?: string
  loadingMessage?: string
}>()

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <CommandList
    ref="listRef"
    class="overflow-y-auto overflow-x-hidden custom-scrollbar"
    :style="{ maxHeight }"
  >
    <CommandEmpty>
      <div class="text-center py-4">
        <p>{{ emptyMessage ?? t('shared.notFound') }}</p>
        <Button
          v-if="showCreateButton"
          variant="outline"
          size="sm"
          class="mt-2"
          @click="emit('create')"
        >
          <Plus class="mr-2 h-4 w-4" />
          {{ t('shared.create') }}
        </Button>
      </div>
    </CommandEmpty>

    <!-- Content slot for items -->
    <slot />

    <!-- Load More Indicator -->
    <div v-if="hasMoreData && !loading" class="p-2 text-center">
      <div class="text-xs text-muted-foreground">
        {{ loadMoreMessage ?? t('shared.scrollForMore') }}
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center items-center p-4">
      <LoadingIcon class="size-4 animate-spin mr-2" />
      <span class="text-sm text-muted-foreground">
        {{ loadingMessage ?? t('common.loading') }}
      </span>
    </div>
  </CommandList>
</template>

<style scoped>
.custom-scrollbar {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

/* Webkit browsers (Chrome, Safari, Edge) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--border) / 0.8);
}

/* Make scrollbar even thinner on hover */
.custom-scrollbar:hover::-webkit-scrollbar {
  width: 8px;
}

/* Ensure no horizontal overflow at any level */
.custom-scrollbar * {
  max-width: 100%;
  box-sizing: border-box;
}
</style>
