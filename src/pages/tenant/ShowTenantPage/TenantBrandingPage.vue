<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageUploader from '@/components/Inputs/ImageUploader.vue'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormDescription from '@/components/ui/form/FormDescription.vue'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { tenantBrandingService } from '@/domains/tenant/services/TenantBrandingService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ITenant, ITenantBrandingCreate } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const tenantStore = useTenantStore()
const { tenantBranding } = storeToRefs(tenantStore)

const loading = ref(false)

defineProps<{
  tenant?: ITenant
}>()

const { handleSubmit, values, setValues, setFieldValue } = useForm<ITenantBrandingCreate>({
  initialValues: {
    colorPrimary: '',
    colorSecondary: '',
    shortName: '',
    theme: '',
    pdfAccentColor: '',
    emailSignatureHtml: '',
    logo: undefined,
    favicon: undefined,
    customFont: undefined,
    pdfLogo: undefined,
    emailHeaderImage: undefined,
  },
})

const submit = handleSubmit((values) => {
  toast.info('Not implemented', {
    description: JSON.stringify(values),
  })
})

const loadTenantBranding = async () => {
  try {
    tenantBranding.value = await tenantBrandingService.show(tenantStore.tenantId ?? '')
    setValues({
      colorPrimary: tenantBranding.value.colorPrimary,
      colorSecondary: tenantBranding.value.colorSecondary,
      shortName: tenantBranding.value.shortName,
      theme: tenantBranding.value.theme,
      pdfAccentColor: tenantBranding.value.pdfAccentColor,
      emailSignatureHtml: tenantBranding.value.emailSignatureHtml,
      logo: tenantBranding.value.logo,
      favicon: tenantBranding.value.favicon,
      customFont: tenantBranding.value.customFont,
      pdfLogo: tenantBranding.value.pdfLogo,
      emailHeaderImage: tenantBranding.value.emailHeaderImage,
    })
  } catch (error) {
    handleErrorWithToast('tenant.branding.show.error', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTenantBranding()
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="$t('tenant.branding.title')" />

    <form class="grid grid-cols-1 gap-4 mt-4" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="shortName">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-md">
              {{ t('tenant.branding.fields.shortName') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-full" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <div />

        <FormField v-slot="{ componentField }" name="colorPrimary">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.branding.fields.colorPrimary') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="color" class="w-20" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="colorSecondary">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.branding.fields.colorSecondary') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="color" class="w-20" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="theme">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.branding.fields.theme') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-20" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="pdfAccentColor">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.branding.fields.pdfAccentColor') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="color" class="w-20" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="emailSignatureHtml">
        <FormItem>
          <FormLabel>
            {{ t('tenant.branding.fields.emailSignatureHtml') }}
          </FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="logo">
          <FormItem>
            <FormLabel>
              {{ t('tenant.branding.fields.logo') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.logo"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('logo', $event)"
            />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="favicon">
          <FormItem>
            <FormLabel>
              {{ t('tenant.branding.fields.favicon') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.favicon"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('favicon', $event)"
            />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="pdfLogo">
          <FormItem>
            <FormLabel>
              {{ t('tenant.branding.fields.pdfLogo') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.pdfLogo"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('pdfLogo', $event)"
            />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="emailHeaderImage">
          <FormItem>
            <FormLabel>
              {{ t('tenant.branding.fields.emailHeaderImage') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.emailHeaderImage"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('emailHeaderImage', $event)"
            />
          </FormItem>
        </FormField>
      </div>

      <div class="col-span-full">
        <Button type="submit" class="w-full">
          {{ $t('settings.save') }}
        </Button>
      </div>
    </form>
  </div>
</template>
