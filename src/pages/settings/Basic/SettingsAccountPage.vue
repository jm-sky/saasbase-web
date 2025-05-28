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
import SettingsHeader from '../partials/SettingsHeader.vue'
import SocialSignInItem from './partials/SocialSignInItem.vue'

const router = useRouter()
const authStore = useAuthStore()

const accountFormSchema = toTypedSchema(z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  phone: z
    .string()
    .optional()
    .transform(val => val ? val.replace(/\D/g, '') : null)
    .pipe(z.string().min(10, { message: 'Phone number must be at least 10 digits.' })),
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
    <FormField v-slot="{ componentField }" name="email">
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

    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Phone</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Your phone number"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          This is the phone number used to login to application
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit" disabled>
        Update account
      </Button>
    </div>
  </Form>

  <Separator class="my-6" />

  <SettingsHeader title="Two-Factor Authentication" description="Add an extra layer of security to your account by enabling two-factor authentication." />

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

  <Separator class="my-6" />

  <SettingsHeader title="Password" description="Change your password." work-in-progress />

  <form class="flex flex-col items-center gap-4">
    <Input type="password" placeholder="Current password" />
    <Input type="password" placeholder="New password" />
    <Input type="password" placeholder="Confirm new password" />
    <Button>
      {{ 'Change password' }}
    </Button>
  </form>


  <Separator class="my-6" />

  <SettingsHeader title="Social sign-in" description="Connect your account to social media accounts." work-in-progress />

  <div class="grid gap-5 mb-7">
    <SocialSignInItem
      provider="Google"
      :email="authStore.userData?.email ?? ''"
      is-enabled
      image="/assets/media/brand-logos/google.svg"
    />
    <SocialSignInItem
      provider="GitHub"
      :email="authStore.userData?.email ?? ''"
      is-enabled
      image="/assets/media/brand-logos/github.svg"
    />
    <SocialSignInItem
      provider="Linkedin"
      :email="authStore.userData?.email ?? ''"
      disabled
      image="/assets/media/brand-logos/linkedin.svg"
    />
  </div>
</template>
