<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
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
import type { IMeasurementUnit } from '../types/measurementUnit.type'
import { measurementUnitService } from '../services/measurementUnit.service'
import { useMeasurementUnitStore } from '../stores/measurementUnit.store'

const { t } = useI18n()
const measurementUnitStore = useMeasurementUnitStore()
const { measurementUnits } = storeToRefs(measurementUnitStore)

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IMeasurementUnit | undefined>('modelValue', { required: true })

defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const measurementUnis = ref<IMeasurementUnit[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadMeasurementUnits = async () => {
  try {
    loading.value = true
    error.value = null
    measurementUnis.value = await measurementUnitService.index()
  } catch (err) {
    error.value = 'Failed to load measurement units'
    console.error('[MeasurementUnitPicker][loadMeasurementUnits] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedMeasurementUnit = measurementUnis.value.find((unit) => unit.id === selectedId)
  modelValue.value = selectedMeasurementUnit
  id.value = selectedMeasurementUnit?.id
  open.value = false
}

onMounted(() => {
  if (measurementUnits.value.length === 0) {
    void loadMeasurementUnits()
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
        {{ modelValue?.name ?? t('shared.measurementUnit.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.measurementUnit.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.measurementUnit.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="unit in measurementUnis"
              :key="unit.id"
              :value="unit.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === unit.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ unit.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
