<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SelectGroup from '@/components/ui/select/SelectGroup.vue'
import SelectLabel from '@/components/ui/select/SelectLabel.vue'
import { cn } from '@/lib/utils'
import { useInvoiceTemplates } from '../../helpers/useInvoiceTemplates'
import type { IInvoiceTemplatePreview } from '../../types/invoiceTemplate.type'

const { t } = useI18n()

const { invoiceTemplates, loadTemplates } = useInvoiceTemplates()

const emit = defineEmits<{
  change: [template: IInvoiceTemplatePreview | undefined]
}>()

const selectedTemplateId = defineModel<string | null | undefined>('selectedTemplateId')

const selectedTemplate = computed(() => invoiceTemplates.value.find(template => template.id === selectedTemplateId.value))
const systemTemplates = computed(() => invoiceTemplates.value.filter(template => template.isSystem))
const userTemplates = computed(() => invoiceTemplates.value.filter(template => !template.isSystem))

const handleChange = (value: string | null | undefined) => {
  const template = invoiceTemplates.value.find(template => template.id === value)
  emit('change', template ?? undefined)
}

onMounted(() => {
  if (invoiceTemplates.value.length === 0) {
    void loadTemplates()
  }
})
</script>

<template>
  <Select v-model="selectedTemplateId" @update:model-value="event => handleChange(event as string | null | undefined)">
    <SelectTrigger
      :aria-label="t('tenant.invoiceTemplates.editor.selectTemplate')"
      :class="cn('flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0')"
    >
      <SelectValue>
        <div class="flex items-center gap-3">
          {{ selectedTemplate?.name ?? t('tenant.invoiceTemplates.editor.selectTemplate') }}
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>
          {{ t('tenant.invoiceTemplates.filters.system') }}
        </SelectLabel>
        <SelectItem
          v-for="option of systemTemplates"
          :key="option.id"
          :value="option.id"
          class="ml-4"
        >
          {{ option.name }}
        </SelectItem>
      </SelectGroup>

      <SelectGroup>
        <SelectLabel>
          {{ t('tenant.invoiceTemplates.filters.tenant') }}
        </SelectLabel>
        <SelectItem
          v-for="option of userTemplates"
          :key="option.id"
          :value="option.id"
          class="ml-4"
        >
          {{ option.name }}
        </SelectItem>
        <SelectItem
          v-if="userTemplates.length === 0"
          value="-"
          class="ml-4"
          disabled
        >
          {{ t('tenant.invoiceTemplates.list.noTemplates') }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
