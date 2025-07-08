<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductPicker from '@/domains/product/components/ProductPicker.vue'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { IProductLookup } from '@/domains/product/types/product.type'

const { t } = useI18n()

const props = defineProps<{
  values: IInvoiceCreate
  addLine: () => void
}>()

const lines = computed<IInvoiceLine[]>(() => {
  return props.values.body.lines
})

const onProductUpdate = (item: IInvoiceLine, product: IProductLookup | undefined) => {
  if (!product) return

  item.productId = product.id
  item.description = product.name
}
</script>

<template>
  <div>
    <table class="w-full border-collapse mt-6">
      <thead>
        <tr>
          <th class="p-2 bg-primary" />
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in lines" :key="item.id">
          <td class="border-b p-2 text-end">
            {{ index + 1 }}
          </td>
          <td class="border-b p-2">
            <ProductPicker
              :id="item.productId"
              class="w-full"
              @update:model-value="onProductUpdate(item, $event)"
            />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Quantity" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Price" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Tax" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Total" />
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
