<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
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
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { tenantCreateSchema } from '@/domains/tenant/validation/tenant.schema'
import CompanyLookupButton from '@/domains/utils/components/CompanyLookupButton.vue'
import IbanLookupButton from '@/domains/utils/components/IbanLookupButton.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IIbanInfo } from '@/domains/utils/services/IbanInfoService'
import type { ICompanyLookupResponse } from '@/domains/utils/types/companyLookup.type'

const { t } = useI18n()
const router = useRouter()

const { isSubmitting, handleSubmit, values, setValues, setFieldValue } = useForm({
  validationSchema: tenantCreateSchema,
  initialValues: {
    tenant: {
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
    },
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
  keepValuesOnUnmount: true,
})

const openSection = ref('company')

const isCompanySectionFilled = computed<boolean>(() => {
  return !!(values.tenant.country && values.tenant.name && values.tenant.name.length > 1)
})

const isOtherDetailsSectionFilled = computed<boolean>(() => {
  return !!(values.tenant.email && values.tenant.phone && values.tenant.website && values.tenant.description)
})

const isAddressSectionFilled = computed<boolean>(() => {
  return !!(values.address?.street && values.address.postalCode && values.address.city && values.address.country)
})

const isBankSectionFilled = computed<boolean>(() => {
  return values.bankAccount?.iban && values.bankAccount.bankName
})

const companySectionTitle = computed(() => {
  if (isCompanySectionFilled.value) {
    return `${values.tenant.name}`
  }
  return t('tenant.create.companyInfo')
})

const otherDetailsSectionTitle = computed(() => {
  if (isOtherDetailsSectionFilled.value) {
    return `${values.tenant.email}, ${values.tenant.phone}, ${values.tenant.website}`
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
    return values.bankAccount?.iban ?? ''
  }
  return t('tenant.create.bankAccount')
})

const slugify = (value: string) => {
  return value.toLowerCase().replace(/ /g, '-')
}

const onTenantNameChange = (value: string) => {
  setFieldValue('tenant.slug', slugify(value))
}

const onCompanyLookup = (company: ICompanyLookupResponse) => {
  setValues({
    tenant: {
      country: company.country,
      vatId: company.vatId ?? values.vatId,
      name: company.name,
      slug: slugify(company.name),
    },
    bankAccount: {
      iban: company.bankAccount?.iban ?? values.bankAccount?.iban,
      bankName: company.bankAccount?.bankName ?? values.bankAccount?.bankName,
      swift: company.bankAccount?.swift ?? values.bankAccount?.swift,
    },
    address: {
      street: company.address?.street ?? values.address?.street,
      postalCode: company.address?.postalCode ?? values.address?.postalCode,
      city: company.address?.city ?? values.address?.city,
      country: company.address?.country ?? values.address?.country,
    },
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
  openSection.value = section
}

const onSubmit = handleSubmit(async (formData) => {
  try {
    await tenantService.create(formData)
    toast.success(t('tenant.create.success'))
    await router.push('/tenants/welcome')
  } catch (error: unknown) {
    handleErrorWithToast(t('tenant.create.error'), error)
  }
})
</script>

<template>
  <GuestLayout>
    <div class="min-w-sm max-w-3xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">
        {{ t('tenant.create.title') }}
      </h1>
      <form @submit.prevent="onSubmit">
        <Accordion
          v-model="openSection"
          type="single"
          class="space-y-1"
          collapsible
        >
          <AccordionItem value="company" class="border-b-0">
            <AccordionTrigger
              class="border bg-white/50 dark:bg-black/50 px-4 -mx-4"
              :success="isCompanySectionFilled"
            >
              {{ companySectionTitle }}
            </AccordionTrigger>
            <AccordionContent>
              <div class="flex flex-col gap-2 py-2">
                <div class="grid grid-cols-[4rem_1fr] gap-4">
                  <FormField v-slot="{ componentField }" name="tenant.country">
                    <FormItem>
                      <FormLabel>{{ t('tenant.fields.country') }}</FormLabel>
                      <FormControl>
                        <CountryPicker
                          v-bind="componentField"
                          :model-value="values.tenant.country"
                          placeholder="-"
                          class="bg-white/50 dark:bg-black/50"
                          @update:model-value="setFieldValue('tenant.country', $event as string)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="tenant.vatId">
                    <FormItem>
                      <FormLabel>{{ t('tenant.fields.vatId') }}</FormLabel>
                      <FormControl>
                        <div class="flex gap-2 items-center">
                          <Input v-bind="componentField" variant="filled" />
                          <CompanyLookupButton :country="values.tenant.country" :vat-id="values.tenant.vatId" @lookup="onCompanyLookup" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <FormField v-slot="{ componentField }" name="tenant.name">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.name') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" @update:model-value="onTenantNameChange($event as string)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="tenant.slug">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.slug') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isCompanySectionFilled" @click="goToSection('other')">
                    {{ t('common.next') }}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="other" class="border-b-0">
            <AccordionTrigger
              class="border bg-white/50 dark:bg-black/50 px-4 -mx-4"
              :success="isOtherDetailsSectionFilled"
            >
              {{ otherDetailsSectionTitle }}
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <FormField v-slot="{ componentField }" name="tenant.email">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.email') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="tenant.phone">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.phone') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="tenant.website">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.website') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="tenant.description">
                  <FormItem>
                    <FormLabel>{{ t('tenant.fields.description') }}</FormLabel>
                    <FormControl>
                      <Textarea v-bind="componentField" variant="filled" class="bg-white/50 dark:bg-black/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isOtherDetailsSectionFilled" @click="goToSection('address')">
                    {{ t('common.next') }}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="address" class="border-b-0">
            <AccordionTrigger
              class="border bg-white/50 dark:bg-black/50 px-4 -mx-4"
              :success="isAddressSectionFilled"
            >
              {{ addressSectionTitle }}
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <FormField v-slot="{ componentField }" name="address.country">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.country') }}</FormLabel>
                    <FormControl>
                      <CountryPicker
                        v-bind="componentField"
                        :model-value="values.address?.country"
                        placeholder="-"
                        class="bg-white/50 dark:bg-black/50"
                        @update:model-value="setFieldValue('address.country', $event as string)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address.postalCode">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.postalCode') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address.city">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.city') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address.street">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.street') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address.building">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.building') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address.flat">
                  <FormItem>
                    <FormLabel>{{ t('address.fields.flat') }}</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" variant="filled" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isAddressSectionFilled" @click="goToSection('bank')">
                    {{ t('common.next') }}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bank" class="border-b-0">
            <AccordionTrigger class="border bg-white/50 dark:bg-black/50 px-4 -mx-4">
              <span :class="isBankSectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ bankSectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <FormField v-slot="{ componentField }" name="bankAccount.iban">
                  <FormItem>
                    <FormLabel>{{ t('bankAccount.fields.iban') }}</FormLabel>
                    <FormControl>
                      <div class="flex flex-row gap-2 items-center grow">
                        <Input v-bind="componentField" variant="filled" />
                        <IbanLookupButton
                          :iban="values.bankAccount?.iban"
                          :country="values.tenant.country"
                          class="h-9"
                          @lookup="onIbanLookup"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="bankAccount.bankName">
                  <FormItem>
                    <FormLabel>{{ t('bankAccount.fields.bankName') }}</FormLabel>
                    <FormControl>
                      <div class="flex flex-row gap-2 items-center grow">
                        <Input v-bind="componentField" variant="filled" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="bankAccount.swift">
                  <FormItem>
                    <FormLabel>{{ t('bankAccount.fields.swift') }}</FormLabel>
                    <FormControl>
                      <div class="flex flex-row gap-2 items-center grow">
                        <Input v-bind="componentField" variant="filled" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
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
