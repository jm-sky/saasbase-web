<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SelectGroup from '@/components/ui/select/SelectGroup.vue'
import SelectLabel from '@/components/ui/select/SelectLabel.vue'
import { cn } from '@/lib/utils'
import type { IInvoiceTemplate } from '../../types/invoiceTemplate.type'

const { t } = useI18n()

const props = defineProps<{
  invoiceTemplates: IInvoiceTemplate[]
}>()

const emit = defineEmits<{
  change: [template: IInvoiceTemplate | undefined]
}>()

const selectedTemplateId = defineModel<string | undefined>('selectedTemplateId')

const selectedTemplate = computed(() => props.invoiceTemplates.find(template => template.id === selectedTemplateId.value))
const systemTemplates = computed(() => props.invoiceTemplates.filter(template => template.isSystem))
const userTemplates = computed(() => props.invoiceTemplates.filter(template => !template.isSystem))

const handleChange = (value: string | undefined) => {
  const template = props.invoiceTemplates.find(template => template.id === value)
  emit('change', template ?? undefined)
}
</script>

<template>
  <Select v-model="selectedTemplateId" @update:model-value="handleChange">
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
