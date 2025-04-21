<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { contractorService } from '@/services/contractorService'
import { isAxiosError } from 'axios'
import { isValidationError } from '@/helpers/validation'
import type { IContractor } from '@/models/contractor.model'

const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit, setErrors, resetForm } = useForm<Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    name: '',
    email: '',
    phone: '',
    address: '',
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
  <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <h1 class="text-2xl font-semibold tracking-tight text-center">Add Contractor</h1>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <FormFieldLabeled name="name" label="Name" :disabled="isSubmitting" v-slot="{ componentField }">
        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
      </FormFieldLabeled>

      <FormFieldLabeled name="email" label="Email" :disabled="isSubmitting" v-slot="{ componentField }">
        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
      </FormFieldLabeled>

      <FormFieldLabeled name="phone" label="Phone" :disabled="isSubmitting" v-slot="{ componentField }">
        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
      </FormFieldLabeled>

      <FormFieldLabeled name="address" label="Address" :disabled="isSubmitting" v-slot="{ componentField }">
        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
      </FormFieldLabeled>

      <Button type="submit" :disabled="isSubmitting" class="w-full">Add Contractor</Button>
    </form>
  </div>
</template>