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
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { tenantPublicProfileService } from '@/domains/tenant/services/TenantPublicProfileService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ITenant, ITenantPublicProfileCreate } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const tenantStore = useTenantStore()
const { tenantPublicProfile } = storeToRefs(tenantStore)

const loading = ref(false)

defineProps<{
  tenant?: ITenant
}>()

const { handleSubmit, values, setValues, setFieldValue } = useForm<ITenantPublicProfileCreate>({
  initialValues: {
    publicName: tenantPublicProfile.value?.publicName,
    description: tenantPublicProfile.value?.description,
    websiteUrl: tenantPublicProfile.value?.websiteUrl,
    socialLinks: tenantPublicProfile.value?.socialLinks,
    visible: tenantPublicProfile.value?.visible,
    industry: tenantPublicProfile.value?.industry,
    locationCity: tenantPublicProfile.value?.locationCity,
    locationCountry: tenantPublicProfile.value?.locationCountry,
    address: tenantPublicProfile.value?.address,
  },
})

const submit = handleSubmit((values) => {
  toast.info('Not implemented', {
    description: JSON.stringify(values),
  })
})

const loadTenantPublicProfile = async () => {
  try {
    tenantPublicProfile.value = await tenantPublicProfileService.show(tenantStore.tenantId ?? '')
    setValues({
      publicName: tenantPublicProfile.value.publicName,
      description: tenantPublicProfile.value.description,
      websiteUrl: tenantPublicProfile.value.websiteUrl,
      socialLinks: tenantPublicProfile.value.socialLinks,
      visible: tenantPublicProfile.value.visible,
      industry: tenantPublicProfile.value.industry,
      locationCity: tenantPublicProfile.value.locationCity,
      locationCountry: tenantPublicProfile.value.locationCountry,
      address: tenantPublicProfile.value.address,
    })
  } catch (error) {
    handleErrorWithToast('tenant.publicProfile.show.error', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTenantPublicProfile()
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="$t('tenant.publicProfile.title')" />

    <form class="grid grid-cols-1 gap-4 mt-4" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="visible">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.publicProfile.fields.visible') }}
            </FormLabel>
            <FormControl>
              <Switch v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <div />

        <FormField v-slot="{ componentField }" name="publicName">
          <FormItem class="col-span-full">
            <FormLabel>
              {{ t('tenant.publicProfile.fields.publicName') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="websiteUrl">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.publicProfile.fields.websiteUrl') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-60" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="industry">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.publicProfile.fields.industry') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-60" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="locationCity">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.publicProfile.fields.locationCity') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-60" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="locationCountry">
          <FormItem class="flex flex-row items-center gap-1">
            <FormLabel class="w-full">
              {{ t('tenant.publicProfile.fields.locationCountry') }}
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" class="w-60" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>
            {{ t('tenant.publicProfile.fields.description') }}
          </FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="publicLogo">
          <FormItem>
            <FormLabel>
              {{ t('tenant.publicProfile.fields.publicLogo') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.publicLogo"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('publicLogo', $event)"
            />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="bannerImage">
          <FormItem>
            <FormLabel>
              {{ t('tenant.publicProfile.fields.bannerImage') }}
            </FormLabel>
            <ImageUploader
              :model-value="values.bannerImage"
              :name="componentField.name"
              class="h-50"
              @update:model-value="setFieldValue('bannerImage', $event)"
            />
          </FormItem>
        </FormField>
      </div>

      <div class="col-span-full">
        <Button type="submit" class="w-full">
          {{ $t('tenant.publicProfile.save') }}
        </Button>
      </div>
    </form>
  </div>
</template>
