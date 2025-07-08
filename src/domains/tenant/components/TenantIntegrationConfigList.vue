<script setup lang="ts">
import {
  Brain,
  Calendar,
  CalendarDays,
  Cloud,
  Database,
  FileText,
  Mail,
  Network,
  RefreshCcw
} from 'lucide-vue-next'
import { type Component, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { availableIntegrations, type IStoreTenantIntegrationRequest, type ITenantIntegration, tenantIntegrationsService, type TTenantIntegrationType } from '../services/TenantIntegrationsService'
import { useTenantStore } from '../store/tenant.store'

interface ITenantIntegrationOption extends ITenantIntegration {
  icon: Component
  name: string
  description: string
}

const { toast } = useToast()
const { t } = useI18n()
const tenantStore = useTenantStore()
const route = useRoute()

const integrationId = computed(() => route.params.integrationId as string)

const loading = ref(false)
const saving = ref<Partial<Record<TTenantIntegrationType, boolean>>>({})
const deleting = ref<Partial<Record<TTenantIntegrationType, boolean>>>({})

const search = ref(integrationId.value)
const integrations = ref<ITenantIntegration[]>(availableIntegrations)

const getIcon = (type: TTenantIntegrationType) => {
  switch (type) {
    case 'azureAi': return Brain
    case 'eDelivery': return Mail
    case 'googleCalendar': return Calendar
    case 'jira': return Network
    case 'ksef': return FileText
    case 'microsoftCalendar': return CalendarDays
    case 'regonApi': return Database
    case 's3': return Cloud
  }
}

const integrationList = computed<ITenantIntegrationOption[]>(() => {
  return integrations.value.map(integration => ({
    ...integration,
    icon: getIcon(integration.type),
    name: t(`tenant.integrations.types.${integration.type}.title`),
    description: t(`tenant.integrations.types.${integration.type}.description`),
  }))
    .sort((a, b) => {
      if (a.enabled && !b.enabled) return -1
      if (!a.enabled && b.enabled) return 1
      return 0
    })
})

const filteredIntegrationList = computed(() => {
  return integrationList.value.filter(integration =>
    integration.name.toLowerCase().includes(search.value.toLowerCase())
    || integration.description.toLowerCase().includes(search.value.toLowerCase())
    || integration.type.toLowerCase().includes(search.value.toLowerCase())
  )
})

const refresh = async () => {
  try {
    loading.value = true
    const data = await tenantIntegrationsService.getIntegrations(tenantStore.tenant?.id ?? '')
    integrations.value = availableIntegrations.map(integration => ({
      ...integration,
      id: data.find(i => i.type === integration.type)?.id,
      enabled: !!data.find(i => i.type === integration.type)?.enabled,
      credentials: data.find(i => i.type === integration.type)?.credentials,
      meta: data.find(i => i.type === integration.type)?.meta,
    }))
    formValues.value = getFormValues()
  } catch (error: unknown) {
    handleErrorWithToast('Error while loading integrations', error)
  } finally {
    loading.value = false
  }
}

const getFormValues = () => integrations.value.reduce<Record<string, Record<string, string>>>((acc, integration) => {
  acc[integration.type] = integration.fields.reduce<Record<string, string>>((obj, field) => {
    obj[field.name] = integration.credentials?.[field.name] ?? ''
    return obj
  }, {})
  return acc
}, {})

const formValues = ref<Record<string, Record<string, string>>>(getFormValues())

const onSubmit = async (integration: ITenantIntegrationOption) => {
  try {
    const payload: IStoreTenantIntegrationRequest = {
      type: integration.type,
      enabled: true,
      credentials: formValues.value[integration.type],
      meta: {}
    }
    saving.value[integration.type] = true
    await tenantIntegrationsService.create(tenantStore.tenant?.id ?? '', payload)
    toast.success('Integration saved successfully')
    await refresh()
  } catch (error: unknown) {
    handleErrorWithToast('Error while saving integration', error)
  } finally {
    saving.value[integration.type] = false
  }
}

const onDelete = async (integration: ITenantIntegrationOption) => {
  try {
    deleting.value[integration.type] = true
    await tenantIntegrationsService.delete(tenantStore.tenant?.id ?? '', integration.id ?? '')
    toast.success('Integration deleted successfully')
    await refresh()
  } catch (error: unknown) {
    handleErrorWithToast('Error while deleting integration', error)
  } finally {
    deleting.value[integration.type] = false
  }
}

onMounted(() => {
  void refresh()
})
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex flex-row items-center justify-between gap-x-2">
      <Input v-model="search" placeholder="Search" />
      <Button variant="ghost" :loading @click="refresh">
        <RefreshCcw />
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card
        v-for="integration in filteredIntegrationList"
        :key="integration.id"
        class="flex flex-col"
        :class="[
          { 'opacity-50 pointer-events-none bg-muted/50 grayscale': integration.disabled || saving[integration.type] },
          integration.enabled ? 'border border-primary' : 'border-dotted border-2'
        ]"
      >
        <CardHeader class="flex flex-row items-center gap-x-3">
          <component :is="integration.icon" class="w-6 h-6 text-primary" />
          <h2 class="text-lg font-semibold">
            {{ integration.name }}
          </h2>
        </CardHeader>

        <CardContent class="flex flex-col h-full">
          <p class="text-sm text-muted-foreground">
            {{ integration.description }}
          </p>

          <form class="h-full mt-2 flex flex-col gap-y-2" @submit.prevent="onSubmit(integration)">
            <div v-for="field in integration.fields" :key="field.name">
              <FormField :name="`config.${integration.id}.${field.name}`">
                <FormItem>
                  <FormLabel>{{ t(`tenant.integrations.fields.${field.name}`) }}</FormLabel>
                  <FormControl>
                    <Input v-model="formValues[integration.type][field.name]" :type="field.type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="flex flex-row items-center justify-end gap-x-2 mt-auto pt-2">
              <Button
                v-if="integration.id"
                type="button"
                variant="destructive"
                :disabled="deleting[integration.type]"
                :loading="deleting[integration.type]"
                @click="onDelete(integration)"
              >
                {{ t('common.delete') }}
              </Button>
              <Button
                type="submit"
                :disabled="integration.disabled || saving[integration.type]"
                :loading="saving[integration.type]"
              >
                {{ t('common.save') }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>