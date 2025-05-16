<script setup lang="ts">
import { computed } from 'vue'
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
    <select v-model="modelValue.operator" class="w-4 h-8">
      <option v-for="operator in operators" :key="operator.value" :value="operator.value">
        {{ operator.value }}
      </option>
    </select>
  </div>
</template>
