<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'

const { t } = useI18n()

const { withAddButton = true, withRefreshButton = true } = defineProps<{
  title: string
  withAddButton?: boolean
  withRefreshButton?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  add: []
  refresh: []
}>()
</script>

<template>
  <div class="px-2 relative pb-1">
    <div class="flex justify-between items-center mb-2">
      <div class="font-bold">
        {{ title }}
      </div>

      <div class="flex flex-row gap-2">
        <slot name="actions">
          <Button
            v-if="withRefreshButton"
            v-tooltip="t('common.refresh')"
            size="sm"
            variant="outline"
            @click="emit('refresh')"
          >
            <Icon icon="lucide:refresh-cw" />
          </Button>

          <Button
            v-if="withAddButton"
            v-tooltip="t('common.add')"
            size="sm"
            variant="outline"
            @click="emit('add')"
          >
            <Icon icon="lucide:plus" />
            <span class="hidden md:block">
              {{ t('common.add') }}
            </span>
          </Button>
        </slot>
      </div>
    </div>

    <div class="flex flex-col gap-2" :class="{ 'opacity-50': loading }">
      <slot />
    </div>

    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center text-sm text-muted-foreground">
        <Icon icon="lucide:loader" class="animate-spin" />
      </div>
    </div>
  </div>
</template>
