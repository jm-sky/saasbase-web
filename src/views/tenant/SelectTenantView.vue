<script setup lang="ts">
import { Building2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { tenantService } from '@/domains/tenant/services/tenantService'
import GuestLayout from '@/layouts/GuestLayout.vue'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const router = useRouter()
const { toast } = useToast() 

const tenants = ref<ITenant[]>([])

const handleSelectTenant = async (tenantId: string) => {
  try {
    await tenantService.switch(tenantId)
    await router.push('/')
  } catch {
    toast.error('Could not switch tenant')
  }
}

const fetchTenants = async () => {
  const tenantsData = await tenantService.index()
  tenants.value = tenantsData
}

onMounted(async () => {
  await fetchTenants()
})
</script>

<template>
  <GuestLayout>
    <Card class="w-full max-w-md bg-transparent border-none">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Building2 class="h-5 w-5" />
          Select Tenant
        </CardTitle>
        <CardDescription>
          Choose a tenant to continue. You can switch between tenants at any time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4">
          <div v-if="tenants.length === 0" class="flex flex-col gap-4 text-center text-sm p-2">
            <div>No tenants found.</div>
            <div>
              <ButtonLink variant="default" to="/tenant/create">
                Create a new tenant
              </ButtonLink>
            </div>
          </div>
          <div
            v-for="tenant in tenants"
            :key="tenant.id"
            class="flex items-center justify-between p-4 rounded-lg border bg-white/30 hover:bg-accent cursor-pointer transition-colors"
            @click="handleSelectTenant(tenant.id)"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {{ tenant.name.charAt(0) }}
              </div>
              <div>
                <div class="font-medium">
                  {{ tenant.name }}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </GuestLayout>
</template>
