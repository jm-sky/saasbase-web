<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import TagsInputField from '@/components/ui/tags-input/TagsInputField.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import ProductSidebar from '@/domains/product/components/ProductSidebar.vue'
import ProductTypePicker from '@/domains/product/components/ProductTypePicker.vue'
import { useUpdateProduct } from '@/domains/product/composables/useProductMutations'
import { useProduct } from '@/domains/product/composables/useProductQueries'
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

const productId = route.params.id as string
const productStore = useProductStore()
const { product: storeProduct } = storeToRefs(productStore)

const { data: product, isPending: loading, refetch } = useProduct(productId)

const { mutateAsync: updateProduct, isPending: isMutating } = useUpdateProduct()

const { isSubmitting, handleSubmit, values, setValues, setFieldValue, setErrors, resetForm } = useForm<IProductCreate>({
  initialValues: {
    name: '',
    type: 'product',
    description: '',
    priceNet: undefined,
    unitId: undefined,
    vatRateId: undefined,
    logo: undefined,
    unit: undefined,
    vatRate: undefined,
  },
})

watch(product, (value) => {
  if (!value) return
  productStore.setProduct(value)
  setValues(value)
}, { immediate: true })

const displayProduct = computed(() => product.value ?? storeProduct.value)

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateProduct({ id: productId, data: values })
    toast.success(t('product.edit.success', 'Product updated successfully'))
    resetForm()
    await router.push(`/products/${productId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditProductPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('product.edit.error', 'Could not edit product'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('product.add.title')"
      back-link="/products"
      :name="displayProduct?.name"
      :logo="displayProduct?.logoUrl"
      show-sidebar
      :loading
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('product.title') }}
      </template>

      <template #sidebar>
        <ProductSidebar :product-id="productId" :product="displayProduct" />
      </template>

      <template #content>
        <div class="p-6 md:p-8 border rounded-md shadow-lg">
          <form class="flex flex-col gap-y-6 gap-x-8" @submit.prevent="onSubmit">
            <FormFieldLabeled
              name="type"
              :label="t('product.fields.type')"
              :disabled="isSubmitting || isMutating"
            >
              <ProductTypePicker
                :model-value="values.type"
                @update:model-value="setFieldValue('type', $event ?? 'product')"
              />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="name"
              :label="t('product.fields.name')"
              :disabled="isSubmitting || isMutating"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="description"
              :label="t('product.fields.description')"
              :disabled="isSubmitting || isMutating"
            >
              <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="priceNet"
                :label="t('product.fields.price')"
                :disabled="isSubmitting || isMutating"
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
                :disabled="isSubmitting || isMutating"
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
                :disabled="isSubmitting || isMutating"
              >
                <VatRatePicker
                  :id="values.vatRateId"
                  :model-value="values.vatRate"
                  @update:model-value="setFieldValue('vatRate', $event)"
                  @update:id="setFieldValue('vatRateId', $event)"
                />
              </FormFieldLabeled>

              <FormFieldLabeled
                v-slot="{ componentField }"
                name="pkwiuCode"
                :label="t('product.fields.pkwiuCode')"
                disabled
              >
                <Input v-bind="componentField" disabled />
              </FormFieldLabeled>

              <FormFieldLabeled
                v-slot="{ componentField }"
                name="ean"
                :label="t('product.fields.ean')"
                :disabled="isSubmitting || isMutating"
              >
                <Input v-bind="componentField" />
              </FormFieldLabeled>

              <FormFieldLabeled
                name="gtuCodes"
                :label="t('product.fields.gtuCodes')"
                disabled
              >
                <TagsInputField
                  disabled
                  :model-value="values.gtuCodes ?? []"
                  @update:model-value="setFieldValue('gtuCodes', $event)"
                />
              </FormFieldLabeled>
            </div>

            <div class="col-span-2">
              <Button type="submit" :disabled="isSubmitting || isMutating" class="w-full">
                {{ t('product.add.title') }}
              </Button>
            </div>
          </form>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
