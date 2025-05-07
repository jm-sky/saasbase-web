<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { contractorService } from '@/domains/contractor/services/contractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { isValidationError } from '@/lib/validation'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit, setErrors, resetForm } = useForm<Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    name: '',
    description: '',
    isSupplier: true,
    isBuyer: true,
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await contractorService.create(values)
    toast({ title: 'Success', description: 'Contractor added successfully', variant: 'success' })
    resetForm()
    await router.push('/contractors') // Navigate to the contractors list
  } catch (error: unknown) {
    console.error('[AddContractorView][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    toast({
      title: 'Error',
      description: `${isAxiosError(error) && error.response?.data?.message ? error.response.data.message : 'Error adding contractor'}`,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        Add Contractor
      </h1>
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="name"
          label="Name"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="description"
          label="Description"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isSupplier"
          label="Is Supplier?"
          :disabled="isSubmitting"
        >
          <Input type="checkbox" v-bind="componentField" />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isBuyer"
          label="Is Buyer?"
          :disabled="isSubmitting"
        >
          <Input type="checkbox" v-bind="componentField" />
        </FormFieldLabeled>

        <Button type="submit" :disabled="isSubmitting" class="w-full">
          Add Contractor
        </Button>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
