<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { Command } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const { t } = useI18n()

const {
  open,
  disabled = false,
  loading = false,
  placeholder,
  modelValue,
  class: classProp,
  popoverContentClass
} = defineProps<{
  open: boolean
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  modelValue?: { name: string } | null
  class?: string
  popoverContentClass?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <Popover :open="open" @update:open="emit('update:open', $event)">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled || loading"
        class="w-full justify-between"
        :class="classProp"
      >
        <slot name="trigger">
          <span class="truncate">
            {{ modelValue?.name ?? placeholder ?? t('shared.select') }}
          </span>
        </slot>
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command class="w-full">
        <slot />
      </Command>
    </PopoverContent>
  </Popover>
</template>
