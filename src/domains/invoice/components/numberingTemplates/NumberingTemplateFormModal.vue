<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import type { IInvoiceNumberingTemplate } from '../../types/numberingTemplate.type'
import { numberingTemplateService } from '../../services/NumberingTemplate.service'
import { FORMAT_ELEMENTS, getInvoiceTypeLabel } from '../../utils/numberingTemplateUtils'
import { numberingTemplateFormSchema } from '../../validation/numberingTemplate.schema'
import type { TInvoiceType } from '@/domains/financial/types/financial.type'

const { t } = useI18n()
const { toast } = useToast()

const open = defineModel<boolean>('open')

const props = defineProps<{
  template?: IInvoiceNumberingTemplate | null
  invoiceType?: TInvoiceType | null
}>()

const emit = defineEmits<{
  'submit': []
}>()

const loading = ref(false)
const formatPreview = ref('')

const isEditing = computed(() => !!props.template)

const form = useForm({
  validationSchema: toTypedSchema(numberingTemplateFormSchema),
  initialValues: {
    name: '',
    invoiceType: props.invoiceType ?? 'basic',
    format: 'FV/YYYY/MM/NNN',
    nextNumber: 1,
    resetPeriod: 'yearly' as const,
    prefix: '',
    suffix: '',
  },
})

const resetPeriodOptions = [
  { value: 'monthly', label: t('invoice.numberingTemplate.resetPeriods.monthly') },
  { value: 'yearly', label: t('invoice.numberingTemplate.resetPeriods.yearly') },
  { value: 'never', label: t('invoice.numberingTemplate.resetPeriods.never') },
]

const invoiceTypeOptions = [
  'basic',
  'basic-correction',
  'advance-payment',
  'advance-payment-correction',
  'export',
  'export-correction',
  'settlement',
  'settlement-correction',
  'proforma',
  'ue',
  'ue-correction',
  'debit-note',
  'debit-note-correction',
  'import',
  'import-correction',
].map(type => ({
  value: type,
  label: t(getInvoiceTypeLabel(type as TInvoiceType)),
}))

const updatePreview = async () => {
  try {
    const values = form.values
    if (values.format) {
      formatPreview.value = await numberingTemplateService.previewNumber({
        format: values.format,
        nextNumber: values.nextNumber,
        resetPeriod: values.resetPeriod,
        prefix: values.prefix,
        suffix: values.suffix,
      })
    }
  } catch {
    formatPreview.value = t('invoice.numberingTemplate.formatBuilder.preview') + ': ' + t('common.error')
  }
}

const insertFormatElement = (element: string) => {
  const currentFormat = form.values.format ?? ''
  form.setFieldValue('format', currentFormat + element)
}

const handleSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true

    if (isEditing.value && props.template) {
      await numberingTemplateService.update(props.template.id, values)
      toast({
        title: t('invoice.numberingTemplate.actions.update.success'),
        variant: 'default',
      })
    } else {
      await numberingTemplateService.create(values)
      toast({
        title: t('invoice.numberingTemplate.actions.create.success'),
        variant: 'default',
      })
    }

    emit('submit')
    open.value = false
    form.resetForm()
  } catch {
    toast({
      title: isEditing.value
        ? t('invoice.numberingTemplate.actions.update.error')
        : t('invoice.numberingTemplate.actions.create.error'),
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
})

watch(() => open.value, (newValue) => {
  if (newValue) {
    if (props.template) {
      form.setValues({
        name: props.template.name,
        invoiceType: props.template.invoiceType,
        format: props.template.format,
        nextNumber: props.template.nextNumber,
        resetPeriod: props.template.resetPeriod,
        prefix: props.template.prefix,
        suffix: props.template.suffix,
      })
    } else {
      form.resetForm()
      if (props.invoiceType) {
        form.setFieldValue('invoiceType', props.invoiceType)
      }
    }
    void updatePreview()
  }
})

watch(() => [form.values.format, form.values.nextNumber, form.values.resetPeriod, form.values.prefix, form.values.suffix],
  () => {
    void updatePreview()
  },
  { deep: true }
)
</script>

<template>
  <ModalComponent
    v-model:open="open"
    :title="isEditing
      ? t('invoice.numberingTemplate.actions.edit')
      : t('invoice.numberingTemplate.actions.add')"
    size="lg"
  >
    <form class="space-y-6" @submit="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t('invoice.numberingTemplate.form.name') }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :placeholder="t('invoice.numberingTemplate.form.namePlaceholder')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="invoiceType">
          <FormItem>
            <FormLabel>{{ t('invoice.numberingTemplate.form.invoiceType') }}</FormLabel>
            <Select v-bind="componentField" :disabled="isEditing">
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in invoiceTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="format">
          <FormItem>
            <FormLabel>{{ t('invoice.numberingTemplate.form.format') }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                class="font-mono"
                :placeholder="t('invoice.numberingTemplate.form.formatHelp')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-5 gap-2">
          <Button
            v-for="element in FORMAT_ELEMENTS"
            :key="element.id"
            type="button"
            variant="outline"
            size="sm"
            @click="insertFormatElement(element.value)"
          >
            {{ element.value }}
          </Button>
        </div>

        <div v-if="formatPreview" class="p-3 bg-muted rounded-md">
          <Label class="text-sm font-medium">{{ t('invoice.numberingTemplate.formatBuilder.preview') }}</Label>
          <div class="font-mono text-sm mt-1">
            {{ formatPreview }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <FormField v-slot="{ componentField }" name="nextNumber">
          <FormItem>
            <FormLabel>{{ t('invoice.numberingTemplate.form.nextNumber') }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="number"
                min="1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="resetPeriod">
          <FormItem>
            <FormLabel>{{ t('invoice.numberingTemplate.form.resetPeriod') }}</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in resetPeriodOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('invoice.numberingTemplate.form.prefix') }}</Label>
          <FormField v-slot="{ componentField }" name="prefix">
            <FormItem>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('invoice.numberingTemplate.form.prefixPlaceholder')"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
    </form>

    <template #footer>
      <Button
        type="button"
        variant="outline"
        @click="open = false"
      >
        {{ t('invoice.numberingTemplate.actions.cancel') }}
      </Button>
      <Button type="submit" :disabled="loading" @click="handleSubmit">
        {{ loading ? t('common.loading') : t('invoice.numberingTemplate.actions.save') }}
      </Button>
    </template>
  </ModalComponent>
</template>
