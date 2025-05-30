<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { TAddressType } from '@/domains/shared/types/address.type'

const { t } = useI18n()

const modelValue = defineModel<TAddressType>('modelValue', { required: true })

defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const types = ref<TAddressType[]>(['residence','billing','registeredOffice','correspondence','domicile','contact'])

const options = computed(() => types.value.map((type) => ({
  label: t(`address.type.${type}`),
  value: type,
})))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const type = event.detail.value
  open.value = false
  modelValue.value = type
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        class="w-full justify-between"
      >
        {{ t(`address.type.${modelValue}`) || t('address.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('address.search')" />
        <CommandList>
          <CommandEmpty>{{ t('address.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue === option.value ? 'opacity-100' : 'opacity-0'"
              />
              {{ option.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
