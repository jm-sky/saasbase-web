<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'

const { t } = useI18n()

const { withText = false, withIcon = true } = defineProps<{
  id: string
  withIcon?: boolean
  withText?: boolean
}>()
</script>

<template>
  <ButtonLink
    v-tooltip="t('common.edit', 'Edit')"
    variant="outline"
    size="sm"
    :to="`/products/${id}/edit`"
  >
    <template v-if="withIcon">
      <Pencil />
    </template>
    <template v-if="withText">
      {{ t('common.edit', 'Edit') }}
    </template>
  </ButtonLink>
</template>
