<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { h, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { mfaService } from '@/domains/auth/services/mfaService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'
import SettingsHeader from './partials/SettingsHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

const accountFormSchema = toTypedSchema(z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
}))

const refreshUserData = async () => {
  const userData = await authService.getMe()
  authStore.setUser(userData)
}

const onSubmit = async (values: unknown) => {
  await nextTick()
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
}

const handleSetup2FA = async () => {
  await router.push({ name: routeMap.settings.mfaSetup})
}

const disable2faLoading = ref(false)

const disable2fa = async () => {
  try {
    disable2faLoading.value = true
    await mfaService.disable2fa()
    await refreshUserData()
    toast.success('Two-factor authentication disabled')
  } catch {
    toast.error('Failed to disable two-factor authentication')
  } finally {
    disable2faLoading.value = false
  }
}

onMounted(async () => {
  await refreshUserData()
})
</script>

<template>
  <SettingsHeader title="Account" description="Update your account settings. Set your preferred language and timezone." />

  <Separator />

  <Form
    :validation-schema="accountFormSchema"
    :initial-values="{ ...authStore.userData }"
    class="space-y-8"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      name="email"
    >
      <FormItem>
        <FormLabel>E-mail</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Your e-mail address"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          This is the e-mail used to login to application
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update account
      </Button>
    </div>
  </Form>

  <Separator class="my-6" />

  <div class="space-y-4">
    <div>
      <h4 class="text-sm font-medium">
        Two-Factor Authentication
      </h4>
      <p class="text-sm text-muted-foreground">
        Add an extra layer of security to your account by enabling two-factor authentication.
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <template v-if="authStore.userData?.isTwoFactorEnabled">
        <Button variant="destructive" :loading="disable2faLoading" @click="disable2fa">
          {{ 'Disable 2FA' }}
        </Button>
        <span class="text-sm text-muted-foreground">
          ✓ Two-factor authentication is enabled
        </span>
      </template>
      <template v-else>
        <Button variant="default" @click="handleSetup2FA">
          {{ 'Enable 2FA' }}
        </Button>
      </template>
    </div>
  </div>
</template>
