<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import { useExpenseStore } from '../stores/expense.store'
import type { IExpense } from '../types/expense.type'

const { t } = useI18n()

const expenseStore = useExpenseStore()

const { withText, withIcon } = defineProps<{
  expense: IExpense
  withIcon?: boolean
  withText?: boolean
}>()
</script>

<template>
  <ButtonLink
    v-tooltip="t('common.edit', 'Edit')"
    variant="outline"
    size="sm"
    :to="`/expenses/${expense.id}/edit`"
    @click="expenseStore.setExpense(expense)"
  >
    <template v-if="withIcon">
      <Pencil />
    </template>
    <template v-if="withText">
      {{ t('common.edit', 'Edit') }}
    </template>
  </ButtonLink>
</template>
