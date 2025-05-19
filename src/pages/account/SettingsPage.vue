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

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  twoFactorEnabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
})

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form } = useForm({
  validationSchema: toTypedSchema(settingsSchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.updateSettings(values)
    toast.toast({
      title: 'Success',
      description: 'Settings updated successfully',
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
      twoFactorEnabled: store.settings.twoFactorEnabled,
      theme: store.settings.theme,
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
        Settings
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
              <Label>Two-Factor Authentication</Label>
              <p class="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch v-model="form.twoFactorEnabled" />
          </div>

          <div class="space-y-2">
            <Label for="theme">Theme</Label>
            <select
              id="theme"
              v-model="form.theme"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="light">
                Light
              </option>
              <option value="dark">
                Dark
              </option>
              <option value="system">
                System
              </option>
            </select>
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
