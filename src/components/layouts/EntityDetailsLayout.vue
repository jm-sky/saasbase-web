<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import Button from '@/components/ui/button/Button.vue'

const { t } = useI18n()

defineProps<{
  title: string
  backLink: string
  editLink?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col gap-y-6" data-testid="entity-details-layout">
    <!-- Header -->
    <div class="flex flex-row gap-4 items-center justify-between">
      <div>
        <div class="font-bold">
          {{ title }}
        </div>
        <div class="text-sm text-muted-foreground">
          <RouterLink :to="backLink">
            <slot name="back-link-text" />
          </RouterLink>
        </div>
      </div>
      <div class="flex flex-row items-center justify-end gap-2">
        <Button
          v-tooltip.bottom.focus="t('common.refresh')"
          variant="ghost"
          :loading
          @click="emit('refresh')"
        >
          <RefreshCcw class="w-4 h-4" />
        </Button>

        <ButtonLink
          v-if="editLink"
          v-tooltip.bottom.focus="t('common.edit')"
          variant="default"
          :to="editLink"
        >
          {{ t('common.edit') }}
        </ButtonLink>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 md:grid-cols-[20rem_1fr] gap-6">
      <!-- Sidebar -->
      <div class="flex flex-col text-center gap-2 border rounded-md p-4 shadow-lg/5">
        <slot name="sidebar" />
      </div>

      <!-- Main content -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-row items-center gap-2 font-semibold">
          <slot name="tabs" />
        </div>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>
