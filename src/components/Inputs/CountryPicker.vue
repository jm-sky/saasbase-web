<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref } from 'vue'
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

export interface ICountry {
  code: string
  name: string
}

const { t } = useI18n()

const modelValue = defineModel<string | undefined>('modelValue', { required: true })

const props = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  placeholder?: string
  class?: string
}>()

const open = ref(false)
const countries = ref<ICountry[]>([
  {
    code: 'PL',
    name: 'Poland',
  },
  {
    code: 'DE',
    name: 'Germany',
  },
  {
    code: 'AT',
    name: 'Austria',
  },
  {
    code: 'CH',
    name: 'Switzerland',
  },
  {
    code: 'FR',
    name: 'France',
  },
  {
    code: 'IT',
    name: 'Italy',
  },
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  modelValue.value = event.detail.value
  open.value = false
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
        :class="cn('w-full justify-between', props.class)"
      >
        {{ modelValue ?? placeholder ?? t('country.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('country.search')" />
        <CommandList>
          <CommandEmpty>{{ t('country.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue === country.name ? 'opacity-100' : 'opacity-0'"
              />
              {{ country.code }} - {{ country.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
