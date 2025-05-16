<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { productService } from '@/domains/product/services/ProductService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit, setErrors, resetForm } = useForm<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    name: '',
    description: '',
    priceNet: 0,
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await productService.create(values)
    toast.success(t('product.add.success', 'Product added successfully'))
    resetForm()
    await router.push('/products')
  } catch (error: unknown) {
    console.error('[AddProductPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('product.add.error', 'Could not add product'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-8 py-6 mx-auto flex w-full flex-col justify-center space-y-6">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        {{ t('product.add.title') }}
      </h1>
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
          v-slot="{ componentField }"
          name="description"
          :label="t('product.fields.description')"
          :disabled="isSubmitting"
        >
          <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
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
        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('product.add.title') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
