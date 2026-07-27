<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Input from '@/components/ui/input/Input.vue'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

export type TFilterOperator = 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'nlike'
  | 'startswith'
  | 'endswith'
  | 'regex'
  | 'null'
  | 'notnull'
  | 'nullish'
  | 'in'
  | 'nin'
  | 'between'

const { t } = useI18n()

const modelValue = defineModel<FilterDefinition>('modelValue', { default: () => ({ value: '', operator: '' }) })

const operators = computed(() => ([
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'nlike',
  'startswith',
  'endswith',
  'regex',
  'null',
  'notnull',
  'nullish',
  'in',
  'nin',
  'between',
] as const).map((value) => ({
  value,
  short: t(`common.filters.operatorShort.${value}`),
  label: t(`common.filters.operators.${value}`),
})))

const currentOperator = computed(() => {
  const operator = (modelValue.value.operator ?? 'eq') as TFilterOperator
  return operators.value.find(item => item.value === operator) ?? operators.value[0]
})

const value = computed<string>({
  get() {
    const rawValue = modelValue.value.value
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return rawValue !== null && rawValue !== undefined ? String(rawValue) : ''
  },
  set(newValue) {
    modelValue.value = {
      value: newValue,
      operator: modelValue.value.operator ?? 'eq',
    }
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Input v-model.lazy.trim="value" class="w-full h-8" />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          v-tooltip="currentOperator.label"
          variant="outline"
          size="icon"
          class="h-8"
          :aria-label="t('common.filters.operator')"
        >
          {{ currentOperator.short }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          v-for="operator in operators"
          :key="operator.value"
          :value="operator.value"
          class="flex items-center justify-between gap-2 cursor-pointer"
          @click="modelValue.operator = operator.value"
        >
          <span class="font-mono text-sm">
            {{ operator.short }}
          </span>
          <span class="text-xs text-muted-foreground">
            {{ operator.label }}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
