<script setup lang="ts">
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { productService } from '@/domains/product/services/productService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const productId = route.params.id as string

const loading = ref(false)
const error = ref<string | null>(null)

const { isSubmitting, handleSubmit, setValues, setErrors, resetForm } = useForm<Omit<IProduct, 'createdAt' | 'updatedAt'>>({
  initialValues: {
    name: '',
    description: '',
    priceNet: 0,
  },
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await productService.get(productId)
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
    <div class="p-6">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        {{ t('product.edit.title', 'Edit Product') }}
      </h1>
      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="name"
          :label="t('product.name')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="description"
          :label="t('product.description')"
          :disabled="isSubmitting"
        >
          <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="priceNet"
          :label="t('product.price')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            type="number"
            step="0.01"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>
        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('product.edit.title', 'Save') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
