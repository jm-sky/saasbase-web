<script setup lang="ts">
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const router = useRouter()
const contractorId = route.params.id as string

const loading = ref(false)
const error = ref<string | null>(null)

const { isSubmitting, handleSubmit, setValues, setErrors, resetForm } = useForm<Omit<IContractor, 'createdAt' | 'updatedAt'>>({
  initialValues: {
    name: '',
    description: '',
    taxId: '',
    email: '',
    phone: '',
    website: '',
    isSupplier: true,
    isBuyer: true,
  },
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await contractorService.get(contractorId)
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('contractor.show.error'), err)
    error.value = 'Failed to load contractor'
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await contractorService.create(values)
    toast.success('Contractor added successfully')
    resetForm()
    await router.push({ name: 'showContractor', params: { id: contractorId } })
  } catch (error: unknown) {
    console.error('[AddContractorView][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast('Could not edit contractor', error)
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
        Edit Contractor
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

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="website"
              label="Website"
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
            Save
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
