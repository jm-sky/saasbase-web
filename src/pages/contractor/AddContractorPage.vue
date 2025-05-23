<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractor } from '@/domains/contractor/types/contractor.type'

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
    toast.success('Contractor added successfully')
    resetForm()
    await router.push('/contractors') // Navigate to the contractors list
  } catch (error: unknown) {
    console.error('[AddContractorView][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast('Could not add contractor', error)

  }
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-8 py-6 mx-auto flex w-full flex-col justify-center space-y-6">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        Add Contractor
      </h1>
      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
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
          <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>

        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <div class="flex flex-col gap-4">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="taxId"
              label="Tax ID"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>
          </div>

          <div class="flex flex-col gap-2">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="email"
              label="Email"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="phone"
              label="Phone"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>
          </div>
        </div>

        <div class="col-span-2 font-semibold mt-2 mb-2">
          Roles
        </div>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isSupplier"
          label="Is Supplier?"
          :disabled="isSubmitting"
          class="grid grid-cols-2 gap-2"
        >
          <Switch type="checkbox" v-bind="componentField" />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isBuyer"
          label="Is Buyer?"
          :disabled="isSubmitting"
          class="grid grid-cols-2 gap-2"
        >
          <Switch type="checkbox" v-bind="componentField" />
        </FormFieldLabeled>

        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            Add Contractor
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
