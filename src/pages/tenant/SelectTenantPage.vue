<script setup lang="ts">
import { Building2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SelectTenantForm from '@/domains/tenant/components/SelectTenantForm.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { useNextRedirect } from '@/lib/useNextRedirect'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { redirectTo } = useNextRedirect(route.query.next as string)

const handleSelectTenant = async () => {
  await router.push(redirectTo.value)
}
</script>

<template>
  <GuestLayout>
    <Card class="w-full max-w-md bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Building2 class="h-5 w-5" />
          {{ t('auth.selectTenant.title') }}
        </CardTitle>
        <CardDescription>
          {{ t('auth.selectTenant.description') }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SelectTenantForm @selected="handleSelectTenant" />
      </CardContent>
    </Card>
  </GuestLayout>
</template>
