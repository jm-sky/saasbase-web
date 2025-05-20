<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import FormFieldLabeledLeft from '@/components/Form/FormFieldLabeledLeft.vue'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { useAccountStore } from '@/domains/account/stores/account.store'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const authStore = useAuthStore()
const store = useAccountStore()
const toast = useToast()

const loading = ref(false)

const formValues = ref({
  availability: true,
  emailActive: true,
  emailPrimary: false,
  googleEnabled: true,
  linkedinEnabled: false,
  smsEnabled: true,
  totpEnabled: false,
  ssoOption: '2', // Google is selected by default
  openTasks: '1', // Modal is selected by default
  showListNames: false,
  showLinkedTaskNames: true,
  emailVisibility: true,
  transparentSidebar: true,
  desktopNotification: '2', // Direct @mentions is selected by default
  emailNotification: '2', // Unread messages is selected by default
  autoSubscribe: false,
  googleWebdev: true,
  equacoin: false,
  evernote: true,
  inferno: true,
  jira: false,
  deleteAccount: false,
  notifications: [],
})

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  twoFactorEnabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
})

const { handleSubmit, setValues } = useForm({
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
  <div class="kt-card flex flex-col grow rounded-lg bg-card pb-2.5">
    <div id="basic_settings" class="kt-card-header flex items-center border-b min-h-12">
      <h3 class="kt-card-title font-semibold">
        Basic Settings
      </h3>
    </div>
    <form class="kt-card-content grid gap-5" @submit="onSubmit">
      <div class="flex items-center flex-wrap gap-2.5">
        <label class="kt-form-label w-full max-w-56">
          Photo
        </label>
        <div class="flex items-center justify-between flex-wrap grow gap-2.5">
          <span class="text-sm text-secondary-foreground">
            150x150px JPEG, PNG Image
          </span>
          <AvatarUploader :model-id="authStore.user?.id ?? ''" :avatar="authStore.user?.avatarUrl ?? ''" />
        </div>
      </div>
      <FormFieldLabeledLeft name="name" label="Name">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="Jason Tatum" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="company" label="Company">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="KeenThemes" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="phone" label="Phone number">
        <template #default="{ componentField }">
          <Input v-bind="componentField" placeholder="Enter phone" />
        </template>
      </FormFieldLabeledLeft>
      <div class="flex items-center flex-wrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Visibility
        </label>
        <div class="grow">
          <select class="kt-select">
            <option>
              Public
            </option>
            <option>
              Option 2
            </option>
            <option>
              Option 3
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center flex-wrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Avaibality
        </label>
        <div class="grow">
          <label class="kt-label">
            Available to hir
            <input
              v-model="formValues.availability"
              class="kt-switch"
              type="checkbox"
              value="1"
            >
          </label>
        </div>
      </div>
      <div class="flex justify-end pt-2.5">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  </div>
  <div class="kt-card pb-2.5">
    <div id="auth_email" class="kt-card-header">
      <h3 class="kt-card-title">
        Email
      </h3>
    </div>
    <div class="kt-card-content grid gap-5 pt-7.5">
      <FormFieldLabeledLeft name="email" label="Email">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="jason@studio.io" />
        </template>
      </FormFieldLabeledLeft>
      <div class="flex items-center gap-7.5">
        <label class="kt-label">
          Active
          <input
            v-model="formValues.emailActive"
            class="kt-switch"
            type="checkbox"
            value="1"
          >
        </label>
        <label class="kt-label">
          Primary
          <input
            v-model="formValues.emailPrimary"
            class="kt-switch"
            type="checkbox"
            value="2"
          >
        </label>
      </div>
      <span class="kt-form-description text-2sm">
        Input your email, designate as primary for priority updates. Toggle to seamlessly customize
        <br>
        your communication preferences
      </span>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="auth_social_sign_in" class="kt-card-header">
      <h3 class="kt-card-title">
        Social Sign in
      </h3>
    </div>
    <div class="kt-card-content">
      <div class="grid gap-5 mb-7">
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-6 shrink-0" src="/assets/media/brand-logos/google.svg">
            <div class="flex flex-col gap-0.5">
              <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                Google
              </a>
              <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                jasontatum@ktstudio.io
              </a>
            </div>
          </div>
          <div class="flex items-center gap-5">
            <label class="kt-label">
              <input
                v-model="formValues.googleEnabled"
                class="kt-switch kt-switch-sm"
                name="check"
                type="checkbox"
                value="1"
              >
            </label>
            <div class="kt-btn kt-btn-sm kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-trash" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-6 shrink-0" src="/assets/media/brand-logos/linkedin.svg">
            <div class="flex flex-col gap-0.5">
              <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                Linkedin
              </a>
              <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                jasontt@keenthemes.co
              </a>
            </div>
          </div>
          <div class="flex items-center gap-5">
            <label class="kt-label">
              <input
                v-model="formValues.linkedinEnabled"
                class="kt-switch kt-switch-sm"
                name="check"
                type="checkbox"
                value="1"
              >
            </label>
            <div class="kt-btn kt-btn-sm kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-trash" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2.5 mb-5">
        <div class="text-base font-medium text-mono">
          More Social Sign in options
        </div>
        <div class="kt-form-description text-2sm">
          Effortless access awaits! Connect seamlessly with your preferred social account.
        </div>
      </div>
      <div class="flex items-center flex-wrap gap-2.5 mb-7.5">
        <a class="kt-btn kt-btn-outline" href="#">
          <img alt="" class="dark:hidden size-5" src="/assets/media/brand-logos/apple-black.svg">
          <img alt="" class="light:hidden size-5" src="/assets/media/brand-logos/apple-white.svg">
          Sign in with Apple
        </a>
        <a class="kt-btn kt-btn-outline" href="#">
          <img alt="" class="size-5" src="/assets/media/brand-logos/microsoft-5.svg">
          Sign in with Microsoft
        </a>
        <a class="kt-btn kt-btn-outline" href="#">
          <img alt="" class="size-5" src="/assets/media/brand-logos/facebook.svg">
          Sign in with Facebook
        </a>
      </div>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="auth_two_factor" class="kt-card-header">
      <h3 class="kt-card-title">
        Two-Factor authentication(2FA)
      </h3>
      <div class="kt-menu" data-kt-menu="true">
        <div
          class="kt-menu-item"
          data-kt-menu-item-offset="0, 10px"
          data-kt-menu-item-placement="bottom-end"
          data-kt-menu-item-placement-rtl="bottom-start"
          data-kt-menu-item-toggle="dropdown"
          data-kt-menu-item-trigger="click"
        >
          <Button class="kt-menu-toggle kt-btn kt-btn-sm kt-btn-icon kt-btn-ghost">
            <i class="ki-filled ki-dots-vertical text-lg" />
          </Button>
          <div class="kt-menu-dropdown kt-menu-default w-full max-w-[200px]" data-kt-menu-dismiss="true">
            <div class="kt-menu-item">
              <a class="kt-menu-link" href="html/demo1/account/home/settings-enterprise.html">
                <span class="kt-menu-icon">
                  <i class="ki-filled ki-setting-3" />
                </span>
                <span class="kt-menu-title">
                  Settings
                </span>
              </a>
            </div>
            <div class="kt-menu-item">
              <a class="kt-menu-link" href="html/demo1/account/members/import-members.html">
                <span class="kt-menu-icon">
                  <i class="ki-filled ki-some-files" />
                </span>
                <span class="kt-menu-title">
                  Import
                </span>
              </a>
            </div>
            <div class="kt-menu-item">
              <a class="kt-menu-link" href="html/demo1/account/activity.html">
                <span class="kt-menu-icon">
                  <i class="ki-filled ki-cloud-change" />
                </span>
                <span class="kt-menu-title">
                  Activity
                </span>
              </a>
            </div>
            <div class="kt-menu-item">
              <a class="kt-menu-link" data-kt-modal-toggle="#report_user_modal" href="#">
                <span class="kt-menu-icon">
                  <i class="ki-filled ki-dislike" />
                </span>
                <span class="kt-menu-title">
                  Report
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="kt-card-content">
      <div class="grid gap-5 mb-7">
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <div class="flex items-center">
              <div class="relative size-[50px] shrink-0">
                <svg
                  class="w-full h-full stroke-border fill-muted/30"
                  fill="none"
                  height="48"
                  viewbox="0 0 44 48"
                  width="44"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
    18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
    39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                    fill=""
                  />
                  <path
                    d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506
    18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937
    39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                    stroke=""
                  />
                </svg>
                <div class="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
                  <i class="ki-filled ki-message-text-2 text-xl text-muted-foreground" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-px">
              <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                Text Message (SMS)
              </a>
              <span class="text-sm font-medium text-secondary-foreground">
                Instant codes for secure account verification.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-6">
            <label class="kt-label">
              Public Profile
              <input
                v-model="formValues.smsEnabled"
                class="kt-switch kt-switch-sm"
                name="check"
                type="checkbox"
                value="1"
              >
            </label>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <div class="flex items-center">
              <div class="relative size-[50px] shrink-0">
                <svg
                  class="w-full h-full stroke-border fill-muted/30"
                  fill="none"
                  height="48"
                  viewbox="0 0 44 48"
                  width="44"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
    18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
    39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                    fill=""
                  />
                  <path
                    d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506
    18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937
    39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                    stroke=""
                  />
                </svg>
                <div class="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
                  <i class="ki-filled ki-shield-tick text-xl text-muted-foreground" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-px">
              <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                Authenticator App (TOTP)
              </a>
              <span class="text-sm font-medium text-secondary-foreground">
                Elevate protection with an authenticator app for two-factor authentication.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-6">
            <label class="kt-label">
              Public Profile
              <input
                v-model="formValues.totpEnabled"
                class="kt-switch kt-switch-sm"
                name="check"
                type="checkbox"
                value="1"
              >
            </label>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-7">
          <label class="kt-form-label max-w-56">
            Password
          </label>
          <div class="flex flex-col tems-start grow gap-3 w-full">
            <input class="kt-input" placeholder="Enter password" type="text">
            <span class="kt-form-description text-2sm">
              Enter your password to setup Two-Factor authentication
            </span>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-2.5">
        <Button variant="primary">
          Setup
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="auth_social_sign_in_sso" class="kt-card-header">
      <h3 class="kt-card-title">
        Single Sign On(SSO)
      </h3>
    </div>
    <div class="kt-card-content flex flex-col gap-7.5">
      <div class="grid gap-7">
        <div class="text-base font-semibold text-mono">
          1. Select SSO integration Type
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          <label class="flex align-stretch cursor-pointer bg-center h-44 bg-no-repeat border border-input rounded-xl border-dashed has-checked:border-primary bg-[length:500px] sso-active singl-sign-on-bg">
            <div class="flex flex-col place-items-center place-content-center rounded-xl grow">
              <div class="flex items-center h-11">
                <img alt="" class="w-5" src="/assets/media/brand-logos/azure.svg">
              </div>
              <span class="text-base font-medium text-mono">
                Microsoft Azure
              </span>
              <input
                v-model="formValues.ssoOption"
                class="appearance-none"
                name="sso_option"
                type="radio"
                value="1"
              >
            </div>
          </label>
          <label class="flex align-stretch cursor-pointer bg-center h-44 bg-no-repeat border border-input rounded-xl border-dashed has-checked:border-primary bg-[length:500px] sso-active singl-sign-on-bg">
            <div class="flex flex-col place-items-center place-content-center rounded-xl grow">
              <div class="flex items-center h-11">
                <img alt="" class="w-8" src="/assets/media/brand-logos/google.svg">
              </div>
              <span class="text-base font-medium text-mono">
                Google
              </span>
              <input
                v-model="formValues.ssoOption"
                class="appearance-none"
                name="sso_option"
                type="radio"
                value="2"
              >
            </div>
          </label>
          <label class="flex align-stretch cursor-pointer bg-center h-44 bg-no-repeat border border-input rounded-xl border-dashed has-checked:border-primary bg-[length:500px] sso-active singl-sign-on-bg">
            <div class="flex flex-col place-items-center place-content-center rounded-xl grow">
              <div class="flex items-center h-11">
                <img alt="" class="w-24" src="/assets/media/brand-logos/openid.svg">
              </div>
              <span class="text-base font-medium text-mono">
                OpenID Connect
              </span>
              <input
                v-model="formValues.ssoOption"
                class="appearance-none"
                name="sso_option"
                type="radio"
                value="3"
              >
            </div>
          </label>
        </div>
      </div>
      <div class="border-b border-border" />
      <div class="grid gap-7">
        <div class="text-base font-semibold text-mono">
          2. Configure Google authentication
        </div>
        <FormFieldLabeledLeft name="clientId" label="Client ID">
          <template #default="{ componentField }">
            <Input v-bind="componentField" value="02874374-367145773" />
          </template>
        </FormFieldLabeledLeft>
        <FormFieldLabeledLeft name="clientSecret" label="Client Secret">
          <template #default="{ componentField }">
            <Input v-bind="componentField" value="23djfn784957f8022we2232307822-cey2442" />
          </template>
        </FormFieldLabeledLeft>
        <div class="flex justify-end">
          <Button variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
      <div class="border-b border-border" />
      <div class="grid gap-7">
        <div class="text-base font-semibold text-mono">
          3. Note down custom URL for Google SSO authentication
        </div>
        <FormFieldLabeledLeft name="customLoginUrl" label="Custom Login URL">
          <template #default="{ componentField }">
            <div class="kt-input-group">
              <Input v-bind="componentField" value="https://devs.keenthemes.com/rl/AirMikeStudios" />
              <span class="kt-btn kt-btn-primary">
                Copy
              </span>
            </div>
          </template>
        </FormFieldLabeledLeft>
      </div>
      <div class="border-b border-border" />
      <div class="kt-form-description pb-5 text-2sm">
        Single Sign-On (SSO) authentication streamlines access across
        multiple platforms. Users log in once, gaining seamless entry
        <br>
        to various systems without repetitive credentials.
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="auth_password" class="kt-card-header">
      <h3 class="kt-card-title">
        Password
      </h3>
    </div>
    <div class="kt-card-content grid gap-5">
      <FormFieldLabeledLeft name="currentPassword" label="Current Password">
        <template #default="{ componentField }">
          <Input v-bind="componentField" placeholder="Your current password" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="newPassword" label="New Password">
        <template #default="{ componentField }">
          <Input v-bind="componentField" placeholder="New password" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="confirmPassword" label="Confirm New Password">
        <template #default="{ componentField }">
          <Input v-bind="componentField" placeholder="Confirm new password" />
        </template>
      </FormFieldLabeledLeft>
      <div class="flex justify-end pt-2.5">
        <Button variant="primary">
          Reset Password
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="advanced_settings_preferences" class="kt-card-header">
      <h3 class="kt-card-title">
        Preferences
      </h3>
    </div>
    <div class="kt-card-content grid gap-5 lg:py-7.5">
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Language
        </label>
        <select class="kt-select">
          <option>
            American English
          </option>
          <option>
            Option 2
          </option>
          <option>
            Option 3
          </option>
        </select>
      </div>
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Time zone
        </label>
        <div class="grow">
          <select class="kt-select">
            <option>
              GMT -5:00 - Eastern Time(US & Canada)
            </option>
            <option>
              Option 2
            </option>
            <option>
              Option 3
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2">
        <label class="kt-form-label max-w-56">
          Currency
        </label>
        <div class="grow">
          <select class="kt-select">
            <option>
              United States Dollar (USD)
            </option>
            <option>
              Option 2
            </option>
            <option>
              Option 3
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Open tasks as...
        </label>
        <div class="flex items-center gap-5">
          <input
            v-model="formValues.openTasks"
            class="kt-radio"
            name="open-tasks"
            type="radio"
            value="1"
          >
          Modal
          <input
            v-model="formValues.openTasks"
            class="kt-radio"
            name="open-tasks"
            type="radio"
            value="2"
          >
          Fullscreen
        </div>
      </div>
      <div class="flex flex-wrap gap-2.5 mb-1.5">
        <label class="kt-form-label items-baseline max-w-56">
          Attributes
        </label>
        <div class="flex flex-col items-start gap-5">
          <div class="flex flex-col gap-2.5">
            <label class="kt-label">
              <input
                v-model="formValues.showListNames"
                class="kt-checkbox"
                name="attributes"
                type="checkbox"
                value="1"
              >
              Show list names
            </label>
            <div class="kt-form-description text-2sm">
              See the name next to each icon
            </div>
          </div>
          <div class="flex flex-col gap-2.5">
            <label class="kt-label">
              <input
                v-model="formValues.showLinkedTaskNames"
                class="kt-checkbox"
                name="attributes"
                type="checkbox"
                value="2"
              >
              Show linked task names
            </label>
            <div class="kt-form-description text-2sm">
              Show task names next to ids for linked project tasks.
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center flex-wrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Email visibility
        </label>
        <label class="kt-label">
          <input
            v-model="formValues.emailVisibility"
            class="kt-switch"
            type="checkbox"
            value="1"
          >
          Visible
        </label>
      </div>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="advanced_settings_appearance" class="kt-card-header">
      <h3 class="kt-card-title">
        Appearance
      </h3>
    </div>
    <div class="kt-card-content lg:py-7.5">
      <div class="mb-5">
        <h3 class="text-base font-medium text-mono">
          Theme mode
        </h3>
        <span class="text-sm text-secondary-foreground">
          Select or customize your ui theme
        </span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
        <div>
          <label class="flex items-end border bg-no-repeat bg-cover border-input rounded-xl has-checked:border-green-500 has-checked:border-3 has-checked:[&_.checked]:flex h-[170px] mb-0.5" style="background-image: url('/assets/media/images/600x400/28.jpg')">
            <input
              class="appearance-none"
              name="appearance_option"
              type="radio"
              value="2"
            >
            <span class="checked hidden">
              <i class="ki-solid ki-check-circle ml-5 mb-5 text-xl text-green-500 leading-none" />
            </span>
          </label>
          <span class="text-sm font-medium text-mono">
            Dark
          </span>
        </div>
        <div>
          <label class="flex items-end border bg-no-repeat bg-cover border-input rounded-xl has-checked:border-green-500 has-checked:border-3 has-checked:[&_.checked]:flex h-[170px] mb-0.5" style="background-image: url('/assets/media/images/600x400/32.jpg')">
            <input
              class="appearance-none"
              name="appearance_option"
              type="radio"
              value="2"
            >
            <span class="checked hidden">
              <i class="ki-solid ki-check-circle ml-5 mb-5 text-xl text-green-500 leading-none" />
            </span>
          </label>
          <span class="text-sm font-medium text-mono">
            Light
          </span>
        </div>
        <div>
          <label class="flex items-end border bg-no-repeat bg-cover border-input rounded-xl has-checked:border-green-500 has-checked:border-3 has-checked:[&_.checked]:flex h-[170px] mb-0.5" style="background-image: url('/assets/media/images/600x400/30.jpg')">
            <input
              class="appearance-none"
              name="appearance_option"
              type="radio"
              value="2"
            >
            <span class="checked hidden">
              <i class="ki-solid ki-check-circle ml-5 mb-5 text-xl text-green-500 leading-none" />
            </span>
          </label>
          <span class="text-sm font-medium text-mono">
            Sistem
          </span>
        </div>
      </div>
      <div class="border-t border-border mt-7 mb-8" />
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-8">
        <label class="kt-form-label max-w-48">
          Transparent sidebar
        </label>
        <div class="flex items-center gap-7.5 grow">
          <label class="kt-label">
            Visible
            <input
              v-model="formValues.transparentSidebar"
              class="kt-switch"
              type="checkbox"
              value="1"
            >
          </label>
          <span class="kt-form-description text-2sm">
            Toggle the transparent sidebar for a sleek interface.Switch it on for
            transparency or off for a solid background.
          </span>
        </div>
      </div>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="advanced_settings_notifications" class="kt-card-header">
      <h3 class="kt-card-title">
        Notifications
      </h3>
    </div>
    <div class="kt-card-content lg:py-7.5">
      <div class="flex flex-wrap items-center gap-5 mb-5 lg:mb-7">
        <div class="flex items-center justify-between flex-wrap grow border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <div class="relative size-[50px] shrink-0">
              <svg
                class="w-full h-full stroke-border fill-muted/30"
                fill="none"
                height="48"
                viewbox="0 0 44 48"
                width="44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
    18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
    39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                  fill=""
                />
                <path
                  d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506
    18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937
    39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                  stroke=""
                />
              </svg>
              <div class="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
                <i class="ki-filled ki-sms text-xl text-muted-foreground" />
              </div>
            </div>
            <div class="flex flex-col">
              <a class="text-sm font-medium text-mono hover:text-primary mb-px" href="#">
                Email
              </a>
              <span class="text-sm text-secondary-foreground">
                Tailor Your Email Preferences.
              </span>
            </div>
          </div>
          <label class="kt-label">
            <input
              v-model="formValues.notifications"
              class="kt-switch kt-switch-sm"
              name="check"
              type="checkbox"
              value="email"
            >
          </label>
        </div>
        <div class="flex items-center justify-between flex-wrap grow border border-border rounded-xl gap-2 px-3.5 py-2.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <div class="relative size-[50px] shrink-0">
              <svg
                class="w-full h-full stroke-border fill-muted/30"
                fill="none"
                height="48"
                viewbox="0 0 44 48"
                width="44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
    18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
    39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                  fill=""
                />
                <path
                  d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506
    18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937
    39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                  stroke=""
                />
              </svg>
              <div class="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
                <img alt="" class="h-5" src="/assets/media/brand-logos/slack.svg">
              </div>
            </div>
            <div class="flex flex-col">
              <a class="text-sm font-medium text-mono hover:text-primary mb-px" href="#">
                Slack
              </a>
              <span class="text-sm text-secondary-foreground">
                Stay Updated on Slack.
              </span>
            </div>
          </div>
          <label class="kt-label">
            <input
              v-model="formValues.notifications"
              class="kt-switch kt-switch-sm"
              name="check"
              type="checkbox"
              value="slack"
            >
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-3.5 mb-7">
        <span class="text-base font-medium text-mono pb-0.5">
          Desktop notifications
        </span>
        <div class="flex flex-col items-start gap-4">
          <label class="kt-label">
            <input
              v-model="formValues.desktopNotification"
              class="kt-radio"
              name="desktop_notification"
              type="radio"
              value="1"
            >
            All new messages (Recommended)
          </label>
          <label class="kt-label">
            <input
              v-model="formValues.desktopNotification"
              class="kt-radio"
              name="desktop_notification"
              type="radio"
              value="2"
            >
            Direct @mentions
          </label>
          <label class="kt-label">
            <input
              v-model="formValues.desktopNotification"
              class="kt-radio"
              name="desktop_notification"
              type="radio"
              value="3"
            >
            Disabled
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-3.5 mb-7">
        <span class="text-base font-medium text-mono pb-0.5">
          Email notifications
        </span>
        <div class="flex flex-col items-start gap-4">
          <label class="kt-label">
            <input
              v-model="formValues.emailNotification"
              class="kt-radio"
              name="email_notification"
              type="radio"
              value="1"
            >
            All new messages and statuses
          </label>
          <label class="kt-label">
            <input
              v-model="formValues.emailNotification"
              class="kt-radio"
              name="email_notification"
              type="radio"
              value="2"
            >
            Unread messages and statuses
          </label>
          <label class="kt-label">
            <input
              v-model="formValues.emailNotification"
              class="kt-radio"
              name="email_notification"
              type="radio"
              value="3"
            >
            Disabled
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-3.5">
        <span class="text-base font-medium text-mono pb-0.5">
          Subscriptions
        </span>
        <label class="kt-label">
          <input
            v-model="formValues.autoSubscribe"
            class="kt-checkbox"
            name="check"
            type="checkbox"
            value="1"
          >
          Automatically subscribe to tasks you create
        </label>
      </div>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="advanced_settings_address" class="kt-card-header">
      <h3 class="kt-card-title">
        Address
      </h3>
    </div>
    <div class="kt-card-content grid gap-5 lg:py-7.5">
      <FormFieldLabeledLeft name="address" label="Address">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="Avinguda Imaginària, 789" />
        </template>
      </FormFieldLabeledLeft>
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label class="kt-form-label max-w-56">
          Country
        </label>
        <div class="grow">
          <select class="kt-select" name="kt-select">
            <option value="1">
              Spain
            </option>
            <option value="2">
              Option 2
            </option>
            <option value="3">
              Option 3
            </option>
          </select>
        </div>
      </div>
      <FormFieldLabeledLeft name="state" label="State">
        <template #default="{ componentField }">
          <Input v-bind="componentField" placeholder="State" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="city" label="City">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="Barcelona" />
        </template>
      </FormFieldLabeledLeft>
      <FormFieldLabeledLeft name="postcode" label="Postcode">
        <template #default="{ componentField }">
          <Input v-bind="componentField" value="08012" />
        </template>
      </FormFieldLabeledLeft>
      <div class="flex justify-end pt-2.5">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="external_services_manage_api" class="kt-card-header mb-5">
      <h3 class="kt-card-title">
        Manage API
      </h3>
    </div>
    <div class="kt-card-content lg:py-7.5 grid gap-5 lg:gap-7.5">
      <FormFieldLabeledLeft name="apiKey" label="API Key">
        <template #default="{ componentField }">
          <div class="kt-input-group">
            <Input v-bind="componentField" placeholder="Right icon" value="abc123xyz456sample789key000" />
            <Button class="kt-btn kt-btn-icon kt-btn-dim -me-2">
              <i class="ki-filled ki-copy" />
            </Button>
          </div>
        </template>
      </FormFieldLabeledLeft>
      <div class="flex items-center flex-wrap sm:flex-nowrap justify-between grow border border-border rounded-xl gap-2 p-5 rtl:[background-position:-195px_-85px] [background-position:195px_-85px] bg-no-repeat bg-[length:650px] user-access-bg">
        <div class="flex items-center gap-4">
          <div class="relative size-[50px] shrink-0">
            <svg
              class="w-full h-full stroke-primary/10 fill-primary-soft"
              fill="none"
              height="48"
              viewbox="0 0 44 48"
              width="44"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
    18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
    39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                fill=""
              />
              <path
                d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506
    18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937
    39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                stroke=""
              />
            </svg>
            <div class="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
              <i class="ki-filled ki-security-user text-xl text-primary" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center flex-wrap gap-2.5">
              <a class="text-base font-medium text-mono hover:text-primary" href="#">
                User Access
              </a>
              <span class="kt-badge kt-badge-sm kt-badge-outline shrink-0">
                16 days left
              </span>
            </div>
            <div class="kt-form-description text-2sm">
              This API key can only access
              <a class="kt-link" href="https://keenthemes.com/">
                @keenthemes
              </a>
              <br>
              Secure access with a unique API key for enhanced functionality.
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <Button class="kt-btn kt-btn-mono">
            Renew Plan
          </Button>
          <a class="kt-btn kt-btn-ghost" href="#">
            Docs
          </a>
        </div>
      </div>
      <p class="text-sm text-foreground">
        Unlock the full potential of your application with our API, a secure gateway facilitating seamless integration, empowering developers
        to create innovative and dynamic experiences effortlessly.
      </p>
    </div>
  </div>
  <div class="kt-card">
    <div id="external_services_integrations" class="kt-card-header">
      <h3 class="kt-card-title">
        Integrations
      </h3>
    </div>
    <div class="kt-card-content grid gap-5 lg:gap-7.5 lg:py-7.5 py-5">
      <div class="grid gap-5">
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-8 shrink-0" src="/assets/media/brand-logos/google-webdev.svg">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                  Google web.dev
                </a>
                <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                  webdev@webdevmail.com
                </a>
              </div>
              <span class="text-sm text-secondary-foreground">
                Integrate for enhanced collaboration in web development.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-5">
            <input
              v-model="formValues.googleWebdev"
              class="kt-switch"
              name="check"
              type="checkbox"
              value="1"
            >
            <div class="kt-btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-setting-2" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-8 shrink-0" src="/assets/media/brand-logos/equacoin.svg">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                  Equacoin
                </a>
                <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                  equacoin@cryptoemail.com
                </a>
              </div>
              <span class="text-sm text-secondary-foreground">
                Streamline cryptocurrency transactions securely and efficiently.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-5">
            <input
              v-model="formValues.equacoin"
              class="kt-switch"
              name="check"
              type="checkbox"
              value="1"
            >
            <div class="kt-btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-setting-2" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-8 shrink-0" src="/assets/media/brand-logos/evernote.svg">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                  Evernote
                </a>
                <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                  evernote@noteexample.com
                </a>
              </div>
              <span class="text-sm text-secondary-foreground">
                Streamline cryptocurrency transactions securely and efficiently.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-5">
            <input
              v-model="formValues.evernote"
              class="kt-switch"
              name="check"
              type="checkbox"
              value="1"
            >
            <div class="kt-btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-setting-2" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-8 shrink-0" src="/assets/media/brand-logos/inferno.svg">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                  Inferno
                </a>
                <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                  inferno@dataexample.com
                </a>
              </div>
              <span class="text-sm text-secondary-foreground">
                Robust email integration for data management.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-5">
            <input
              v-model="formValues.inferno"
              class="kt-switch"
              name="check"
              type="checkbox"
              value="1"
            >
            <div class="kt-btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-setting-2" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 p-3.5">
          <div class="flex items-center flex-wrap gap-3.5">
            <img alt="" class="size-8 shrink-0" src="/assets/media/brand-logos/jira.svg">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <a class="text-sm font-medium text-mono hover:text-primary" href="#">
                  Jira
                </a>
                <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                  jira@projectmail.com
                </a>
              </div>
              <span class="text-sm text-secondary-foreground">
                Streamline project management, enhance collaboration.
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-5">
            <input
              v-model="formValues.jira"
              class="kt-switch"
              name="check"
              type="checkbox"
              value="1"
            >
            <div class="kt-btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-setting-2" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  <div class="kt-card">
    <div id="delete_account" class="kt-card-header">
      <h3 class="kt-card-title">
        Delete Account
      </h3>
    </div>
    <div class="kt-card-content flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
      <div class="flex flex-col gap-5">
        <div class="text-sm text-foreground">
          We regret to see you leave. Confirm account deletion below. Your data will be permanently removed. Thank you for being part of our
          community. Please check our
          <a class="kt-link" href="#">
            Setup Guidelines
          </a>
          if you still wish continue.
        </div>
        <label class="kt-label">
          <input
            v-model="formValues.deleteAccount"
            class="kt-checkbox kt-checkbox-sm"
            name="delete"
            type="checkbox"
            value="1"
          >
          Confirm deleting account
        </label>
      </div>
      <div class="flex justify-end gap-2.5">
        <Button variant="outline">
          Deactivate Instead
        </Button>
        <Button variant="destructive">
          Delete Account
        </Button>
      </div>
    </div>
  </div>
</template>
