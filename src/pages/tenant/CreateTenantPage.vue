<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import Accordion from '@/components/ui/accordion/Accordion.vue'
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue'
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue'
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { tenantService } from '@/domains/tenant/services/TenantService'
import CompanyLookupButton from '@/domains/utils/components/CompanyLookupButton.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ICompanyLookupResponse } from '@/domains/utils/types/companyLookup.type'

const router = useRouter()

const schema = z.object({
  country: z.string().min(2),
  vat_id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  regon: z.string().optional(),
  tax_id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    region: z.string().optional(),
    country: z.string().min(2),
  }),
  bankAccount: z.object({
    iban: z.string().min(10),
    bankName: z.string().min(2),
    swift_code: z.string().optional(),
  }),
})

const { isSubmitting, handleSubmit, values, setFieldValue, setValues, setErrors } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    country: 'PL',
    vat_id: '',
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
      swift_code: '',
    },
  },
})

const openSection = ref(['company']) // Accordion expects array for multiple, string for single

const isCompanySectionFilled = computed(() => {
  return values.country && values.name && values.name.length > 1
})

const companySectionTitle = computed(() => {
  if (isCompanySectionFilled.value) {
    return `${values.name} (${values.country}${values.vat_id ? ', VAT: ' + values.vat_id : ''})`
  }
  return 'Company Info'
})

const onCompanyLookup = (company: ICompanyLookupResponse) => {
  setValues({
    country: company.country,
    vat_id: company.vatId ?? '',
    name: company.name,
    // ...other fields for later sections
  })
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
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Create your company
      </h1>
      <form @submit.prevent="onSubmit">
        <Accordion v-model="openSection" type="single" collapsible>
          <AccordionItem value="company">
            <AccordionTrigger>
              <span :class="isCompanySectionFilled ? 'text-green-600 font-semibold' : ''">
                {{ companySectionTitle }}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div class="space-y-4 py-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Country</label>
                  <Input v-model="values.country" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">VAT ID</label>
                  <div class="flex gap-2 items-center">
                    <Input v-model="values.vat_id" />
                    <CompanyLookupButton :country="values.country" :vat-id="values.vat_id" @lookup="onCompanyLookup" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Company Name</label>
                  <Input v-model="values.name" />
                </div>
                <div class="pt-2 text-right">
                  <Button type="button" :disabled="!isCompanySectionFilled" @click="openSection = []">
                    Next
                  </Button>
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
