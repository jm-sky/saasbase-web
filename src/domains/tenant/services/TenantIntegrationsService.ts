import { useToast } from '@/components/ui/toast'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export type TTenantIntegrationType =
  | 'azureAi'
  | 's3'
  | 'regonApi'
  | 'googleCalendar'
  | 'microsoftCalendar'
  | 'jira'
  | 'ksef'
  | 'eDelivery'

export interface ITenantIntegration {
  id: string
  type: TTenantIntegrationType
  fields: { name: string; type: string }[]
  disabled?: boolean
}

export const availableIntegrations: ITenantIntegration[] = [
  {
    id: 'azureAi',
    type: 'azureAi',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' },
      { name: 'endpoint',  type: 'text' }
    ]
  },
  {
    id: 'ksef',
    type: 'ksef',
    fields: [
      { name: 'apiToken', type: 'text' }
    ]
  },
  {
    id: 'eDelivery',
    type: 'eDelivery',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' }
    ]
  },
  {
    id: 's3',
    type: 's3',
    fields: [
      { name: 'accessKey', type: 'text' },
      { name: 'secretKey', type: 'password' },
      { name: 'bucket', type: 'text' },
      { name: 'endpoint', type: 'text' }
    ]
  },
  {
    id: 'regon',
    type: 'regonApi',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' }
    ]
  },
  {
    id: 'google_calendar',
    type: 'googleCalendar',
    fields: [
      { name: 'clientId', type: 'text' },
      { name: 'clientSecret', type: 'password' }
    ],
    disabled: true
  },
  {
    id: 'microsoft_calendar',
    type: 'microsoftCalendar',
    fields: [
      { name: 'clientId', type: 'text' },
      { name: 'clientSecret', type: 'password' },
      { name: 'tenantId', type: 'text' }
    ],
    disabled: true
  },
  {
    id: 'jira',
    type: 'jira',
    fields: [
      { name: 'domain', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'apiToken', type: 'password' }
    ],
    disabled: true
  }
]

class TenantIntegrationsService {
  async getIntegrations(tenantId: string): Promise<ITenantIntegration[]> {
    try {
      const response = await api.get<IResourceCollection<ITenantIntegration>>(`${apiRoutesMap.tenants}/${tenantId}/integrations`)
      return response.data.data
    } catch {
      useToast().toast.info('Using default integrations')
      return availableIntegrations
    }
  }
}

export const tenantIntegrationsService = new TenantIntegrationsService()