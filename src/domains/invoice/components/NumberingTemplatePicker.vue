<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
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
import type { TInvoiceType } from '../types/invoice.type'
import type { IInvoiceNumberingTemplate } from '../types/numberingTemplate.type'
import { numberingTemplateService } from '../services/NumberingTemplate.service'
import { useNumberingTemplateStore } from '../stores/numberingTemplate.store'

const { t } = useI18n()
const numberingTemplateStore = useNumberingTemplateStore()
const { numberingTemplates } = storeToRefs(numberingTemplateStore)

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IInvoiceNumberingTemplate | undefined>('modelValue', { required: true })

const { invoiceType } = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  invoiceType?: TInvoiceType
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const loadTemplates = async () => {
  try {
    loading.value = true
    error.value = null
    numberingTemplates.value = (await numberingTemplateService.index()).data
  } catch (err) {
    error.value = 'Failed to load numbering templates'
    console.error('[NumberingTemplatePicker][loadVatRates] error:', err)
  } finally {
    loading.value = false
  }
}

const filteredNumberingTemplates = computed(() => {
  if (!invoiceType) return numberingTemplates.value
  return numberingTemplates.value.filter((template) => template.invoiceType === invoiceType)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedVatRate = numberingTemplates.value.find((template) => template.id === selectedId)
  id.value = selectedVatRate?.id
  modelValue.value = selectedVatRate
  open.value = false
}

onMounted(() => {
  if (numberingTemplates.value.length === 0) {
    void loadTemplates()
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
        {{ modelValue?.format ?? t('shared.numberingTemplate.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.numberingTemplate.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.numberingTemplate.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="template in filteredNumberingTemplates"
              :key="template.id"
              :value="template.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === template.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="grid grid-cols-2 w-full gap-x-2">
                <div class="text-sm">
                  {{ template.format }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ template.name }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
