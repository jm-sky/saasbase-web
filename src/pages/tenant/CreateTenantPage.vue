<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CountryPicker from '@/components/Inputs/CountryPicker.vue'
import Accordion from '@/components/ui/accordion/Accordion.vue'
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue'
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue'
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import Input from '@/components/ui/input/Input.vue'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { tenantCreateSchema } from '@/domains/tenant/validation/tenant.schema'
import CompanyLookupButton from '@/domains/utils/components/CompanyLookupButton.vue'
import IbanLookupButton from '@/domains/utils/components/IbanLookupButton.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IIbanInfo } from '@/domains/utils/services/IbanInfoService'
import type { ICompanyLookupResponse } from '@/domains/utils/types/companyLookup.type'

const { t } = useI18n()

const { isSubmitting, handleSubmit, values, setValues, setFieldValue } = useForm({
  validationSchema: tenantCreateSchema,
  initialValues: {
    country: 'PL',
    vatId: '',
    name: '',
    slug: '',
    regon: '',
    tax_id: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      region: '',
      country: 'PL',
    },
    bankAccount: {
      iban: '',
      bankName: '',
      swift: '',
    },
  },
})

const openSection = ref(['company'])

const isCompanySectionFilled = computed(() => {
  return values.country && values.name && values.name.length > 1
})

const isOtherDetailsSectionFilled = computed(() => {
  return values.email && values.phone && values.website && values.description
})

const isAddressSectionFilled = computed(() => {
  return values.address?.street && values.address.postalCode && values.address.city && values.address.country
})

const isBankSectionFilled = computed(() => {
  return values.bankAccount?.iban && values.bankAccount.bankName
})

const companySectionTitle = computed(() => {
  if (isCompanySectionFilled.value) {
    return `${values.name} (${values.country}${values.vatId ? `, VAT: ${values.vatId}` : ''})`
  }
  return t('tenant.create.companyInfo')
})

const otherDetailsSectionTitle = computed(() => {
  if (isOtherDetailsSectionFilled.value) {
    return `${values.email}, ${values.phone}, ${values.website}`
  }
  return t('tenant.create.otherDetails')
})

const addressSectionTitle = computed(() => {
  if (isAddressSectionFilled.value) {
    return `${values.address?.street}, ${values.address?.city}, ${values.address?.postalCode}`
  }
  return t('tenant.create.address')
})

const bankSectionTitle = computed(() => {
  if (isBankSectionFilled.value) {
    return `${values.bankAccount?.iban} (${values.bankAccount?.bankName})`
  }
  return t('tenant.create.bankAccount')
})

const onCompanyLookup = (company: ICompanyLookupResponse) => {
  setValues({
    country: company.country,
    vatId: company.vatId ?? '',
    name: company.name,
    // ...other fields for later sections
  })
}

const onIbanLookup = (ibanInfo: IIbanInfo) => {
  setValues({
    bankAccount: {
      iban: ibanInfo.iban,
      bankName: ibanInfo.bankName,
      swift: ibanInfo.swift,
    },
  })
}

const goToSection = (section: string) => {
  openSection.value = [section]
}

const onSubmit = handleSubmit(async (formData) => {
  try {
    await tenantService.create(formData)
    // await router.push('/subscribe')
  } catch (error: unknown) {
    handleErrorWithToast('Error creating tenant', error)
  }
})
</script>

<template>
  <GuestLayout>
    <div class="max-w-3xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Create your company
      </h1>
      <form @submit.prevent="onSubmit">
        <Accordion v-model="openSection" type="single" collapsible>
          <AccordionItem value="company">
            <AccordionTrigger class="border bg-white/50 dark:bg-black/50 px-4 -mx-4">
              <span :class="isCompanySectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ companySectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="flex flex-col gap-2 py-2">
                <div class="grid grid-cols-[4rem_1fr] gap-4">
                  <FormField v-slot="{ componentField }" name="country">
                    <FormItem>
                      <FormLabel>{{ t('tenant.fields.country') }}</FormLabel>
                      <FormControl>
                        <CountryPicker
                          v-bind="componentField"
                          :model-value="values.country"
                          class="bg-white/50 dark:bg-black/50"
                          @update:model-value="setFieldValue('country', $event as string)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="vatId">
                    <FormItem>
                      <FormLabel>{{ t('tenant.fields.vatId') }}</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <FormField v-slot="{ componentField }" name="name">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.name') }}</FormLabel>
                    <FormControl>
                      <div class="flex gap-2 items-center">
                        <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                        <CompanyLookupButton :country="values.country" :vat-id="values.vatId" @lookup="onCompanyLookup" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isCompanySectionFilled" @click="goToSection('other')">
                    Next
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="other">
            <AccordionTrigger class="border bg-white/50 dark:bg-black/50 px-4 -mx-4">
              <span :class="isOtherDetailsSectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ otherDetailsSectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Email</label>
                  <Input v-model="values.email" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Phone</label>
                  <Input v-model="values.phone" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Website</label>
                  <Input v-model="values.website" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <Input v-model="values.description" />
                </div>
                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isOtherDetailsSectionFilled" @click="goToSection('address')">
                    Next
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="address">
            <AccordionTrigger class="border bg-white/50 dark:bg-black/50 px-4 -mx-4">
              <span :class="isAddressSectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ addressSectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Street</label>
                  <Input
                    :model-value="values.address?.street"
                    @update:model-value="setFieldValue('address.street', $event as string)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Postal Code</label>
                  <Input
                    :model-value="values.address?.postalCode"
                    @update:model-value="setFieldValue('address.postalCode', $event as string)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">City</label>
                  <Input
                    :model-value="values.address?.city"
                    @update:model-value="setFieldValue('address.city', $event as string)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Region</label>
                  <Input
                    :model-value="values.address?.region"
                    @update:model-value="setFieldValue('address.region', $event as string)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Country</label>
                  <Input
                    :model-value="values.address?.country"
                    @update:model-value="setFieldValue('address.country', $event as string)"
                  />
                </div>
                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isAddressSectionFilled" @click="goToSection('bank')">
                    Next
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="bank">
            <AccordionTrigger class="border bg-white/50 dark:bg-black/50 px-4 -mx-4">
              <span :class="isBankSectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ bankSectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Account Number (IBAN)</label>
                  <div class="flex flex-row gap-2 items-center grow">
                    <Input
                      :model-value="values.bankAccount?.iban"
                      @update:model-value="setFieldValue('bankAccount.iban', $event as string)"
                    />
                    <IbanLookupButton
                      :iban="values.bankAccount?.iban"
                      :country="values.country"
                      class="h-9"
                      @lookup="onIbanLookup"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Bank Name</label>
                  <Input
                    :model-value="values.bankAccount?.bankName"
                    @update:model-value="setFieldValue('bankAccount.bankName', $event as string)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">SWIFT Code</label>
                  <Input
                    :model-value="values.bankAccount?.swift"
                    @update:model-value="setFieldValue('bankAccount.swift', $event as string)"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div class="pt-6 text-right">
          <Button type="submit" :disabled="isSubmitting">
            Create & Continue
          </Button>
        </div>
      </form>
    </div>
  </GuestLayout>
</template>
