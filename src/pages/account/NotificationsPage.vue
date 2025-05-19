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

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  productUpdates: z.boolean(),
  newFeatures: z.boolean(),
  tipsAndTricks: z.boolean(),
})

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form } = useForm({
  validationSchema: toTypedSchema(notificationsSchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.updateSettings(values)
    toast.toast({
      title: 'Success',
      description: 'Notification preferences updated successfully',
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
      emailNotifications: store.settings.emailNotifications,
      marketingEmails: store.settings.marketingEmails,
      securityAlerts: store.settings.securityAlerts,
      productUpdates: true,
      newFeatures: true,
      tipsAndTricks: true,
    })
  }
}

onMounted(async () => {
  if (!store.isSettingsLoaded) {
    await store.fetchSettings()
  }
  handleReset()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Notifications
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
              <Label>Email Notifications</Label>
              <p class="text-sm text-muted-foreground">
                Receive email notifications about your account activity
              </p>
            </div>
            <Switch v-model="form.emailNotifications" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p class="text-sm text-muted-foreground">
                Receive emails about new features and promotions
              </p>
            </div>
            <Switch v-model="form.marketingEmails" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Security Alerts</Label>
              <p class="text-sm text-muted-foreground">
                Get notified about suspicious activity
              </p>
            </div>
            <Switch v-model="form.securityAlerts" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Product Updates</Label>
              <p class="text-sm text-muted-foreground">
                Stay informed about product updates and improvements
              </p>
            </div>
            <Switch v-model="form.productUpdates" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>New Features</Label>
              <p class="text-sm text-muted-foreground">
                Learn about new features as they're released
              </p>
            </div>
            <Switch v-model="form.newFeatures" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Tips and Tricks</Label>
              <p class="text-sm text-muted-foreground">
                Get helpful tips to make the most of the platform
              </p>
            </div>
            <Switch v-model="form.tipsAndTricks" />
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
  </div>
</template>
