<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import CompanyLookupButton from '@/domains/utils/components/CompanyLookupButton.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import AddressForm from './AddContractorPage/AddressForm.vue'
import BankAccountForm from './AddContractorPage/BankAccountForm.vue'
import type { IContractorCombinedCreate } from '@/domains/contractor/types/contractor.type'
import type { ICompanyLookupResponse } from '@/domains/utils/types/companyLookup.type'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()

const { isSubmitting, handleSubmit, values, setValues, setErrors, resetForm } = useForm<IContractorCombinedCreate>({
  initialValues: {
    contractor: {
      name: '',
      country: 'PL',
      vatId: '',
      taxId: '',
      regon: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      isSupplier: true,
      isBuyer: true,
    },
    address: {
      city: '',
      street: '',
      building: '',
      flat: '',
    },
    bankAccount: {
      iban: '',
      swift: '',
      bankName: '',
    },
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await contractorService.create(values)
    toast.success(t('contractor.add.success'))
    resetForm()
    await router.push('/contractors') // Navigate to the contractors list
  } catch (error: unknown) {
    console.error('[AddContractorView][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contractor.add.error'), error)

  }
})

const onCompanyLookup = (company: ICompanyLookupResponse) => {
  console.log('[AddContractorView][onCompanyLookup] company:', company)
  setValues({
    contractor: {
      name: company.name,
      vatId: company.vatId,
      country: company.country,
      regon: company.regon,
    },
    address: {
      street: company.address,
    },
    bankAccount: {
      iban: company.accountNumbers?.at(0) ?? '',
    },
  })
}
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-8 py-6 mx-auto flex w-full flex-col justify-center space-y-6">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        {{ t('contractor.add.title') }}
      </h1>

      <div class="p-6 md:p-8 border rounded-md shadow-lg">
        <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-2">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="contractor.country"
              :label="t('contractor.fields.country')"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="contractor.name"
              :label="t('contractor.fields.name')"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>
          </div>


          <FormFieldLabeled
            v-slot="{ componentField }"
            name="contractor.description"
            :label="t('contractor.fields.description')"
            :disabled="isSubmitting"
          >
            <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          </FormFieldLabeled>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div class="flex flex-col gap-2">
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.vatId"
                :label="t('contractor.fields.vatId')"
                :disabled="isSubmitting"
              >
                <div class="flex flex-row gap-2 items-center grow">
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                  <CompanyLookupButton
                    :country="values.contractor.country"
                    :vat-id="values.contractor.vatId"
                    @lookup="onCompanyLookup"
                  />
                </div>
              </FormFieldLabeled>

              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.taxId"
                :label="t('contractor.fields.taxId')"
                :disabled="isSubmitting"
              >
                <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
              </FormFieldLabeled>
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.regon"
                :label="t('contractor.fields.regon')"
                :disabled="isSubmitting"
              >
                <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
              </FormFieldLabeled>
            </div>

            <div class="flex flex-col gap-2">
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.email"
                :label="t('contractor.fields.email')"
                :disabled="isSubmitting"
              >
                <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
              </FormFieldLabeled>

              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.phone"
                :label="t('contractor.fields.phone')"
                :disabled="isSubmitting"
              >
                <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
              </FormFieldLabeled>

              <FormFieldLabeled
                v-slot="{ componentField }"
                name="contractor.website"
                :label="t('contractor.fields.website')"
                :disabled="isSubmitting"
              >
                <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
              </FormFieldLabeled>
            </div>
          </div>

          <Separator class="my-2" />

          <div class="col-span-2 font-semibold mt-2 mb-2">
            {{ t('contractor.fields.roles') }}
          </div>
          <FormFieldLabeled
            v-slot="{ componentField }"
            name="contractor.isSupplier"
            :label="t('contractor.fields.isSupplier')"
            :disabled="isSubmitting"
            class="grid grid-cols-2 gap-2"
          >
            <Switch type="checkbox" v-bind="componentField" />
          </FormFieldLabeled>

          <FormFieldLabeled
            v-slot="{ componentField }"
            name="contractor.isBuyer"
            :label="t('contractor.fields.isBuyer')"
            :disabled="isSubmitting"
            class="grid grid-cols-2 gap-2"
          >
            <Switch type="checkbox" v-bind="componentField" />
          </FormFieldLabeled>

          <Separator class="my-2" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AddressForm :is-submitting />

            <BankAccountForm :is-submitting />
          </div>

          <Separator class="my-2" />

          <div class="col-span-2 flex flex-col gap-2">
            <Button type="submit" :disabled="isSubmitting" class="w-full">
              {{ t('common.save') }}
            </Button>
            <Button
              type="button"
              variant="outline"
              :disabled="isSubmitting"
              class="w-full"
              @click="resetForm"
            >
              {{ t('common.reset') }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
