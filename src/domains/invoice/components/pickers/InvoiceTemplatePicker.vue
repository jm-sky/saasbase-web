<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
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
import type { IInvoiceTemplatePreview } from '../../types/invoiceTemplate.type'
import { useInvoiceTemplates } from '../../helpers/useInvoiceTemplates'

const { t } = useI18n()
const { invoiceTemplates, loadTemplates: loadTemplatesHelper } = useInvoiceTemplates()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IInvoiceTemplatePreview | undefined>('modelValue', { required: true })

const { class: classProp, pickFirstTemplate } = defineProps<{
  class?: string
  popoverContentClass?: string
  disabled?: boolean
  pickFirstTemplate?: boolean
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const loadTemplates = async () => {
  try {
    loading.value = true
    error.value = null
    await loadTemplatesHelper()
  } catch (err) {
    error.value = 'Failed to load invoice templates'
    console.error('[InvoiceTemplatePicker][loadTemplates] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedTemplate = invoiceTemplates.value.find((template) => template.id === selectedId)
  id.value = selectedTemplate?.id
  modelValue.value = selectedTemplate
  open.value = false
}

onMounted(async () => {
  if (invoiceTemplates.value.length === 0) {
    await loadTemplates()
  }
  if (pickFirstTemplate && invoiceTemplates.value.length > 0) {
    modelValue.value = invoiceTemplates.value[0]
    id.value = invoiceTemplates.value[0].id
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
        :class="classProp"
      >
        {{ modelValue?.name ?? t('shared.invoiceTemplate.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.invoiceTemplate.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.invoiceTemplate.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="template in invoiceTemplates"
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
                  {{ template.name }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ template.category }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
