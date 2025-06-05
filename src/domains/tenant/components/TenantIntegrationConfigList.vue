<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import {
  Brain,
  Calendar,
  CalendarDays,
  Cloud,
  Database,
  Network
} from 'lucide-vue-next'
import { type Component, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const { t } = useI18n()

interface Integration {
  id: string
  name: string
  description: string
  icon: Component
  fields: { name: string; label: string; type: string }[]
  disabled?: boolean
}

const integrations: Integration[] = [
  {
    id: 'azure_ai',
    name: 'Azure Intelligence Studio',
    description: 'Powerful OCR and AI services for document processing.',
    icon: Brain,
    fields: [
      { name: 'app_id', label: 'App ID', type: 'text' },
      { name: 'app_secret', label: 'App Secret', type: 'password' },
      { name: 'endpoint', label: 'Endpoint', type: 'text' }
    ]
  },
  {
    id: 's3_storage',
    name: 'S3 Storage',
    description: 'Object storage integration for backups and files.',
    icon: Cloud,
    fields: [
      { name: 'access_key', label: 'Access Key', type: 'text' },
      { name: 'secret_key', label: 'Secret Key', type: 'password' },
      { name: 'bucket', label: 'Bucket Name', type: 'text' },
      { name: 'endpoint', label: 'Endpoint', type: 'text' }
    ]
  },
  {
    id: 'regon',
    name: 'REGON API',
    description: 'Business registry integration for company data verification.',
    icon: Database,
    fields: [
      { name: 'app_id', label: 'App ID', type: 'text' },
      { name: 'app_secret', label: 'App Secret', type: 'password' }
    ]
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Calendar integration for scheduling and events.',
    icon: Calendar,
    fields: [
      { name: 'client_id', label: 'Client ID', type: 'text' },
      { name: 'client_secret', label: 'Client Secret', type: 'password' }
    ],
    disabled: true
  },
  {
    id: 'microsoft_calendar',
    name: 'Microsoft Calendar',
    description: 'Microsoft 365 Calendar integration (Exchange/Outlook).',
    icon: CalendarDays,
    fields: [
      { name: 'client_id', label: 'Client ID', type: 'text' },
      { name: 'client_secret', label: 'Client Secret', type: 'password' },
      { name: 'tenant_id', label: 'Tenant ID', type: 'text' }
    ],
    disabled: true
  },
  {
    id: 'jira',
    name: 'JIRA',
    description: 'Project tracking and issue management integration.',
    icon: Network,
    fields: [
      { name: 'domain', label: 'JIRA Domain', type: 'text' },
      { name: 'email', label: 'User Email', type: 'email' },
      { name: 'api_token', label: 'API Token', type: 'password' }
    ],
    disabled: true
  }
]

const formValues = ref<Record<string, Record<string, string>>>(
  integrations.reduce<Record<string, Record<string, string>>>((acc, integration) => {
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
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <Card
      v-for="integration in integrations"
      :key="integration.id"
      class="p-4 space-y-4"
      :class="{ 'opacity-50 pointer-events-none bg-muted/50': integration.disabled }"
    >
      <div class="flex items-center space-x-3">
        <component :is="integration.icon" class="w-6 h-6 text-primary" />
        <h2 class="text-lg font-semibold">
          {{ integration.name }}
        </h2>
      </div>
      <p class="text-sm text-muted-foreground">
        {{ integration.description }}
      </p>

      <Form :validation-schema="schema" @submit="onSubmit(integration.id)">
        <div class="space-y-3">
          <div v-for="field in integration.fields" :key="field.name">
            <FormField :name="`config.${integration.id}.${field.name}`">
              <FormItem>
                <FormLabel>{{ field.label }}</FormLabel>
                <FormControl>
                  <Input v-model="formValues[integration.id][field.name]" :type="field.type" />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <Button type="submit" :disabled="integration.disabled">
            {{ t('common.save') }}
          </Button>
        </div>
      </Form>
    </Card>
  </div>
</template>