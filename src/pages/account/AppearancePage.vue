<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useAccountStore } from '@/domains/account/stores/account.store'

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  density: z.enum(['comfortable', 'compact']),
  colorScheme: z.enum(['default', 'blue', 'green', 'purple']),
})

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form } = useForm({
  validationSchema: toTypedSchema(appearanceSchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.updateSettings(values)
    toast.toast({
      title: 'Success',
      description: 'Appearance settings updated successfully',
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
      theme: store.settings.theme,
      fontSize: 'medium',
      density: 'comfortable',
      colorScheme: 'default',
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
        Appearance
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

          <div class="space-y-2">
            <Label for="fontSize">Font Size</Label>
            <select
              id="fontSize"
              v-model="form.fontSize"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="small">
                Small
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="large">
                Large
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="density">Density</Label>
            <select
              id="density"
              v-model="form.density"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="comfortable">
                Comfortable
              </option>
              <option value="compact">
                Compact
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="colorScheme">Color Scheme</Label>
            <select
              id="colorScheme"
              v-model="form.colorScheme"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="default">
                Default
              </option>
              <option value="blue">
                Blue
              </option>
              <option value="green">
                Green
              </option>
              <option value="purple">
                Purple
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
