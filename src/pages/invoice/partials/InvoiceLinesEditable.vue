<script setup lang="ts">
import { useFieldArray, useFormContext } from 'vee-validate'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateInvoiceTotals, calculateLineTotal } from '@/domains/invoice/helpers/invoiceCalculations'
import ProductPicker from '@/domains/product/components/ProductPicker.vue'
import VatRatePicker from '@/domains/shared/components/VatRatePicker.vue'
import { money } from '@/lib/money'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { IProductLookup } from '@/domains/product/types/product.type'
import type { IVatRate } from '@/domains/shared/types/vatRate.type'

const { t } = useI18n()
const { setFieldValue, values } = useFormContext<IInvoiceCreate>()

const props = defineProps<{
  values: IInvoiceCreate
  addLine: () => void
}>()

const { fields: lines, remove } = useFieldArray<IInvoiceLine>('body.lines')

const onProductUpdate = (index: number, product: IProductLookup | undefined) => {
  if (!product) return

  setFieldValue(`body.lines[${index}].productId` as any, product.id)
  setFieldValue(`body.lines[${index}].description` as any, product.name)
  if (product.priceNet) {
    setFieldValue(`body.lines[${index}].unitPrice` as any, product.priceNet)
  }
  recalculateLine(index)
}

const onVatRateUpdate = (index: number, vatRate: IVatRate | undefined) => {
  if (!vatRate) return

  setFieldValue(`body.lines[${index}].vatRate` as any, {
    rate: vatRate.rate * 100,
    category: vatRate.name,
  })
  recalculateLine(index)
}

const recalculateLine = (index: number) => {
  const line = props.values.body.lines[index]
  if (!line) return

  const calculated = calculateLineTotal(line)
  setFieldValue(`body.lines[${index}].totalNet` as any, calculated.totalNet)
  setFieldValue(`body.lines[${index}].totalVat` as any, calculated.totalVat)
  setFieldValue(`body.lines[${index}].totalGross` as any, calculated.totalGross)
  
  recalculateTotals()
}

const recalculateTotals = () => {
  const totals = calculateInvoiceTotals(props.values.body.lines)
  setFieldValue('totalNet', totals.totalNet)
  setFieldValue('totalTax', totals.totalTax)
  setFieldValue('totalGross', totals.totalGross)
  setFieldValue('body.vatSummary', totals.vatSummary)
}

const onQuantityChange = (index: number, quantity: number) => {
  setFieldValue(`body.lines[${index}].quantity` as any, quantity)
  recalculateLine(index)
}

const onUnitPriceChange = (index: number, unitPrice: number) => {
  setFieldValue(`body.lines[${index}].unitPrice` as any, unitPrice)
  recalculateLine(index)
}

const onDescriptionChange = (index: number, description: string) => {
  setFieldValue(`body.lines[${index}].description` as any, description)
}

const removeLine = (index: number) => {
  remove(index)
  recalculateTotals()
}
</script>

<template>
  <div>
    <table class="w-full border-collapse mt-6">
      <thead>
        <tr>
          <th class="p-2 bg-primary text-white text-center w-12">
            #
          </th>
          <th class="py-2 px-4 text-white bg-primary text-left w-3/8">
            {{ t('financial.lines.fields.items') }}
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            {{ t('financial.lines.fields.quantity') }}
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            {{ t('financial.lines.fields.unitPrice') }}
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            {{ t('financial.lines.fields.tax') }}
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            {{ t('financial.lines.fields.total') }}
          </th>
          <th class="p-2 bg-primary w-12" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in lines" :key="item.value.id">
          <td class="border-b p-2 text-center">
            {{ index + 1 }}
          </td>
          <td class="border-b p-2">
            <div class="space-y-2">
              <ProductPicker
                :id="item.value.productId"
                class="w-full"
                @update:model-value="onProductUpdate(index, $event)"
              />
              <Input
                :model-value="item.value.description"
                class="w-full"
                placeholder="Description"
                @update:model-value="(value) => onDescriptionChange(index, String(value))"
              />
            </div>
          </td>
          <td class="border-b p-2 text-right">
            <Input 
              type="number" 
              :model-value="item.value.quantity"
              class="w-full text-right" 
              placeholder="Quantity"
              @update:model-value="onQuantityChange(index, Number($event))"
            />
          </td>
          <td class="border-b p-2 text-right">
            <Input 
              type="number" 
              :model-value="item.value.unitPrice"
              class="w-full text-right" 
              placeholder="Price"
              step="0.01"
              @update:model-value="onUnitPriceChange(index, Number($event))"
            />
          </td>
          <td class="border-b p-2 text-right">
            <div class="text-sm">
              {{ item.value.vatRate.rate }}% 
              <span v-if="item.value.vatRate.category">({{ item.value.vatRate.category }})</span>
            </div>
          </td>
          <td class="border-b p-2 text-right">
            <div class="text-right">
              <div class="font-medium">
                {{ money(item.value.totalGross ?? 0, values.currency, t('locale')) }}
              </div>
              <div class="text-xs text-muted-foreground">
                Net: {{ money(item.value.totalNet ?? 0, values.currency, t('locale')) }}
              </div>
            </div>
          </td>
          <td class="border-b p-2 text-center">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              class="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              @click="removeLine(index)"
            >
              ×
            </Button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-2 mr-2 flex justify-end">
      <Button type="button" variant="outline" @click="addLine">
        {{ t('financial.lines.actions.addItem') }}
      </Button>
    </div>
  </div>
</template>
