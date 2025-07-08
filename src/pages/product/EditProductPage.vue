<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import ProductSidebar from '@/domains/product/components/ProductSidebar.vue'
import ProductTypePicker from '@/domains/product/components/ProductTypePicker.vue'
import { productService } from '@/domains/product/services/ProductService'
import { useProductStore } from '@/domains/product/stores/product.store'
import MeasurementUnitPicker from '@/domains/shared/components/MeasurementUnitPicker.vue'
import VatRatePicker from '@/domains/shared/components/VatRatePicker.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProductCreate } from '@/domains/product/types/product.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const productId = route.params.id as string
const { product } = storeToRefs(useProductStore())

const loading = ref(false)
const error = ref<string | null>(null)


const { isSubmitting, handleSubmit, values, setValues, setFieldValue, setErrors, resetForm } = useForm<IProductCreate>({
  initialValues: {
    name: product.value?.name ?? '',
    type: product.value?.type ?? 'product',
    description: product.value?.description ?? '',
    priceNet: product.value?.priceNet ?? undefined,
    unitId: product.value?.unitId ?? undefined,
    vatRateId: product.value?.vatRateId ?? undefined,
    logo: product.value?.logo ?? undefined,
    unit: product.value?.unit ?? undefined,
    vatRate: product.value?.vatRate ?? undefined,
  },
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await productService.get(productId)
    product.value = response
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('product.show.error', 'Error'), err)
    error.value = t('product.show.error', 'Failed to load product')
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await productService.update(productId, values)
    toast.success(t('product.edit.success', 'Product updated successfully'))
    resetForm()
    await router.push(`/products/${productId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditProductPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('product.edit.error', 'Could not edit product'), error)
  }
})

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('product.add.title')"
      back-link="/products"
    >
      <template #back-link-text>
        {{ t('product.title') }}
      </template>

      <template #sidebar>
        <ProductSidebar :product-id :product="product" />
      </template>

      <template #content>
        <div class="p-6 md:p-8 border rounded-md shadow-lg">
          <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="name"
              :label="t('product.fields.name')"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              name="type"
              :label="t('product.fields.type')"
              :disabled="isSubmitting"
            >
              <ProductTypePicker
                :model-value="values.type"
                @update:model-value="setFieldValue('type', $event ?? 'product')"
              />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="description"
              :label="t('product.fields.description')"
              :disabled="isSubmitting"
            >
              <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="priceNet"
                :label="t('product.fields.price')"
                :disabled="isSubmitting"
              >
                <Input
                  v-bind="componentField"
                  type="number"
                  step="0.01"
                  class="bg-white/50 dark:bg-black/50"
                />
              </FormFieldLabeled>
              <FormFieldLabeled
                name="unitId"
                :label="t('product.fields.unit')"
                :disabled="isSubmitting"
              >
                <MeasurementUnitPicker
                  :id="values.unitId"
                  :model-value="values.unit"
                  @update:model-value="setFieldValue('unit', $event)"
                  @update:id="setFieldValue('unitId', $event)"
                />
              </FormFieldLabeled>
              <FormFieldLabeled
                name="vatRateId"
                :label="t('product.fields.vatRate')"
                :disabled="isSubmitting"
              >
                <VatRatePicker
                  :id="values.vatRateId"
                  :model-value="values.vatRate"
                  @update:model-value="setFieldValue('vatRate', $event)"
                  @update:id="setFieldValue('vatRateId', $event)"
                />
              </FormFieldLabeled>
            </div>

            <div class="col-span-2">
              <Button type="submit" :disabled="isSubmitting" class="w-full">
                {{ t('product.add.title') }}
              </Button>
            </div>
          </form>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>

