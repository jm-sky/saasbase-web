<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/toast'
import { useAccountStore } from '@/domains/account/stores/account.store'

const privacySchema = z.object({
  dataCollection: z.boolean(),
  analytics: z.boolean(),
  marketingEmails: z.boolean(),
  thirdPartySharing: z.boolean(),
  personalizedAds: z.boolean(),
  locationTracking: z.boolean(),
})

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form } = useForm({
  validationSchema: toTypedSchema(privacySchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.updateSettings(values)
    toast.toast({
      title: 'Success',
      description: 'Privacy settings updated successfully',
      variant: 'success',
    })
  } catch {
    // Error is already handled by the service
  } finally {
    loading.value = false
  }
})

const handleReset = () => {
  if (store.settings) {
    setValues({
      dataCollection: store.settings.dataCollection,
      analytics: store.settings.analytics,
      marketingEmails: store.settings.marketingEmails,
      thirdPartySharing: store.settings.thirdPartySharing,
      personalizedAds: store.settings.personalizedAds,
      locationTracking: store.settings.locationTracking,
    })
  }
}

onMounted(async () => {
  if (!store.isSettingsLoaded) {
    loading.value = true
    try {
      await store.fetchSettings()
    } catch {
      // Error is already handled by the service
    } finally {
      loading.value = false
    }
  }
  handleReset()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Privacy Settings
      </h2>
      <Button
        variant="outline"
        class="metronic-primary-outline"
        @click="handleReset"
      >
        Reset
      </Button>
    </div>

    <div class="card">
      <form class="space-y-6 p-6" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Data Collection</Label>
              <p class="text-sm text-muted-foreground">
                Allow us to collect and process your data to improve our services
              </p>
            </div>
            <Switch v-model="form.dataCollection" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Analytics</Label>
              <p class="text-sm text-muted-foreground">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <Switch v-model="form.analytics" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Marketing Communications</Label>
              <p class="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch v-model="form.marketingEmails" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Third-Party Sharing</Label>
              <p class="text-sm text-muted-foreground">
                Allow sharing of your data with trusted partners
              </p>
            </div>
            <Switch v-model="form.thirdPartySharing" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Personalized Ads</Label>
              <p class="text-sm text-muted-foreground">
                Show ads based on your interests and preferences
              </p>
            </div>
            <Switch v-model="form.personalizedAds" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Location Tracking</Label>
              <p class="text-sm text-muted-foreground">
                Allow us to use your location for better service
              </p>
            </div>
            <Switch v-model="form.locationTracking" />
          </div>
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            :disabled="loading"
            class="metronic-primary"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin">⟳</span>
            Save Changes
          </Button>
        </div>
      </form>
    </div>

    <div class="card p-6">
      <h3 class="text-lg font-semibold mb-4">
        Your Data Rights
      </h3>
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          You have the right to:
        </p>
        <ul class="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Data portability</li>
          <li>Withdraw consent</li>
        </ul>
        <p class="text-sm text-muted-foreground">
          To exercise any of these rights, please contact our support team.
        </p>
      </div>
    </div>
  </div>
</template>
