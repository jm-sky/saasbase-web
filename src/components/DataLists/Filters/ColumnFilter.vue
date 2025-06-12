<script setup lang="ts">
import { computed } from 'vue'
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

interface FilterOperatorOption {
  value: TFilterOperator
  label: string
}

const modelValue = defineModel<FilterDefinition>('modelValue', { default: { value: '', operator: '' } })

const operators: FilterOperatorOption[] = [
  { value: 'eq', label: 'Equal ( = )' },
  { value: 'ne', label: 'neq: Not equal ( != )' },
  { value: 'gt', label: 'Greater than ( > )' },
  { value: 'gte', label: 'Greater than or equal ( >= )' },
  { value: 'lt', label: 'Less than ( < )' },
  { value: 'lte', label: 'Less than or equal ( <= )' },
  { value: 'like', label: 'Contains (LIKE %value%)' },
  { value: 'nlike', label: 'notlike: Not contains (NOT LIKE %value%)' },
  { value: 'startswith', label: 'Starts with (LIKE value%)' },
  { value: 'endswith', label: 'Ends with (LIKE %value)' },
  { value: 'regex', label: 'Regular expression (REGEXP)' },
  { value: 'null', label: 'Is NULL' },
  { value: 'notnull', label: 'Is NOT NULL' },
  { value: 'nullish', label: 'Is NULL or empty string' },
  { value: 'in', label: 'In array/list' },
  { value: 'nin', label: 'notin: Not in array/list' },
  { value: 'between', label: 'Between two values (comma-separated or array)' },
]

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
        <Button variant="outline" size="icon" class="h-8">
          {{ modelValue.operator?.slice(0, 3) ?? 'eq' }}
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
          {{ operator.value }}
          <span class="text-xs text-muted-foreground">
            {{ operator.label }}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
