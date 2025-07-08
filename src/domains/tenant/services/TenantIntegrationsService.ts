import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
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
  id?: TUUID
  type: TTenantIntegrationType
  enabled?: boolean
  credentials?: Record<string, string>
  meta?: Record<string, string>
  lastSyncedAt?: TDateTime
  createdAt?: TDateTime
  updatedAt?: TDateTime
  // Frontend only
  fields: { name: string; type: string }[]
  disabled?: boolean
}

export interface IStoreTenantIntegrationRequest {
  type: TTenantIntegrationType
  enabled: boolean
  credentials: Record<string, string>
  meta: Record<string, string>
}

export interface IUpdateTenantIntegrationRequest {
  enabled: boolean
  credentials: Record<string, string>
  meta: Record<string, string>
}

export const availableIntegrations: ITenantIntegration[] = [
  {
    type: 'azureAi',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' },
      { name: 'endpoint',  type: 'text' }
    ]
  },
  {
    type: 'ksef',
    fields: [
      { name: 'apiToken', type: 'text' }
    ]
  },
  {
    type: 'eDelivery',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' }
    ]
  },
  {
    type: 's3',
    fields: [
      { name: 'accessKey', type: 'text' },
      { name: 'secretKey', type: 'password' },
      { name: 'bucket', type: 'text' },
      { name: 'endpoint', type: 'text' }
    ]
  },
  {
    type: 'regonApi',
    fields: [
      { name: 'appId', type: 'text' },
      { name: 'appSecret', type: 'password' }
    ]
  },
  {
    type: 'googleCalendar',
    fields: [
      { name: 'clientId', type: 'text' },
      { name: 'clientSecret', type: 'password' }
    ],
    disabled: true
  },
  {
    type: 'microsoftCalendar',
    fields: [
      { name: 'clientId', type: 'text' },
      { name: 'clientSecret', type: 'password' },
      { name: 'tenantId', type: 'text' }
    ],
    disabled: true
  },
  {
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
    const response = await api.get<IResourceCollection<ITenantIntegration>>(`${apiRoutesMap.tenants}/${tenantId}/integrations`)
    return response.data.data
  }

  async create(tenantId: TUUID, data: IStoreTenantIntegrationRequest): Promise<void> {
    await api.post(`${apiRoutesMap.tenants}/${tenantId}/integrations/`, data)
  }

  async update(tenantId: TUUID, integrationId: TUUID, data: IUpdateTenantIntegrationRequest): Promise<void> {
    await api.put(`${apiRoutesMap.tenants}/${tenantId}/integrations/${integrationId}`, data)
  }

  async delete(tenantId: TUUID, integrationId: TUUID): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/integrations/${integrationId}`)
  }
}

export const tenantIntegrationsService = new TenantIntegrationsService()