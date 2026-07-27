<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'

const { t } = useI18n()

const {
  showCreateButton,
  showClearCache,
  clearCacheText,
  createText
} = defineProps<{
  showCreateButton?: boolean
  showClearCache?: boolean
  clearCacheText?: string
  createText?: string
}>()

const emit = defineEmits<{
  'clear-cache': []
  create: []
}>()
</script>

<template>
  <div class="border-t bg-background">
    <div class="p-2">
      <div class="flex gap-2">
        <Button
          v-if="showClearCache"
          variant="outline"
          size="sm"
          @click="emit('clear-cache')"
        >
          {{ clearCacheText ?? t('common.clearCache', 'Clear cache') }}
        </Button>
        <Button
          v-if="showCreateButton"
          variant="outline"
          size="sm"
          @click="emit('create')"
        >
          <Plus class="mr-2 h-4 w-4" />
          {{ createText ?? t('shared.create') }}
        </Button>
      </div>
    </div>
  </div>
</template>
