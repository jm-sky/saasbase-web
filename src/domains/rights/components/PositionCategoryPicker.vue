<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref, watch } from 'vue'
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
import { positionCategoryService } from '@/domains/rights/services/positionCategory.service'
import { cn } from '@/lib/utils'
import type { IPositionCategory } from '@/domains/rights/types/position.type'

const { t } = useI18n()

const modelValue = defineModel<string | undefined>('modelValue', { required: true })

const { popoverContentClass = 'min-w-64' } = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const categories = ref<IPositionCategory[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadCategories = async () => {
  try {
    loading.value = true
    error.value = null
    categories.value = await positionCategoryService.list()
  } catch (err) {
    error.value = 'Failed to load roles'
    console.error('[PositionCategoryPicker][loadCategories] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const name = event.detail.value
  modelValue.value = categories.value.find((category) => category.name === name)?.name ?? name
  open.value = false
}

watch(open, (newValue) => {
  if (newValue && categories.value.length === 0) {
    void loadCategories()
  }
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled || loading"
        class="w-full justify-between"
      >
        {{ modelValue || t('shared.positionCategory.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.positionCategory.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.positionCategory.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="category in categories"
              :key="category.name"
              :value="category.name"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue === category.name ? 'opacity-100' : 'opacity-0'"
              />
              {{ category.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
