<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import {
  Brain,
  Calendar,
  CalendarDays,
  Cloud,
  Database,
  FileText,
  Mail,
  Network
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { availableIntegrations, type ITenantIntegration, tenantIntegrationsService, type TTenantIntegrationType } from '../services/TenantIntegrationsService'
import { useTenantStore } from '../store/tenant.store'

const { t } = useI18n()
const tenantStore = useTenantStore()
const route = useRoute()
const integrationId = computed(() => route.params.integrationId as string)

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

const integrationList = computed(() => {
  return availableIntegrations.map(integration => ({
    ...integration,
    icon: getIcon(integration.type),
    name: t(`tenant.integrations.types.${integration.type}.title`),
    description: t(`tenant.integrations.types.${integration.type}.description`),
  }))
})

const filteredIntegrationList = computed(() => {
  return integrationList.value.filter(integration =>
    integration.name.toLowerCase().includes(search.value.toLowerCase())
    || integration.description.toLowerCase().includes(search.value.toLowerCase())
    || integration.id.toLowerCase().includes(search.value.toLowerCase())
  )
})

const loadIntegrations = async () => {
  const data = await tenantIntegrationsService.getIntegrations(tenantStore.tenant?.id ?? '')
  integrations.value = data
}

const formValues = ref<Record<string, Record<string, string>>>(
  integrations.value.reduce<Record<string, Record<string, string>>>((acc, integration) => {
    acc[integration.id] = integration.fields.reduce<Record<string, string>>((obj, field) => {
      obj[field.name] = ''
      return obj
    }, {})
    return acc
  }, {})
)

const schema = toTypedSchema(z.object({
  config: z.record(z.string(), z.record(z.string(), z.string()))
}))

function onSubmit(integrationId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (values: any) => {
    const config = values.config[integrationId]
    console.log(`Saving config for ${integrationId}:`, config)
    // Make API call here to save integration config
  }
}

onMounted(() => {
  void loadIntegrations()
})
</script>

<template>
  <div class="p-4 space-y-4">
    <div>
      <Input v-model="search" placeholder="Search" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card
        v-for="integration in filteredIntegrationList"
        :key="integration.id"
        class="flex flex-col"
        :class="{ 'opacity-50 pointer-events-none bg-muted/50': integration.disabled }"
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

          <Form :validation-schema="schema" class="h-full mt-2 flex flex-col gap-y-2" @submit="onSubmit(integration.id)">
            <div v-for="field in integration.fields" :key="field.name">
              <FormField :name="`config.${integration.id}.${field.name}`">
                <FormItem>
                  <FormLabel>{{ t(`tenant.integrations.fields.${field.name}`) }}</FormLabel>
                  <FormControl>
                    <Input v-model="formValues[integration.id][field.name]" :type="field.type" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <div class="mt-auto pt-2 text-end">
              <Button type="submit" class="mt-auto" :disabled="integration.disabled">
                {{ t('common.save') }}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>