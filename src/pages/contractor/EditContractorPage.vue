<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import FormDescription from '@/components/ui/form/FormDescription.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import ContractorSidebar from '@/domains/contractor/components/ContractorSidebar.vue'
import ContractorTypePicker from '@/domains/contractor/components/ContractorTypePicker.vue'
import { useUpdateContractor } from '@/domains/contractor/composables/useContractorMutations'
import { useContractor } from '@/domains/contractor/composables/useContractorQueries'
import { useContractorStore } from '@/domains/contractor/store/contractor.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorUpdate } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const contractorId = route.params.id as string
const contractorStore = useContractorStore()
const { contractor: storeContractor } = storeToRefs(contractorStore)

const { data: contractor, isPending: loading, refetch } = useContractor(contractorId)

const isMobile = useMediaQuery('(max-width: 767px)')

const { mutateAsync: updateContractor, isPending: isMutating } = useUpdateContractor()

const { isSubmitting, handleSubmit, setValues, setFieldValue, setErrors, resetForm } = useForm<IContractorUpdate>({
  initialValues: {
    contractor: {
      name: '',
      type: 'company',
      description: '',
      taxId: '',
      email: '',
      phone: '',
      website: '',
      isSupplier: true,
      isBuyer: true,
    },
    options: {
      fetchLogo: true,
    },
  },
})

watch(contractor, (value) => {
  if (!value) return
  contractorStore.setContractor(value)
  setValues({ contractor: value })
}, { immediate: true })

const displayContractor = computed(() => contractor.value ?? storeContractor.value)

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateContractor({ id: contractorId, data: values })
    toast.success(t('contractor.edit.success'))
    resetForm()
    await router.push({ name: 'showContractor', params: { id: contractorId } })
  } catch (error: unknown) {
    console.error('[EditContractorPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contractor.edit.error'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('contractor.contractorDetails')"
      :back-link="'/contractors'"
      :name="displayContractor?.name"
      :email="displayContractor?.email"
      :logo="displayContractor?.logoUrl"
      :show-sidebar="!isMobile"
      :loading
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('contractor.title') }}
      </template>

      <template #actions-right>
        <ButtonLink variant="outline" :to="`/contractors/${contractorId}/show`">
          {{ t('common.back') }}
        </ButtonLink>
      </template>

      <template #sidebar>
        <ContractorSidebar :contractor-id="contractorId" :contractor="displayContractor" />
      </template>

      <template #content>
        <h1 class="text-2xl font-semibold tracking-tight text-center">
          {{ t('contractor.edit.title') }}
        </h1>

        <div class="p-6 md:p-8 border rounded-md shadow-lg">
          <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="contractor.name"
              :label="t('contractor.fields.name')"
              :disabled="isSubmitting || isMutating"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              name="contractor.type"
              :label="t('contractor.fields.type')"
              :disabled="isSubmitting || isMutating"
            >
              <ContractorTypePicker
                :model-value="displayContractor?.type ?? 'company'"
                class="bg-white/50 dark:bg-black/50"
                @update:model-value="setFieldValue('contractor.type', $event)"
              />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="contractor.description"
              :label="t('contractor.fields.description')"
              :disabled="isSubmitting || isMutating"
            >
              <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div class="flex flex-col gap-2">
                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.vatId"
                  :label="t('contractor.fields.vatId')"
                  :disabled="isSubmitting || isMutating"
                >
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                </FormFieldLabeled>
                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.taxId"
                  :label="t('contractor.fields.taxId')"
                  :disabled="isSubmitting || isMutating"
                >
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                </FormFieldLabeled>
                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.regon"
                  :label="t('contractor.fields.regon')"
                  :disabled="isSubmitting || isMutating"
                >
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                </FormFieldLabeled>
              </div>

              <div class="flex flex-col gap-2">
                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.email"
                  :label="t('contractor.fields.email')"
                  :disabled="isSubmitting || isMutating"
                >
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                </FormFieldLabeled>

                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.phone"
                  :label="t('contractor.fields.phone')"
                  :disabled="isSubmitting || isMutating"
                >
                  <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
                </FormFieldLabeled>

                <FormFieldLabeled
                  v-slot="{ componentField }"
                  name="contractor.website"
                  :label="t('contractor.fields.website')"
                  :disabled="isSubmitting || isMutating"
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
              :disabled="isSubmitting || isMutating"
              class="grid grid-cols-2 gap-2"
            >
              <Switch type="checkbox" v-bind="componentField" />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="contractor.isBuyer"
              :label="t('contractor.fields.isBuyer')"
              :disabled="isSubmitting || isMutating"
              class="grid grid-cols-2 gap-2"
            >
              <Switch type="checkbox" v-bind="componentField" />
            </FormFieldLabeled>

            <Separator class="my-2" />

            <div class="col-span-2 flex flex-col gap-2">
              <Button type="submit" :disabled="isSubmitting || isMutating" class="w-full">
                {{ t('common.save') }}
              </Button>
              <Button
                type="button"
                variant="outline"
                :disabled="isSubmitting || isMutating"
                class="w-full"
                @click="resetForm"
              >
                {{ t('common.reset') }}
              </Button>
            </div>

            <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <div class="col-span-full font-semibold mt-2 mb-2">
                {{ t('common.options') }}
              </div>
              <FormFieldLabeled
                v-slot="{ value, handleChange }"
                name="options.fetchLogo"
                :label="t('contractor.add.fetchLogo')"
                :disabled="isSubmitting || isMutating"
                class="flex flex-col gap-2"
              >
                <Switch :model-value="value" @update:model-value="handleChange" />
                <FormDescription>
                  {{ t('contractor.add.fetchLogoDescription') }}
                </FormDescription>
              </FormFieldLabeled>
            </div>
          </form>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
