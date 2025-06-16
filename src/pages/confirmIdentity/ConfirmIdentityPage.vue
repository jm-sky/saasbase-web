<script setup lang="ts">
import { Banknote, FileText, Mail, ShieldCheck } from 'lucide-vue-next'
import { type Component, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import ConfirmIdentityByTrustedProfileModal from '@/domains/identityConfirmation/components/ConfirmIdentityByTrustedProfileModal.vue'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import type { TIdentityConfirmationType } from '@/domains/identityConfirmation/types/identityConfirmation.type'

const integrations = {
  ksef: false,
  eDelivery: false,
}

const { t } = useI18n()
const tenantStore = useTenantStore()

const isTrustedProfileModalOpen = ref(false)

interface IIdentityConfirmationOption {
  key: TIdentityConfirmationType
  route?: RouteLocationRaw
  icon: Component
  label: string
  description: string
  active: boolean
  soon: boolean
  configRoute?: RouteLocationRaw
  onClick?: () => void
}

const options = computed<IIdentityConfirmationOption[]>(() => [
  {
    key: 'trustedProfile',
    icon: ShieldCheck,
    label: t('identityConfirmation.trustedProfile.title'),
    description: t('identityConfirmation.trustedProfile.description'),
    active: true,
    soon: false,
    onClick: () => isTrustedProfileModalOpen.value = true,
  },
  {
    key: 'ksef',
    route: '/identity-confirmation/ksef',
    icon: FileText,
    label: t('identityConfirmation.ksefLogin.title'),
    description: t('identityConfirmation.ksefLogin.description'),
    active: integrations.ksef,
    configRoute: `/tenants/${tenantStore.tenant?.id}/show/integrations/ksef`,
    soon: true,
  },
  {
    key: 'eDelivery',
    route: '/identity-confirmation/e-delivery',
    icon: Mail,
    label: t('identityConfirmation.eDeliveryLogin.title'),
    description: t('identityConfirmation.eDeliveryLogin.description'),
    active: integrations.eDelivery,
    configRoute: `/tenants/${tenantStore.tenant?.id}/show/integrations/eDelivery`,
    soon: true,
  },
  {
    key: 'bank',
    route: '/identity-confirmation/bank',
    icon: Banknote,
    label: t('identityConfirmation.bankConfirmation.title'),
    description: t('identityConfirmation.bankConfirmation.description'),
    active: false,
    soon: true,
  },
])
</script>

<template>
  <AuthenticatedLayout>
    <div class="mx-4 px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">
        {{ $t('identityConfirmation.title') }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          v-for="option in options"
          :key="option.key"
          class="relative shadow-sm transition"
          :class="option.active ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'"
        >
          <CardHeader>
            <component
              :is="option.active ? RouterLink : 'div'"
              :to="option.route"
              class="flex items-center space-x-4"
            >
              <component :is="option.icon" class="text-3xl" />
              <div class="text-lg font-medium">
                {{ option.label }}
              </div>
            </component>

            <Badge v-if="option.soon" class="absolute top-3 right-3" variant="standout">
              {{ $t('common.feature.commingSoon') }}
            </Badge>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">
              {{ option.description }}
            </p>

            <ButtonLink v-if="!option.active && option.configRoute" :to="option.configRoute" variant="default">
              ⚙️ {{ $t('identityConfirmation.configureIntegration') }}
            </ButtonLink>
            <ButtonLink v-if="option.active && option.route" :to="option.route" variant="default">
              {{ $t('identityConfirmation.next') }}
            </ButtonLink>
            <Button v-if="option.active && option.onClick" variant="default" @click="option.onClick">
              {{ $t('identityConfirmation.next') }}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <ConfirmIdentityByTrustedProfileModal v-model:open="isTrustedProfileModalOpen" />
  </AuthenticatedLayout>
</template>
