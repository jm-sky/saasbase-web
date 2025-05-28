<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-row justify-center items-center flex-wrap gap-2 text-center text-sm text-muted-foreground py-2 mb-1">
    <Icon icon="lucide:inbox" class="size-4" />
    {{ message ?? t('common.noItems') }}

    <div v-if="$slots.default" class="w-full mt-2">
      <slot />
    </div>
  </div>
</template>
