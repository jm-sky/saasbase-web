<script lang="ts" setup>
import { computed } from 'vue'
import MailBox from '@/components/MailBox/MailBox.vue'
import { config } from '@/config'
import { mails } from '@/data/mails'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const authStore = useAuthStore()
const tenantStore = useTenantStore()

const supportedEmailProviders = ['gmail', 'outlook', 'yahoo', 'hotmail']

const getEmailName = (email: string) => {
  return email.split('@')[0]
}

const getEmailProvider = (email: string) => {
  return email.split('@')[1].split('.')[0]
}

const getMailIcon = (email: string) => {
  const provider = getEmailProvider(email)
  if (supportedEmailProviders.includes(provider)) {
    return `bx:bxl-${provider}`
  }
  return 'lucide:mail'
}

const userEmailInOurDomain = computed(() => {
  const emailName = getEmailName(authStore.user?.email ?? '')
  return `${emailName}@${config.appDomain}`
})

const accounts = computed(() => {
  return [
    {
      label: authStore.user?.fullName ?? '',
      email: authStore.user?.email ?? '',
      icon: getMailIcon(authStore.user?.email ?? ''),
    },
    {
      label: `${authStore.user?.fullName} (${config.appDomain})`,
      email: userEmailInOurDomain.value,
      icon: getMailIcon(userEmailInOurDomain.value),
      disabled: true,
    },
    {
      label: 'E-Doręczenia',
      email: `E-Doręczenia ${tenantStore.tenant?.name}`,
      icon: 'lucide:mail',
      disabled: true,
    },
  ]
})
</script>

<template>
  <AuthenticatedLayout>
    <MailBox
      :accounts="accounts"
      :mails="mails"
      :nav-collapsed-size="4"
    />
  </AuthenticatedLayout>
</template>
