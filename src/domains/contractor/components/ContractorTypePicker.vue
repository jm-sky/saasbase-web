<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TContractorType } from '../types/contractor.type'

const { t } = useI18n()

const modelValue = defineModel<TContractorType>('modelValue', { required: true })

const types: TContractorType[] = ['company', 'individual', 'organization', 'institution', 'government', 'non_profit', 'other']

const options = computed(() => types.map(type => ({
  value: type,
  label: t(`contractor.type.${type}`),
})))
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>