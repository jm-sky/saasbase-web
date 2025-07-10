<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps<{
  title: string
  backLink?: string
  backLinkText?: string
  notRefreshable?: boolean
  editLink?: string
  loading?: boolean
  padded?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="flex flex-row gap-4 items-center justify-between" :class="{'px-4 md:px-6 py-4 md:py-6' : padded }">
    <div>
      <div class="font-bold">
        {{ title }}
      </div>
      <div class="text-sm text-muted-foreground">
        <RouterLink v-if="backLink" :to="backLink">
          <slot name="back-link-text">
            {{ backLinkText ?? t('common.back') }}
          </slot>
        </RouterLink>
      </div>
    </div>
    <div class="flex flex-row items-center justify-end gap-2">
      <slot name="actions">
        <slot name="actions-left" />
        <Button
          v-if="!notRefreshable"
          v-tooltip.bottom.focus="t('common.refresh')"
          variant="ghost"
          :loading
          @click="emit('refresh')"
        >
          <RefreshCcw class="size-4" />
        </Button>

        <ButtonLink
          v-if="editLink"
          v-tooltip.bottom.focus="t('common.edit')"
          variant="default"
          :to="editLink"
        >
          {{ t('common.edit') }}
        </ButtonLink>
        <slot name="actions-right" />
      </slot>
    </div>
  </div>
</template>
