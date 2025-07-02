<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CommandInput } from '@/components/ui/command'

const { t } = useI18n()

const {
  search,
  searchPlaceholder,
  error
} = defineProps<{
  search: string
  searchPlaceholder?: string
  error?: string | null
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'search-input': [value: string]
}>()
</script>

<template>
  <CommandInput
    :model-value="search"
    :placeholder="searchPlaceholder ?? t('shared.search')"
    class="w-full"
    @update:model-value="emit('update:search', $event)"
    @input="(event: any) => emit('search-input', event.target.value)"
  />

  <!-- Error State -->
  <Alert v-if="error" variant="destructive" class="m-2">
    <AlertCircle class="h-4 w-4" />
    <AlertDescription>{{ error }}</AlertDescription>
  </Alert>
</template>
