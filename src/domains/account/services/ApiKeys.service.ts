import api from '@/lib/api'
import type { TDateTime } from '@/domains/shared/types/common'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IApiKey {
  id: string
  name: string
  scopes: string[]
  isActive: boolean
  lastUsedAt?: TDateTime
  expiresAt: TDateTime
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ICreateApiKeyData {
  name: string
  scopes: string[]
  expiresAt?: TDateTime
}

class ApiKeysService {
  async getApiKeys(): Promise<IResourceCollection<IApiKey>> {
    return (await api.get<IResourceCollection<IApiKey>>('/api-keys')).data
  }

  async createApiKey(data: ICreateApiKeyData): Promise<IApiKey> {
    return (await api.post<IResource<IApiKey>>('/api-keys', data)).data.data
  }

  async deleteApiKey(keyId: string): Promise<void> {
    return (await api.delete(`/api-keys/${keyId}`)).data
  }

  async revokeApiKey(keyId: string): Promise<void> {
    return (await api.post(`/api-keys/${keyId}/revoke`)).data
  }
}

export const apiKeysService = new ApiKeysService()
