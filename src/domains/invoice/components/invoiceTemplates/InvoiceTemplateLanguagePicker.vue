<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ClearButton from '@/components/Buttons/ClearButton.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const { t } = useI18n()

const modelValue = defineModel<string | undefined>('modelValue', { required: true })

const props = defineProps<{
  class?: string
  disabled?: boolean
}>()

const options = [
  { value: 'en', label: t('common.language.en') },
  { value: 'pl', label: t('common.language.pl') },
  { value: 'uk', label: t('common.language.uk'), disabled: true },
  { value: 'ru', label: t('common.language.ru'), disabled: true }
]
</script>

<template>
  <Select v-model="modelValue" :disabled="disabled">
    <div class="relative">
      <SelectTrigger :class="cn('w-full relative', props.class)">
        <SelectValue>
          {{ modelValue ? t(`common.language.${modelValue}`) : '...' }}
        </SelectValue>
      </SelectTrigger>
      <ClearButton v-if="modelValue" class="absolute right-6 top-0" @click.stop.capture="modelValue = undefined" />
    </div>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
